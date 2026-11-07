import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const fallbackSiteUrl = "https://shiftlabs.sh";
const socialImagePath = "/social-preview.png";
const organizationLogoPath = "/fav-icon.svg";
const projectRoot = process.cwd();
const distDir = path.resolve(projectRoot, "dist");
const baseHtmlPath = path.join(distDir, "index.html");
const rawSiteUrl =
  firstNonEmptyEnv("SITE_URL", "VITE_SITE_URL") ?? fallbackSiteUrl;
const siteUrl = rawSiteUrl.trim().replace(/\/+$/, "") || fallbackSiteUrl;
const googleSiteVerification = firstNonEmptyEnv(
  "GOOGLE_SITE_VERIFICATION",
  "VITE_GOOGLE_SITE_VERIFICATION",
);

function firstNonEmptyEnv(...names) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsonLd(value) {
  return JSON.stringify(value).replace(/<\/script/gi, "<\\/script");
}

function toAbsoluteUrl(pathname) {
  const normalizedPath = String(pathname || "/").startsWith("/")
    ? String(pathname || "/")
    : `/${pathname}`;
  const finalPath =
    normalizedPath === "/" ? "/" : normalizedPath.replace(/\/+$/, "");
  return `${siteUrl}${finalPath}`;
}

function normalizeRoutePath(pathname) {
  if (!pathname || pathname === "/") return "/";
  return `/${String(pathname).replace(/^\/+|\/+$/g, "")}`;
}

function routeToFilePath(routePath) {
  const normalizedPath = normalizeRoutePath(routePath);
  if (normalizedPath === "/") return path.join(distDir, "index.html");
  return path.join(distDir, normalizedPath.slice(1), "index.html");
}

function truncateWithEllipsis(value, maxLength = 160) {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const truncated = normalized.slice(0, maxLength - 1);
  const safeBreak = truncated.lastIndexOf(" ");
  if (safeBreak <= 60) return `${truncated.trim()}...`;
  return `${truncated.slice(0, safeBreak).trim()}...`;
}

function extractPreservedAssetTags(baseHtml) {
  const matches = [
    ...baseHtml.matchAll(/<script\b[\s\S]*?<\/script>/gi),
    ...baseHtml.matchAll(/<link\b[^>]*>/gi),
  ];
  const tags = [];
  const seen = new Set();

  for (const match of matches) {
    const tag = match[0].trim();
    const lowerTag = tag.toLowerCase();
    const shouldKeepScript =
      lowerTag.startsWith("<script") && /\bsrc\s*=/.test(lowerTag);
    const shouldKeepLink =
      lowerTag.startsWith("<link") &&
      !/\brel\s*=\s*["']?canonical\b/.test(lowerTag) &&
      (/\brel\s*=\s*["']?(stylesheet|manifest|icon|preload|modulepreload)\b/.test(
        lowerTag,
      ) ||
        /\bhref\s*=\s*["']\/(assets|fonts|fav-icon\.svg|site\.webmanifest)\b/.test(
          lowerTag,
        ));

    if (!shouldKeepScript && !shouldKeepLink) continue;
    if (seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }

  return tags;
}

function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShiftLabs",
    url: toAbsoluteUrl("/"),
    logo: toAbsoluteUrl(organizationLogoPath),
    sameAs: [
      "https://www.linkedin.com/company/shiftlabs-br/",
      "https://instagram.com/shiftlabs.br",
      "https://github.com/shiftlabs-br",
    ],
  };
}

function buildWebPageSchema(name, description, routePath, inLanguage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    url: toAbsoluteUrl(routePath),
    description,
    inLanguage,
  };
}

function buildHead({
  title,
  description,
  routePath,
  canonicalPath,
  ogLocale,
  robots,
  type = "website",
  jsonLd = [],
  preservedAssetTags,
}) {
  const normalizedDescription = truncateWithEllipsis(description);
  const canonicalUrl = toAbsoluteUrl(canonicalPath || routePath);
  const imageUrl = toAbsoluteUrl(socialImagePath);
  const jsonLdTags = jsonLd
    .filter(Boolean)
    .map(
      (payload) =>
        `<script type="application/ld+json">${escapeJsonLd(payload)}</script>`,
    );
  const tags = [
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(normalizedDescription)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    '<meta name="theme-color" content="#f2f3ef" />',
    '<meta name="author" content="ShiftLabs" />',
    ...(googleSiteVerification
      ? [
          `<meta name="google-site-verification" content="${escapeHtml(googleSiteVerification)}" />`,
        ]
      : []),
    '<meta property="og:site_name" content="ShiftLabs" />',
    `<meta property="og:locale" content="${escapeHtml(ogLocale)}" />`,
    `<meta property="og:type" content="${escapeHtml(type)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(normalizedDescription)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`,
    '<meta property="og:image:alt" content="ShiftLabs" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(normalizedDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<link rel="alternate" hreflang="pt-BR" href="${escapeHtml(toAbsoluteUrl("/"))}" />`,
    `<link rel="alternate" hreflang="en" href="${escapeHtml(toAbsoluteUrl("/en"))}" />`,
    `<link rel="alternate" hreflang="x-default" href="${escapeHtml(toAbsoluteUrl("/"))}" />`,
    ...jsonLdTags,
    ...preservedAssetTags,
  ];

  return tags.map((tag) => `    ${tag}`).join("\n");
}

const staticShellStyles = {
  main: "min-height:100vh;background:#f2f3ef;color:#101700;font-family:-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;",
  header:
    "height:72px;border-bottom:1px solid #d6dace;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:0 clamp(24px,12vw,192px);",
  brand:
    "color:#101700;text-decoration:none;font-family:-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;font-size:20px;font-weight:600;letter-spacing:0;",
  section:
    "max-width:1512px;margin:0 auto;padding:clamp(48px,8vw,112px) clamp(24px,12vw,192px);border-bottom:1px solid #d6dace;",
  eyebrow:
    "margin:0 0 24px;color:#5f644c;font-family:ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;font-size:12px;text-transform:lowercase;",
  title:
    "max-width:780px;margin:0;color:#101700;font-family:-apple-system, BlinkMacSystemFont, system-ui, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;font-size:clamp(32px,7vw,72px);font-weight:500;line-height:1.02;letter-spacing:-0.02em;",
  description:
    "max-width:560px;margin:28px 0 0;color:#5f644c;font-size:clamp(16px,2vw,20px);line-height:1.35;",
};

function buildStaticLayout({ homePath, eyebrow, title, description, bodyHtml = "" }) {
  const safeDescription = description
    ? `<p style="${staticShellStyles.description}">${escapeHtml(description)}</p>`
    : "";

  return [
    `<main data-static-route="true" style="${staticShellStyles.main}">`,
    `  <header style="${staticShellStyles.header}">`,
    `    <a href="${escapeHtml(homePath)}" style="${staticShellStyles.brand}">ShiftLabs</a>`,
    "  </header>",
    `  <section style="${staticShellStyles.section}">`,
    eyebrow
      ? `    <p style="${staticShellStyles.eyebrow}">${escapeHtml(eyebrow)}</p>`
      : "",
    `    <h1 style="${staticShellStyles.title}">${escapeHtml(title)}</h1>`,
    safeDescription ? `    ${safeDescription}` : "",
    bodyHtml,
    "  </section>",
    "</main>",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildHtmlDocument(baseHtml, page) {
  const preservedAssetTags = extractPreservedAssetTags(baseHtml);
  const head = buildHead({ ...page, preservedAssetTags });
  return [
    "<!DOCTYPE html>",
    `<html lang="${escapeHtml(page.lang)}">`,
    "  <head>",
    head,
    "  </head>",
    "",
    "  <body>",
    `    <div id="root">${page.bodyHtml}</div>`,
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}

async function writeRouteHtml(baseHtml, routePath, page) {
  const filePath = routeToFilePath(routePath);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buildHtmlDocument(baseHtml, page), "utf8");
}

const landingPages = [
  {
    routePath: "/",
    lang: "pt-BR",
    ogLocale: "pt_BR",
    title: "ShiftLabs | Da Ideia ao Primeiro Cliente e Estrutura para Empresas",
    description:
      "A ShiftLabs leva sua ideia até a entrega ao primeiro cliente e estrutura empresas prontas para crescer com previsibilidade e execução coordenada.",
    eyebrow: "/Engenharia de negócios, da ideia à escala",
    heading: "Tiramos negócios do papel. Estruturamos os que já existem.",
    text: "A ShiftLabs transforma ideias em negócios reais, até a entrega ao primeiro cliente, e organiza empresas prontas para crescer com previsibilidade.",
  },
  {
    routePath: "/en",
    lang: "en",
    ogLocale: "en_US",
    title: "ShiftLabs | From Idea to First Customer, and Structure for Companies",
    description:
      "ShiftLabs takes your idea all the way to the first customer and structures established companies for predictable growth and coordinated execution.",
    eyebrow: "/Business engineering, from idea to scale",
    heading: "We get businesses off the ground. We structure the ones already running.",
    text: "ShiftLabs turns ideas into real businesses, all the way to delivery to the first customer, and organizes established companies to grow predictably.",
  },
];

async function run() {
  const baseHtml = await readFile(baseHtmlPath, "utf8");
  const organizationSchema = buildOrganizationSchema();

  for (const page of landingPages) {
    await writeRouteHtml(baseHtml, page.routePath, {
      title: page.title,
      description: page.description,
      routePath: page.routePath,
      lang: page.lang,
      ogLocale: page.ogLocale,
      robots: "index, follow, max-image-preview:large",
      jsonLd: [
        organizationSchema,
        buildWebPageSchema("ShiftLabs", page.description, page.routePath, page.lang),
      ],
      bodyHtml: buildStaticLayout({
        homePath: page.routePath,
        eyebrow: page.eyebrow,
        title: page.heading,
        description: page.text,
      }),
    });
  }

  console.log("[seo] HTML estatico gerado para / e /en.");
}

run().catch((error) => {
  console.error("[seo] Falha ao gerar HTML estatico:", error);
  process.exit(1);
});
