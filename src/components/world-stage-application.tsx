"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCopy, useT } from "@/i18n/provider";
import { supabase } from "@/lib/supabase";
import {
  clearWorldStageApplicationDraft,
  readWorldStageApplicationDraft,
  saveWorldStageApplicationDraft,
  WORLD_STAGE_APPLY_PATH,
  type WorldStageApplicationDraft,
} from "@/lib/world-stage-application-draft";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

const INDUSTRY_OTHER = "__other__";

const INDUSTRIES = [
  "Accounting",
  "Advertising & Marketing",
  "Aerospace & Defense",
  "Agriculture",
  "Architecture & Construction",
  "Automotive",
  "Banking & Financial Services",
  "Biotechnology",
  "Chemicals",
  "Consulting",
  "Consumer Goods",
  "Education",
  "Energy & Utilities",
  "Engineering",
  "Entertainment & Media",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Government & Public Sector",
  "Healthcare",
  "Hospitality & Tourism",
  "Human Resources",
  "Information Technology",
  "Insurance",
  "Legal Services",
  "Logistics & Supply Chain",
  "Manufacturing",
  "Mining & Metals",
  "Non-Profit & NGOs",
  "Oil & Gas",
  "Pharmaceuticals",
  "Real Estate",
  "Retail",
  "Telecommunications",
  "Transportation",
] as const;

const fields = [
  [
    { name: "firstName", label: "first_name" },
    { name: "lastName", label: "last_name" },
  ],
  [
    { name: "email", label: "email", type: "email" },
    { name: "phone", label: "phone", type: "tel" },
  ],
  [
    { name: "company", label: "company" },
    { name: "title", label: "job" },
  ],
] as const;

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "title"
  | "industry"
  | "industryOther"
  | "assignments"
  | "phoneConsent"
  | "termsConsent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldBorder(invalid: boolean) {
  return invalid ? "border-[#FF5A5A]" : "border-[#C1C7CD]";
}

function Field({
  name,
  label,
  type = "text",
  invalid,
  defaultValue,
  onClear,
}: {
  name: FieldName;
  label: string;
  type?: string;
  invalid: boolean;
  defaultValue?: string;
  onClear: (name: FieldName) => void;
}) {
  return (
    <label className="block w-[315px]">
      <span
        className={`block text-[15px] leading-[20px] ${invalid ? "text-[#FF5A5A]" : "text-white"}`}
        style={sans}
      >
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        defaultValue={defaultValue}
        aria-invalid={invalid}
        aria-required="true"
        onChange={() => onClear(name)}
        className={`mt-[12px] h-[28px] w-full border-0 border-b bg-transparent text-[15px] text-white outline-none ${fieldBorder(invalid)}`}
        style={sans}
      />
    </label>
  );
}

function draftFromForm(form: HTMLFormElement): WorldStageApplicationDraft {
  const data = new FormData(form);
  return {
    firstName: String(data.get("firstName") ?? "").trim(),
    lastName: String(data.get("lastName") ?? "").trim(),
    email: String(data.get("email") ?? "").trim(),
    phone: String(data.get("phone") ?? "").trim(),
    company: String(data.get("company") ?? "").trim(),
    title: String(data.get("title") ?? "").trim(),
    industry: String(data.get("industry") ?? "").trim(),
    industryOther: String(data.get("industryOther") ?? "").trim(),
    assignments: String(data.get("assignments") ?? "").trim(),
    phoneConsent: Boolean(
      (form.elements.namedItem("phoneConsent") as HTMLInputElement | null)?.checked,
    ),
    termsConsent: Boolean(
      (form.elements.namedItem("termsConsent") as HTMLInputElement | null)?.checked,
    ),
  };
}

export function WorldStageApplication() {
  const c = useCopy("world-stage-apply");
  const t = useT();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const autoSubmitStarted = useRef(false);
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<WorldStageApplicationDraft | null>(null);
  const [industry, setIndustry] = useState("");
  const [invalid, setInvalid] = useState<Partial<Record<FieldName, boolean>>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = readWorldStageApplicationDraft();
    setDraft(saved);
    if (saved?.industry) setIndustry(saved.industry);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !formRef.current) return;
    let cancelled = false;
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled || !user?.email || !formRef.current) return;
      const input = formRef.current.elements.namedItem("email");
      if (input instanceof HTMLInputElement) {
        input.value = user.email;
      }
    });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  useEffect(() => {
    if (!ready || !draft?.pendingSubmit || autoSubmitStarted.current) return;
    autoSubmitStarted.current = true;
    let cancelled = false;

    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        // Still logged out after return — keep draft and wait for a manual submit.
        saveWorldStageApplicationDraft({ ...draft, pendingSubmit: false });
        return;
      }
      saveWorldStageApplicationDraft({ ...draft, pendingSubmit: false });
      if (user.email && formRef.current) {
        const input = formRef.current.elements.namedItem("email");
        if (input instanceof HTMLInputElement) {
          input.value = user.email;
        }
      }
      // Let defaultValues paint, then submit once authenticated.
      window.setTimeout(() => {
        if (!cancelled) formRef.current?.requestSubmit();
      }, 0);
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, draft]);

  function clearError(name: FieldName) {
    setInvalid((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setFormError("");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = formRef.current;
    if (!form) return;

    const data = new FormData(form);
    const nextInvalid: Partial<Record<FieldName, boolean>> = {};

    const requiredText: FieldName[] = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "company",
      "title",
      "assignments",
    ];

    for (const name of requiredText) {
      const value = String(data.get(name) ?? "").trim();
      if (!value) nextInvalid[name] = true;
    }

    const email = String(data.get("email") ?? "").trim();
    if (email && !EMAIL_RE.test(email)) nextInvalid.email = true;

    const industryValue = String(data.get("industry") ?? "").trim();
    const industryOther = String(data.get("industryOther") ?? "").trim();
    if (!industryValue) {
      nextInvalid.industry = true;
    } else if (industryValue === INDUSTRY_OTHER) {
      if (!industryOther) nextInvalid.industryOther = true;
    }

    const phoneConsent = Boolean(
      (form.elements.namedItem("phoneConsent") as HTMLInputElement | null)?.checked,
    );
    const termsConsent = Boolean(
      (form.elements.namedItem("termsConsent") as HTMLInputElement | null)?.checked,
    );
    if (!phoneConsent) nextInvalid.phoneConsent = true;
    if (!termsConsent) nextInvalid.termsConsent = true;

    if (Object.keys(nextInvalid).length > 0) {
      setInvalid(nextInvalid);
      setFormError(t("Please complete every required field and checkbox on this step."));
      const order: FieldName[] = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "company",
        "title",
        "industry",
        "industryOther",
        "assignments",
        "phoneConsent",
        "termsConsent",
      ];
      const first = order.find((name) => nextInvalid[name]);
      if (first) {
        const el = form.elements.namedItem(first);
        if (el instanceof HTMLElement) el.focus();
      }
      return;
    }

    setInvalid({});
    setFormError("");

    // Authoritative auth check — never insert while logged out.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id || !user.email) {
      saveWorldStageApplicationDraft({ ...draftFromForm(form), pendingSubmit: true });
      setFormError(t("Sign in is required before your application can be submitted."));
      router.push(`/signup?next=${encodeURIComponent(WORLD_STAGE_APPLY_PATH)}`);
      return;
    }

    const accountEmail = user.email.trim().toLowerCase();
    const formEmail = email.trim().toLowerCase();
    const emailInput = form.elements.namedItem("email");
    if (formEmail && formEmail !== accountEmail) {
      // Never submit under an unrelated email — bind to the authenticated account.
      if (emailInput instanceof HTMLInputElement) {
        emailInput.value = user.email;
      }
      setInvalid({ email: true });
      setFormError(t("Use the same email as your account to submit this application."));
      if (emailInput instanceof HTMLElement) emailInput.focus();
      return;
    }
    if (emailInput instanceof HTMLInputElement) {
      emailInput.value = user.email;
    }

    setSubmitting(true);

    const { error } = await supabase.from("world_stage_applications").insert({
      user_id: user.id,
      first_name: String(data.get("firstName") ?? "").trim(),
      last_name: String(data.get("lastName") ?? "").trim(),
      email: accountEmail,
      phone: String(data.get("phone") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      job_title: String(data.get("title") ?? "").trim(),
      industry: industryValue,
      industry_other: industryValue === INDUSTRY_OTHER ? industryOther : null,
      previous_assignments: String(data.get("assignments") ?? "").trim(),
      phone_consent: phoneConsent,
      terms_consent: termsConsent,
      status: "pending",
    });

    if (error) {
      setSubmitting(false);
      setFormError(t("Your application could not be saved. Please try again."));
      return;
    }

    clearWorldStageApplicationDraft();
    router.push("/courses/world-stage/apply/confirmation");
  }

  if (!ready) {
    return (
      <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
        <div style={{ position: "relative", height: "calc(1024px * (100cqw / 1440px))", overflow: "hidden" }} />
      </div>
    );
  }

  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(1024px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 1024,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            className="absolute top-0 left-[316px] h-[900px] w-[808px] bg-[#061E38]"
          >
            <h1
              className="absolute top-[48px] left-0 m-0 w-[808px] text-center text-[42px] leading-[48px] font-bold text-white"
              style={sans}
            >
              {c("title")}
            </h1>

            {fields.map((row, index) => (
              <div
                key={row[0].name}
                className="absolute left-[69px] flex w-[671px] justify-between"
                style={{ top: 140 + index * 84 }}
              >
                <Field
                  name={row[0].name}
                  label={c(row[0].label)}
                  type={"type" in row[0] ? row[0].type : "text"}
                  invalid={Boolean(invalid[row[0].name])}
                  defaultValue={draft?.[row[0].name] ?? ""}
                  onClear={clearError}
                />
                <Field
                  name={row[1].name}
                  label={c(row[1].label)}
                  type={"type" in row[1] ? row[1].type : "text"}
                  invalid={Boolean(invalid[row[1].name])}
                  defaultValue={draft?.[row[1].name] ?? ""}
                  onClear={clearError}
                />
              </div>
            ))}

            <div className="absolute top-[392px] left-[69px] w-[315px]">
              <label className="block w-full">
                <span
                  className={`block text-[15px] leading-[20px] ${
                    invalid.industry || invalid.industryOther ? "text-[#FF5A5A]" : "text-white"
                  }`}
                  style={sans}
                >
                  {c("industry")}
                </span>
                <span
                  className={`relative mt-[12px] block h-[28px] border-b ${fieldBorder(
                    Boolean(invalid.industry),
                  )}`}
                >
                  <select
                    name="industry"
                    value={industry}
                    required
                    aria-invalid={Boolean(invalid.industry)}
                    aria-required="true"
                    onChange={(event) => {
                      setIndustry(event.target.value);
                      clearError("industry");
                      clearError("industryOther");
                    }}
                    className="h-full w-full cursor-pointer appearance-none bg-transparent pr-[28px] text-[15px] text-white outline-none"
                    style={sans}
                    aria-label={c("industry")}
                  >
                    <option value="" disabled hidden />
                    {INDUSTRIES.map((item) => (
                      <option key={item} value={item} className="bg-white text-[#061E38]">
                        {t(item)}
                      </option>
                    ))}
                    <option value={INDUSTRY_OTHER} className="bg-white text-[#061E38]">
                      {t("Other")}
                    </option>
                  </select>
                  <img
                    src="/images/chevron.svg"
                    alt=""
                    width={15}
                    height={10}
                    className="pointer-events-none absolute top-[8px] right-[8px] h-[10px] w-[15px]"
                  />
                </span>
              </label>
              {industry === INDUSTRY_OTHER ? (
                <label className="mt-[10px] block w-full">
                  <span className="sr-only">{t("Please specify")}</span>
                  <input
                    name="industryOther"
                    type="text"
                    required
                    defaultValue={draft?.industryOther ?? ""}
                    aria-invalid={Boolean(invalid.industryOther)}
                    aria-required="true"
                    aria-label={t("Please specify")}
                    placeholder={t("Please specify")}
                    onChange={() => clearError("industryOther")}
                    className={`h-[28px] w-full border-0 border-b bg-transparent text-[15px] text-white outline-none placeholder:text-[#8A93A3] ${fieldBorder(
                      Boolean(invalid.industryOther),
                    )}`}
                    style={sans}
                  />
                </label>
              ) : null}
            </div>
            <div className="absolute top-[392px] left-[425px] w-[315px]">
              <Field
                name="assignments"
                label={c("assignments")}
                invalid={Boolean(invalid.assignments)}
                defaultValue={draft?.assignments ?? ""}
                onClear={clearError}
              />
            </div>

            <label className="absolute top-[500px] left-[69px] flex w-[670px] gap-[12px]">
              <input
                type="checkbox"
                name="phoneConsent"
                required
                defaultChecked={draft?.phoneConsent ?? false}
                aria-invalid={Boolean(invalid.phoneConsent)}
                aria-required="true"
                onChange={() => clearError("phoneConsent")}
                className={`mt-[2px] h-[16px] w-[16px] shrink-0 appearance-none border bg-transparent checked:bg-white ${
                  invalid.phoneConsent ? "border-[#FF5A5A]" : "border-white"
                }`}
              />
              <span
                className={`text-[13px] leading-[18px] ${invalid.phoneConsent ? "text-[#FF5A5A]" : "text-white"}`}
                style={sans}
              >
                {c("phone_consent")}
              </span>
            </label>

            <label className="absolute top-[610px] left-[69px] flex w-[670px] gap-[12px]">
              <input
                type="checkbox"
                name="termsConsent"
                required
                defaultChecked={draft?.termsConsent ?? false}
                aria-invalid={Boolean(invalid.termsConsent)}
                aria-required="true"
                onChange={() => clearError("termsConsent")}
                className={`mt-[2px] h-[16px] w-[16px] shrink-0 appearance-none border bg-transparent checked:bg-white ${
                  invalid.termsConsent ? "border-[#FF5A5A]" : "border-white"
                }`}
              />
              <span
                className={`text-[13px] leading-[18px] ${invalid.termsConsent ? "text-[#FF5A5A]" : "text-white"}`}
                style={sans}
              >
                {c("terms_intro")}{" "}
                <span className="underline">{c("terms")}</span> {c("terms_and")}{" "}
                <span className="underline">{c("privacy")}</span>
                {c("terms_end")}
              </span>
            </label>

            {formError ? (
              <p
                role="alert"
                className="absolute top-[730px] left-[69px] m-0 w-[670px] text-[13px] leading-[18px] text-[#FF5A5A]"
                style={sans}
              >
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="absolute top-[777px] left-[310px] flex h-[40px] w-[188px] cursor-pointer items-center justify-center border-0 bg-[#2251FF] text-[16px] leading-[20px] font-semibold text-white disabled:cursor-wait disabled:opacity-70"
              style={sans}
            >
              {c("submit")}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
