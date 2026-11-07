import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";

const prefix = "/WhiteDent";
const routes = ["/", "/services/", "/services/consultation/", "/services/diagnostics/", "/services/surgery/", "/services/prosthetics/", "/services/implants/", "/doctors/", "/doctors/demo-profile/", "/about/", "/contacts/", "/privacy/"];

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`статический экспорт: все страницы и ресурсы на ${width}px`, async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("response", response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    for (const route of routes) {
      const response = await page.goto(prefix + route);
      expect(response?.status(), route).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.getByRole("complementary", { name: "Демонстрационный режим" })).toBeVisible();
      const logo = page.getByRole("banner").getByRole("img");
      await expect(logo).toHaveAttribute("src", prefix + "/brand/whitedent-logo.png");
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth === 300)).toBe(true);
      const links = await page.locator('a[href^="/"]').evaluateAll(elements => elements.map(element => element.getAttribute("href")));
      expect(links.every(href => href?.startsWith(prefix + "/")), route).toBe(true);
      await page.locator("footer").scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("мягкая навигация, фильтр, FAQ и локальная форма в подпапке", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(prefix + "/");
  await page.getByRole("navigation", { name: "Основная навигация", exact: true }).getByRole("link", { name: "Направления" }).click();
  await expect(page).toHaveURL(/\/WhiteDent\/services\/$/);
  await page.getByRole("button", { name: "Восстановление зубов", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(2);
  await page.getByRole("link", { name: "Подробнее: Имплантация" }).click();
  await expect(page).toHaveURL(/\/WhiteDent\/services\/implants\/$/);
  await page.locator("summary").click();
  await expect(page.locator("details p")).toBeVisible();
  await page.getByRole("link", { name: "К форме · демо" }).click();
  await expect(page).toHaveURL(/\/WhiteDent\/contacts\/#inquiry$/);
  const posts: string[] = [];
  page.on("request", request => { if (request.method() !== "GET") posts.push(request.url()); });
  await page.getByRole("textbox", { name: /^Имя/ }).fill("Тестовый Пользователь");
  await page.getByRole("textbox", { name: /^Телефон/ }).fill("+7 (700) 000-00-00");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Проверить данные · демо" }).click();
  await expect(page.getByRole("status")).toContainText("Обращение не отправлено");
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test("мобильное меню и возврат к FAQ на статической главной", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(prefix + "/doctors/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.getByRole("navigation", { name: "Мобильная навигация" }).getByRole("link", { name: "Вопросы" }).click();
  await expect(page).toHaveURL(/\/WhiteDent\/#faq$/);
  await expect(page.getByRole("navigation", { name: "Мобильная навигация" })).toBeHidden();
  await page.locator("summary").first().click();
  await expect(page.locator("details").first().locator("p")).toBeVisible();
});

test("экспорт содержит оригинал PNG и .nojekyll, не задаёт собственный домен", async ({ request }) => {
  await access("out/.nojekyll");
  await expect(access("out/CNAME")).rejects.toThrow();
  const response = await request.get(prefix + "/brand/whitedent-logo.png");
  expect(response.status()).toBe(200);
  expect(createHash("sha256").update(await response.body()).digest("hex")).toBe("6fb759068bdc3016356aedab774851150498bb6f01eb9c7dd9533333d3857de5");
  expect(await readFile("out/robots.txt", "utf8")).toContain("Disallow: /");
  expect(await readFile("out/sitemap.xml", "utf8")).not.toContain("<loc>");
});

test("статическая форма без JavaScript отключена", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3200" + prefix + "/contacts/");
  await expect(page.getByRole("button", { name: "Проверить данные · демо" })).toBeDisabled();
  await expect(page.locator("#inquiry-name")).toBeDisabled();
  await context.close();
});

test("фирменная статическая 404 возвращает на главную с префиксом", async ({ page }) => {
  const response = await page.goto(prefix + "/does-not-exist/");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "На главную" }).click();
  await expect(page).toHaveURL(/\/WhiteDent\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Ваша улыбка.");
});

for (const route of ["/", "/contacts/"]) {
  test(`axe на статической версии: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(prefix + route);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"]).analyze();
    expect(result.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) }))).toEqual([]);
  });
}
