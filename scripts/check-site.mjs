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
          // <source> recebe uma animação interna do Chrome, sem efeito visual.
          // A rolagem dos depoimentos é a única animação permitida.
          (e) =>
            e.tagName !== "SOURCE" &&
            !e.classList.contains("testimonials-track") &&
            getComputedStyle(e).animationName !== "none",
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
      assert.equal(report.autoplay, route === "/" ? 1 : 0);
      if (route === "/") {
        await page.waitForFunction(() => {
          const video = document.querySelector(".hero-visual video");
          return video && !video.paused && video.currentTime > 0.1;
        });
        const hero = page.locator(".hero-visual video");
        const duration = await hero.evaluate((v) => v.duration);
        assert.ok(
          duration > 4.5 && duration < 5.2,
          "Hero montage should complete in about five seconds",
        );
        assert.equal(
          await hero.evaluate((v) => v.muted && v.loop && v.playsInline),
          true,
        );
        await page
          .getByRole("button", { name: "Pausar vídeo de montagem" })
          .click();
        assert.equal(await hero.evaluate((v) => v.paused), true);
        await page
          .getByRole("button", { name: "Reproduzir vídeo de montagem" })
          .click();
        await page.waitForFunction(
          () => !document.querySelector(".hero-visual video").paused,
        );
        await page
          .getByRole("button", { name: "Pausar vídeo de montagem" })
          .click();
        const sources = await page
          .locator(".service-image img")
          .evaluateAll((imgs) => imgs.map((i) => i.src));
        assert.equal(
          new Set(sources).size,
          6,
          "All six service images must be distinct",
        );
        assert.equal(
          sources.some((src) => src.endsWith("/notebook.webp")),
          false,
        );
        const surfaces = await page.evaluate(() => ({
          base: getComputedStyle(document.documentElement).backgroundColor,
          card: getComputedStyle(document.querySelector(".review"))
            .backgroundColor,
        }));
        assert.equal(surfaces.base, "rgb(239, 240, 242)");
        assert.equal(surfaces.card, "rgb(255, 255, 255)");
        await page.screenshot({ path: `.qa/hero-${viewport.width}.png` });
        await page
          .locator("#servicos")
          .screenshot({ path: `.qa/services-${viewport.width}.png` });
        await page
          .locator("#avaliacoes")
          .screenshot({ path: `.qa/reviews-${viewport.width}.png` });
      }
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
          () => !document.querySelector(".video-frame video").paused,
        );
        assert.equal(
          await page
            .locator(".video-frame video")
            .first()
            .evaluate((v) => v.muted),
          true,
        );
        await page
          .locator(".video-frame video")
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
  const reducedPage = await browser.newPage({ reducedMotion: "reduce" });
  await reducedPage.goto(base, { waitUntil: "networkidle" });
  assert.equal(
    await reducedPage
      .locator(".hero-visual video")
      .evaluate((v) => v.paused && !v.autoplay),
    true,
  );
  assert.equal(
    await reducedPage
      .locator(".testimonials-track")
      .first()
      .evaluate((t) => getComputedStyle(t).animationName),
    "none",
    "Testimonials must stop with reduced motion",
  );
  // Sem animação, cada depoimento aparece uma única vez na coluna visível.
  await reducedPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await reducedPage
      .locator(".testimonials-narrow .testimonial-card:visible")
      .count(),
    6,
  );
  await reducedPage.close();
  assert.deepEqual(errors, [], "Browser runtime errors");
  await writeFile(".qa/results.json", JSON.stringify(results, null, 2));
  console.log(
    `OK: ${results.length} page/viewport checks, FAQ, mobile navigation, video playback and WhatsApp links.`,
  );
} finally {
  await browser.close();
}
