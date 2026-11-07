import { faq } from "@/data/faq";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function Faq() {
  return (
    <section id="faq" className="section section-paper" aria-labelledby="faq-heading">
      <div className="container faq-layout"><Reveal><p className="eyebrow">04 / Ответы рядом</p><h2 id="faq-heading">Есть вопросы?<br /><em>Это естественно.</em></h2><p className="faq-intro">Несколько деталей о клинике<br />и этой версии сайта.</p></Reveal>
        <div className="faq-list">{faq.map((item, index) => <details className="faq-item" key={item.question}><summary><span className="faq-number">0{index + 1}</span><span>{item.question}</span><Plus size={20} strokeWidth={1.5} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div>
      </div>
    </section>
  );
}
