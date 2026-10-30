"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/i18n/provider";
import { DocumentTitle } from "@/components/document-title";
import { PasswordInput } from "@/components/password-input";
import {
  checkoutReturnPath,
  GLOBAL_FLUENCY_PAYMENT_PATH,
  hasCheckoutIntent,
  restoreCartFromCheckoutIntent,
} from "@/lib/payments";
import { safeReturnPath, signInStudent } from "@/lib/student-auth";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const inter = { fontFamily: "var(--font-inter)", letterSpacing: "0.001em" } as const;

const fieldClass =
  "absolute left-[245px] h-[54px] w-[950px] border border-[#B3B3B3] bg-white px-[16px] text-[16px] leading-[20px] text-[#061E38] outline-none";

export function StudentLogin() {
  const router = useRouter();
  const text = useCopy("login", "shared");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [createHref, setCreateHref] = useState("/signup");
  const errors: Record<string, string> = {
    "Enter your email and password.": "error_required",
    "The email or password is not correct.": "error_invalid",
    "Confirm your email before signing in.": "error_confirm",
  };

  useEffect(() => {
    const next = safeReturnPath(new URLSearchParams(window.location.search).get("next"));
    if (next) setCreateHref(`/signup?next=${encodeURIComponent(next)}`);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await signInStudent({ email, password });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    const next = safeReturnPath(new URLSearchParams(window.location.search).get("next"));
    if (hasCheckoutIntent()) {
      // Return to checkout; CartPage detects the intent and opens WhatsApp once.
      restoreCartFromCheckoutIntent();
      router.replace(checkoutReturnPath() || next || GLOBAL_FLUENCY_PAYMENT_PATH);
      return;
    }
    router.push(next || "/");
  }

  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(593px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 593,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <DocumentTitle title={text("title")} description={text("document_description")} />
          <form onSubmit={onSubmit} noValidate>
            <h1
              className="absolute top-[28px] left-0 m-0 w-[1440px] text-center text-[28px] leading-[36px] font-bold text-[#061E38]"
              style={sans}
            >
              {text("title")}
            </h1>

            <label
              htmlFor="email"
              className="absolute top-[72px] left-[254px] text-[16px] leading-[20px] font-semibold text-[#061E38]"
              style={sans}
            >
              {text("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`${fieldClass} top-[108px]`}
              style={sans}
            />

            <label
              htmlFor="password"
              className="absolute top-[198px] left-[254px] text-[16px] leading-[20px] font-semibold text-[#061E38]"
              style={sans}
            >
              {text("password")}
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              aria-describedby="password-hint"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${fieldClass} top-[235px]`}
              style={sans}
            />
            <p
              id="password-hint"
              className="absolute top-[296px] left-[254px] m-0 text-[13px] leading-[16px] font-normal text-[#787B82]"
              style={sans}
            >
              {text("password_hint")}
            </p>

            <a
              href="/forgot-password"
              className="absolute top-[322px] left-0 w-[1440px] bg-transparent text-center text-[16px] leading-[22px] font-semibold text-[#061E38]"
              style={sans}
            >
              {text("forgot")}
            </a>

            <button
              type="submit"
              className="absolute top-[375px] left-[626px] flex h-[40px] w-[188px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
              style={inter}
            >
              {text("sign_in")}
            </button>

            <a
              href={createHref}
              className="absolute top-[448px] left-0 w-[1440px] bg-transparent text-center text-[16px] leading-[22px] font-bold text-[#061E38]"
              style={sans}
            >
              {text("create")}
            </a>

            {message ? (
              <p
                role="alert"
                className="absolute top-[490px] left-0 m-0 w-[1440px] text-center text-[14px] leading-[20px] text-[#061E38]"
                style={sans}
              >
                {text(errors[message] ?? "error_required")}
              </p>
            ) : null}
          </form>
        </main>
      </div>
    </div>
  );
}
