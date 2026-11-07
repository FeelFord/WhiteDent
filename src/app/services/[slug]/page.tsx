import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { services, consultationSteps } from "@/data/services";
import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { demoMetadata } from "@/lib/seo";

export function generateStaticParams() { return services.map(service => ({ slug: service.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find(item => item.id === slug);
  if (!service) notFound();
  return demoMetadata(`${service.title} | WhiteDent · Демонстрация`, `${service.description} Демонстрационная информация; наличие услуги и описание требуют подтверждения.`);
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find(item => item.id === slug);
  if (!service) notFound();
  return <main id="main" tabIndex={-1}><PageHeading label={service.title} parent={{ href: "/services", label: "Направления" }} title={<>{service.title}.<br /><em>Сначала — разобраться.</em></>} description={service.description} />
    <section className="section section-light"><div className="container detail-layout"><div className="detail-copy">
      <ContentNotice>Наличие услуги в WhiteDent и медицинское описание требуют подтверждения. Информация не заменяет консультацию врача.</ContentNotice>
      <h2>О направлении</h2><p>{service.overview}</p><h2>Как подготовиться к обсуждению</h2><p>Общие ориентиры для разговора с врачом. Это не утверждённый протокол клиники и не индивидуальный план лечения.</p>
      <ol className="steps-list">{consultationSteps.map(step => <li key={step.title}><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
      <h2>Частый вопрос</h2>{service.questions.map(item => <details className="faq-item" key={item.question}><summary>{item.question}<ArrowUpRight size={18} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}
    </div><aside className="detail-aside"><p className="eyebrow">Следующий шаг</p><h2>Остались<br /><em>вопросы?</em></h2><p>На странице контактов можно проверить демонстрационную форму. Запись и отправка пока отключены.</p><Link href="/contacts#inquiry" className="button button-gold">К форме · демо <ArrowUpRight size={17} aria-hidden="true" /></Link><Link href="/services" className="text-link">← Все направления</Link></aside></div></section>
  </main>;
}
