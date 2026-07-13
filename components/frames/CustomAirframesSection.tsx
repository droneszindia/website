"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { withMotionPreference } from "@/lib/motion";
import { FrameSequenceCanvas } from "@/components/scroll/FrameSequenceCanvas";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CUSTOM_AIRFRAMES } from "@/data/frames";
import "./frames.css";

/**
 * Custom Airframes — the conversion moment. Two parts:
 *  1. A pinned reveal that scroll-scrubs the custom-showcase clip (a red CAD wireframe
 *     materializing into a finished carbon frame): scroll = "your design becomes hardware".
 *  2. The two-path fork ("I have a design" / "I have an idea") + CTA into the (parked) form.
 * The clip is a frame sequence scrubbed on a canvas (same technique as the hero); reduced-motion
 * parks it on the finished frame. The real two-path upload form drops into the `form` slot later.
 */
const CUSTOM_SEQ_COUNT = 100;

function CustomRevealPanel() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const drawRef = useRef<(() => void) | null>(null);
  // Below the fold — don't preload the 100-frame sequence until the section nears the
  // viewport, so it doesn't compete with the hero's own preload at initial page load.
  const [near, setNear] = useState(false);

  const handleReady = useCallback((draw: () => void) => {
    drawRef.current = draw;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      withMotionPreference(
        {
          animated: () => {
            const proxy = { t: 0 };
            gsap.to(proxy, {
              t: 1,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "+=140%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                refreshPriority: 50, // below thirteen-inch (60); keeps stacked pins ordered
                invalidateOnRefresh: true,
              },
              onUpdate: () => {
                progressRef.current = proxy.t;
                drawRef.current?.();
              },
            });
          },
          reduced: () => {
            progressRef.current = 1; // show the finished frame, no pin
            drawRef.current?.();
          },
        },
        el,
      );
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="custom-reveal" aria-labelledby="custom-title">
      <div className="custom-reveal__copy">
        <SectionLabel>{CUSTOM_AIRFRAMES.eyebrow}</SectionLabel>
        <h2 id="custom-title" className="custom-reveal__title">
          {CUSTOM_AIRFRAMES.title}
        </h2>
        <p className="custom-reveal__lead">
          Whether you arrive with a finished CAD design or only an idea on
          paper, our engineering team turns it into a production-ready airframe.
        </p>
      </div>

      <div className="custom-reveal__media">
        <img
          className="custom-reveal__poster"
          src={`/custom-seq/${String(CUSTOM_SEQ_COUNT).padStart(3, "0")}.webp`}
          alt="A bespoke DronesZ airframe rendered from CAD into a finished carbon-and-red frame."
          loading="lazy"
        />
        {near && (
          <FrameSequenceCanvas
            dir="/custom-seq"
            count={CUSTOM_SEQ_COUNT}
            progressRef={progressRef}
            onReady={handleReady}
            className="custom-reveal__canvas"
          />
        )}
      </div>
    </section>
  );
}

const PATHS = [
  {
    tag: "Option A",
    title: "I have a design",
    body: "CAD or STEP files ready to go. We validate them, optimize for manufacturability, and build.",
    href: "/contact?path=design",
    cta: "Upload your design →",
  },
  {
    tag: "Option B",
    title: "I have an idea",
    body: "Just a mission and a sketch. Our team engineers it from requirements to a finished airframe.",
    href: "/contact?path=idea",
    cta: "Share your idea →",
  },
];

function CustomFork({ form }: { form?: ReactNode }) {
  return (
    <section className="custom-fork" aria-label="Start a custom build">
      <p className="custom-fork__tagline">{CUSTOM_AIRFRAMES.tagline}</p>
      <div className="custom-fork__paths">
        {PATHS.map((p) => (
          <a className="path-card" key={p.title} href={p.href}>
            <span className="path-card__tag">{p.tag}</span>
            <h3 className="path-card__title">{p.title}</h3>
            <p className="path-card__body">{p.body}</p>
            <span className="path-card__cta">{p.cta}</span>
          </a>
        ))}
      </div>
      {form && <div className="custom-fork__form">{form}</div>}
    </section>
  );
}

export function CustomAirframesSection({ form }: { form?: ReactNode }) {
  return (
    <div id="custom-airframes">
      <CustomRevealPanel />
      <CustomFork form={form} />
    </div>
  );
}
