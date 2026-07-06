import { SITE, CONTACT, FOOTER } from "@/data/site";
import "@/components/sections.css";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer__brand">
          Drones<span className="accent">Z</span>
        </div>
        <p className="footer__blurb">{FOOTER.blurb}</p>
      </div>
      <div className="footer__meta">
        <p>{CONTACT.address}</p>
        <p>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
        <p>
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a>
        </p>
        <p style={{ marginTop: "var(--space-2)" }}>{FOOTER.copyright}</p>
      </div>
    </footer>
  );
}
