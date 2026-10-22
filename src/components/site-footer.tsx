"use client";

import { useCopy } from "@/i18n/provider";
import { WHATSAPP_NUMBER } from "@/lib/payments";

const sans = { fontFamily: "var(--font-montserrat)" } as const;

const bookRoger = [
  { label: "footer_speaking", message: "footer_speaking_message" },
  { label: "footer_consulting", message: "footer_consulting_message" },
  { label: "footer_media", message: "footer_media_message" },
  { label: "footer_corporate", message: "footer_corporate_message" },
] as const;

const social = [
  { src: "/icons/instagram.svg", label: "footer_instagram", url: "footer_instagram_url", left: 1110 },
  { src: "/icons/linkedin.svg", label: "footer_linkedin", url: "footer_linkedin_url", left: 1184 },
  { src: "/icons/facebook.svg", label: "footer_facebook", url: "footer_facebook_url", left: 1258 },
] as const;

function socialHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.href;
  } catch {
    return "";
  }
}

export function SiteFooter() {
  const text = useCopy("shared");
  const phone = text("footer_phone");
  const email = text("footer_email");
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 40,
        background: "#061E38",
      }}
    >
      <div style={{ width: "min(1440px, 100%)", marginInline: "auto", containerType: "inline-size" }}>
      <div style={{ position: "relative", height: "calc(600px * (100cqw / 1440px))", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1440,
            height: 600,
            transform: "scale(calc(100cqw / 1440px))",
            transformOrigin: "top left",
            background: "#061E38",
            color: "#ffffff",
          }}
        >
          <img
            src={text("logo")}
            alt=""
            width={100}
            height={50}
            className="absolute top-[48px] left-[670px] h-[50px] w-[100px]"
          />
          <a
            href="/"
            className="absolute top-[40px] left-[796px] w-[90px] text-[27px] leading-[33px] font-semibold text-white"
            style={{ fontFamily: "var(--font-source-serif)" }}
          >
            {text("brand_first")}
            <br />
            {text("brand_last")}
          </a>

          <h2 className="absolute top-[316px] left-[305px] m-0 text-[24px] leading-[28px] font-bold" style={sans}>
            {text("footer_shop")}
          </h2>
          <a
            href="/courses"
            className="absolute top-[372px] left-[305px] text-[16px] leading-[20px] font-normal text-white"
            style={sans}
          >
            {text("nav_products")}
          </a>

          <h2 className="absolute top-[316px] left-[533px] m-0 text-[24px] leading-[28px] font-bold" style={sans}>
            {text("footer_book")}
          </h2>
          <ul className="absolute top-[372px] left-[533px] m-0 w-[180px] list-none p-0">
            {bookRoger.map((item, index) => (
              <li key={item.label} style={{ marginTop: index === 0 ? 0 : 24 }}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text(item.message))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] leading-[20px] font-normal text-white no-underline"
                  style={sans}
                >
                  {text(item.label)}
                </a>
              </li>
            ))}
          </ul>

          <h2 className="absolute top-[236px] left-[1109px] m-0 text-[32px] leading-[36px] font-bold" style={sans}>
            {text("footer_contact")}
          </h2>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="absolute top-[348px] left-[1109px] flex items-center gap-[18px] text-[16px] leading-[20px] font-normal text-white"
            style={sans}
          >
            <img src="/icons/phone.svg" alt="" width={20} height={20} className="h-[20px] w-[20px]" />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="absolute top-[400px] left-[1109px] flex items-center gap-[18px] text-[16px] leading-[20px] font-normal text-white"
            style={sans}
          >
            <img src="/icons/mail.svg" alt="" width={20} height={20} className="h-[20px] w-[20px]" />
            {email}
          </a>
          {social.map((item) => {
            const href = socialHref(text(item.url));
            const label = text(item.label);
            const icon = (
              <img
                src={item.src}
                alt={href ? "" : label}
                width={42}
                height={42}
                className="h-[42px] w-[42px]"
              />
            );
            if (!href) {
              return (
                <span
                  key={item.label}
                  className="absolute top-[470px] h-[42px] w-[42px]"
                  style={{ left: item.left }}
                >
                  {icon}
                </span>
              );
            }
            return (
              <a
                key={item.label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="absolute top-[470px] h-[42px] w-[42px]"
                style={{ left: item.left }}
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>
      </div>
    </footer>
  );
}
