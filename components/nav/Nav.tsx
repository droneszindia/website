"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { useLenisScroll } from "@/components/providers/LenisGSAPProvider";
import "./nav.css";

/**
 * Fixed nav. Over the dark cinematic hero it goes transparent with light type; once the hero
 * scrolls away it settles into the solid light-glass treatment for the light sections below.
 * An IntersectionObserver on the hero drives the flip (works through the hero's GSAP pin, which
 * keeps it viewport-filling). No `.hero` on a route (e.g. /contact) → always solid.
 * The "Frames" item is an in-page anchor — on home it scrolls through Lenis to #frames-section;
 * from another route it routes home then anchors.
 */
export function Nav() {
  const pathname = usePathname();
  const { scrollTo } = useLenisScroll();
  const [overHero, setOverHero] = useState(pathname === "/");

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  const handleAnchor = (href: string) => {
    // href like "#frames-section"
    if (pathname === "/") {
      scrollTo(href);
    } else {
      // navigate home with the hash; Lenis settles the rest after load
      window.location.href = `/${href}`;
    }
  };

  return (
    <header className="nav" data-over-hero={overHero || undefined}>
      <Link href="/" className="nav__brand" aria-label={`${SITE.name} home`}>
        {/* Official quadcopter mark — stays brand-red on both the dark hero and the
            light sections, so it needs no color flip. alt="" as the link is labelled. */}
        <img
          src="/brand/drone-mark.png"
          alt=""
          width={26}
          height={26}
          className="nav__brand-mark"
        />
        Drones<span className="accent">Z</span>
      </Link>
      <nav aria-label="Main navigation">
        <ul className="nav__links">
          {NAV.map((item) => {
            const isAnchor = item.href.startsWith("#");
            const isActive = !isAnchor && pathname === item.href;
            return (
              <li key={item.href}>
                {isAnchor ? (
                  <button
                    type="button"
                    className="nav__link"
                    onClick={() => handleAnchor(item.href)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="nav__link"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
