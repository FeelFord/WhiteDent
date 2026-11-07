import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { clinic } from "@/data/clinic";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <p className="eyebrow"><span className="gold-dash" /> WhiteDent · {clinic.city}</p>
          <h1 id="hero-heading">Ваша улыбка.<br />Ваше <em>спокойствие.</em></h1>
          <p className="hero-description">Знакомство со стоматологией начинается с&nbsp;простого: возможности задать вопросы и&nbsp;понять следующий шаг.</p>
          <div className="hero-actions"><a href="#contacts" className="button button-gold">О консультации <ArrowUpRight size={19} aria-hidden="true" /></a><a href="#approach" className="hero-secondary">Познакомиться <ArrowDown size={16} aria-hidden="true" /></a></div>
          <p className="hero-demo-note">Демонстрация · запись пока не подключена</p>
          <div className="hero-location"><MapPin size={16} aria-hidden="true" /><span>{clinic.city}, {clinic.country}</span><span className="location-rule" /></div>
        </Reveal>
        <Reveal className="hero-art" delay={0.12}>
          <div className="art-frame" aria-hidden="true">
            <div className="art-halo" /><div className="art-arch arch-one" /><div className="art-arch arch-two" /><div className="art-arch arch-three" />
            <div className="art-orb" /><div className="art-plinth" /><div className="art-line" />
            <span className="art-word">Баланс.<br /><i>В деталях.</i></span><span className="art-index">FORM / CONCEPT 01</span>
          </div>
          <p className="art-caption"><span>Свет. Форма. Спокойствие.</span><span>Абстрактная композиция, не фото клиники</span></p>
        </Reveal>
      </div>
      <div className="container hero-bottom"><span>НОВЫЙ ВЗГЛЯД НА ПРИВЫЧНОЕ</span><a href="#services">Исследовать направления <ArrowDown size={14} aria-hidden="true" /></a><span>01 — WHITE DENT</span></div>
    </section>
  );
}
