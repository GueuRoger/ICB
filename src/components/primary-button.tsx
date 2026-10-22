export function PrimaryButton({ label }: { label: string }) {
  return (
    <a
      href="/courses"
      className="absolute top-[633px] left-[635px] flex h-[40px] w-[170px] items-center justify-center bg-[#2251FF] text-[16px] leading-[18px] font-semibold text-white"
      style={{ fontFamily: "var(--font-inter)", letterSpacing: "0.001em" }}
    >
      {label}
    </a>
  );
}
