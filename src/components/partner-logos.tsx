import { copy } from "@/lib/site-content";

const logos = [
  {
    src: "/images/bnp-paribas.svg",
    alt: "BNP Paribas",
    className: "top-[767px] left-[180px] h-[45px] w-[219px]",
    width: 219,
    height: 45,
  },
  {
    src: "/images/vivo-energy.svg",
    alt: "Vivo Energy",
    className: "top-[761px] left-[458px] h-[56px] w-[207px]",
    width: 207,
    height: 56,
  },
  {
    src: "/images/attijariwafa.svg",
    alt: "Attijariwafa bank",
    className: "top-[767px] left-[724px] h-[45px] w-[219px]",
    width: 219,
    height: 45,
  },
  {
    src: "/images/coat-of-arms.svg",
    alt: "Coat of arms of Ivory Coast",
    className: "top-[754px] left-[1002px] h-[70px] w-[100px]",
    width: 100,
    height: 70,
  },
  {
    src: "/images/united-nations.svg",
    alt: "United Nations",
    className: "top-[754px] left-[1161px] h-[70px] w-[100px]",
    width: 100,
    height: 70,
  },
] as const;

export async function PartnerLogos() {
  const text = await copy("home");
  const items = await Promise.all(
    logos.map(async (logo, index) => ({
      ...logo,
      src: await text(`partner_${index + 1}_src`),
      alt: await text(`partner_${index + 1}_alt`),
    })),
  );
  return (
    <>
      {items.map((logo) => (
        <img
          key={logo.className}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className={`absolute ${logo.className}`}
        />
      ))}
    </>
  );
}
