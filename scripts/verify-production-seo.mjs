const fallbackSiteUrl = "https://shiftlabs.sh";
const siteUrl = (
  process.env.SEO_PRODUCTION_URL ||
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  fallbackSiteUrl
)
  .trim()
  .replace(/\/+$/, "");
const socialPreviewUrl = `${siteUrl}/social-preview.png`;
const googleSiteVerification = (
  process.env.GOOGLE_SITE_VERIFICATION ||
  process.env.VITE_GOOGLE_SITE_VERIFICATION ||
  ""
).trim();
function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function toUrl(pathOrUrl) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

async function fetchText(pathOrUrl) {
  const url = toUrl(pathOrUrl);
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      "user-agent": "ShiftLabs SEO verifier",
    },
  });

  if (!response.ok) {
    throw new Error(`${url}: HTTP ${response.status}`);
  }

  return {
    finalUrl: response.url,
    text: await response.text(),
  };
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

function extractJsonLdBlocks(html, url) {
  return [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => {
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      throw new Error(`${url}: JSON-LD invalido (${error.message})`);
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

function hasJsonLdType(entries, type) {
  return entries.some((entry) => {
    const entryType = entry["@type"];
    return Array.isArray(entryType) ? entryType.includes(type) : entryType === type;
  });
}

function extractSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

function validateHtml(url, html, { canonical, robots, jobPosting = false }) {
  assert(getLink(html, "canonical") === canonical, `${url}: canonical incorreto`);
  assert(getMeta(html, "name", "robots") === robots, `${url}: robots incorreto`);
  assert(getMeta(html, "property", "og:url") === canonical, `${url}: og:url incorreto`);
  assert(
    getMeta(html, "property", "og:image") === socialPreviewUrl &&
      getMeta(html, "name", "twitter:image") === socialPreviewUrl,
    `${url}: imagem social incorreta`,
  );
  assert(getMeta(html, "name", "description"), `${url}: description ausente`);

  if (googleSiteVerification) {
    assert(
      getMeta(html, "name", "google-site-verification") === googleSiteVerification,
      `${url}: token do Google Search Console ausente`,
    );
  }

  const jsonLdEntries = flattenJsonLd(extractJsonLdBlocks(html, url));
  assert(hasJsonLdType(jsonLdEntries, "Organization"), `${url}: Organization ausente`);
}

async function validateIndexablePages(locs) {
  for (const loc of locs) {
    const { text } = await fetchText(loc);
    validateHtml(loc, text, {
      canonical: loc,
      robots: "index, follow, max-image-preview:large",
    });
  }
}

async function run() {
  const robots = await fetchText("/robots.txt");
  assert(robots.text.includes("User-agent: *"), "robots.txt sem user-agent");
  assert(!robots.text.includes("/vagas"), "robots.txt ainda cita /vagas");
  assert(robots.text.includes(`Sitemap: ${siteUrl}/sitemap.xml`), "robots.txt sem sitemap");

  const sitemap = await fetchText("/sitemap.xml");
  const locs = extractSitemapLocs(sitemap.text);
  assert(locs.includes(`${siteUrl}/`), "sitemap sem home");
  assert(!sitemap.text.includes("/vagas"), "sitemap ainda cita /vagas");

  for (const loc of locs) {
    assert(loc.startsWith(siteUrl), `sitemap com dominio incorreto: ${loc}`);
  }

  await validateIndexablePages(locs);

  if (!googleSiteVerification) {
    console.warn(
      "[seo:production] Search Console: prontidao tecnica validada; configure GOOGLE_SITE_VERIFICATION para validar o token.",
    );
  }

  console.log(`[seo:production] ${locs.length} URLs indexaveis validadas.`);
}

run().catch((error) => {
  console.error(`[seo:production] ${error.message}`);
  process.exit(1);
});
