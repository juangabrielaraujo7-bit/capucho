import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const base = process.env.PREVIEW_URL || "http://127.0.0.1:5173";
const routes = [
  "/",
  "/servicos/conserto",
  "/servicos/formatacao-e-programas",
  "/servicos/upgrade-e-montagem",
  "/servicos/limpeza-preventiva",
  "/servicos/suporte-e-atendimento",
];
const results = [];
try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ]) {
    const page = await browser.newPage({ viewport });
    page.on("pageerror", (e) => errors.push(e.message));
    for (const route of routes) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all(
          [...document.images].map((img) => {
            img.loading = "eager";
            return img.decode().catch(() => {});
          }),
        );
      });
      assert.equal(
        await page.locator("h1").count(),
        1,
        route + " should have one main heading",
      );
      const report = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
        wa: [...document.querySelectorAll('a[href*="wa.me"]')].every((a) =>
          a.href.startsWith("https://wa.me/5511947009632?text="),
        ),
        motion: [...document.querySelectorAll("*")].some(
          (e) => getComputedStyle(e).animationName !== "none",
        ),
        autoplay: document.querySelectorAll("video[autoplay]").length,
        title: document.title,
      }));
      assert.equal(
        report.overflow,
        false,
        `${route} overflow at ${viewport.width}`,
      );
      assert.deepEqual(report.broken, [], `${route} has broken images`);
      assert.equal(report.wa, true);
      assert.equal(report.motion, false);
      assert.equal(report.autoplay, 0);
      results.push({ route, width: viewport.width, ...report });
      if (
        route === "/" ||
        route === "/servicos/conserto" ||
        route === "/servicos/suporte-e-atendimento"
      ) {
        await page.screenshot({
          path: `.qa/${route === "/" ? "home" : route.split("/").pop()}-${viewport.width}.png`,
          fullPage: true,
        });
      }
      if (route === "/") {
        const faq = page.locator(".faq-list details").first();
        await faq.locator("summary").click();
        assert.equal(await faq.getAttribute("open"), "");
        await page
          .getByRole("button", {
            name: "Reproduzir: Troca de tela de notebook",
            exact: true,
          })
          .click();
        await page.waitForFunction(
          () => !document.querySelector("video").paused,
        );
        assert.equal(
          await page
            .locator("video")
            .first()
            .evaluate((v) => v.muted),
          true,
        );
        await page
          .locator("video")
          .first()
          .evaluate((v) => v.pause());
        if (viewport.width === 390) {
          await page.getByRole("button", { name: "Abrir menu" }).click();
          assert.equal(await page.locator("#main-nav").isVisible(), true);
          await page
            .locator("#main-nav")
            .getByRole("link", { name: "Serviços", exact: true })
            .click();
          assert.equal(await page.locator("#main-nav").isVisible(), false);
        }
      }
    }
    await page.close();
  }
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(".qa/results.json", JSON.stringify(results, null, 2));
  console.log(
    `OK: ${results.length} page/viewport checks, FAQ, mobile navigation, video playback and WhatsApp links.`,
  );
} finally {
  await browser.close();
}
