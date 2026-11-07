import { ArrowUpRight, MapPin, Clock3, MessageCircle } from "lucide-react";
import { clinic } from "@/data/clinic";
import { Reveal } from "@/components/ui/reveal";

export function Contacts() {
  return (
    <section id="contacts" className="section contact-section" aria-labelledby="contacts-heading">
      <div className="container contacts-grid"><Reveal><p className="eyebrow">05 / На связи</p><h2 id="contacts-heading">Первый шаг —<br /><em>просто разговор.</em></h2><p className="contact-lead">WhiteDent · {clinic.city}</p><p className="contact-description">Мы готовим удобный способ связаться с клиникой. До подтверждения номера запись через этот сайт недоступна.</p><button type="button" className="button button-gold" disabled aria-describedby="booking-status">Запись на консультацию <ArrowUpRight size={18} aria-hidden="true" /></button><p id="booking-status" className="contact-note">Демонстрационный режим · обращения не отправляются</p></Reveal>
        <Reveal className="contact-card">
          <div className="contact-detail"><MapPin size={21} strokeWidth={1.3} aria-hidden="true" /><div><p className="detail-label">Расположение</p><h3>{clinic.city}, {clinic.street}</h3><p>Номер здания и вход уточняются.<br />В источниках: {clinic.address.value}; {clinic.alternativeAddress.value}.</p></div></div>
          <div className="contact-detail"><Clock3 size={21} strokeWidth={1.3} aria-hidden="true" /><div><p className="detail-label">Часы работы</p><h3>Расписание уточняется</h3><p>Утверждённый график будет добавлен позже.</p></div></div>
          <div className="contact-detail"><MessageCircle size={21} strokeWidth={1.3} aria-hidden="true" /><div><p className="detail-label">Телефон и WhatsApp</p><h3>Контакты на проверке</h3><p>Неподтверждённые номера не используются.</p></div></div>
          <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer" className="map-link">Открыть карточку в 2ГИС <ArrowUpRight size={20} aria-hidden="true" /></a>
        </Reveal>
      </div>
    </section>
  );
}
