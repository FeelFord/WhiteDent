import { test, expect } from "@playwright/test";

const routes = ["/services", "/services/consultation", "/services/diagnostics", "/services/surgery", "/services/prosthetics", "/services/implants", "/doctors", "/doctors/demo-profile", "/about", "/contacts", "/privacy"];

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`все новые страницы без ошибок и переполнения на ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await page.locator("footer").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), route).toBe(true);
      await expect(page.locator('a[href^="tel:"], a[href*="wa.me"], a[href*="api.whatsapp"]')).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}

test("категории фильтруют каталог; выбор доступен с клавиатуры", async ({ page }) => {
  await page.goto("/services");
  await expect(page.locator(".catalog-card")).toHaveCount(5);
  for (const [label, expectedTitles] of [
    ["Консультация и диагностика", ["Консультация", "Диагностика"]],
    ["Восстановление зубов", ["Ортопедия", "Имплантация"]],
    ["Хирургические направления", ["Хирургия"]],
  ] as const) {
    const filter = page.getByRole("button", { name: label, exact: true });
    await filter.focus();
    await page.keyboard.press("Space");
    await expect(filter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".catalog-card h2")).toHaveText([...expectedTitles]);
    await expect(page.getByRole("status")).toHaveText(`Направлений: ${expectedTitles.length}`);
  }
  await page.getByRole("button", { name: "Все направления", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(5);
});

test("карточка услуги, детали, FAQ и переход к демо-форме", async ({ page }) => {
  await page.goto("/services");
  await page.getByRole("link", { name: "Подробнее: Имплантация", exact: true }).click();
  await expect(page).toHaveURL(/\/services\/implants$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Имплантация.");
  await page.locator("summary").click();
  await expect(page.locator("details p")).toContainText("риски");
  await page.getByRole("link", { name: "К форме · демо" }).click();
  await expect(page).toHaveURL(/\/contacts#inquiry$/);
  await expect(page.getByRole("form", { name: "Демонстрационная форма обращения" })).toBeVisible();
});

test("демо-карточка врача не выдаётся за реального специалиста", async ({ page }) => {
  await page.goto("/doctors");
  await expect(page.getByText("Демо · не реальный специалист")).toBeVisible();
  await page.getByRole("link", { name: "Посмотреть структуру профиля" }).click();
  await expect(page).toHaveURL(/\/doctors\/demo-profile$/);
  await expect(page.getByText("Сведения не предоставлены", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Запись недоступна" })).toBeDisabled();
});

test("форма показывает связанные ошибки и фокусирует первое неверное поле", async ({ page }) => {
  await page.goto("/contacts");
  await page.getByRole("button", { name: "Проверить данные · демо" }).click();
  await expect(page.getByLabel("Имя", { exact: false })).toBeFocused();
  await expect(page.locator("#name-error")).toBeVisible();
  await expect(page.locator("#phone-error")).toBeVisible();
  await expect(page.locator("#acknowledgement-error")).toBeVisible();
  await page.getByLabel("Имя", { exact: false }).fill("123");
  await page.getByRole("textbox", { name: /^Телефон/ }).fill("+7 abc 7000000000");
  await page.getByRole("button", { name: "Проверить данные · демо" }).click();
  await expect(page.locator("#inquiry-name")).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator("#inquiry-phone")).toHaveAttribute("aria-invalid", "true");
});

test("валидная форма не отправляет и не сохраняет данные; результат честный", async ({ page }) => {
  await page.goto("/contacts");
  const transmissions: string[] = [];
  page.on("request", request => {
    if (request.method() !== "GET" || /7000000000|Тестовый/.test(`${request.url()} ${request.postData() ?? ""}`)) transmissions.push(request.url());
  });
  await page.getByLabel("Имя", { exact: false }).fill("Тестовый Пользователь");
  await page.getByRole("textbox", { name: /^Телефон/ }).fill("+7 (700) 000-00-00");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Проверить данные · демо" }).click();
  await expect(page.getByRole("status")).toHaveText("Данные проверены локально. Обращение не отправлено. Запись на приём не создана.");
  await expect(page).toHaveURL(/\/contacts$/);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  expect(transmissions).toEqual([]);
  await page.reload();
  await expect(page.locator("#inquiry-name")).toHaveValue("");
  await expect(page.locator("#inquiry-phone")).toHaveValue("");
  await expect(page.getByRole("status")).toBeEmpty();
});

test("без JavaScript форма отключена и не может отправить данные", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/contacts");
  await expect(page.getByRole("button", { name: "Проверить данные · демо" })).toBeDisabled();
  await expect(page.locator("#inquiry-name")).toBeDisabled();
  await expect(page.getByText("Для локальной проверки формы нужен JavaScript. Отправка отключена.")).toBeVisible();
  await context.close();
});

for (const route of ["/services/unknown-service", "/doctors/unknown-doctor"]) {
  test(`неизвестный slug возвращает 404: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Вернёмся");
  });
}

test("пустой демо-sitemap и ссылки на карту и privacy", async ({ page }) => {
  await page.goto("/contacts");
  await expect(page.getByRole("link", { name: "Построить маршрут в 2ГИС" })).toHaveAttribute("href", "https://2gis.kz/karaganda/firm/70000001080243152");
  await page.getByRole("link", { name: "Черновик политики конфиденциальности", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy$/);
  await expect(page.getByText("Не является окончательно согласованным юридическим документом.", { exact: false })).toBeVisible();
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain("<urlset");
  expect(await sitemap.text()).not.toContain("<loc>");
});
