import type { NextConfig } from "next";

// CSP volontairement absente : elle dépend de GTM / Meta / Turnstile et est posée en phase 8.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Un cran de plus vers le bas (360 et 480) : un logo affiché à 368 px n'a pas à télécharger du 640 px.
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
  },
  // Anciennes adresses de l'ancien site : redirigées définitivement (301) pour garder le référencement.
  async redirects() {
    return [
      { source: "/qui-sommes-nous", destination: "/#histoire", permanent: true },
      { source: "/couverture", destination: "/realisations/couverture", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Images du site (photos, logos…) : le navigateur les garde une semaine au lieu de les
        // revérifier à chaque page (par défaut, `max-age=0`). Si une image est remplacée sous le
        // même nom, un visiteur peut voir l'ancienne jusqu'à une semaine : changer le nom du fichier.
        source: "/v2/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" },
        ],
      },
    ];
  },
};

export default nextConfig;
