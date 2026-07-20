import "./globals.css";
import Analytics from "../components/Analytics";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.imbondeirotravel.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Imbondeiro Travel | Explore Angola & The World",
    template: "%s | Imbondeiro Travel",
  },
  description: "Discover Angola through private cultural journeys, nature escapes, coastlines, wildlife and carefully crafted worldwide travel.",
  keywords: ["Angola travel", "Angola tours", "destination management Angola", "Imbondeiro Travel", "Kalandula Falls", "Serra da Leba"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Imbondeiro Travel",
    title: "Imbondeiro Travel | Explore Angola & The World",
    description: "Your gateway to meaningful journeys across Angola and selected destinations worldwide.",
    images: [{ url: "/assets/hero-kalandula.jpg", width: 1200, height: 630, alt: "Kalandula Falls, Angola" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Imbondeiro Travel | Explore Angola & The World",
    description: "Carefully crafted journeys across Angola and the world.",
    images: ["/assets/hero-kalandula.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Imbondeiro Travel",
    url: siteUrl,
    email: "imbondeirotravel@gmail.com",
    areaServed: ["Angola", "Worldwide"],
    slogan: "Your Lifetime Experience Starts Here.",
  };
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
  </head><body><a className="skip-link" href="#main-content">Skip to main content</a><Analytics />{children}</body></html>;
}
