import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const fallbackSiteUrl = "https://shiftlabs.sh";
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || fallbackSiteUrl)
  .trim()
  .replace(/\/+$/, "");
const socialPreviewUrl = `${siteUrl}/social-preview.png`;
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) {
    throw new Error(message);
  }
}

async function findIndexFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findIndexFiles(entryPath)));
    } else if (entry.name === "index.html") {
      files.push(entryPath);
    }
  }

  return files;
}

function routeFromIndexFile(filePath) {
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  if (relativePath === "index.html") return "/";
  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"/index.html".length)}`;
  }
  throw new Error(`${relativePath}: rota estatica invalida`);
}

function toCanonicalUrl(route) {
  return route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`;
}

function getTags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(
    (match) => match[0],
  );
}

function getAttribute(tag, attribute) {
  const match = tag?.match(new RegExp(`\\s${attribute}=["']([^"']*)["']`, "i"));
  return match?.[1];
}

function getMeta(html, selectorAttribute, selectorValue) {
  const tag = getTags(html, "meta").find(
    (candidate) => getAttribute(candidate, selectorAttribute) === selectorValue,
  );
  return getAttribute(tag, "content");
}

function getLink(html, rel) {
  const tag = getTags(html, "link").find(
    (candidate) => getAttribute(candidate, "rel") === rel,
  );
  return getAttribute(tag, "href");
}

function getTitle(html) {
  return html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim();
}

function getH1(html) {
  return html
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
    ?.replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractJsonLdBlocks(html, route) {
  return [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${route}: JSON-LD invalido (${error.message})`);
    }
  });
}

function flattenJsonLd(blocks) {
  const entries = [];

  function visit(value) {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    entries.push(value);
    if (Array.isArray(value["@graph"])) {
      value["@graph"].forEach(visit);
    }
  }

  blocks.forEach(visit);
  return entries;
}

function findJsonLdEntry(entries, type) {
  return entries.find((entry) => {
    const entryType = entry["@type"];
    return Array.isArray(entryType) ? entryType.includes(type) : entryType === type;
  });
}

function validateCommonPage({ route, relativePath, html }) {
  const expectedLang = route === "/en" ? "en" : "pt-BR";
  assertIncludes(html, `<html lang="${expectedLang}">`, `${relativePath}: lang ${expectedLang} ausente`);
  for (const [hreflang, href] of [
    ["pt-BR", toCanonicalUrl("/")],
    ["en", toCanonicalUrl("/en")],
    ["x-default", toCanonicalUrl("/")],
  ]) {
    assertIncludes(
      html,
      `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
      `${relativePath}: hreflang ${hreflang} ausente`,
    );
  }

  const title = getTitle(html);
  const description = getMeta(html, "name", "description");
  const robots = getMeta(html, "name", "robots");
  const canonical = getLink(html, "canonical");
  const h1 = getH1(html);
  const jsonLdBlocks = extractJsonLdBlocks(html, route);
  const jsonLdEntries = flattenJsonLd(jsonLdBlocks);

  assert(title && title.length >= 10, `${relativePath}: title ausente ou curto`);
  assert(
    description && description.length >= 50 && description.length <= 180,
    `${relativePath}: meta description ausente ou fora do tamanho esperado`,
  );
  assert(robots, `${relativePath}: meta robots ausente`);
  assert(canonical?.startsWith(siteUrl), `${relativePath}: canonical absoluto ausente`);
  assert(h1, `${relativePath}: H1 ausente`);
  assert(jsonLdBlocks.length > 0, `${relativePath}: JSON-LD ausente`);
  assert(
    findJsonLdEntry(jsonLdEntries, "Organization"),
    `${relativePath}: JSON-LD Organization ausente`,
  );

  const ogUrl = getMeta(html, "property", "og:url");
  assert(ogUrl === canonical, `${relativePath}: og:url diferente do canonical`);

  for (const property of [
    "og:site_name",
    "og:locale",
    "og:type",
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "og:image:alt",
  ]) {
    assert(getMeta(html, "property", property), `${relativePath}: ${property} ausente`);
  }

  for (const name of [
    "twitter:card",
    "twitter:title",
    "twitter:description",
    "twitter:image",
  ]) {
    assert(getMeta(html, "name", name), `${relativePath}: ${name} ausente`);
  }

  assert(
    getMeta(html, "property", "og:image") === socialPreviewUrl &&
      getMeta(html, "name", "twitter:image") === socialPreviewUrl,
    `${relativePath}: imagem social incorreta`,
  );

  return { title, description, robots, canonical, h1, jsonLdEntries };
}

function validateHome(routeState) {
  assert(routeState.title === "ShiftLabs | Da Ideia ao Primeiro Cliente e Estrutura para Empresas", "/: title incorreto");
  assert(routeState.canonical === toCanonicalUrl("/"), "/: canonical incorreto");
  assert(
    routeState.h1 === "Tiramos negócios do papel. Estruturamos os que já existem.",
    "/: H1 incorreto",
  );
  assert(findJsonLdEntry(routeState.jsonLdEntries, "WebPage"), "/: WebPage ausente");
}

function validateEnglishHome(routeState) {
  assert(
    routeState.title === "ShiftLabs | From Idea to First Customer, and Structure for Companies",
    "/en: title incorreto",
  );
  assert(routeState.canonical === toCanonicalUrl("/en"), "/en: canonical incorreto");
  assert(
    routeState.h1 === "We get businesses off the ground. We structure the ones already running.",
    "/en: H1 incorreto",
  );
  assert(findJsonLdEntry(routeState.jsonLdEntries, "WebPage"), "/en: WebPage ausente");
}

async function validateRoute(filePath) {
  const route = routeFromIndexFile(filePath);
  const relativePath = path.relative(distDir, filePath).split(path.sep).join("/");
  const html = await readFile(filePath, "utf8");
  const routeState = validateCommonPage({ route, relativePath, html });

  if (route === "/") {
    validateHome(routeState);
  } else if (route === "/en") {
    validateEnglishHome(routeState);
  } else {
    assert(routeState.canonical === toCanonicalUrl(route), `${route}: canonical incorreto`);
  }

  return { route, canonical: routeState.canonical, robots: routeState.robots };
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

async function validateSitemap(routeStates) {
  const sitemapPath = path.join(distDir, "sitemap.xml");
  const sitemapXml = await readFile(sitemapPath, "utf8");
  const locs = extractSitemapLocs(sitemapXml);
  const expectedLocs = new Set(
    routeStates
      .filter((state) => state.robots !== "noindex, nofollow, noarchive")
      .map((state) => state.canonical),
  );

  assert(locs.length === expectedLocs.size, "sitemap.xml com quantidade inesperada de URLs");

  for (const expectedLoc of expectedLocs) {
    assert(locs.includes(expectedLoc), `sitemap.xml sem ${expectedLoc}`);
  }

  for (const loc of locs) {
    assert(loc.startsWith(siteUrl), `sitemap.xml com dominio incorreto: ${loc}`);
    assert(expectedLocs.has(loc), `sitemap.xml com URL nao indexavel: ${loc}`);
  }

  assert(!sitemapXml.includes("/vagas"), "sitemap.xml ainda cita /vagas");
}

async function run() {
  await stat(distDir);

  const socialPreview = await stat(path.join(distDir, "social-preview.png"));
  if (!socialPreview.isFile()) {
    throw new Error("social-preview.png ausente no build");
  }

  const robotsTxt = await readFile(path.join(distDir, "robots.txt"), "utf8");
  assertIncludes(robotsTxt, "User-agent: *", "robots.txt sem user-agent");
  assert(!robotsTxt.includes("/vagas"), "robots.txt ainda cita /vagas");
  assertIncludes(robotsTxt, `Sitemap: ${siteUrl}/sitemap.xml`, "robots.txt sem sitemap correto");

  const indexFiles = await findIndexFiles(distDir);
  assert(indexFiles.length > 0, "nenhuma rota HTML encontrada no build");

  const routeStates = [];
  for (const filePath of indexFiles) {
    assert(
      !routeFromIndexFile(filePath).startsWith("/vagas"),
      `${routeFromIndexFile(filePath)}: rota de vagas nao deve existir`,
    );
    routeStates.push(await validateRoute(filePath));
  }

  await validateSitemap(routeStates);

  console.log(`[seo:verify] ${routeStates.length} rotas HTML validadas.`);
}

run().catch((error) => {
  console.error(`[seo:verify] ${error.message}`);
  process.exit(1);
});
