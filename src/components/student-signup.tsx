"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/i18n/provider";
import { checkoutReturnPath, hasCheckoutIntent, readPaymentCopy, resumeCheckout } from "@/lib/payments";
import { registerStudent, safeReturnPath } from "@/lib/student-auth";
import { supabase } from "@/lib/supabase";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const inter = { fontFamily: "var(--font-inter)", letterSpacing: "0.001em" } as const;

const fieldClass =
  "absolute left-[212px] h-[48px] w-[1014px] border border-[#808080] bg-white px-[54px] text-[16px] leading-[20px] font-semibold text-[#000000] outline-none";

export function StudentSignup() {
  const router = useRouter();
  const text = useCopy("signup", "payments", "shared");
  const payment = readPaymentCopy(text);
  const errors: Record<string, string> = {
    "Fill in every field.": "error_fields",
    "Enter a valid email address.": "error_email",
    "Enter a valid WhatsApp number.": "error_whatsapp",
    "Password should be at least 6 characters.": "error_password",
    "Passwords do not match.": "error_match",
    "An account with this email already exists.": "error_exists",
    "The account could not be created. Try again.": "error_create",
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loginHref, setLoginHref] = useState("/login");

  useEffect(() => {
    const next = safeReturnPath(new URLSearchParams(window.location.search).get("next"));
    if (next) setLoginHref(`/login?next=${encodeURIComponent(next)}`);
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await registerStudent({ firstName, lastName, email, whatsapp, password, confirmPassword });
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    const next = safeReturnPath(new URLSearchParams(window.location.search).get("next"));
    if (hasCheckoutIntent()) {
      const resumed = await resumeCheckout(payment);
      if (resumed === "away") return;
      if (resumed === "done") {
        router.push(checkoutReturnPath() || "/courses/global-fluency/payment");
        return;
      }
      return;
    }
    const { data } = await supabase.auth.getSession();
    router.push(data.session && next ? next : "/videos");
  }

  return (
    <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(1128px * (100cqw / 1440px))", overflow: "hidden" }}>
        <main
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 1128,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#ffffff",
          }}
        >
          <img src={text("logo")} alt="" width={100} height={50} className="absolute top-[88px] left-[670px] h-[50px] w-[100px]" />

          <form onSubmit={onSubmit} noValidate>
            <div className="absolute top-[154px] left-[116px] h-[900px] w-[1204px] border border-[#808080] bg-white" />

            <h1
              className="absolute top-[184px] left-[266px] m-0 text-[24px] leading-[30px] font-bold text-[#061E38]"
              style={sans}
            >
              {text("title")}
            </h1>

            <label htmlFor="first-name" className="absolute top-[248px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("first_name")}
            </label>
            <input
              id="first-name"
              name="first-name"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className={`${fieldClass} top-[274px]`}
              style={sans}
            />

            <label htmlFor="last-name" className="absolute top-[352px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("last_name")}
            </label>
            <input
              id="last-name"
              name="last-name"
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className={`${fieldClass} top-[378px]`}
              style={sans}
            />

            <label htmlFor="email" className="absolute top-[456px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={`${fieldClass} top-[484px]`}
              style={sans}
            />

            <label htmlFor="whatsapp" className="absolute top-[558px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("whatsapp")}
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              className={`${fieldClass} top-[580px]`}
              style={sans}
            />

            <label htmlFor="password" className="absolute top-[658px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${fieldClass} top-[696px]`}
              style={sans}
            />

            <label
              htmlFor="confirm-password"
              className="absolute top-[778px] left-[214px] text-[18px] leading-[22px] font-bold text-[#000000]"
              style={sans}
            >
              {text("confirm")}
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={`${fieldClass} top-[808px]`}
              style={sans}
            />

            <button
              type="submit"
              className="absolute top-[880px] left-[214px] flex h-[48px] w-[1011px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
              style={inter}
            >
              {text("continue")}
            </button>

            <p className="absolute top-[956px] left-[214px] m-0 text-[18px] leading-[22px] font-bold text-[#000000]" style={sans}>
              {text("already")}
            </p>
            <a
              href={loginHref}
              className="absolute top-[1004px] left-[214px] text-[18px] leading-[22px] font-normal text-[#2068BD]"
              style={sans}
            >
              {text("sign_in_instead")}
            </a>

            {message ? (
              <p role="alert" className="absolute top-[1072px] left-[214px] m-0 text-[14px] leading-[20px] text-[#061E38]" style={sans}>
                {text(errors[message] ?? "error_fields")}
              </p>
            ) : null}
          </form>
        </main>
      </div>
    </div>
  );
}
