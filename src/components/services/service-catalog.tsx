"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services, serviceCategories } from "@/data/services";

export function ServiceCatalog() {
  const [category, setCategory] = useState<string>("all");
  const visible = services.filter(service => category === "all" || service.category === category);
  return <>
    <div className="filter-group" role="group" aria-label="Категории услуг">{serviceCategories.map(item => <button key={item.id} type="button" className="filter-button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
    <p className="catalog-count" role="status">Направлений: {visible.length}</p>
    <div className="catalog-grid">{visible.map(service => <article className="catalog-card" key={service.id}>
      <span className="status-tag">Требует подтверждения</span><h2><Link href={`/services/${service.id}`}>{service.title}</Link></h2><p>{service.description}</p><Link className="text-link" href={`/services/${service.id}`} aria-label={`Подробнее: ${service.title}`}>Подробнее <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </article>)}</div>
  </>;
}
