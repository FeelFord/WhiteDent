import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, UserRound } from "lucide-react";
import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { doctors } from "@/data/doctors";
import { demoMetadata } from "@/lib/seo";

export const metadata: Metadata = demoMetadata("Врачи | WhiteDent · Демонстрация", "Демонстрационная структура раздела специалистов WhiteDent. Состав команды ожидает подтверждения клиникой.");

export default function DoctorsPage() {
  return <main id="main" tabIndex={-1}><PageHeading label="Врачи" title={<>Знакомство<br /><em>начинается с доверия.</em></>} description="Будущий раздел о людях WhiteDent. Реальные профили будут добавлены после проверки сведений и разрешений на использование фотографий." />
    <section className="section section-light"><div className="container"><ContentNotice>Ниже — образец оформления, а не реальный врач клиники. ФИО, квалификация, стаж и образование не выдуманы.</ContentNotice>
      <div className="doctor-grid">{doctors.map(doctor => <article className="doctor-card" key={doctor.id}><div className="doctor-placeholder" aria-hidden="true"><UserRound size={80} strokeWidth={0.7} /><span>Фотография не предоставлена</span></div><div className="doctor-card-copy"><span className="status-tag">Демо · не реальный специалист</span><h2>{doctor.name}</h2><p>{doctor.specialty}</p><Link href={`/doctors/${doctor.id}`} className="text-link">Посмотреть структуру профиля <ArrowUpRight size={18} aria-hidden="true" /></Link></div></article>)}</div>
    </div></section>
  </main>;
}
