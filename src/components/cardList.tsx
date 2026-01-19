// Card management page, list of all saved cards
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoldCard from "../assets/gold_card.png";
import PlatinumCard from "../assets/platinum_card.png";
import Delete from "../assets/delete.png";

export default function Management() {
  // Array of all saved cards
  const [cards, setCards] = useState<any[]>([]);

  // Index of currently selected card
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  /*
    Runs on mount
      - Loads saved cards from localStorage
      - Loads currently selected card index
  */
  useEffect(() => {
    // Retrieve stored cards infofrom localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    const index = localStorage.getItem("currentCard");

    // Set saved cards in state
    setCards(storedCards);

    // Set currently selected card (null if none)
    setCurrentCardIndex(index !== null ? Number(index) : null);
  }, []);

  // Used to move between app pages
  const navigate = useNavigate();

  // Handle move to Add Card Form
  const handleAddCard = () => navigate("/AddCard");

  // Selects a card as the currently active card
  const handleSelect = (index: number) => {
    // Stores index to localStorage
    localStorage.setItem("currentCard", index.toString());

    // Navigates to home page
    navigate("/");
  };

  /* 
    Removes a card from the list
      - Asks user for confirmation
      - Updates state and localStorage
      - Clears current card if that was the card removed
  */
  const handleRemove = (index: number) => {
    // Retrieves card from saved card list
    const card = cards[index];

    // Prompts user for conformation
    if (!confirm(`Are you sure you want to remove card ending in ${card.lastFour}?`)) {
      return;
    }

    // Create an array copy
    const updatedCards = [...cards];

    // Remove the card at the given index
    updatedCards.splice(index, 1);

    // Updated card list saved to localStorage
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    // If the current card was removed
    if (currentCardIndex === index) {
      // Set current card to null and remove from localStorage
      setCurrentCardIndex(null);
      localStorage.removeItem("currentCard");
    } 
    // Shift card index if the deleted card is before current in the array
    else if (currentCardIndex !==null && index < currentCardIndex) {
      const newIndex = currentCardIndex - 1;
      setCurrentCardIndex(newIndex);
      localStorage.setItem("currentCard", newIndex.toString());
    }

    // Updates state with the new cards, so the list updates
    setCards(updatedCards);
  };

  // Shows message if no cards are saved
  if (cards.length === 0) {
    return (
      <div className="p-1 bg-stone-200 w-full h-full">
        <div className=" flex flex-col text-2xl bg-white w-full h-full items-center justify-center font-bold text-blue-900 gap-y-2">
          <div>No saved cards yet!</div>

          {/* Button to Add Card Form */}
          <button
            onClick={handleAddCard}
            className="px-2 py-1 text-sm font-bold text-white bg-green-600 hover:border-green-500 border-black"
          >
            Add Card
          </button>
        </div>
      </div>
    );
  }

  // Show saved cards in a
  return (
    <div className="p-1 bg-stone-200 w-full h-full overflow-hidden">
      <div className="flex flex-col bg-white m-0 w-full h-full gap-2 px-12 py-6 rounded-b-lg overflow-y-auto scrollbar-hidden">
        {/* Grid layout for cards */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-8 justify-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-[6px] rounded-xl bg-blue-800 flex flex-row gap-x-1"
            >
              {/* Div for each card, with unique key */}
              <div className="items-center gap-2">
                {/* Card image, varies with card type */}
                <img
                  src={
                    card.type === "gold"
                      ? GoldCard
                      : card.type === "platinum"
                        ? PlatinumCard
                        : ""
                  }
                  className="border border-black rounded-xl"
                ></img>
              </div>

              {/* Buttons and card info */}
              <div className="flex flex-col items-center justify-between ">
                <div className="flex flex-col gap-y-2">
                  {/* Button to set card as current */}
                  <button
                    onClick={() => handleSelect(index)}
                    className="flex text-black bg-green-400/75 border border-black w-7 h-7 text-lg items-center justify-center font-bold p-1 rounded-lg hover:scale-105 duration-150 transition"
                  >
                    →
                  </button>

                  {/* Button to remove card */}
                  <button
                    onClick={() => handleRemove(index)}
                    className="flex items-center justify-center p-1 border border-black w-7 h-7 bg-red-500/75 hover:scale-105 duration-150 text-blue-900 font-bold rounded-lg transition"
                  >
                    <img src={Delete} className="w-3"></img>
                  </button>
                </div>

                {/* Display last 4 digits of the card number */}
                <div className="flex items-center justify-end text-white font-bold text-xs">
                  {`x${card.lastFour || "••••"}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
