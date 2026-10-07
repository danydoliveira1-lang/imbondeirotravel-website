import PublicDestinationExplorer from "../../components/PublicDestinationExplorer";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { JourneyProvider } from "../../components/JourneyContext";
import { LanguageProvider } from "../../components/LanguageContext";
import { CurrencyProvider } from "../../components/CurrencyContext";

export const metadata = {
  title: "Africa & Middle East Explorer | Imbondeiro Travel",
  description:
    "Explore tailor-made journeys across Africa and the Middle East with Imbondeiro Travel.",
};

export default function ExplorerPage() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <JourneyProvider>
          <>
            <Header />

            <main id="main-content">
              <PublicDestinationExplorer />
            </main>

            <Footer />
          </>
        </JourneyProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
