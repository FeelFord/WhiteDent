import { ArrowUpRight } from "lucide-react";
import { clinic } from "@/data/clinic";
import { navigation } from "@/config/navigation";
import Link from "next/link";
import { Brand } from "@/components/ui/brand";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link href="/" className="brand-home" title="На главную"><Brand placement="footer" /></Link>
          <nav aria-label="Навигация в подвале">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
          <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer" className="text-link">Карточка в 2ГИС <ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} WhiteDent · Концепция сайта</span><span>Демонстрационная версия. Не является медицинской рекомендацией.</span></div>
        <p className="footer-note">Контакты, медицинские сведения и материалы ожидают согласования. Демонстрационная форма работает локально и не отправляет обращения.</p>
        <Link href="/privacy" className="privacy-link">Конфиденциальность · черновик</Link>
      </div>
    </footer>
  );
}
