import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

// Fingerprint of the owner's original dfcc5e.png from commit a53f778.
const originalSha256 = "6fb759068bdc3016356aedab774851150498bb6f01eb9c7dd9533333d3857de5";
const digest = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

test("исходный PNG доступен на диске и по HTTP без изменения байтов", async ({ request }) => {
  const file = await readFile("public/brand/whitedent-logo.png");
  expect(digest(file)).toBe(originalSha256);
  expect(file.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  expect([file.readUInt32BE(16), file.readUInt32BE(20)]).toEqual([300, 300]);
  const response = await request.get("/brand/whitedent-logo.png");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  expect(digest(await response.body())).toBe(originalSha256);
});

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`оригинал WD виден без обрезки и искажения в Header и Footer: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const region of [page.getByRole("banner"), page.getByRole("contentinfo")]) {
      const logo = region.getByRole("img", { name: "WhiteDent — оригинальный логотип WD", exact: true });
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute("src", "/brand/whitedent-logo.png");
      await expect.poll(() => logo.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 300 && element.naturalHeight === 300)).toBe(true);
      const rendering = await logo.evaluate(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { ratio: rect.width / rect.height, filter: style.filter, clipPath: style.clipPath, borderRadius: style.borderRadius };
      });
      expect(rendering.ratio).toBeCloseTo(1, 3);
      expect(rendering.filter).toBe("none");
      expect(rendering.clipPath).toBe("none");
      expect(rendering.borderRadius).toBe("0px");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "/brand/whitedent-logo.png");
  });
}
