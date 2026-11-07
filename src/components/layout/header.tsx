"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navigation } from "@/config/navigation";
import { Brand } from "@/components/ui/brand";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("keydown", close); desktop.removeEventListener("change", closeOnDesktop); };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand-home" title="На главную" onClick={() => setOpen(false)}><Brand placement="header" /></Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
        </nav>
        <Link href="/contacts#inquiry" className="header-cta" onClick={() => setOpen(false)}>Консультация <ArrowUpRight size={16} aria-hidden="true" /></Link>
        <button className="menu-toggle" ref={trigger} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(!open)}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      <nav id="mobile-navigation" ref={menu} hidden={!open} className="mobile-nav container" aria-label="Мобильная навигация">
        {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link>)}
      </nav>
    </header>
  );
}
