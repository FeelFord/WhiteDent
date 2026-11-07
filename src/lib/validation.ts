export type InquiryValues = { name: string; phone: string; acknowledgement: boolean };
export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = values.name.trim();
  if (name.length < 2 || name.length > 80 || !/^[\p{L}\p{M}\s'’–-]+$/u.test(name) || (name.match(/\p{L}/gu)?.length ?? 0) < 2) {
    errors.name = "Укажите имя от 2 до 80 символов, используя буквы.";
  }
  const digits = values.phone.replace(/\D/g, "");
  if (!/^[+\d()\s-]+$/.test(values.phone) || !/^[78]\d{10}$/.test(digits)) {
    errors.phone = "Введите номер в формате +7 (XXX) XXX-XX-XX или 8XXXXXXXXXX.";
  }
  if (!values.acknowledgement) errors.acknowledgement = "Подтвердите, что понимаете демонстрационный режим.";
  return errors;
}
