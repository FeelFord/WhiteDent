import { test, expect } from "@playwright/test";

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`главная без переполнения и ошибок на ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ваша улыбка.");
    await expect(page.getByRole("heading", { name: "Первый шаг — просто разговор." })).toBeVisible();
    // Check overflow across the full page, not just the first screen.
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator("footer").scrollIntoViewIfNeeded();
    await expect(page.locator("footer")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("сквозная навигация ведёт на страницы и к FAQ главной", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Основная навигация", exact: true });
  for (const [name, path] of [["О клинике", "/about"], ["Направления", "/services"], ["Врачи", "/doctors"], ["Вопросы", "/#faq"], ["Контакты", "/contacts"]]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("мобильное меню: открытие, Escape, фокус и переход", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Открыть меню" });
  await trigger.click();
  const menu = page.getByRole("navigation", { name: "Мобильная навигация" });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole("link", { name: "Контакты" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/contacts$/);
});

test("FAQ открывается и закрывается с клавиатуры", async ({ page }) => {
  await page.goto("/");
  const question = page.locator("summary").first();
  const answer = page.locator("details").first().locator("p");
  await expect(answer).toBeHidden();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(answer).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(answer).toBeHidden();
});

test("защита демо: нет записи, подмены логотипа и неподтверждённых ссылок", async ({ page }) => {
  const response = await page.goto("/");
  await expect(page.getByRole("button", { name: "Запись на консультацию" })).toBeDisabled();
  await expect(page.locator('a[href^="tel:"], a[href*="wa.me"], a[href*="api.whatsapp"]')).toHaveCount(0);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.getByRole("img", { name: "WhiteDent — оригинальный логотип WD", exact: true })).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Открыть карточку в 2ГИС" })).toHaveAttribute("href", "https://2gis.kz/karaganda/firm/70000001080243152");
  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain("Disallow: /");
});

test("пропуск навигации доступен с клавиатуры, reduced motion поддержан", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Перейти к содержимому" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});

test("неизвестный адрес показывает 404 с возвратом на главную", async ({ page }) => {
  const response = await page.goto("/page-that-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Вернёмся");
  await page.getByRole("link", { name: "На главную" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ваша улыбка.");
});
