import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/reveal";

export function PageHeading({ label, title, description, parent }: {
  label: string; title: ReactNode; description: string;
  parent?: { href: string; label: string };
}) {
  return <section className="page-heading"><div className="container">
    <nav aria-label="Хлебные крошки" className="breadcrumbs"><Link href="/">Главная</Link><span aria-hidden="true">/</span>{parent && <><Link href={parent.href}>{parent.label}</Link><span aria-hidden="true">/</span></>}<span aria-current="page">{label}</span></nav>
    <Reveal><p className="eyebrow">WhiteDent / {label}</p><h1>{title}</h1><p className="page-description">{description}</p></Reveal>
  </div></section>;
}
