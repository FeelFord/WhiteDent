import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="not-found container"><p className="eyebrow">404 / Страница не найдена</p><h1>Вернёмся<br /><em>к началу?</em></h1><p>По этому адресу пока нет страницы.</p><Link href="/" className="button button-gold">На главную ↗</Link></main>;
}
