import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Imbondeiro Travel | Explore Angola & The World",
  description:
    "Tailor-made journeys across Angola and the world, with luxury escapes, hotels, corporate travel, MICE, and trusted local support."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Libre+Caslon+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Script src="/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
