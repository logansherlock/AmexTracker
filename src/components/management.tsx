import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GoldCard from "../assets/gold_card.png";
import PlatinumCard from "../assets/platinum_card.png";
import Delete from "../assets/delete.png";

export default function Management() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState<number | null>(null);

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    const storedCurrentCard = localStorage.getItem("currentCard");

    setCards(storedCards);
    setCurrentCard(
      storedCurrentCard !== null ? Number(storedCurrentCard) : null
    );
  }, []);

  const navigate = useNavigate();
  const handleAddCard = () => navigate("/AddCard");

  const handleSelect = (index: number) => {
    localStorage.setItem("currentCard", index.toString());
    navigate("/");
  };

  const handleRemove = (index: number) => {
    const card = cards[index];
    if (
      !confirm(
        `Are you sure you want to remove card ending in ${card.lastFour}?`
      )
    ) {
      return;
    }

    const newCards = [...cards];
    newCards.splice(index, 1);

    localStorage.setItem("cards", JSON.stringify(newCards));

    if (currentCard === index) {
      setCurrentCard(null);
      localStorage.removeItem("currentCard");
    }

    setCards(newCards);
  };

  // If no cards
  if (cards.length === 0) {
    return (
      <div className="p-1 bg-stone-200 w-full h-full">
        <div className=" flex flex-col text-2xl bg-white w-full h-full items-center justify-center font-bold text-blue-900 gap-y-2">
          <div>No saved cards yet!</div>
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

  return (
    <div className="p-1 bg-stone-200 w-full h-full">
      <div className="flex flex-col bg-white m-0 p-0 w-full h-full gap-2 px-4 py-4 rounded-b-lg">
        <div className="grid grid-cols-3 gap-y-3 gap-x-5 justify-center">
          {cards.map((card, index) => (
            <div className="p-1 rounded-lg border border-black flex flex-row gap-x-1 bg-stone-400">
              <div
                key={index}
                className="border border-black rounded-md items-center gap-2"
              >
                {/* <button
              className={`rounded-full bg-stone-300 text-blue-900 py-2 font-bold transition w-full ${
                currentCard === index ? "bg-red-400" : ""
                }`}
                >
                
                </button> */}
                <img
                  src={
                    card.type === "gold"
                      ? GoldCard
                      : card.type === "platinum"
                      ? PlatinumCard
                      : ""
                  }
                  className=" rounded-md"
                ></img>
              </div>
              <div className="flex flex-col justify-between ">
                <div className="flex flex-row gap-x-1">
                  <button
                    onClick={() => handleSelect(index)}
                    className="flex text-black bg-green-400 border border-black w-5 h-5 text-sm items-center justify-center font-bold p-1 rounded-md hover:scale-105 duration-150 transition"
                  >
                    →
                  </button>

                  <button
                    onClick={() => handleRemove(index)}
                    className="flex items-center justify-center p-1 border border-black w-5 h-5 bg-red-500 hover:scale-105 duration-150 text-blue-900 font-bold rounded-md transition"
                  >
                    <img src={Delete} className="w-3"></img>
                  </button>
                </div>
                <div className="flex items-center justify-end font-bold text-sm">
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
