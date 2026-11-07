import AxeBuilder from "@axe-core/playwright";
import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const routes = ["/", "/services", "/services/consultation", "/services/diagnostics", "/services/surgery", "/services/prosthetics", "/services/implants", "/doctors", "/doctors/demo-profile", "/about", "/contacts", "/privacy"];

async function scan(page: Page, info: TestInfo, state = "page") {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    .analyze();
  const output = info.outputPath(`axe-${state}.json`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ url: result.url, testEngine: result.testEngine, violations: result.violations, incomplete: result.incomplete }, null, 2));
  await info.attach(`axe-${state}.json`, {
    path: output,
    contentType: "application/json",
  });
  expect(result.violations.map(item => ({ id: item.id, impact: item.impact, targets: item.nodes.map(node => node.target) }))).toEqual([]);
}

for (const route of routes) {
  test(`axe: ${route}`, async ({ page }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await scan(page, info);
  });
}

test("axe: мобильная главная и открытое меню", async ({ page }, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await scan(page, info, "mobile-home");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await scan(page, info, "mobile-menu");
});

test("axe: мобильная форма с ошибками", async ({ page }, info) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contacts#inquiry");
  await page.getByRole("button", { name: "Проверить данные · демо" }).click();
  await expect(page.locator("#name-error")).toBeVisible();
  await scan(page, info, "form-errors");
});

test("axe: фильтр каталога и раскрытый FAQ услуги", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  await page.getByRole("button", { name: "Восстановление зубов", exact: true }).click();
  await expect(page.locator(".catalog-card")).toHaveCount(2);
  await scan(page, info, "filtered-catalog");
  await page.getByRole("link", { name: "Подробнее: Имплантация" }).click();
  await page.locator("summary").click();
  await scan(page, info, "expanded-faq");
});

test("SEO: уникальные метаданные и демозащита на всех страницах", async ({ page }) => {
  test.setTimeout(60_000);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(title).toContain("WhiteDent");
    expect(description).toBeTruthy();
    expect(titles.has(title), `${route}: duplicate title`).toBe(false);
    expect(descriptions.has(description!), `${route}: duplicate description`).toBe(false);
    titles.add(title); descriptions.add(description!);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", description!);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ru_KZ");
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
  }
});
