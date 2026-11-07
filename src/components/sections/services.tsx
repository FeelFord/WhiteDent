import { ArrowDownRight } from "lucide-react";
import { services } from "@/data/services";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export function Services() {
  return (
    <section id="services" className="section section-paper" aria-labelledby="services-heading">
      <div className="container services-layout">
        <Reveal className="services-intro"><p className="eyebrow">02 / Направления</p><h2 id="services-heading">Забота об улыбке.<br /><em>Шаг за шагом.</em></h2><p>Направления для будущего каталога. Наличие услуг и медицинские описания требуют подтверждения клиникой.</p><span className="status-tag">На согласовании</span></Reveal>
        <div className="service-list">{services.map((service, index) => <Reveal key={service.id} className="service-row" delay={index * 0.04}><span className="service-number">0{index + 1}</span><div><h3><Link href={`/services/${service.id}`}>{service.title}</Link></h3><p>{service.description}</p></div><ArrowDownRight size={23} strokeWidth={1.3} aria-hidden="true" /></Reveal>)}<Link href="/services" className="text-link catalog-home-link">Все направления <ArrowDownRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}
