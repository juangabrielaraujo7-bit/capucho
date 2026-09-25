// Gera o HTML final de cada rota depois do `vite build`, com metadados de SEO,
// dados estruturados, sitemap e robots.txt. Executado pelo `npm run build`.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const ssrDir = resolve(root, "dist-ssr");

// Domínio definitivo: defina SITE_URL (ex.: https://www.seudominio.com.br).
// Na Vercel, sem SITE_URL, usa o domínio de produção do projeto.
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://127.0.0.1:4173")
).replace(/\/$/, "");

const { render, routes, getSeo, localBusinessJsonLd } = await import(
  pathToFileURL(resolve(ssrDir, "entry-server.js")).href
);
const template = await readFile(resolve(dist, "index.html"), "utf8");

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const jsonLd = JSON.stringify(localBusinessJsonLd(siteUrl)).replace(
  /</g,
  "\\u003c",
);

function head(seo) {
  const url = siteUrl + (seo.path === "/" ? "/" : seo.path);
  const image = `${siteUrl}/assets/og-image.jpg`;
  return [
    `<title>${escape(seo.title)}</title>`,
    `<meta name="description" content="${escape(seo.description)}" />`,
    seo.noindex
      ? `<meta name="robots" content="noindex" />`
      : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="Capucho Informática" />`,
    `<meta property="og:title" content="${escape(seo.title)}" />`,
    `<meta property="og:description" content="${escape(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join("\n    ");
}

function page(pathname) {
  const html = template
    .replace(
      /<!--seo:start-->[\s\S]*<!--seo:end-->/,
      head(getSeo(pathname)),
    )
    .replace('<div id="root"></div>', `<div id="root">${render(pathname)}</div>`);
  if (html === template) throw new Error("Template sem marcadores de SEO/root");
  return html;
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

for (const route of routes) {
  // Com "cleanUrls" na Vercel, /servicos/conserto serve servicos/conserto.html
  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  await write(resolve(dist, file), page(route));
}
await write(resolve(dist, "404.html"), page("/404"));

const today = new Date().toISOString().slice(0, 10);
await write(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) =>
      `  <url><loc>${siteUrl}${r}</loc><lastmod>${today}</lastmod></url>`,
  )
  .join("\n")}
</urlset>
`,
);
await write(
  resolve(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Pré-render: ${routes.length} páginas + 404 para ${siteUrl}`);
