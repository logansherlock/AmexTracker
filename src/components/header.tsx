import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hamburger from "../assets/Hamburger_icon_white.png"

export default function Header() {
  const [currentCard, setCurrentCard] = useState<{ lastFour?: string } | null>(
    null
  );
  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const currentCardIndex = localStorage.getItem("currentCard");

    if (currentCardIndex !== null && cards[currentCardIndex]) {
      setCurrentCard(cards[currentCardIndex]);
    } else {
      setCurrentCard(null);
    }
  }, []);

  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const handleMenuClick = () => setDropdownVisible(!dropdownVisible);
  const handleReturnHome = () => navigate("/");
  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");
  const handlePastRewards = () => navigate("/RewardHistory");

  return (
    <div className="px-2 py-1 flex flex-row h-[10%] bg-blue-800 items-center">
      <div className="text-white text-xs font-bold">
        {currentCard ? `x${currentCard.lastFour || ""}` : "No card selected!"}
      </div>
      <div
        onClick={handleReturnHome}
        className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-2xl cursor-pointer"
      >
        AMEX TRACKER
      </div>
      <div className="ml-auto relative">
        <button
          className="flex flex-row gap-x-2 items-center bg-blue-600 border-blue-900 hover:border-blue-500 shadow-md m-1 px-2 py-1 rounded-md text-sm text-white cursor-pointer"
          onClick={handleMenuClick}
        >
          <span className="tracking-tight font-bold">Menu</span>
          <img src={Hamburger} className="h-[20px]" />
        </button>
        {dropdownVisible && (
          <div
            id="dropdownMenu"
            className="absolute right-1 w-32 bg-stone-100 rounded-md shadow-lg z-50"
          >
            <button
              className="w-full bg-stone-100 text-right px-2 py-1 text-sm font-semibold text-blue-800 rounded-t-md hover:bg-gray-200"
              onClick={handleAddCard}
            >
              Add Card
            </button>
            <button
              className="w-full bg-stone-100 text-right px-2 py-1 text-sm font-semibold text-blue-800 hover:bg-gray-200"
              onClick={handleCardList}
            >
              Manage Cards
            </button>
            <button
              className="w-full bg-stone-100 text-right px-2 py-1 text-sm font-semibold text-blue-800 rounded-b-md hover:bg-gray-200"
              onClick={handlePastRewards}
            >
              Past Rewards
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
