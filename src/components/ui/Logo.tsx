export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={className}
      role="img"
      aria-label="Dansvic Designs"
      style={{
        display: "block",
        backgroundColor: "var(--ink)",
        maskImage: "url('/dansvicc_ImgID1.png')",
        maskPosition: "center",
        maskRepeat: "no-repeat",
        maskSize: "contain",
        WebkitMaskImage: "url('/dansvicc_ImgID1.png')",
        WebkitMaskPosition: "center",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
