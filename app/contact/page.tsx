import type { Metadata } from "next";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CONTACT, SITE } from "@/data/site";
import "@/components/sections.css";
import "./contact.css";

export const metadata: Metadata = {
  title: `Contact — ${SITE.name}`,
  description: "Talk to DronesZ India about custom builds, counter-UAS, and lab setup.",
};

export default function ContactPage() {
  return (
    <main style={{ paddingTop: "5rem" }}>
      <section className="section contact-page" aria-labelledby="contact-title">
        <div className="contact-page__intro">
          <SectionLabel>Get in touch</SectionLabel>
          <h1 id="contact-title" className="contact-page__title">
            Tell us about the mission.
          </h1>
          <p className="contact-page__lead">
            Custom builds, counter-UAS, consumer drones, or standing up a lab —
            we&apos;ll call you back.
          </p>
          <ul className="contact-page__details">
            <li>
              <span>Email</span>
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <span>Phone</span>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                {CONTACT.phone}
              </a>
            </li>
            <li>
              <span>Studio</span>
              <p>{CONTACT.address}</p>
            </li>
          </ul>
        </div>
        <div className="contact-page__form">
          {/* Phase 7 mounts the validated ContactForm here. */}
          <p style={{ color: "var(--color-faint)" }}>
            [ Contact form — wired in Phase 7 ]
          </p>
        </div>
      </section>
    </main>
  );
}
