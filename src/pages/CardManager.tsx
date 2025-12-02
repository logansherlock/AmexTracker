import Management from "../components/cardList";
import "../index.css";
import "../output.css";
import Header from "../components/header";

export default function CardManager() {
  return (
    <div className="flex flex-col bg-stone-200 h-screen w-screen">
      <Header />
      <Management />
    </div>
  );
}
