import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import Header from "../components/header";
import Countdown from "../components/countdown";
import ProgressBar from "../components/progressBar";
import GoldCard from "../assets/gold_card.png"
import PlatinumCard from "../assets/platinum_card.png"

export default function App() {
  const [progress, setProgress] = useState({ percent: 0, total: 0, target: 0 });
  const currentCardIndex = localStorage.getItem("currentCard");
  const [currentCardType, setCurrentCardType] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");

  useEffect(() => {
    if (currentCardIndex !== null) {
      const cards = JSON.parse(localStorage.getItem("cards") || "[]");
      const card = cards[parseInt(currentCardIndex)];
      if (card && card.type) setCurrentCardType(card.type);
    }
  }, []);

  return (
    <div className="flex flex-col bg-white w-screen h-screen rounded-b-xl">
      <Header />
      {currentCardIndex === null ? (
        <div className="p-1 flex flex-row h-full w-full text-2xl rounded-b-lg bg-stone-200 gap-x-1">
          <div className="p-1 h-full w-full flex flex-col items-center bg-white rounded-b-lg justify-center text-blue-900 font-bold gap-y-2">
            No card selected!
            <div className="flex flex-row gap-x-2">
              <button
                onClick={handleAddCard}
                className="px-2 py-1 text-sm font-bold text-white bg-green-600 hover:border-green-500 border-black cursor-pointer"
              >
                Add Card
              </button>
              <button
                onClick={handleCardList}
                className="px-2 py-1 text-sm font-bold text-white bg-stone-500 hover:border-stone-400 border-black cursor-pointer"
              >
                Manage Cards
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-1 flex flex-row h-full w-full rounded-b-lg bg-stone-200 gap-x-1">
          <div className="flex flex-col justify-center gap-y-10 h-full w-[70%] rounded-bl-lg bg-white">
            <div className="flex flex-row justify-center">
              <img
                src={
                  currentCardType === "gold"
                    ? GoldCard
                    : PlatinumCard
                }
                className=" w-[70%] border-black border rounded-2xl"
              />
            </div>
            <ProgressBar
              percent={progress.percent}
              total={progress.total}
              target={progress.target}
            />
          </div>
          <div className="flex flex-col flex-1 h-full w-[30%] rounded-br-lg bg-white">
            <Countdown setProgress={setProgress} />
          </div>
        </div>
      )}
    </div>
  );
}
