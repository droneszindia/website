"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollSection } from "@/components/scroll/ScrollSection";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FRAME_BOX_ASPECT, type FrameStory } from "@/data/frames";
import type { FrameCallout } from "@/data/frame-callouts";
import "./frames.css";

/**
 * Engineering-dossier panel: the real exploded flat-lay photo as a specimen, with red annotation
 * leader-lines that DRAW to labelled callouts as the pin scrubs (motion bound to scroll, not a
 * fade). Deliberately the inverse of the hero's "assembled" cinematic: this is the parts, labelled.
 * Reduced-motion / no-JS: ScrollSection stays data-animated="false" → lines drawn + labels shown
 * via CSS (see frames.css), first-class fallback.
 *
 * NOTE: the "▶ Play assembly" clip toggle is parked until the Veo clips land — the video data model
 * (story.video) and its CSS remain so it can be re-wired here without touching the layout.
 */
const buildTimeline = (tl: gsap.core.Timeline, el: HTMLElement) => {
  const lines = el.querySelectorAll<SVGLineElement>(".dossier__line");
  const dots = el.querySelectorAll<HTMLElement>(".dossier__dot");
  const labels = el.querySelectorAll<HTMLElement>(".dossier__label");

  gsap.set(lines, { strokeDashoffset: 1 });
  gsap.set(dots, { scale: 0, transformOrigin: "50% 50%" });
  gsap.set(labels, { opacity: 0, x: 14 });

  lines.forEach((line, i) => {
    tl.to(
      line,
      { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" },
      i * 0.5,
    )
      .to(dots[i], { scale: 1, duration: 0.2 }, "<")
      .to(
        labels[i],
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
        ">-0.1",
      );
  });
};

interface FrameDossierPanelProps {
  story: FrameStory;
  callouts: FrameCallout[];
  priority?: boolean;
  refreshPriority?: number;
}

export function FrameDossierPanel({
  story,
  callouts,
  priority,
  refreshPriority = 0,
}: FrameDossierPanelProps) {
  // Every specimen shares FRAME_BOX_ASPECT (the widest frame). Photos narrower than the box are
  // centred with black bars, so a callout anchored at ax% of the PHOTO width maps to a smaller
  // box-% span offset by the left bar. Vertical (ay/ly) is unchanged: the photo always fills the
  // full box height (it's the height-limited dimension), so those percentages still map 1:1.
  const photoAspect = story.image.width / story.image.height;
  const fillFrac = photoAspect / FRAME_BOX_ASPECT; // ≤ 1; photo's share of the box width
  const barFrac = (1 - fillFrac) / 2; // one side bar, as a fraction of box width
  const mapAx = (ax: number) => barFrac * 100 + ax * fillFrac;

  return (
    <ScrollSection
      id={story.id}
      className="frame-panel dossier"
      pin
      scrollDistance={Math.max(1.2, callouts.length * 0.45)}
      refreshPriority={refreshPriority}
      // ≤860px the pinned leader-line diagram doesn't fit — degrade to a static stacked
      // photo + label list (matches the frames.css mobile block) instead of clipping.
      animateMinWidth={861}
      onTimeline={buildTimeline}
    >
      <div className="dossier__header">
        <div className="dossier__eyebrow-row">
          <span className="dossier__size">{story.size}</span>
          <SectionLabel>{story.eyebrow}</SectionLabel>
        </div>
        <h2 className="dossier__title">{story.title}</h2>
        {story.hook && <p className="dossier__hook">{story.hook}</p>}
        <p className="dossier__tagline">{story.tagline}</p>
      </div>

      <div
        className="dossier__specimen"
        // Uniform box across all four frames (widest photo's aspect) so the cards share one size.
        style={{ aspectRatio: FRAME_BOX_ASPECT }}
      >
        {/* Clipped media plate: a blurred cover-fit copy fills the box behind the sharp photo so
            narrower frames get a seamless side-fill (each photo extends its own backdrop). Labels
            live OUTSIDE this plate (they overflow right), so the plate's overflow:hidden — needed
            to contain the blur bleed — doesn't clip them. */}
        <div className="dossier__plate">
          <Image
            className="dossier__fill"
            src={story.image.src}
            width={story.image.width}
            height={story.image.height}
            alt=""
            aria-hidden="true"
            sizes="240px"
          />
          <Image
            className="dossier__photo"
            src={story.image.src}
            width={story.image.width}
            height={story.image.height}
            alt={story.image.alt}
            priority={priority}
            sizes="(min-width: 769px) 40vw, 88vw"
          />
        </div>

        {/* Leader lines — non-scaling stroke so the stretched viewBox doesn't distort them. */}
        <svg
          className="dossier__lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {callouts.map((c, i) => (
            <line
              key={`line-${i}`}
              className="dossier__line"
              x1={mapAx(c.ax)}
              y1={c.ay}
              x2={100}
              y2={c.ly}
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {callouts.map((c, i) => (
          <span
            key={`dot-${i}`}
            className="dossier__dot"
            style={{ left: `${mapAx(c.ax)}%`, top: `${c.ay}%` }}
            aria-hidden="true"
          />
        ))}

        <ul className="dossier__labels">
          {callouts.map((c, i) => (
            <li
              key={`label-${i}`}
              className="dossier__label"
              data-animate
              style={{ top: `${c.ly}%` }}
            >
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </ScrollSection>
  );
}
