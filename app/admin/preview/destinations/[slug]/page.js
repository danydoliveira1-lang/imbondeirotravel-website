
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "../../../../../lib/commandCentreAuth";

import Header from "../../../../../components/Header";
import Footer from "../../../../../components/Footer";
import PublicDestinationStory from "../../../../../components/PublicDestinationStory";

import { JourneyProvider } from "../../../../../components/JourneyContext";
import { LanguageProvider } from "../../../../../components/LanguageContext";
import { CurrencyProvider } from "../../../../../components/CurrencyContext";

import "./preview.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Private Destination Preview | Imbondeiro Travel",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDestinationPreview({ params }) {
  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const { slug } = await params;

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    notFound();
  }

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <JourneyProvider>
          <div className="destination-preview">
            <div
              className="destination-preview-banner"
              role="status"
            >
              <div className="destination-preview-banner-inner">
                <strong>PRIVATE DRAFT PREVIEW</strong>

                <span>
                  Not publicly published · Showing last saved changes
                </span>

                <a href="/admin">
                  Return to Command Centre
                </a>
              </div>
            </div>

            <Header />

            <PublicDestinationStory
              slug={slug}
              preview
            />

            <Footer />
          </div>
        </JourneyProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
