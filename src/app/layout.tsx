import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f2ee6" },
    { media: "(prefers-color-scheme: dark)", color: "#070a22" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://dig-ecom.academy"
  ),
  title: {
    default: "Dig e-com Academy — Formations professionnelles aux Comores",
    template: "%s | Dig e-com Academy",
  },
  description:
    "Académie de formation professionnelle pratique à Moroni Hadoudja (ancien Campus France), Comores : Marketing digital & Meta Ads, E-commerce, Entrepreneuriat, Art oratoire et Développement personnel.",
  keywords: [
    "Formation Comores",
    "Dig e-com Academy",
    "Marketing digital Moroni",
    "E-commerce Comores",
    "Entrepreneuriat Comores",
    "Art oratoire Comores",
    "Développement personnel Comores",
    "Moroni Hadoudja",
    "ancien Campus France",
    "Formation pratique Moroni",
    "Vente WhatsApp Comores",
    "Meta Ads Comores",
    "Création entreprise Grande Comore",
  ],
  authors: [{ name: "Dig e-com Academy", url: "https://dig-ecom.academy" }],
  creator: "Dig e-com Academy",
  publisher: "Dig e-com Academy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dig e-com Academy — Formations professionnelles aux Comores",
    description:
      "Des formations concrètes, animées par des praticiens, pour passer de l'idée à l'action. Siège à Moroni Hadoudja (ancien Campus France).",
    url: "https://dig-ecom.academy",
    siteName: "Dig e-com Academy",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "Dig e-com Academy — Moroni Hadoudja (ancien Campus France)",
      },
    ],
    locale: "fr_KM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dig e-com Academy — Formations professionnelles aux Comores",
    description:
      "Formations pratiques à Moroni Hadoudja (ancien Campus France) : Marketing digital, E-commerce, Entrepreneuriat & Art oratoire.",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": "https://dig-ecom.academy/#organization",
        "name": "Dig e-com Academy",
        "url": "https://dig-ecom.academy",
        "logo": "https://dig-ecom.academy/logo.png",
        "image": "https://dig-ecom.academy/logo.png",
        "description":
          "Académie de formations professionnelles pratiques aux Comores : Marketing digital, E-commerce, Entrepreneuriat, Art oratoire et Développement personnel.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hadoudja (ancien Campus France)",
          "addressLocality": "Moroni",
          "addressRegion": "Grande Comore",
          "addressCountry": "KM",
        },
        "telephone": "+2693330000",
        "email": "contact@dig-ecom.academy",
        "sameAs": ["https://wa.me/2693330000"],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://dig-ecom.academy/#localbusiness",
        "name": "Dig e-com Academy — Siège Moroni",
        "image": "https://dig-ecom.academy/logo.png",
        "url": "https://dig-ecom.academy",
        "telephone": "+2693330000",
        "priceRange": "Accessible avec facilités",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Hadoudja (ancien Campus France)",
          "addressLocality": "Moroni",
          "addressRegion": "Grande Comore",
          "addressCountry": "KM",
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            "opens": "08:30",
            "closes": "18:00",
          },
        ],
      },
    ],
  };

  return (
    <html lang="fr" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('theme');
                if (storedTheme) {
                  document.documentElement.setAttribute('data-theme', storedTheme);
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
