// Main dashboard page showing the selected card, progress, and reward selection
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import Header from "../components/header";
import Countdown from "../components/countdown";
import ProgressBar from "../components/progressBar";
import GoldCard from "../assets/gold_card.png";
import PlatinumCard from "../assets/platinum_card.png";

export default function App() {
  /*
    Tracks progress towards card's annual fee value
      - percent: percent of goal completed (0-100)
      - total: amount spent since last renewal
      - target: annual fee (Gold: $325, Platinum: $895)
  */
  const [progress, setProgress] = useState({
    percent: 0,
    total: 0,
    target: 0,
  });

  // Stored index of the currently selected card
  const currentCardIndex = localStorage.getItem("currentCard");

  // Holds the currently selected card
  const [currentCard, setCurrentCard] = useState<any | null>(null);

  // Used to move between app pages
  const navigate = useNavigate();

  // Functions to handle button clicks to move to other pages
  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");

  /*
    Runs on page render
      - Reads saved card data from localStorage
      - Sets the card type for display
  */
  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");

    const index = currentCardIndex !== null ? parseInt(currentCardIndex) : null;

    if (index !== null && cards[index]) {
      setCurrentCard(cards[index]);
    } else {
      setCurrentCard(null);
    }
  }, [currentCardIndex]);

  return (
    <div className="flex flex-col bg-white w-screen h-screen rounded-b-xl">
      {/* Header component always visible */}
      <Header />
      {/* If no card is selected, show setup screen */}
      {currentCard === null ? (
        <div className="p-1 flex flex-row h-full w-full text-2xl rounded-b-lg bg-stone-200 gap-x-1">
          <div className="p-1 h-full w-full flex flex-col items-center bg-white rounded-b-lg justify-center text-blue-900 font-bold gap-y-2">
            No card selected!
            <div className="flex flex-row gap-x-2">
              {/* Add card button, 'handleAddCard' function */}
              <button
                onClick={handleAddCard}
                className="px-2 py-1 text-sm font-bold text-white bg-green-600 hover:border-green-500 border-black cursor-pointer"
              >
                Add Card
              </button>

              {/* Card Management button, 'handleCardList' function */}
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
        /* Card selected, show dashboard */
        <div className="p-1 flex flex-row h-full w-full rounded-b-lg bg-stone-200 gap-x-1">
          {/* Left side: card image & progress */}
          <div className="flex flex-col justify-center gap-y-10 h-full w-[70%] rounded-bl-lg bg-white">
            <div className="flex flex-row justify-center">
              <img
                src={currentCard.type === "gold" ? GoldCard : PlatinumCard}
                className=" w-[70%] border-black border rounded-2xl"
              />
            </div>

            {/* Visual progress towards annual fee */}
            <ProgressBar
              percent={progress.percent}
              total={progress.total}
              target={progress.target}
            />
          </div>

          {/* Right side: countdown rewards component */}
          <div className="flex flex-col flex-1 h-full w-[30%] rounded-br-lg bg-stone-500">
            <Countdown setProgress={setProgress} />
          </div>
        </div>
      )}
    </div>
  );
}
