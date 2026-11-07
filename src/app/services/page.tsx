import { PageHeading } from "@/components/ui/page-heading";
import { ContentNotice } from "@/components/ui/content-notice";
import { ServiceCatalog } from "@/components/services/service-catalog";
import type { Metadata } from "next";
import { demoMetadata } from "@/lib/seo";

export const metadata: Metadata = demoMetadata("Направления стоматологии | WhiteDent · Демонстрация", "Демонстрационный каталог направлений WhiteDent в Караганде. Наличие услуг и медицинские тексты требуют подтверждения.");

export default function ServicesPage() {
  return <main id="main" tabIndex={-1}><PageHeading label="Направления" title={<>Возможности.<br /><em>Без лишней спешки.</em></>} description="Выберите направление, чтобы познакомиться с общей информацией и подготовить вопросы к разговору с врачом." />
    <section className="section section-light"><div className="container"><ContentNotice>Это демонстрационный каталог, а не подтверждённый перечень услуг клиники. Описания ожидают медицинской проверки.</ContentNotice><ServiceCatalog /></div></section>
  </main>;
}
