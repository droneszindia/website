import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy for a static marketing site. Notes on the non-obvious choices:
 * - `script-src 'unsafe-inline'`: Next's App Router emits inline hydration bootstraps
 *   (`self.__next_f`). A nonce would require middleware + forcing every route to dynamic
 *   render, defeating static generation — not worth it here, where the only user input
 *   (the enquiry form) is emailed as plain text and never rendered back, so the XSS surface
 *   is minimal. `'unsafe-eval'` is added in dev only (React Refresh needs it; headers apply
 *   in dev too).
 * - `img-src blob:` + `worker-src blob:`: the file dropzone previews images via object-URLs
 *   and online-3d-viewer renders meshes through a blob-URL worker.
 * - `connect-src *.public.blob.vercel-storage.com`: large-file client uploads PUT straight to
 *   the public Blob store. Confirm the exact host once BLOB_READ_WRITE_TOKEN lands.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob:`,
  `font-src 'self'`,
  `media-src 'self'`,
  `connect-src 'self' https://*.public.blob.vercel-storage.com https://blob.vercel-storage.com`,
  `worker-src 'self' blob:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three.js ships untranspiled ESM; keep it server-external-safe and tree-shaken.
  transpilePackages: ["three"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
