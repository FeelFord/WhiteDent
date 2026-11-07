import type { ContentFact } from "@/types/content";
import { assetPath } from "@/config/site";

const brief = "Техническое задание WhiteDent v2.0; источники повторно не подтверждены клиникой";

export const clinic = {
  name: "WhiteDent",
  city: "Караганда",
  country: "Казахстан",
  street: "улица Букетова",
  mode: "demo",
  // Owner-provided PNG, moved byte-for-byte from dfcc5e.png in origin/main.
  logo: {
    src: assetPath("/brand/whitedent-logo.png"),
    width: 300,
    height: 300,
    alt: "WhiteDent — оригинальный логотип WD",
    status: "verified",
    source: "Предоставлен пользователем: dfcc5e.png, коммит a53f778",
    sha256: "6fb759068bdc3016356aedab774851150498bb6f01eb9c7dd9533333d3857de5",
  },
  address: {
    value: "ул. Букетова, 60/2",
    status: "requiresVerification",
    source: "https://2gis.kz/karaganda/firm/70000001080243152",
    note: "Альтернатива с существующего сайта: ул. Букетова, 60а, блок 1. Требует сверки.",
  } satisfies ContentFact<string>,
  alternativeAddress: {
    value: "ул. Букетова, 60а, блок 1",
    status: "requiresVerification",
    source: "https://white-dent.kz/",
  } satisfies ContentFact<string>,
  phone: {
    value: "+7 706 835 00 00",
    status: "requiresVerification",
    source: "https://white-dent.kz/",
  } satisfies ContentFact<string>,
  whatsapp: {
    value: "+7 706 635 00 00",
    status: "requiresVerification",
    source: "https://2gis.kz/karaganda/firm/70000001080243152",
  } satisfies ContentFact<string>,
  schedule: {
    value: null,
    status: "requiresVerification",
    source: brief,
    note: "Встречается интервал 09:00–19:00; дни недели и полное расписание не подтверждены.",
  } satisfies ContentFact<string | null>,
  instagram: {
    value: "https://instagram.com/whitedent.krg",
    status: "requiresVerification",
    source: brief,
  } satisfies ContentFact<string>,
  mapUrl: "https://2gis.kz/karaganda/firm/70000001080243152",
} as const;
