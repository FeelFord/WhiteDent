"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { validateInquiry, type InquiryErrors, type InquiryValues } from "@/lib/validation";

export function InquiryForm() {
  const [ready, setReady] = useState(false);
  const [values, setValues] = useState<InquiryValues>({ name: "", phone: "", acknowledgement: false });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [checked, setChecked] = useState(false);
  useEffect(() => setReady(true), []);

  function update<K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) {
    setValues(previous => ({ ...previous, [key]: value }));
    setChecked(false);
    setErrors(previous => ({ ...previous, [key]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validateInquiry(values);
    setErrors(nextErrors);
    setChecked(Object.keys(nextErrors).length === 0);
    if (Object.keys(nextErrors).length) requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
  }

  return <form className="inquiry-form" aria-label="Демонстрационная форма обращения" noValidate onSubmit={handleSubmit}>
    <p className="form-intro">Используйте вымышленные данные для проверки. Значения остаются в памяти этой страницы: форма не отправляет их, не записывает в браузерное хранилище и не создаёт запись на приём.</p>
    {!ready && <p className="field-hint">Для локальной проверки формы нужен JavaScript. Отправка отключена.</p>}
    <fieldset disabled={!ready}>
      <legend className="sr-only">Проверка полей обращения</legend>
      <div className="form-field"><label htmlFor="inquiry-name">Имя <span aria-hidden="true">*</span></label><input id="inquiry-name" type="text" autoComplete="off" maxLength={80} required value={values.name} onChange={event => update("name", event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />{errors.name && <p className="form-error" id="name-error">{errors.name}</p>}</div>
      <div className="form-field"><label htmlFor="inquiry-phone">Телефон <span aria-hidden="true">*</span></label><input id="inquiry-phone" type="tel" inputMode="tel" autoComplete="off" maxLength={24} required placeholder="+7 (XXX) XXX-XX-XX" value={values.phone} onChange={event => update("phone", event.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-hint phone-error" : "phone-hint"} /><p id="phone-hint" className="field-hint">Формат с +7 или 8 и 10 следующими цифрами. Это только проверка формата.</p>{errors.phone && <p className="form-error" id="phone-error">{errors.phone}</p>}</div>
      <div className="form-field"><label className="checkbox-label" htmlFor="inquiry-acknowledgement"><input type="checkbox" id="inquiry-acknowledgement" required checked={values.acknowledgement} onChange={event => update("acknowledgement", event.target.checked)} aria-invalid={!!errors.acknowledgement} aria-describedby={errors.acknowledgement ? "acknowledgement-error" : undefined} /><span>Я понимаю, что это демонстрация и обращение не будет отправлено.</span></label>{errors.acknowledgement && <p className="form-error" id="acknowledgement-error">{errors.acknowledgement}</p>}</div>
      <button type="submit" className="button button-gold">Проверить данные · демо <ArrowUpRight size={18} aria-hidden="true" /></button>
    </fieldset>
    <div role="status" className={checked ? "form-result" : undefined}>{checked && "Данные проверены локально. Обращение не отправлено. Запись на приём не создана."}</div>
    <p className="field-hint">Все поля обязательны. Реальная отправка будет доступна только после отдельного согласования. <Link href="/privacy">Черновик политики конфиденциальности</Link>.</p>
  </form>;
}
