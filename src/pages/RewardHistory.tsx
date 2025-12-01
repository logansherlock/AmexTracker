import "../index.css";
import "../output.css";
import Header from "../components/header";
import Rewards from "../components/rewards";

export default function RewardHistory() {
  return (
    <div className="flex flex-col bg-stone-500 h-screen w-screen">
      <Header />
      <Rewards />
    </div>
  );
}
