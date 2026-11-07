import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { Approach } from "@/components/sections/approach";
import { clinic } from "@/data/clinic";
import { demoMetadata } from "@/lib/seo";

export const metadata: Metadata = demoMetadata("О клинике | WhiteDent · Караганда · Демонстрация", "Концепция раздела о WhiteDent в Караганде. История, оборудование и фотографии клиники ожидают согласования.");

export default function AboutPage() {
  return <main id="main" tabIndex={-1}><PageHeading label="О клинике" title={<>WhiteDent.<br /><em>Ближе к знакомству.</em></>} description={`Концепция сайта стоматологии в городе ${clinic.city}, ${clinic.country}. Материалы о клинике будут добавляться после проверки.`} />
    <section className="section section-light"><div className="container"><ContentNotice>Сведения об истории клиники, оборудовании и стандартах обслуживания пока не подтверждены. Мы не заменяем их рекламными обещаниями.</ContentNotice><div className="about-grid"><div><p className="eyebrow">Пространство WhiteDent</p><h2>Место для<br /><em>настоящей истории.</em></h2><p className="section-body">Здесь появятся согласованные фотографии интерьера и рассказ о клинике. Сейчас мы показываем только визуальную концепцию.</p><Link href="/contacts" className="text-link">Расположение и контакты <ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="about-placeholder"><div className="about-arch" aria-hidden="true" /><span>Интерьер · материалы ожидаются</span></div></div>
      <div className="about-topics">{[{ title: "История", text: "Факты о создании и развитии клиники — после подтверждения." }, { title: "Оборудование", text: "Перечень оборудования и его возможностей — после проверки." }, { title: "Команда", text: "Профессиональные профили и фотографии — после согласования." }].map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    </div></section><Approach />
  </main>;
}
