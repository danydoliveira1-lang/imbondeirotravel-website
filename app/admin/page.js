import "./command-centre.css";
import CommandCentre from "../../components/CommandCentre";

export const metadata = {
  title: "Imbondeiro Command Centre",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <CommandCentre />;
}
