import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import PublicDestinationStory from "../../../components/PublicDestinationStory";
import { JourneyProvider } from "../../../components/JourneyContext";
import { LanguageProvider } from "../../../components/LanguageContext";
import { CurrencyProvider } from "../../../components/CurrencyContext";

export const metadata = {
  title: "Destination Explorer | Imbondeiro Travel",
  description:
    "Discover tailor-made journeys across Africa and the Middle East with Imbondeiro Travel.",
};

export default async function DestinationPage({ params }) {
  const { slug } = await params;

  return (
    <LanguageProvider>
      <CurrencyProvider>
        <JourneyProvider>
          <>
            <Header />

            <PublicDestinationStory slug={slug} />

            <Footer />
          </>
        </JourneyProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
