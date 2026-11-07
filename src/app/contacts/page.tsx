import type { Metadata } from "next";
import { ArrowUpRight, MapPin } from "lucide-react";
import { clinic } from "@/data/clinic";
import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { demoMetadata } from "@/lib/seo";

export const metadata: Metadata = demoMetadata("Контакты | WhiteDent · Караганда · Демонстрация", "WhiteDent, Караганда: адрес и контакты на проверке. Карточка 2ГИС и демонстрационная форма без отправки.");

export default function ContactsPage() {
  return <main id="main" tabIndex={-1}><PageHeading label="Контакты" title={<>Давайте<br /><em>начнём с разговора.</em></>} description={`${clinic.name} · ${clinic.city}, ${clinic.country}. Контактные сведения пока требуют подтверждения клиникой.`} />
    <section className="section section-light"><div className="container"><ContentNotice>Запись по телефону и WhatsApp не подключена: в источниках указаны разные номера. Полный график и точный адрес также ожидают подтверждения.</ContentNotice><div className="contacts-page-grid"><div className="contact-facts"><h2>Ориентиры</h2><dl><div><dt>Город</dt><dd>{clinic.city}, {clinic.country}</dd></div><div><dt>Адрес · требует проверки</dt><dd>{clinic.address.value}<span className="field-hint">Альтернатива: {clinic.alternativeAddress.value}. Вход уточняется.</span></dd></div><div><dt>Телефон и WhatsApp</dt><dd>На подтверждении<span className="field-hint">Рабочие ссылки появятся после согласования номеров.</span></dd></div><div><dt>График работы</dt><dd>Полное расписание уточняется</dd></div><div><dt>Instagram</dt><dd>Официальный аккаунт на проверке</dd></div></dl></div><div className="map-card"><div className="map-decoration" aria-hidden="true"><MapPin size={54} strokeWidth={1} /></div><p className="eyebrow">Караганда / 2ГИС</p><h2>Найдём<br /><em>ориентир.</em></h2><p>Откройте исходную карточку организации. Точку назначения и маршрут можно выбрать в 2ГИС; перед поездкой уточните адрес.</p><a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer" className="button button-gold">Построить маршрут в 2ГИС <ArrowUpRight size={18} aria-hidden="true" /></a><span className="field-hint">Откроется карточка организации в новой вкладке. Здесь не показана карта и не заданы координаты.</span></div></div></div></section>
    <section id="inquiry" className="section section-paper"><div className="container inquiry-layout"><div><p className="eyebrow">Форма / Демонстрация</p><h2>Проверим<br /><em>первый шаг.</em></h2><p className="section-body">Пока можно проверить только заполнение полей. Ни клиника, ни администратор не получат сообщение из этой формы.</p></div><InquiryForm /></div></section>
  </main>;
}
