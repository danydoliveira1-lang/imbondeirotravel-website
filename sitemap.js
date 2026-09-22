export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://imbondeirotravel.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
