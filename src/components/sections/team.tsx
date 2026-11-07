import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import Link from "next/link";

export function Team() {
  return (
    <section id="team" className="section section-light" aria-labelledby="team-heading">
      <div className="container team-grid">
        <Reveal className="team-art"><div className="team-sculpture" aria-hidden="true"><span /><span /><span /></div><p>Форма будущего знакомства</p></Reveal>
        <Reveal className="team-copy"><p className="eyebrow">03 / Люди WhiteDent</p><h2 id="team-heading">За каждой улыбкой&nbsp;—<br /><em>человек.</em></h2><p>Эта часть сайта будет посвящена специалистам WhiteDent: их профессиональному пути, образованию и направлениям работы.</p><p className="text-muted">Состав команды и фотографии появятся после проверки и согласования с клиникой.</p><Link href="/doctors" className="text-link">Раздел специалистов · демо <ArrowUpRight size={17} aria-hidden="true" /></Link></Reveal>
      </div>
    </section>
  );
}
