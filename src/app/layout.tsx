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
  themeColor: "#1f2ee6",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Dig e-com Academy — Formations professionnelles aux Comores",
  description:
    "Marketing digital, e-commerce, développement personnel, art oratoire, entrepreneuriat : des formations 100% pratiques animées par des professionnels pour réussir aux Comores.",
  keywords: [
    "Formation Comores",
    "Dig e-com Academy",
    "Marketing digital Moroni",
    "E-commerce Comores",
    "Entrepreneuriat Comores",
    "Art oratoire",
    "Développement personnel",
  ],
  authors: [{ name: "Dig e-com Academy" }],
  openGraph: {
    title: "Dig e-com Academy — Formations professionnelles aux Comores",
    description:
      "Des formations concrètes, animées par des praticiens, pour passer de l'idée à l'action.",
    url: "https://dig-ecom.academy",
    siteName: "Dig e-com Academy",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 400,
        alt: "Dig e-com Academy Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </head>
      <body>{children}</body>
    </html>
  );
}
