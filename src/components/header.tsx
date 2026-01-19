// Header component for navigation and current card display
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hamburger from "../assets/Hamburger_icon_white.png";

export default function Header() {
  // Holds the last four digits of the currently selected card
  const [currentCardLastFour, setCurrentCardLastFour] = useState<{
    lastFour?: string;
  } | null>(null);

  /*
    Runs on mount
      - Retrieves cards from localStorage
      - Stores last four digits of currently selected card, null if no card selected
  */
  useEffect(() => {
    const cards = JSON.parse(localStorage.getItem("cards") || "[]");
    const currentCardIndex = localStorage.getItem("currentCard");

    if (currentCardIndex !== null && cards[currentCardIndex]) {
      setCurrentCardLastFour(cards[currentCardIndex]);
    } else {
      setCurrentCardLastFour(null);
    }
  }, []);

  // Holds boolean of whether or not dropdown should be visible
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Used to move between app pages
  const navigate = useNavigate();

  // Handles dropdown visibility
  const handleMenuClick = () => setDropdownVisible(!dropdownVisible);

  // Functions to handle button clicks to move to other pages
  const handleReturnHome = () => navigate("/");
  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");
  const handlePastRewards = () => navigate("/RewardHistory");

  return (
    <div className="px-2 py-1 flex flex-row h-[10%] bg-blue-800 items-center">
      {/* Show last four digits if available, message if not */}
      <div className="text-white text-xs font-bold">
        {currentCardLastFour
          ? `x${currentCardLastFour.lastFour || ""}`
          : "No card selected!"}
      </div>
      {/* Application name, link to home page */}
      <div
        onClick={handleReturnHome}
        className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-2xl cursor-pointer"
      >
        AMEX TRACKER
      </div>
      {/* Drop down menu, links to other pages */}
      <div className="ml-auto relative">
        {/* Toggles dropdown visibility */}
        <button
          className="flex flex-row gap-x-2 items-center bg-blue-600 border-blue-900 hover:border-blue-500 shadow-md m-1 px-2 py-1 rounded-md text-sm text-white cursor-pointer"
          onClick={handleMenuClick}
        >
          <span className="tracking-tight font-bold">Menu</span>
          <img src={Hamburger} className="h-[20px]" />
        </button>
        {/* If dropdown is visible */}
        {dropdownVisible && (
          <div
            id="dropdownMenu"
            className="absolute right-1 w-32 bg-stone-100 rounded-md shadow-lg z-50"
          >
            {/* Button to Add Card Form */}
            <button
              className="w-full bg-stone-100 text-right px-2 py-1 text-sm font-semibold text-blue-800 rounded-t-md hover:bg-gray-200"
              onClick={handleAddCard}
            >
              Add Card
            </button>

            {/* Button to Card Management */}
            <button
              className="w-full bg-stone-100 text-right px-2 py-1 text-sm font-semibold text-blue-800 hover:bg-gray-200"
              onClick={handleCardList}
            >
              Manage Cards
            </button>

            {/* Button to Past Rewards */}
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
