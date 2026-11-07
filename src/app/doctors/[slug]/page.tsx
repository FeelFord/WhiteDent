import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { UserRound } from "lucide-react";
import { doctors } from "@/data/doctors";
import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { demoMetadata } from "@/lib/seo";

export function generateStaticParams() { return doctors.map(doctor => ({ slug: doctor.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = doctors.find(item => item.id === slug);
  if (!doctor) notFound();
  return demoMetadata(`${doctor.name} | WhiteDent · Демонстрация`, "Образец оформления профиля специалиста WhiteDent. Не представляет реального сотрудника: имя, стаж и образование не предоставлены.");
}

export default async function DoctorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doctor = doctors.find(item => item.id === slug);
  if (!doctor) notFound();
  return <main id="main" tabIndex={-1}><PageHeading label={doctor.name} parent={{ href: "/doctors", label: "Врачи" }} title={<>Профиль специалиста.<br /><em>Демонстрационный образец.</em></>} description="Здесь показана только структура будущей страницы. Этот профиль не представляет реального сотрудника WhiteDent." />
    <section className="section section-light"><div className="container"><ContentNotice>Демо-профиль. Информация о специалистах клиники ещё не предоставлена и не подтверждена.</ContentNotice><div className="profile-grid"><div className="doctor-placeholder" aria-hidden="true"><UserRound size={100} strokeWidth={0.7} /><span>Место для согласованной фотографии</span></div><div className="profile-details"><span className="status-tag">{doctor.status === "demo" ? "Демонстрация" : "Требует проверки"}</span><h2>{doctor.name}</h2><dl><div><dt>Специализация</dt><dd>{doctor.specialty}</dd></div><div><dt>Подтверждённый стаж</dt><dd>{doctor.experience ?? "Сведения не предоставлены"}</dd></div><div><dt>Образование</dt><dd>{doctor.education.length ? doctor.education.join("; ") : "Документы ожидают проверки"}</dd></div></dl><button type="button" disabled className="button button-gold" aria-describedby="doctor-booking-note">Запись недоступна</button><p id="doctor-booking-note" className="field-hint">Запись к демонстрационному специалисту не производится.</p><Link href="/doctors" className="text-link">← К разделу врачей</Link></div></div></div></section>
  </main>;
}
