import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";
import { demoMetadata } from "@/lib/seo";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = {
  ...demoMetadata("WhiteDent — стоматология в Караганде | Демонстрация", "Концепция сайта WhiteDent в Караганде. Демонстрационная версия: контент и контакты требуют согласования с клиникой."),
  // Use the same original PNG directly, without generating a derivative.
  icons: { icon: { url: clinic.logo.src, type: "image/png", sizes: "300x300" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><a href="#main" className="skip-link">Перейти к содержимому</a><aside className="demo-banner" aria-label="Демонстрационный режим">Концепция WhiteDent <span aria-hidden="true">/</span> Демонстрационная версия · запись недоступна</aside><Header />{children}<Footer /></body></html>;
}
