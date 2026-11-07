import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

function IdentityLayerIcon() {
  return (
    <svg className="size-9" fill="none" viewBox="0 0 40 40">
      <circle pathLength={1} cx="20" cy="20" r="10.5" stroke="currentColor" strokeWidth="1.5" />
      <circle pathLength={1} cx="20" cy="20" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path pathLength={1}
        d="M20 4.5V9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M20 30.5V35.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M4.5 20H9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M30.5 20H35.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FundamentalsLayerIcon() {
  return (
    <svg className="size-9" fill="none" viewBox="0 0 40 40">
      <rect pathLength={1}
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="23"
        x="8.5"
        y="25.5"
      />
      <rect pathLength={1}
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="17"
        x="11.5"
        y="18.2"
      />
      <rect pathLength={1}
        height="5.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="11"
        x="14.5"
        y="10.9"
      />
    </svg>
  );
}

function ArchitectureLayerIcon() {
  return (
    <svg className="size-9" fill="none" viewBox="0 0 40 40">
      <rect pathLength={1}
        height="23"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="23"
        x="8.5"
        y="8.5"
      />
      <path pathLength={1} d="M8.5 16.2H31.5" stroke="currentColor" strokeWidth="1.5" />
      <path pathLength={1} d="M16.2 8.5V31.5" stroke="currentColor" strokeWidth="1.5" />
      <path pathLength={1} d="M22 22H31.5" stroke="currentColor" strokeWidth="1.5" />
      <path pathLength={1} d="M22 31.5V22" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function OperatingSystemLayerIcon() {
  return (
    <svg className="size-9" fill="none" viewBox="0 0 40 40">
      <circle pathLength={1} cx="20" cy="20" r="6.2" stroke="currentColor" strokeWidth="1.5" />
      <path pathLength={1}
        d="M20 7.2V11.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M20 28.8V32.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M7.2 20H11.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M28.8 20H32.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M11 11L13.8 13.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M26.2 26.2L29 29"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M29 11L26.2 13.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M13.8 26.2L11 29"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function IntelligenceLayerIcon() {
  return (
    <svg className="size-9" fill="none" viewBox="0 0 40 40">
      <circle cx="10" cy="11" fill="currentColor" r="2.2" />
      <circle cx="29.8" cy="10.5" fill="currentColor" r="2.2" />
      <circle cx="20" cy="20" fill="currentColor" r="2.2" />
      <circle cx="10.5" cy="29.2" fill="currentColor" r="2.2" />
      <circle cx="30" cy="29" fill="currentColor" r="2.2" />
      <path pathLength={1}
        d="M12 12.5L18.3 18.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M27.8 12L21.7 18.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M12.4 27.8L18.1 21.9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M27.8 27.4L21.9 21.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path pathLength={1}
        d="M12.2 11.1H27.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

const layerIcons = [
  IdentityLayerIcon,
  FundamentalsLayerIcon,
  ArchitectureLayerIcon,
  OperatingSystemLayerIcon,
  IntelligenceLayerIcon,
];

const arrivalSeconds = [0.3, 1.8, 3.2, 4.5, 5.7];
const playRatio = 0.45;

type CyclePhase = "idle" | "run" | "reset";

const phaseDurationMs: Record<CyclePhase, number> = { idle: 300, run: 7400, reset: 840 };
const nextPhase: Record<CyclePhase, CyclePhase> = { idle: "run", run: "reset", reset: "idle" };

export function FrameworkLayers({ labels }: { labels: string[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [phase, setPhase] = useState<CyclePhase>("idle");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= playRatio) setIsInView(true);
        else if (!entry.isIntersecting) setIsInView(false);
      },
      { threshold: [0, playRatio] },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      setPhase("idle");
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(() => setPhase(nextPhase[phase]), phaseDurationMs[phase]);
    return () => window.clearTimeout(timer);
  }, [isInView, phase]);

  return (
    <div
      ref={rootRef}
      className="framework-flow"
      data-in-view={isInView ? "" : undefined}
      data-playing={phase === "idle" ? undefined : ""}
      data-resetting={phase === "reset" ? "" : undefined}
    >
      <span aria-hidden className="framework-flow-aura" />
      <span aria-hidden className="framework-flow-rail">
        <span className="framework-rail-base" />
        <span className="framework-rail-fill" />
        <span className="framework-rail-runner">
          <span className="framework-rail-comet" />
        </span>
      </span>
      <ol className="framework-flow-list">
        {labels.map((label, index) => {
          const Icon = layerIcons[index];
          return (
          <li
            key={label}
            className="framework-flow-item"
            style={
              {
                "--arrive": `${arrivalSeconds[index]}s`,
              } as CSSProperties
            }
          >
            <span aria-hidden className="framework-orb">
              <span className="framework-orb-ripple" />
              <svg className="framework-ring" viewBox="0 0 86 86">
                <circle className="framework-ring-base" cx="43" cy="43" r="42.5" />
                <path
                  className="framework-ring-arc"
                  d="M0.5 43A42.5 42.5 0 0 1 85.5 43"
                  pathLength={1}
                />
                <path
                  className="framework-ring-arc"
                  d="M0.5 43A42.5 42.5 0 0 0 85.5 43"
                  pathLength={1}
                />
              </svg>
              <span className="framework-icon framework-icon-base">
                <Icon />
              </span>
              <span className="framework-orb-lit">
                <span className="framework-orb-glow" />
                <span className="framework-orb-disc" />
                <span className="framework-icon framework-icon-lit">
                  <Icon />
                </span>
              </span>
            </span>
            <span className="framework-flow-label">{label}</span>
          </li>
          );
        })}
      </ol>
    </div>
  );
}
