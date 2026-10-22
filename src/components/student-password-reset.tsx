"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCopy } from "@/i18n/provider";
import { requestPasswordReset } from "@/lib/student-auth";

const sans = { fontFamily: "var(--font-montserrat)" } as const;
const inter = { fontFamily: "var(--font-inter)", letterSpacing: "0.001em" } as const;

type Status = "idle" | "loading" | "error";

export function StudentPasswordReset() {
  const router = useRouter();
  const text = useCopy("forgot-password");
  const errors: Record<string, string> = {
    "Enter your email address.": "error_required",
    "Enter a valid email address.": "error_email",
    "The reset email could not be sent. Try again.": "error_send",
  };
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const result = await requestPasswordReset(email);
      if (!result.ok) {
        setStatus("error");
        setMessage(result.message);
        return;
      }
      router.push("/forgot-password/confirmation");
    } catch {
      setStatus("error");
      setMessage("The reset email could not be sent. Try again.");
    }
  }

  const loading = status === "loading";

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
          <form onSubmit={onSubmit} noValidate>
            <h1
              className="absolute top-[28px] left-[662px] m-0 text-[28px] leading-[36px] font-bold text-[#061E38]"
              style={sans}
            >
              {text("title")}
            </h1>

            <label
              htmlFor="email"
              className="absolute top-[72px] left-[254px] text-[16px] leading-[20px] font-semibold text-[#061E38]"
              style={sans}
            >
              {text("email_label")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              className="absolute top-[108px] left-[245px] h-[54px] w-[950px] border border-[#B3B3B3] bg-white px-[16px] text-[16px] leading-[20px] text-[#061E38] outline-none disabled:opacity-70"
              style={sans}
            />

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="absolute top-[184px] left-[626px] flex h-[40px] w-[188px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white disabled:opacity-70"
              style={inter}
            >
              {loading ? text("sending") : text("send")}
            </button>

            {message ? (
              <p
                role={status === "error" ? "alert" : "status"}
                className="absolute top-[250px] left-[245px] m-0 w-[950px] text-center text-[14px] leading-[20px] text-[#061E38]"
                style={sans}
              >
                {text(errors[message] ?? "error_send")}
              </p>
            ) : null}
          </form>
        </main>
      </div>
    </div>
  );
}
