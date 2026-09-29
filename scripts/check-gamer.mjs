import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [1440, 768, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 960 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: "networkidle" });
    const setup = page.locator(".gamer-setup");
    assert.equal(await setup.getAttribute("data-state"), "waiting");
    assert.equal(await page.locator(".gamer-screen-main").evaluate(el => getComputedStyle(el).opacity), "1");
    await setup.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".gamer-setup").dataset.state === "on");
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".gamer-screen")].every(el => getComputedStyle(el).opacity === "0") &&
      getComputedStyle(document.querySelector(".gamer-setup-powered")).opacity === "1",
    );
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const image = await page.locator(".gamer-setup-base").evaluate(el => ({
      width: el.naturalWidth, loaded: el.complete, source: el.currentSrc,
    }));
    assert.ok(image.loaded && image.width > 0);
    if (width === 390) assert.ok(image.source.includes("-800.webp"));
    await page.locator("#gamer").screenshot({ path: `.qa/gamer-${width}.png` });
    await page.locator("#servicos").scrollIntoViewIfNeeded();
    await setup.scrollIntoViewIfNeeded();
    assert.equal(await setup.getAttribute("data-state"), "on", "Do not replay on scroll");
    assert.deepEqual(errors, []);
    await page.close();
  }
  for (const options of [{ reducedMotion: "reduce" }, { javaScriptEnabled: false }]) {
    const page = await browser.newPage(options);
    await page.goto(base + "/#gamer", { waitUntil: "networkidle" });
    assert.equal(await page.locator(".gamer-setup-powered").evaluate(el => getComputedStyle(el).opacity), "1");
    assert.equal(await page.locator(".gamer-screen-main").evaluate(el => getComputedStyle(el).opacity), "0");
    await page.close();
  }
  console.log("OK: gamer startup, three viewports, no replay, reduced motion and no-JS fallback.");
} finally {
  await browser.close();
}
