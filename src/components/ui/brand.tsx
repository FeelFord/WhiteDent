import Image from "next/image";
import { clinic } from "@/data/clinic";

export function Brand({ placement }: { placement: "header" | "footer" }) {
  return <span className={`brand-lockup brand-${placement}`}>
    <Image
      src={clinic.logo.src}
      width={clinic.logo.width}
      height={clinic.logo.height}
      alt={clinic.logo.alt}
      className="brand-logo"
      loading={placement === "header" ? "eager" : "lazy"}
      unoptimized
    />
    <span className="brand-copy"><span className="brand-name">{clinic.name}</span><span className="brand-tagline">{clinic.city} · стоматология</span></span>
  </span>;
}
