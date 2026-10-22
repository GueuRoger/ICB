import { DocumentTitle } from "@/components/document-title";
import { PartnerLogos } from "@/components/partner-logos";
import { PrimaryButton } from "@/components/primary-button";
import { copy } from "@/lib/site-content";

const roles = [
  { key: "role_engineer", left: 351, top: 531, width: 116, weight: 700 },
  { key: "role_inventor", left: 487, top: 531, width: 115, weight: 600 },
  { key: "role_entrepreneur", left: 622, top: 531, width: 172, weight: 600 },
  { key: "role_speaker", left: 814, top: 532, width: 275, weight: 600 },
] as const;

export async function HeroSection() {
  const text = await copy("home");
  const [documentTitle, firstName, lastName, shopLabel, trusted, imageAlt, heroImage, ...roleLabels] = await Promise.all([
    text("document_title"),
    text("first_name"),
    text("last_name"),
    text("shop_button"),
    text("trusted_by"),
    text("image_alt"),
    text("hero_image"),
    ...roles.map((role) => text(role.key)),
  ]);
  return (
    <section className="absolute top-0 left-0 z-0 h-[852px] w-[1440px]">
      <DocumentTitle title={documentTitle} description={text("document_description")} />
      <img
        src={heroImage}
        alt={imageAlt}
        width={1774}
        height={887}
        className="absolute top-[132px] left-0 h-[720px] w-[1440px] object-cover"
      />
      <h1 className="contents">
        <span
          className="absolute top-[428px] left-[526px] w-[148px] text-center text-[60px] leading-none font-normal text-white"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {firstName}
        </span>
        <span
          className="absolute top-[428px] left-[684px] w-[150px] text-center text-[60px] leading-none font-extrabold text-white"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {lastName}
        </span>
      </h1>
      {roles.map((role, index) => (
        <span
          key={role.key}
          className="absolute text-center text-[24px] leading-[30px] text-white"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontWeight: role.weight,
            left: role.left,
            top: role.top,
            width: role.width,
          }}
        >
          {roleLabels[index]}
        </span>
      ))}
      {[478, 610, 800].map((left) => (
        <span
          key={left}
          className="absolute top-[532px] h-[30px] w-[3px] bg-white"
          style={{ left }}
          aria-hidden="true"
        />
      ))}
      <PrimaryButton label={shopLabel} />
      <p
        className="absolute top-[680px] left-[108px] w-[326px] text-[17px] leading-[19px] font-bold text-white"
        style={{ fontFamily: "var(--font-montserrat)", letterSpacing: "0.12em" }}
      >
        {trusted}
      </p>
      <PartnerLogos />
    </section>
  );
}
