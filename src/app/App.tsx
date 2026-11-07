import { useEffect, useRef, useState } from "react";
import svgPaths from "../imports/svg-pgtixnbxan";
import {
  MenuxLogo,
  CortexLogo,
  ConttoLogo,
  RepasseSeguroLogo,
} from "./components/BrandLogos";
import { FrameworkLayers } from "./components/FrameworkLayers";
import { HairlineFigure } from "./components/HairlineFigure";
import { HeroTimeline } from "./components/HeroTimeline";
import sondagemFigure from "../vendor/hairline/framework/sondagem.js";
import maqueteFigure from "../vendor/hairline/framework/maquete.js";
import motorFigure from "../vendor/hairline/framework/motor.js";
import balancaFigure from "../vendor/hairline/framework/balanca.js";
import roadmapFigure from "../vendor/hairline/servicos/roadmap.js";
import torreFigure from "../vendor/hairline/servicos/torre.js";
import funilFigure from "../vendor/hairline/servicos/funil.js";
import chipFigure from "../vendor/hairline/servicos/chip.js";
import ponteFigure from "../vendor/hairline/problemas/ponte.js";
import pedidosFigure from "../vendor/hairline/problemas/pedidos.js";
import gaveteiroFigure from "../vendor/hairline/problemas/gaveteiro.js";
import painelFigure from "../vendor/hairline/problemas/painel.js";
import { copy, localeFromPath } from "./copy";

const mono = "var(--font-system-mono)";
const heading = "var(--font-system)";
const body = "var(--font-system)";
const display = "var(--font-system)";
const titleTracking = "var(--tracking-title)";
const audienceTextHalo =
  "0 0 0 #F2F3EF, 1px 0 0 #F2F3EF, -1px 0 0 #F2F3EF, 0 1px 0 #F2F3EF, 0 -1px 0 #F2F3EF, 2px 0 0 #F2F3EF, -2px 0 0 #F2F3EF, 0 2px 0 #F2F3EF, 0 -2px 0 #F2F3EF, 0 0 12px #F2F3EF, 0 0 22px #F2F3EF, 0 0 34px #F2F3EF";

const fallbackSiteUrl = "https://shiftlabs.sh";
const configuredSiteUrl = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? fallbackSiteUrl
).trim();
const siteUrl = configuredSiteUrl.replace(/\/+$/, "") || fallbackSiteUrl;
const locale = localeFromPath(window.location.pathname);
const t = copy[locale];
const seoDefaultDescription = t.seo.description;
const seoDefaultImagePath = "/social-preview.png";
const seoOrganizationLogoPath = "/fav-icon.svg";

/* ─── Reusable sub-components ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      data-reveal="text"
      className="text-[#5f644c] text-[12px] lowercase"
      style={{ fontFamily: mono }}
    >
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "h1" | "h2";
}) {
  return (
    <Tag
      data-reveal="title"
      className={`text-[#101700] leading-[normal] ${className}`}
      style={{ fontFamily: heading, fontWeight: 500, letterSpacing: titleTracking }}
    >
      {children}
    </Tag>
  );
}

function XlHelper({ className = "" }: { className?: string }) {
  return <div className={`hidden xl:block w-[192px] shrink-0 ${className}`} />;
}

const edgeTickPositions = ["192px", "calc(100% - 192px)"];
const twoColumnTickPositions = ["192px", "50%", "calc(100% - 192px)"];
const threeColumnTickPositions = [
  "192px",
  "calc(33.333333% + 64px)",
  "calc(66.666667% - 64px)",
  "calc(100% - 192px)",
];
const fourColumnTickPositions = [
  "192px",
  "calc(25% + 96px)",
  "50%",
  "calc(75% - 96px)",
  "calc(100% - 192px)",
];

function SectionBorderTicks({
  positions,
  showTop = true,
  showBottom = true,
}: {
  positions: string[];
  showTop?: boolean;
  showBottom?: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden xl:block z-10"
    >
      {showTop &&
        positions.map((left) => (
          <div key={`top-${left}`} className="absolute top-0" style={{ left }}>
            <span className="absolute top-0 -translate-x-1/2 h-[2px] w-[14px] bg-[#5f644c]" />
            <span className="absolute top-0 -translate-x-1/2 h-[12px] w-[2px] bg-[#5f644c]" />
          </div>
        ))}
      {showBottom &&
        positions.map((left) => (
          <div
            key={`bottom-${left}`}
            className="absolute bottom-0"
            style={{ left }}
          >
            <span className="absolute bottom-0 -translate-x-1/2 h-[2px] w-[14px] bg-[#5f644c]" />
            <span className="absolute bottom-0 -translate-x-1/2 h-[12px] w-[2px] bg-[#5f644c]" />
          </div>
        ))}
    </div>
  );
}

function AsciiStarfield({
  className = "",
  color = "#70745A",
}: {
  className?: string;
  color?: string;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [asciiFrame, setAsciiFrame] = useState("");
  const asciiFontSizePx = 11;
  const asciiLineHeightPx = 12;
  const asciiLetterSpacingPx = 0.2;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    type Star = { x: number; y: number; z: number; speed: number };
    type AmbientStar = { x: number; y: number; char: "." | ":" | "+" };
    let stars: Star[] = [];
    let ambientStars: AmbientStar[] = [];
    let cols = 0;
    let rows = 0;
    let cellWidth = 7.2;
    let cellHeight = asciiLineHeightPx;
    let rafId = 0;
    let visibilityObserver: IntersectionObserver | null = null;
    let isVisible = typeof IntersectionObserver === "undefined";
    let lastTime = performance.now();
    let accumulator = 0;
    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const stepIntervalMs = 92;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));
    const rand = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const measureAsciiCell = () => {
      const probe = document.createElement("span");
      probe.textContent = "0".repeat(40);
      Object.assign(probe.style, {
        position: "absolute",
        visibility: "hidden",
        whiteSpace: "pre",
        fontFamily: mono,
        fontSize: `${asciiFontSizePx}px`,
        lineHeight: `${asciiLineHeightPx}px`,
        letterSpacing: `${asciiLetterSpacingPx}px`,
        fontVariantLigatures: "none",
      });
      host.appendChild(probe);
      const rect = probe.getBoundingClientRect();
      const computed = window.getComputedStyle(probe);
      const measuredLineHeight =
        Number.parseFloat(computed.lineHeight) || asciiLineHeightPx;
      probe.remove();
      cellWidth = Math.max(rect.width / 40, 4);
      cellHeight = Math.max(measuredLineHeight, 8);
    };

    const resetStar = (star: Star, far = false) => {
      star.x = rand(-1, 1);
      star.y = rand(-1, 1);
      star.z = far ? rand(0.75, 1) : rand(0.12, 1);
      star.speed = rand(0.126, 0.342);
    };

    const buildFrame = () => {
      if (!cols || !rows) return;
      const grid = Array.from({ length: rows }, () => Array(cols).fill(" "));

      for (const ambient of ambientStars) {
        if (
          ambient.x >= 0 &&
          ambient.x < cols &&
          ambient.y >= 0 &&
          ambient.y < rows
        ) {
          grid[ambient.y][ambient.x] = ambient.char;
        }
      }

      for (const star of stars) {
        const sx = ((star.x / star.z) * 0.5 + 0.5) * cols;
        const sy = ((star.y / star.z) * 0.5 + 0.5) * rows;
        const x = Math.floor(sx);
        const y = Math.floor(sy);
        if (x < 0 || x >= cols || y < 0 || y >= rows) continue;

        const depth = 1 - star.z;
        const char =
          depth > 0.84
            ? "@"
            : depth > 0.7
              ? "#"
              : depth > 0.56
                ? "*"
                : depth > 0.42
                  ? "+"
                  : depth > 0.3
                    ? ":"
                    : ".";
        grid[y][x] = char;

        if (depth > 0.6 && x > 0 && grid[y][x - 1] === " ") {
          grid[y][x - 1] = ".";
        }
      }

      setAsciiFrame(grid.map((line) => line.join("")).join("\n"));
    };

    const rebuild = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      measureAsciiCell();
      cols = clamp(Math.ceil(width / cellWidth) + 2, 36, 420);
      rows = clamp(Math.ceil(height / cellHeight) + 2, 14, 160);
      const count = clamp(Math.floor(cols * rows * 0.075), 160, 520);
      stars = Array.from({ length: count }, () => {
        const star: Star = { x: 0, y: 0, z: 0, speed: 0 };
        resetStar(star);
        return star;
      });
      const ambientCount = clamp(Math.floor(cols * rows * 0.009), 36, 180);
      ambientStars = Array.from({ length: ambientCount }, () => {
        const charRoll = Math.random();
        const char: "." | ":" | "+" =
          charRoll > 0.9 ? "+" : charRoll > 0.65 ? ":" : ".";
        return {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
          char,
        };
      });
      buildFrame();
    };

    const stopAnimation = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const animate = (now: number) => {
      if (prefersReduced || !isVisible) {
        stopAnimation();
        return;
      }

      const delta = now - lastTime;
      lastTime = now;
      accumulator += delta;

      if (accumulator >= stepIntervalMs) {
        for (const star of stars) {
          star.z -= star.speed * (accumulator / 1000);
          if (star.z <= 0.08) resetStar(star, true);
        }
        buildFrame();
        accumulator = 0;
      }

      rafId = requestAnimationFrame(animate);
    };

    rebuild();
    if (!prefersReduced && isVisible) {
      rafId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(() => rebuild());
    resizeObserver.observe(host);

    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          const nextVisible = entries.some((entry) => entry.isIntersecting);
          if (nextVisible === isVisible) return;
          isVisible = nextVisible;
          if (!prefersReduced && isVisible) {
            lastTime = performance.now();
            accumulator = 0;
            stopAnimation();
            rafId = requestAnimationFrame(animate);
            return;
          }
          stopAnimation();
        },
        { threshold: 0.08 },
      );
      visibilityObserver.observe(host);
    }

    return () => {
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      stopAnimation();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      <pre
        className="absolute inset-0 m-0 select-none whitespace-pre"
        style={{
          fontFamily: mono,
          fontSize: `${asciiFontSizePx}px`,
          lineHeight: `${asciiLineHeightPx}px`,
          color,
          letterSpacing: `${asciiLetterSpacingPx}px`,
          fontVariantLigatures: "none",
          display: "block",
          width: "100%",
          height: "100%",
          userSelect: "none",
        }}
      >
        {asciiFrame}
      </pre>
    </div>
  );
}

/* ─── ShiftLabs Logo ─── */
function ShiftLabsIcon() {
  return (
    <div className="h-[34px] w-[34px] relative shrink-0">
      <svg
        className="block size-full"
        fill="none"
        viewBox="0 0 33.9148 34.0638"
      >
        <path d={svgPaths.p32570e00} fill="#101700" />
        <path d={svgPaths.p2aaefb00} fill="#101700" />
        <path d={svgPaths.p6d58c60} fill="#101700" />
        <path d={svgPaths.pdb9af80} fill="#101700" />
        <path d={svgPaths.p366c4780} fill="#101700" />
        <path d={svgPaths.p219d7300} fill="#101700" />
        <path d={svgPaths.p28330940} fill="#101700" />
      </svg>
    </div>
  );
}

function ShiftLabsWordmark() {
  return (
    <div className="h-[15px] w-[80px] relative shrink-0">
      <svg
        className="block size-full"
        fill="none"
        viewBox="0 0 79.7793 14.8396"
      >
        <path d={svgPaths.pc4be800} fill="#101700" />
        <path d={svgPaths.p303e5b80} fill="#101700" />
        <path d={svgPaths.p29dd9600} fill="#101700" />
        <path d={svgPaths.p24aff100} fill="#101700" />
        <path d={svgPaths.p7460f80} fill="#101700" />
        <path d={svgPaths.p26df5d00} fill="#101700" />
        <path d={svgPaths.p2d07ed00} fill="#101700" />
        <path d={svgPaths.p3cf36d00} fill="#101700" />
        <path d={svgPaths.p27734e00} fill="#101700" />
      </svg>
    </div>
  );
}

/* ─── Social icons ─── */
function LinkedInIcon() {
  return (
    <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
      <path d={svgPaths.p5160f00} fill="#101700" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg className="size-[14px]" fill="none" viewBox="0 0 14 14">
      <path d={svgPaths.p14360c80} fill="#101700" />
      <path d={svgPaths.p27980d00} fill="#101700" />
      <path d={svgPaths.p1b767a00} fill="#101700" />
    </svg>
  );
}

/* ─── Footer big wordmark ─── */
function BigWordmark() {
  return (
    <div className="w-full overflow-hidden">
      <svg
        className="w-full h-auto"
        fill="none"
        viewBox="0 0 1128 209.816"
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={svgPaths.p7ab8900} fill="#101700" />
        <path d={svgPaths.p3b0eb280} fill="#101700" />
        <path d={svgPaths.p80dcd80} fill="#101700" />
        <path d={svgPaths.p2ab56d00} fill="#101700" />
        <path d={svgPaths.p16d8bc00} fill="#101700" />
        <path d={svgPaths.p16f12c00} fill="#101700" />
        <path d={svgPaths.p20f31800} fill="#101700" />
        <path d={svgPaths.p33ec1870} fill="#101700" />
        <path d={svgPaths.p20d98480} fill="#101700" />
      </svg>
    </div>
  );
}

/* ─── Data ─── */
const heroFigures = [sondagemFigure, maqueteFigure, motorFigure, balancaFigure];
const heroTimeline = t.hero.timeline.map((slide, index) => ({
  ...slide,
  step: `/0${index + 1}`,
  figure: heroFigures[index],
}));

const problemFigures = [ponteFigure, painelFigure, pedidosFigure, gaveteiroFigure];
const problemCards = t.problem.cards.map((card, index) => ({
  ...card,
  id: index + 1,
  figure: problemFigures[index],
}));

const serviceFigures = [roadmapFigure, torreFigure, funilFigure, chipFigure];
const services = t.services.items.map((service, index) => ({
  ...service,
  figure: serviceFigures[index],
}));

const workSteps = t.method.steps.map((step, index) => ({
  ...step,
  step: `/0${index + 1}`,
}));

const audienceItems = t.audience.items.map((text) => ({
  text,
  textMaxClass: "max-w-[230px]",
}));

const pathTracks = t.paths.tracks;

const ecosystemSites = [
  { name: "Menux", href: "https://menux.co", Logo: MenuxLogo },
  { name: "Cortex", href: "https://www.cortex.je", Logo: CortexLogo },
  { name: "Contto", href: "https://www.contto.sh", Logo: ConttoLogo },
  {
    name: "Repasse Seguro",
    href: "https://www.repasseseguro.com.br",
    Logo: RepasseSeguroLogo,
  },
];

const ecosystemMarqueeItems = Array.from(
  { length: 16 },
  (_, index) => ecosystemSites[index % ecosystemSites.length],
);

const caseBrands = [
  {
    name: "Menux",
    Logo: MenuxLogo,
    href: "https://menux.co",
    domain: "menux.co",
  },
  {
    name: "Cortex",
    Logo: CortexLogo,
    href: "https://www.cortex.je",
    domain: "cortex.je",
  },
  {
    name: "Contto",
    Logo: ConttoLogo,
    href: "https://www.contto.sh",
    domain: "contto.sh",
  },
  {
    name: "Repasse Seguro",
    Logo: RepasseSeguroLogo,
    href: "https://www.repasseseguro.com.br",
    domain: "repasseseguro.com.br",
  },
];

const caseStudies = caseBrands.map((brand, index) => ({
  ...brand,
  ...t.cases.items[index],
}));

const coordinationItems = t.why.items;

const homeSections = t.nav.sections.map(([id, label]) => [
  `#${t.ids[id as keyof typeof t.ids]}`,
  label,
]);

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/shiftlabs-br/",
    Icon: LinkedInIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/shiftlabs.br",
    Icon: InstagramIcon,
  },
];

type SeoPayload = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  imagePath?: string;
  pageSchema?: Record<string, unknown> | Array<Record<string, unknown>> | null;
};

function truncateWithEllipsis(value: string, maxLength = 160): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const truncated = normalized.slice(0, maxLength - 1);
  const safeBreak = truncated.lastIndexOf(" ");
  if (safeBreak <= 60) return `${truncated.trim()}...`;
  return `${truncated.slice(0, safeBreak).trim()}...`;
}

function toAbsoluteUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const finalPath =
    normalizedPath === "/" ? "/" : normalizedPath.replace(/\/+$/, "");
  return `${siteUrl}${finalPath}`;
}

function upsertMetaByName(name: string, content: string): void {
  const selector = `meta[name="${name}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string): void {
  const selector = `meta[property="${property}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("property", property);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertAlternateLink(hreflang: string, href: string): void {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "alternate");
    element.setAttribute("hreflang", hreflang);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function upsertJsonLdScript(
  id: string,
  payload: Record<string, unknown> | Array<Record<string, unknown>> | null,
): void {
  const scriptId = `seo-jsonld-${id}`;
  const current = document.getElementById(scriptId);
  if (!payload) {
    if (current) current.remove();
    return;
  }

  let script = current as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
}

function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShiftLabs",
    url: `${siteUrl}/`,
    logo: toAbsoluteUrl(seoOrganizationLogoPath),
    sameAs: socialLinks.map((link) => link.href),
  };
}

function buildLandingPageSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ShiftLabs",
    url: toAbsoluteUrl(t.homePath),
    description: seoDefaultDescription,
    inLanguage: t.htmlLang,
  };
}

function applySeoPayload(payload: SeoPayload): void {
  const normalizedTitle = payload.title.includes("ShiftLabs")
    ? payload.title
    : `${payload.title} | ShiftLabs`;
  const normalizedDescription = truncateWithEllipsis(payload.description, 160);
  const canonicalUrl = toAbsoluteUrl(payload.path);
  const imageUrl = toAbsoluteUrl(payload.imagePath ?? seoDefaultImagePath);

  document.documentElement.lang = t.htmlLang;
  document.title = normalizedTitle;

  upsertMetaByName("description", normalizedDescription);
  upsertMetaByName(
    "robots",
    payload.noindex
      ? "noindex, nofollow, noarchive"
      : "index, follow, max-image-preview:large",
  );
  upsertMetaByName("theme-color", "#f2f3ef");
  upsertMetaByName("author", "ShiftLabs");

  upsertMetaByProperty("og:site_name", "ShiftLabs");
  upsertMetaByProperty("og:locale", t.ogLocale);
  upsertMetaByProperty("og:type", payload.type ?? "website");
  upsertMetaByProperty("og:title", normalizedTitle);
  upsertMetaByProperty("og:description", normalizedDescription);
  upsertMetaByProperty("og:url", canonicalUrl);
  upsertMetaByProperty("og:image", imageUrl);
  upsertMetaByProperty("og:image:alt", "ShiftLabs");

  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", normalizedTitle);
  upsertMetaByName("twitter:description", normalizedDescription);
  upsertMetaByName("twitter:image", imageUrl);

  upsertLink("canonical", canonicalUrl);
  upsertAlternateLink("pt-BR", toAbsoluteUrl(copy.pt.homePath));
  upsertAlternateLink("en", toAbsoluteUrl(copy.en.homePath));
  upsertAlternateLink("x-default", toAbsoluteUrl(copy.pt.homePath));
  upsertJsonLdScript("organization", buildOrganizationSchema());
  upsertJsonLdScript("page", payload.pageSchema ?? null);
}

const contactEmail = "hello@shiftlabs.sh";

type HeroContactFormState = {
  name: string;
  whatsapp: string;
  email: string;
  company: string;
  subject: string;
};

type HeroContactFeedback = {
  type: "success" | "error";
  message: string;
};

const initialHeroContactFormState: HeroContactFormState = {
  name: "",
  whatsapp: "",
  email: "",
  company: "",
  subject: "",
};

/* ════════════════════════════════════════════ */
function LandingPage() {
  const [isHeaderCondensed, setIsHeaderCondensed] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [heroContactForm, setHeroContactForm] = useState<HeroContactFormState>(
    initialHeroContactFormState,
  );
  const [heroContactFeedback, setHeroContactFeedback] =
    useState<HeroContactFeedback | null>(null);
  const isContactSuccess = heroContactFeedback?.type === "success";
  const isContactError = heroContactFeedback?.type === "error";

  const updateHeroContactField = (
    field: keyof HeroContactFormState,
    value: string,
  ) => {
    let formattedValue = value;
    if (field === "whatsapp") {
      if (locale === "en" || value.startsWith("+")) {
        const digits = value.replace(/\D/g, "");
        formattedValue = digits ? "+" + digits.slice(0, 15) : "";
      } else {
        let v = value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 2) v = `(${v.slice(0, 2)}) ` + v.slice(2);
        if (v.length > 10) v = v.slice(0, 10) + "-" + v.slice(10);
        formattedValue = v;
      }
    } else if (field === "email") {
      formattedValue = value.replace(/\s/g, "").toLowerCase();
    }
    setHeroContactForm((current) => ({ ...current, [field]: formattedValue }));
  };

  const openContactModal = () => {
    setHeroContactFeedback(null);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setHeroContactFeedback(null);
  };

  const resetContactModalFeedback = () => {
    setHeroContactFeedback(null);
  };

  const submitHeroContactForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = heroContactForm.name.trim();
    const whatsapp = heroContactForm.whatsapp.trim();
    const email = heroContactForm.email.trim();
    const company = heroContactForm.company.trim();
    const subject = heroContactForm.subject.trim();

    if (!name || !whatsapp || !email || !company || !subject) {
      setHeroContactFeedback({
        type: "error",
        message: t.contact.missingFields,
      });
      return;
    }

    const mailBody = [
      `${t.contact.fields.name}: ${name}`,
      `${t.contact.fields.whatsapp}: ${whatsapp}`,
      `${t.contact.fields.email}: ${email}`,
      `${t.contact.fields.company}: ${company}`,
      "",
      subject,
    ].join("\n");

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(t.contact.mailSubject(company))}&body=${encodeURIComponent(mailBody)}`;

    setHeroContactFeedback({
      type: "success",
      message: t.contact.successFallback(contactEmail),
    });
  };

  useEffect(() => {
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!revealNodes.length) return;
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }, []);

  useEffect(() => {
    let rafId = 0;

    const updateHeaderMode = () => {
      const shouldCondense = window.scrollY > 28 && window.innerWidth >= 1024;
      setIsHeaderCondensed((current) =>
        current === shouldCondense ? current : shouldCondense,
      );
    };

    const scheduleHeaderUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateHeaderMode();
      });
    };

    updateHeaderMode();
    window.addEventListener("scroll", scheduleHeaderUpdate, { passive: true });
    window.addEventListener("resize", scheduleHeaderUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleHeaderUpdate);
      window.removeEventListener("resize", scheduleHeaderUpdate);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  useEffect(() => {
    if (!isContactModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeContactModal();
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isContactModalOpen]);

  return (
    <div className="bg-[#f2f3ef] min-h-screen w-full overflow-x-hidden pt-[72px]">
      {/* ===== FIXED TOP BAR ===== */}
      <div
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-300 ease-out ${
          isHeaderCondensed ? "pt-3" : "pt-0"
        }`}
      >
        <div
          className={
            isHeaderCondensed ? "mx-auto w-full max-w-[1040px] px-4" : "w-full"
          }
        >
          <header
            className={`transition-all duration-300 ease-out ${
              isHeaderCondensed
                ? "border border-[#d6dace] bg-[#f2f3ef]"
                : "border-b border-[#d6dace] bg-[#f2f3ef]"
            }`}
          >
            <div
              className={`mx-auto h-[72px] flex items-center justify-between gap-3 transition-[padding,max-width] duration-300 ease-out ${
                isHeaderCondensed
                  ? "max-w-none px-6"
                  : "max-w-[1512px] px-6 xl:px-[192px]"
              }`}
            >
              <a
                href={t.homePath}
                aria-label="ShiftLabs"
                title="ShiftLabs"
                className="inline-flex min-h-[44px] items-center gap-2 py-1"
              >
                <ShiftLabsIcon />
                <ShiftLabsWordmark />
              </a>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-6">
                <nav
                  aria-label={t.nav.sectionsLabel}
                  className="hidden lg:flex items-center gap-1"
                >
                  {homeSections.map(([href, label]) => (
                    <a
                      key={href}
                      href={href}
                      className="inline-flex min-h-[44px] items-center px-2 text-[#5f644c] hover:text-[#101700] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700] text-[13px] uppercase"
                      style={{
                        fontFamily: mono,
                        fontWeight: 400,
                        lineHeight: "normal",
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </nav>
                <span
                  aria-hidden
                  className="hidden lg:block h-4 w-px bg-[#d6dace]"
                />
                <a
                  href={t.switchTo.href}
                  hrefLang={t.switchTo.lang}
                  lang={t.switchTo.lang}
                  aria-label={t.switchTo.ariaLabel}
                  className="inline-flex min-h-[44px] items-center px-2 text-[#5f644c] hover:text-[#101700] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700] text-[12px] uppercase"
                  style={{
                    fontFamily: mono,
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  {t.switchTo.label}
                </a>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="inline-flex min-h-[36px] items-center border border-[#d6dace] px-2.5 sm:px-3 text-[#101700] transition-[background-color,border-color,color,transform] hover:border-[#101700] hover:bg-[#101700] hover:text-[#f2f3ef] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700] text-[12px] uppercase cursor-pointer"
                  style={{
                    fontFamily: mono,
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  {t.nav.contact}
                </button>
              </div>
            </div>
          </header>
        </div>
      </div>

      <main className="text-[#101700]">
        {/* ===== HERO ===== */}
        <div
          id={t.ids.hero}
          data-reveal="section"
          className="border-y border-[#d6dace] scroll-mt-[96px]"
        >
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper className="border-r border-[#d6dace]" />
            <div className="flex flex-col lg:flex-row flex-1 min-w-0">
              <div className="flex flex-col justify-between p-6 w-full lg:w-[58%] min-h-[360px] lg:h-[462px]">
                <div className="flex flex-col gap-12 max-w-[540px]">
                  <div className="flex flex-col gap-6">
                    <SectionLabel>{t.hero.label}</SectionLabel>
                    <SectionTitle
                      as="h1"
                      className="text-[32px]"
                    >
                      <span className="block">{t.hero.titleLines[0]}</span>
                      <span className="block">{t.hero.titleLines[1]}</span>
                    </SectionTitle>
                  </div>
                  <p
                    data-reveal="text"
                    className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[343px]"
                    style={{ fontFamily: body, lineHeight: 1.333 }}
                  >
                    {t.hero.text}
                  </p>
                </div>
                <div className="mt-8 lg:mt-0">
                  <button
                    type="button"
                    onClick={openContactModal}
                    className="inline-flex min-h-[36px] items-center bg-[#101700] text-[#f2f3ef] px-3 py-2 text-[12px] uppercase cursor-pointer transition-[background-color,transform] hover:bg-[#263600] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                    style={{ fontFamily: mono }}
                  >
                    {t.hero.cta}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center p-4 md:p-6 w-full lg:w-[42%] min-h-[180px] md:min-h-[300px] lg:h-[462px] border-t lg:border-t-0 lg:border-l border-[#d6dace]">
                <HeroTimeline slides={heroTimeline} />
              </div>
            </div>
            <XlHelper className="border-l border-[#d6dace]" />
            <SectionBorderTicks positions={edgeTickPositions} />
          </div>
        </div>

        {/* ===== ECOSYSTEM ===== */}
        <div data-reveal="section" className="border-b border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] py-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="flex flex-col gap-6 max-w-[640px]">
                <SectionLabel>{t.ecosystem.label}</SectionLabel>
                <SectionTitle as="h2" className="text-[32px]">
                  {t.ecosystem.title}
                </SectionTitle>
              </div>
            </div>
          </div>
          <div className="logo-marquee border-t border-[#d6dace]">
            <div className="logo-marquee-track">
              {[...ecosystemMarqueeItems, ...ecosystemMarqueeItems].map(
                ({ name, href, Logo }, index) => {
                  const isClone = index >= ecosystemSites.length;
                  return (
                    <a
                      key={`${name}-${index}`}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        isClone ? undefined : t.ecosystem.openSite(name)
                      }
                      aria-hidden={isClone || undefined}
                      tabIndex={isClone ? -1 : undefined}
                      data-clone={isClone || undefined}
                      className="logo-marquee-item focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                    >
                      <Logo />
                    </a>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <nav
          aria-label={t.nav.sectionsLabel}
          className="sticky top-[72px] z-40 lg:hidden border-b border-[#d6dace] bg-[#f2f3ef]"
        >
          <div className="flex overflow-x-auto px-4">
            {homeSections.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="inline-flex min-h-[44px] shrink-0 items-center px-3 text-[12px] uppercase text-[#5f644c] hover:text-[#101700] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#101700]"
                style={{ fontFamily: mono }}
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ===== PROBLEM HEADER ===== */}
        <div
          id={t.ids.problem}
          data-reveal="section"
          className="border-b border-[#d6dace] scroll-mt-[96px]"
        >
          <div className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] py-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <div className="flex flex-col gap-6 max-w-[499px]">
                <SectionLabel>{t.problem.label}</SectionLabel>
                <SectionTitle
                  as="h2"
                  className="text-[32px]"
                >
                  {t.problem.title}
                </SectionTitle>
              </div>
              <p
                data-reveal="text"
                className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[335px]"
                style={{ fontFamily: body, lineHeight: 1.4 }}
              >
                {t.problem.text}
              </p>
            </div>
          </div>
        </div>

        {/* ===== PROBLEM CARDS ===== */}
        <div data-reveal="section" className="border-b border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="hairline-row flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border-x border-[#d6dace]">
              {problemCards.map((card, index) => (
                <div
                  key={card.id}
                  className={`hairline-card relative flex flex-col px-6 py-8 xl:px-5 ${
                    index > 0 ? "border-t border-[#d6dace]" : ""
                  } ${index % 2 === 1 ? "sm:border-l sm:border-[#d6dace]" : ""} ${
                    index >= 2 ? "sm:border-t sm:border-[#d6dace]" : ""
                  } ${index === 1 ? "sm:border-t-0" : ""} ${
                    index > 0 ? "xl:border-t-0 xl:border-l" : ""
                  }`}
                >
                  <HairlineFigure
                    figure={card.figure}
                    label={card.figureLabel}
                  />
                  <p
                    data-reveal="text"
                    className="relative z-[1] max-w-[380px] text-[#101700] text-[14px] md:text-[16px]"
                    style={{
                      fontFamily: display,
                      letterSpacing: titleTracking,
                      fontWeight: 500,
                      lineHeight: "normal",
                    }}
                  >
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
            <XlHelper />
            <SectionBorderTicks positions={fourColumnTickPositions} />
          </div>
        </div>

        {/* ===== FRAGMENT QUOTE ===== */}
        <div data-reveal="section" className="border-b border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] py-12">
            <div className="flex justify-end">
              <p
                data-reveal="text"
                className="text-[#101700] text-[18px] md:text-[20px] lg:text-[24px] max-w-[472px]"
                style={{
                  fontFamily: display,
                  letterSpacing: titleTracking,
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                {t.problem.quote}
              </p>
            </div>
          </div>
        </div>

        {/* ===== CAMINHOS ===== */}
        <div
          id={t.ids.paths}
          data-reveal="section"
          className="border-b border-[#d6dace] scroll-mt-[96px]"
        >
          <div className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] py-12">
            <div className="flex flex-col gap-6 max-w-[560px]">
              <SectionLabel>{t.paths.label}</SectionLabel>
              <SectionTitle as="h2" className="text-[32px]">
                {t.paths.title}
              </SectionTitle>
            </div>
          </div>
        </div>

        <div data-reveal="section" className="border-b border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 border-x border-[#d6dace]">
              {pathTracks.map((track, index) => (
                <div
                  key={track.label}
                  className={`flex flex-col gap-8 p-6 ${
                    index > 0
                      ? "border-t border-[#d6dace] md:border-t-0 md:border-l"
                      : ""
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    <p
                      data-reveal="text"
                      className="text-[#5f644c] text-[12px] lowercase"
                      style={{ fontFamily: mono }}
                    >
                      {track.label}
                    </p>
                    <h3
                      data-reveal="text"
                      className="text-[#101700] text-[20px] md:text-[24px]"
                      style={{
                        fontFamily: display,
                        fontWeight: 500,
                        letterSpacing: titleTracking,
                        lineHeight: 1.2,
                      }}
                    >
                      {track.title}
                    </h3>
                    <p
                      data-reveal="text"
                      className="text-[#5f644c] text-[14px] md:text-[16px]"
                      style={{ fontFamily: body, lineHeight: 1.4 }}
                    >
                      {track.desc}
                    </p>
                  </div>
                  <ol className="flex flex-col">
                    {track.steps.map((step, stepIndex) => (
                      <li
                        key={step}
                        className="flex gap-3 border-t border-[#d6dace] py-3 text-[#101700] text-[14px] md:text-[16px]"
                        style={{ fontFamily: body, lineHeight: 1.4 }}
                      >
                        <span
                          className="shrink-0 pt-[3px] text-[#5f644c] text-[12px]"
                          style={{ fontFamily: mono }}
                        >
                          {`/0${stepIndex + 1}`}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <XlHelper />
            <SectionBorderTicks positions={twoColumnTickPositions} />
          </div>
        </div>

        {/* ===== AUDIENCE ===== */}
        <div data-reveal="section">
          <div className="max-w-[1512px] mx-auto flex">
            <XlHelper />
            <div className="relative overflow-hidden flex-1 flex flex-col items-center justify-center p-6 min-h-[300px] lg:h-[462px] border-x border-[#d6dace]">
              <AsciiStarfield className="absolute inset-0 hidden md:block" />
              <div className="relative z-[1] flex flex-col items-center gap-6 text-center">
                <p
                  data-reveal="text"
                  className="text-[#5f644c] text-[12px] lowercase"
                  style={{ fontFamily: mono, textShadow: audienceTextHalo }}
                >
                  {t.audience.label}
                </p>
                <h2
                  data-reveal="title"
                  className="text-[#101700] leading-[normal] text-[32px] text-center max-w-[454px]"
                  style={{
                    fontFamily: heading,
                    letterSpacing: titleTracking,
                    fontWeight: 500,
                    textShadow: audienceTextHalo,
                  }}
                >
                  {t.audience.title}
                </h2>
              </div>
            </div>
            <XlHelper />
          </div>
        </div>

        <div data-reveal="section" className="border-y border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 border-x border-[#d6dace]">
              {audienceItems.map((item, index) => (
                <div
                  key={item.text}
                  className={`flex items-end p-6 min-h-[100px] md:h-[118px] ${
                    index > 0 ? "border-t border-[#d6dace]" : ""
                  } ${index === 1 ? "sm:border-t-0" : ""} ${
                    index > 1 ? "sm:border-t sm:border-[#d6dace]" : ""
                  } ${index % 2 === 1 ? "sm:border-l sm:border-[#d6dace]" : ""}`}
                >
                  <p
                    data-reveal="text"
                    className={`text-[#101700] text-[14px] md:text-[16px] ${item.textMaxClass}`}
                    style={{
                      fontFamily: display,
                      letterSpacing: titleTracking,
                      fontWeight: 500,
                      lineHeight: "normal",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
            <XlHelper />
            <SectionBorderTicks
              positions={twoColumnTickPositions}
            />
          </div>
        </div>

        {/* ===== THE SHIFT APPROACH ===== */}
        <div
          id={t.ids.approach}
          data-reveal="section"
          className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] pt-16 pb-9 scroll-mt-[96px]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12">
            <div className="flex flex-col gap-8 max-w-[649px]">
              <SectionLabel>{t.approach.label}</SectionLabel>
              <SectionTitle
                as="h2"
                className="text-[32px]"
              >
                {t.approach.title}
              </SectionTitle>
            </div>
            <p
              data-reveal="text"
              className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[338px]"
              style={{ fontFamily: body, lineHeight: 1.4 }}
            >
              {t.approach.parts.map(([plain, strong]) => (
                <span key={strong}>
                  {plain}
                  <span
                    className="text-[#101700]"
                    style={{ fontFamily: display, fontWeight: 500 }}
                  >
                    {strong}
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* ===== O QUE FAZEMOS ===== */}
        <div className="border-t border-[#d6dace]">
          <div
            id={t.ids.services}
            data-reveal="section"
            className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] pt-16 pb-9 scroll-mt-[96px]"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
              <div className="flex flex-col gap-6 max-w-[499px]">
                <SectionLabel>{t.services.label}</SectionLabel>
                <SectionTitle
                  as="h2"
                  className="text-[32px]"
                >
                  <span className="block">{t.services.titleLines[0]}</span>
                  <span className="block">{t.services.titleLines[1]}</span>
                </SectionTitle>
              </div>
              <p
                data-reveal="text"
                className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[420px]"
                style={{ fontFamily: body, lineHeight: 1.4 }}
              >
                <span
                  className="text-[#101700]"
                  style={{ fontFamily: display, fontWeight: 500 }}
                >
                  {t.services.lead}
                </span>{" "}
                {t.services.text}
              </p>
            </div>
          </div>
        </div>

        {/* ===== SERVICES GRID ===== */}
        <div
          data-reveal="section"
          className="max-w-[1512px] mx-auto flex relative"
        >
          <XlHelper className="border-t border-[#d6dace]" />
          <div className="hairline-row flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-x border-t border-[#d6dace]">
            {services.map((svc, index) => (
              <div
                key={svc.title}
                className={`hairline-card relative flex flex-col px-6 py-8 xl:px-5 ${
                  index > 0 ? "border-t border-[#d6dace]" : ""
                } ${index % 2 === 1 ? "md:border-l md:border-[#d6dace]" : ""} ${
                  index >= 2 ? "md:border-t md:border-[#d6dace]" : ""
                } ${index === 1 ? "md:border-t-0" : ""} ${
                  index > 0 ? "xl:border-t-0 xl:border-l" : ""
                }`}
              >
                <HairlineFigure figure={svc.figure} label={svc.figureLabel} />
                <div className="relative z-[1] flex max-w-[380px] flex-col gap-4">
                  <h3
                    data-reveal="text"
                    className="text-[#101700] text-[14px] md:text-[16px]"
                    style={{
                      fontFamily: display,
                      letterSpacing: titleTracking,
                      fontWeight: 500,
                      lineHeight: "normal",
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    data-reveal="text"
                    className="text-[#5f644c] text-[14px] md:text-[16px]"
                    style={{ fontFamily: body, lineHeight: 1.4 }}
                  >
                    {svc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <XlHelper className="border-t border-[#d6dace]" />
          <SectionBorderTicks positions={fourColumnTickPositions} />
        </div>

        {/* ===== FRAMEWORK ===== */}
        <div data-reveal="section" className="border-y border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex">
            <div className="hidden xl:block w-[192px] shrink-0 border-y border-[#d6dace]" />
            <div className="flex-1 min-w-0 bg-[#b4eb38] px-6 py-16 flex flex-col items-center gap-12">
              <div className="flex flex-col items-center gap-6 w-full text-center max-w-[640px]">
                <p
                  data-reveal="text"
                  className="text-[#3d4f0a] text-[12px] lowercase"
                  style={{ fontFamily: mono }}
                >
                  {t.framework.label}
                </p>
                <h2
                  data-reveal="title"
                  className="text-[#101700] text-[length:clamp(14px,calc(6vw-5px),32px)] whitespace-nowrap"
                  style={{ fontFamily: heading, fontWeight: 500, letterSpacing: titleTracking }}
                >
                  {t.framework.title}
                </h2>
                <p
                  data-reveal="text"
                  className="text-[#3d4f0a] text-[14px] md:text-[16px] max-w-[343px]"
                  style={{
                    fontFamily: heading,
                    fontWeight: 400,
                    lineHeight: 1.1,
                  }}
                >
                  {t.framework.intro}
                </p>
              </div>
              <FrameworkLayers labels={t.framework.layers} />
              <p
                className="framework-outcome text-center text-balance text-[18px] md:text-[20px] lg:text-[24px]"
                style={{
                  fontFamily: display,
                  letterSpacing: titleTracking,
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                {t.framework.outcome}
              </p>
            </div>
            <div className="hidden xl:block w-[192px] shrink-0 border-y border-[#d6dace]" />
          </div>
        </div>

        {/* ===== HOW WE WORK ===== */}
        <div
          id={t.ids.method}
          data-reveal="section"
          className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] pt-16 pb-9 scroll-mt-[96px]"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            <div className="flex flex-col gap-6 max-w-[560px]">
              <SectionLabel>{t.method.label}</SectionLabel>
              <SectionTitle
                as="h2"
                className="text-[32px]"
              >
                {t.method.title}
              </SectionTitle>
            </div>
            <p
              data-reveal="text"
              className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[420px]"
              style={{ fontFamily: body, lineHeight: 1.4 }}
            >
              {t.method.text}
            </p>
          </div>
        </div>

        <div data-reveal="section" className="border-y border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 border-x border-[#d6dace]">
              {workSteps.map((step, index) => (
                <div
                  key={step.title}
                  className={`flex min-h-[230px] flex-col justify-between gap-8 p-6 md:min-h-[260px] md:gap-10 ${
                    index > 0 ? "border-t border-[#d6dace]" : ""
                  } ${index > 0 ? "md:border-t-0 md:border-l md:border-[#d6dace]" : ""}`}
                >
                  <p
                    data-reveal="text"
                    className="text-[#5f644c] text-[12px] lowercase"
                    style={{ fontFamily: mono }}
                  >
                    {step.step}
                  </p>
                  <div className="flex flex-col gap-4">
                    <h3
                      data-reveal="text"
                      className="text-[#101700] text-[18px] md:text-[20px]"
                      style={{ fontFamily: display, fontWeight: 500, letterSpacing: titleTracking }}
                    >
                      {step.title}
                    </h3>
                    <p
                      data-reveal="text"
                      className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[310px]"
                      style={{ fontFamily: body, lineHeight: 1.4 }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <XlHelper />
            <SectionBorderTicks
              positions={threeColumnTickPositions}
            />
          </div>
        </div>

        {/* ===== CASES ===== */}
        <div
          id={t.ids.cases}
          data-reveal="section"
          className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] pt-16 pb-9 scroll-mt-[96px]"
        >
          <div className="flex flex-col gap-6 max-w-[499px]">
            <SectionLabel>{t.cases.label}</SectionLabel>
            <SectionTitle
              as="h2"
              className="text-[32px]"
            >
              {t.cases.title}
            </SectionTitle>
          </div>
        </div>

        <div data-reveal="section" className="border-y border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 border-x border-[#d6dace]">
              {caseStudies.map(
                (
                  { name, Logo, href, domain, title, context, effect, capability },
                  index,
                ) => (
                  <article
                    key={name}
                    className={`relative flex flex-col gap-6 p-6 min-h-[270px] lg:min-h-[330px] transition-colors hover:bg-[#ecefe7] ${
                      index > 0 ? "border-t border-[#d6dace]" : ""
                    } ${index === 1 ? "md:border-t-0" : ""} ${
                      index % 2 === 1 ? "md:border-l" : ""
                    }`}
                  >
                    <div className="flex h-[30px] items-center justify-between gap-4">
                      <Logo />
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#5f644c] text-[12px] lowercase underline-offset-4 hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-[#101700]"
                        style={{ fontFamily: mono }}
                      >
                        {domain} <span aria-hidden>↗</span>
                        <span className="sr-only">{t.cases.newTab}</span>
                      </a>
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3
                        data-reveal="text"
                        className="text-[#101700] text-[14px] md:text-[16px]"
                        style={{
                          fontFamily: display,
                          fontWeight: 500,
                          letterSpacing: titleTracking,
                        }}
                      >
                        {title}
                      </h3>
                      <div className="flex flex-col gap-3">
                        {[
                          [t.cases.contextLabel, context],
                          [t.cases.effectLabel, effect],
                          [t.cases.capabilityLabel, capability],
                        ].map(([label, text]) => (
                          <p
                            key={label}
                            data-reveal="text"
                            className="text-[#5f644c] text-[13px] md:text-[14px] max-w-[460px]"
                            style={{ fontFamily: body, lineHeight: 1.4 }}
                          >
                            <span className="text-[#101700]">{label}</span>
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </article>
                ),
              )}
            </div>
            <XlHelper />
            <SectionBorderTicks positions={twoColumnTickPositions} />
          </div>
        </div>

        {/* ===== WHAT MAKES US DIFFERENT ===== */}
        <div
          data-reveal="section"
          className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] pt-16 pb-9"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
            <div className="flex flex-col gap-8 max-w-[649px]">
              <SectionLabel>{t.why.label}</SectionLabel>
              <SectionTitle as="h2" className="text-[32px]">
                {t.why.title}
              </SectionTitle>
            </div>
            <p
              data-reveal="text"
              className="text-[#5f644c] text-[14px] md:text-[16px] max-w-[338px]"
              style={{ fontFamily: body, lineHeight: 1.4 }}
            >
              {t.why.text}
            </p>
          </div>
        </div>

        <div data-reveal="section" className="border-t border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper />
            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 border-x border-[#d6dace]">
              {coordinationItems.map(({ before, after }, index) => (
                <div
                  key={before}
                  className={`flex flex-col justify-between gap-6 p-6 sm:min-h-[200px] md:min-h-[220px] ${
                    index > 0
                      ? "border-t border-[#d6dace] sm:border-t-0 sm:border-l"
                      : ""
                  }`}
                >
                  <p
                    data-reveal="text"
                    className="text-[#5f644c] text-[14px] md:text-[16px] line-through"
                    style={{ fontFamily: body, lineHeight: 1.3 }}
                  >
                    {before}
                  </p>
                  <p
                    data-reveal="text"
                    className="text-[#101700] text-[18px] md:text-[20px]"
                    style={{
                      fontFamily: heading,
                      letterSpacing: titleTracking,
                      fontWeight: 500,
                      lineHeight: 1.2,
                    }}
                  >
                    {after}
                  </p>
                </div>
              ))}
            </div>
            <XlHelper />
            <SectionBorderTicks positions={threeColumnTickPositions} />
          </div>
        </div>

        {/* ===== CTA ===== */}
        <div data-reveal="section" className="border-y border-[#d6dace]">
          <div className="max-w-[1512px] mx-auto flex relative">
            <XlHelper className="border-r border-[#d6dace]" />
            <div className="relative flex flex-col lg:flex-row flex-1 min-w-0 overflow-hidden bg-[#b4eb38]">
              <AsciiStarfield
                className="absolute inset-0 hidden lg:block [mask-image:linear-gradient(90deg,transparent_38%,black_72%)]"
                color="#456300"
              />
              <div className="relative flex flex-col justify-between p-6 w-full lg:w-1/2 min-h-[360px] lg:h-[462px]">
                <div className="flex flex-col gap-6 max-w-[450px]">
                  <p
                    data-reveal="text"
                    className="text-[#456300] text-[12px] lowercase"
                    style={{ fontFamily: mono }}
                  >
                    {t.cta.label}
                  </p>
                  <SectionTitle
                    as="h2"
                    className="text-[32px]"
                  >
                    {t.cta.title}
                  </SectionTitle>
                </div>
                <p
                  data-reveal="text"
                  className="text-[#456300] text-[14px] md:text-[16px] max-w-[360px] mt-8"
                  style={{ fontFamily: body, lineHeight: 1.4 }}
                >
                  {t.cta.text}
                </p>
              </div>
              <div className="relative flex items-end justify-end p-6 w-full lg:w-1/2 min-h-[120px] lg:h-[462px]">
                <button
                  type="button"
                  onClick={openContactModal}
                  className="inline-flex min-h-[36px] items-center bg-[#101700] text-[#f2f3ef] px-3 py-2 text-[12px] uppercase cursor-pointer transition-[background-color,transform] hover:bg-[#263600] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                  style={{ fontFamily: mono }}
                >
                  {t.cta.button}
                </button>
              </div>
            </div>
            <XlHelper className="border-l border-[#d6dace]" />
            <SectionBorderTicks positions={edgeTickPositions} />
          </div>
        </div>

      </main>

      {/* ===== FOOTER ===== */}
      <footer
        id={t.ids.contact}
        data-reveal="section"
        className="max-w-[1512px] mx-auto px-6 md:px-8 xl:px-[192px] py-9 scroll-mt-[96px] text-[#101700]"
      >
        <div className="flex flex-col md:flex-row md:justify-between gap-10 pb-9">
          <div className="flex flex-col gap-8 max-w-[356px]">
            <ShiftLabsIcon />
            <p
              data-reveal="text"
              className="text-[#5f644c] text-[14px] md:text-[16px]"
              style={{ fontFamily: body, lineHeight: 1.3 }}
            >
              {t.footer.text}
            </p>
            <p
              data-reveal="text"
              className="text-[#5f644c] text-[14px] md:text-[16px]"
              style={{ fontFamily: body, lineHeight: 1.3 }}
            >
              <span
                className="text-[#101700]"
                style={{ fontFamily: display, fontWeight: 500 }}
              >
                © 2026 ShiftLabs.
              </span>
              <span>{t.footer.rights}</span>
            </p>
          </div>
          <nav
            aria-label={t.nav.footerLabel}
            className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:gap-x-16"
          >
            <div className="flex flex-col gap-3">
              <p
                className="text-[#5f644c] text-[12px] lowercase"
                style={{ fontFamily: mono }}
              >
                {t.footer.homeLabel}
              </p>
              {homeSections.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-[32px] items-center text-[#5f644c] hover:text-[#101700] transition-colors text-[14px] md:text-[16px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                  style={{ fontFamily: body, lineHeight: 1.3 }}
                >
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p
                className="text-[#5f644c] text-[12px] lowercase"
                style={{ fontFamily: mono }}
              >
                {t.footer.companyLabel}
              </p>
              <button
                type="button"
                onClick={openContactModal}
                className="inline-flex min-h-[32px] items-center text-left text-[#5f644c] hover:text-[#101700] transition-colors text-[14px] md:text-[16px] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                style={{ fontFamily: body, lineHeight: 1.3 }}
              >
                {t.nav.contact}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <p
                className="text-[#5f644c] text-[12px] lowercase"
                style={{ fontFamily: mono }}
              >
                {t.footer.socialLabel}
              </p>
              {socialLinks.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-2 text-[#5f644c] hover:text-[#101700] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101700]"
                >
                  <Icon />
                  <span
                    className="text-[14px] md:text-[16px]"
                    style={{ fontFamily: body, lineHeight: 1.3 }}
                  >
                    {name}
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
        {/* Big wordmark */}
        <div className="pt-9">
          <BigWordmark />
        </div>
      </footer>

      {isContactModalOpen ? (
        <div
          className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto px-4 py-4 sm:items-center sm:py-6"
          onClick={closeContactModal}
        >
          <div className="absolute inset-0 bg-[#101700]/45 backdrop-blur-[1px]" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.contact.dialogLabel}
            className="relative flex max-h-[calc(100dvh-32px)] w-full max-w-[760px] flex-col overflow-hidden border border-[#d6dace] bg-[#f2f3ef]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="shrink-0 border-b border-[#d6dace] px-5 py-4 md:px-6">
              <div className="flex items-center justify-between gap-4">
                <p
                  className="text-[#5f644c] text-[12px] lowercase"
                  style={{ fontFamily: mono }}
                >
                  {t.contact.label}
                </p>
                <button
                  type="button"
                  onClick={closeContactModal}
                  className="inline-flex min-h-[36px] items-center border border-[#d6dace] px-3 py-2 text-[12px] uppercase text-[#5f644c] hover:text-[#101700]"
                  style={{ fontFamily: mono, lineHeight: "normal" }}
                >
                  {t.contact.close}
                </button>
              </div>
              <p
                className="mt-3 text-[#101700] text-[24px] md:text-[30px]"
                style={{
                  fontFamily: heading,
                  letterSpacing: titleTracking,
                  fontWeight: 500,
                  lineHeight: "normal",
                }}
              >
                {isContactSuccess ? t.contact.successTitle : t.contact.title}
              </p>
            </div>

            {isContactSuccess ? (
              <div className="min-h-0 overflow-y-auto p-5 md:p-6">
                <div className="shiftlabs-success-shell border border-[#d6dace] p-5 md:p-6">
                  <div className="relative z-[1] flex flex-col gap-5 md:gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-3">
                        <span aria-hidden className="shiftlabs-success-orb">
                          <span className="shiftlabs-success-check">✓</span>
                        </span>
                        <div className="flex flex-col gap-1">
                          <p
                            className="text-[12px] lowercase text-[#5f644c]"
                            style={{ fontFamily: mono }}
                          >
                            {t.contact.successLabel}
                          </p>
                          <p
                            className="text-[25px] md:text-[36px] text-[#101700]"
                            style={{
                              fontFamily: heading,
                              letterSpacing: titleTracking,
                              fontWeight: 500,
                              lineHeight: 1.03,
                            }}
                          >
                            {t.contact.successHeading}
                          </p>
                        </div>
                      </div>
                      <span
                        className="shiftlabs-success-chip"
                        style={{ fontFamily: mono }}
                      >
                        {t.contact.successStatus}
                      </span>
                    </div>

                    <p
                      className="text-[#50543f] text-[15px] md:text-[18px] max-w-[560px]"
                      style={{ fontFamily: body, lineHeight: 1.35 }}
                    >
                      {heroContactFeedback?.message}
                    </p>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {t.contact.steps.map(([label, text]) => (
                        <div
                          key={label}
                          className="shiftlabs-success-step border border-[#d6dace] p-3"
                        >
                          <p
                            className="text-[12px] lowercase text-[#5f644c]"
                            style={{ fontFamily: mono }}
                          >
                            {label}
                          </p>
                          <p
                            className="mt-1 text-[14px] text-[#101700]"
                            style={{ fontFamily: body, lineHeight: 1.3 }}
                          >
                            {text}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div aria-hidden className="shiftlabs-success-progress" />

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={resetContactModalFeedback}
                        className="inline-flex min-h-[36px] items-center border border-[#d6dace] px-3 py-2 text-[12px] uppercase text-[#5f644c] hover:text-[#101700]"
                        style={{ fontFamily: mono, lineHeight: "normal" }}
                      >
                        {t.contact.backToForm}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={submitHeroContactForm}
                className="min-h-0 overflow-y-auto p-5 md:p-6"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-[13px] text-[#5f644c]"
                      style={{ fontFamily: body }}
                    >
                      {t.contact.fields.name}
                    </span>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={heroContactForm.name}
                      onChange={(event) =>
                        updateHeroContactField("name", event.target.value)
                      }
                      className="h-11 border border-[#d6dace] bg-[#f2f3ef] px-3 text-[14px] text-[#101700] outline-none focus:border-[#5f644c]"
                      style={{ fontFamily: body }}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-[13px] text-[#5f644c]"
                      style={{ fontFamily: body }}
                    >
                      {t.contact.fields.whatsapp}
                    </span>
                    <input
                      type="tel"
                      required
                      value={heroContactForm.whatsapp}
                      onChange={(event) =>
                        updateHeroContactField("whatsapp", event.target.value)
                      }
                      className="h-11 border border-[#d6dace] bg-[#f2f3ef] px-3 text-[14px] text-[#101700] outline-none focus:border-[#5f644c]"
                      style={{ fontFamily: body }}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-[13px] text-[#5f644c]"
                      style={{ fontFamily: body }}
                    >
                      {t.contact.fields.email}
                    </span>
                    <input
                      type="email"
                      required
                      value={heroContactForm.email}
                      onChange={(event) =>
                        updateHeroContactField("email", event.target.value)
                      }
                      className="h-11 border border-[#d6dace] bg-[#f2f3ef] px-3 text-[14px] text-[#101700] outline-none focus:border-[#5f644c]"
                      style={{ fontFamily: body }}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span
                      className="text-[13px] text-[#5f644c]"
                      style={{ fontFamily: body }}
                    >
                      {t.contact.fields.company}
                    </span>
                    <input
                      type="text"
                      required
                      value={heroContactForm.company}
                      onChange={(event) =>
                        updateHeroContactField("company", event.target.value)
                      }
                      className="h-11 border border-[#d6dace] bg-[#f2f3ef] px-3 text-[14px] text-[#101700] outline-none focus:border-[#5f644c]"
                      style={{ fontFamily: body }}
                    />
                  </label>

                  <label className="flex flex-col gap-1.5 md:col-span-2">
                    <span
                      className="text-[13px] text-[#5f644c]"
                      style={{ fontFamily: body }}
                    >
                      {t.contact.fields.subject}
                    </span>
                    <input
                      type="text"
                      required
                      value={heroContactForm.subject}
                      onChange={(event) =>
                        updateHeroContactField("subject", event.target.value)
                      }
                      className="h-11 border border-[#d6dace] bg-[#f2f3ef] px-3 text-[14px] text-[#101700] outline-none focus:border-[#5f644c]"
                      style={{ fontFamily: body }}
                    />
                  </label>
                </div>

                <p
                  className="mt-5 text-[12px] text-[#5f644c]"
                  style={{ fontFamily: body, lineHeight: 1.3 }}
                >
                  {t.contact.notice}
                </p>

                <div className="sticky bottom-0 -mx-5 mt-3 flex flex-wrap items-center gap-3 border-t border-[#d6dace] bg-[#f2f3ef] px-5 pt-3 pb-1 md:-mx-6 md:px-6">
                  <button
                    type="button"
                    onClick={closeContactModal}
                    className="inline-flex min-h-[36px] items-center border border-[#d6dace] px-3 py-2 text-[12px] uppercase text-[#5f644c] hover:text-[#101700]"
                    style={{ fontFamily: mono, lineHeight: "normal" }}
                  >
                    {t.contact.cancel}
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-[36px] items-center bg-[#101700] px-3 py-2 text-[12px] uppercase text-[#f2f3ef]"
                    style={{ fontFamily: mono, lineHeight: "normal" }}
                  >
                    {t.contact.submit}
                  </button>
                </div>
                {isContactError ? (
                  <div className="mt-3 border border-[#d8bbb9] bg-[#f8eceb] px-3 py-2">
                    <p
                      className="text-[13px] text-[#9f2b2b]"
                      style={{ fontFamily: body }}
                    >
                      {heroContactFeedback?.message}
                    </p>
                  </div>
                ) : null}
              </form>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    applySeoPayload({
      title: t.seo.title,
      description: seoDefaultDescription,
      path: t.homePath,
      pageSchema: buildLandingPageSchema(),
    });
  }, []);

  return <LandingPage />;
}
