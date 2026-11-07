import { ArrowUpRight, MessageCircle, ScanLine, Waypoints } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const principles = [
  { icon: MessageCircle, title: "Место для вопросов", text: "Что вас беспокоит? Что хотелось бы узнать? С этих вопросов можно начать разговор с врачом." },
  { icon: ScanLine, title: "Ясность в деталях", text: "Обсудите с врачом необходимость диагностики и то, как её результаты могут повлиять на план лечения." },
  { icon: Waypoints, title: "Понимание следующего шага", text: "Уточните возможные варианты, этапы и ограничения до принятия решения о лечении." },
];

export function Approach() {
  return (
    <section id="approach" className="section section-light" aria-labelledby="approach-heading">
      <div className="container">
        <Reveal className="section-heading"><p className="eyebrow">01 / Знакомство</p><div className="heading-row"><h2 id="approach-heading">Начать с&nbsp;главного.<br /><em>С вашего вопроса.</em></h2><p className="section-intro">Не торопиться с решением.<br />Разобраться в возможностях.<br />Подготовиться к консультации.</p></div></Reveal>
        <div className="principles-grid">{principles.map(({ icon: Icon, title, text }, index) => <Reveal className="principle" key={title} delay={index * 0.06}><div className="principle-top"><Icon strokeWidth={1.2} size={29} aria-hidden="true" /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></Reveal>)}</div>
        <div className="section-footnote"><span>Общая информация для подготовки к приёму. Не описание подтверждённых стандартов клиники.</span><a href="#faq" className="text-link">Вопросы и ответы <ArrowUpRight size={16} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}
