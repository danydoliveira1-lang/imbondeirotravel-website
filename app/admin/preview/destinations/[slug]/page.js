import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "../../../../../lib/commandCentreAuth";
import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import PublicDestinationStory from "../../../../../components/PublicDestinationStory";
import { JourneyProvider } from "../../../../../components/JourneyContext";
import { LanguageProvider } from "../../../../../components/LanguageContext";
import { CurrencyProvider } from "../../../../../components/CurrencyContext";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private Destination Preview | Imbondeiro Travel", robots: { index: false, follow: false } };

export default async function AdminDestinationPreview({ params }) {
  if (!(await isAuthenticated())) redirect("/admin");
  const { slug } = await params;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) notFound();

  return (
    <LanguageProvider><CurrencyProvider><JourneyProvider>
      <Header />
      <div role="status" style={{ position: "relative", zIndex: 20, background: "#e8d4a6", color: "#173e33", padding: "12px 24px", textAlign: "center", fontWeight: 700 }}>
        PRIVATE DRAFT PREVIEW — Not publicly published. Showing last saved changes.
        {" "}<a href="/admin" style={{ textDecoration: "underline" }}>Return to Command Centre</a>
      </div>
      <PublicDestinationStory slug={slug} preview />
      <Footer />
    </JourneyProvider></CurrencyProvider></LanguageProvider>
  );
}
