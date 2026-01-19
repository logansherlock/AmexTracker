// Past rewards component, allows users to go back in time to add or edit reward use
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Reward logos
import Airline from "../assets/airline.png";
import Clear from "../assets/clear_new.png";
import Dining from "../assets/dining.jpg";
import Dunkin from "../assets/dunkin.png";
import Equinox from "../assets/equinox.jpg";
import Lulu from "../assets/lululemon.png";
import Oura from "../assets/oura.png";
import Resy from "../assets/resy.png";
import Saks from "../assets/saks.png";
import Stream from "../assets/stream.jpg";
import Uber from "../assets/uber_new.png";
import UberOne from "../assets/uber_one.png";
import Walmart from "../assets/walmart_plus.jpg";

export default function Rewards() {
  // Holds list of all cards
  const [cards, setCards] = useState<any[]>([]);

  // Holds index of the currently selected card
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  // Holds the currently selected card
  const [currentCard, setCurrentCard] = useState<any | null>(null);

  // Currently selected month in dropdown menu
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth(),
  );

  // Currently selected year in dropdown menu
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  // Used to move between app pages
  const navigate = useNavigate();

  // Functions to handle button clicks to move to other pages
  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");

  /*
    Runs on mount
      - Retrieves card data from local storage
      - Saves info in the state
  */
  useEffect(() => {
    // Retrieve stored cards from localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");

    // Retrieve index of currentCard from localStorage
    const index = localStorage.getItem("currentCard");

    // Set saved info in state
    setCards(storedCards);
    setCurrentCardIndex(index !== null ? Number(index) : null);
    setCurrentCard(index !== null ? storedCards[index] : null);
  }, []);

  // Array of month strings
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Retrieves the date of the most recent card renewal
  const getMostRecentRenewal = (
    year: number,
    month: number,
    renewalMonth: number,
  ) => {
    if (month >= renewalMonth) {
      return { year, month: renewalMonth };
    } else {
      return { year: year - 1, month: renewalMonth };
    }
  };

  // Checks if the first {year, month} pair is before the second
  const isBefore = (y1: number, m1: number, y2: number, m2: number) => {
    return y1 < y2 || (y1 === y2 && m1 < m2);
  };

  // Determines whether a reward use belongs to the same reward period as the selected year and month
  const isSamePeriod = (
    type: string,
    useY: number,
    useM: number,
    selY: number,
    selM: number,
  ) => {
    if (type === "monthly") return useY === selY && useM === selM;
    if (type === "quarterly")
      return useY === selY && Math.floor(useM / 3) === Math.floor(selM / 3);
    if (type === "biannually")
      return useY === selY && Math.floor(useM / 6) === Math.floor(selM / 6);
    if (type === "annually") return useY === selY;
    return false;
  };

  // If no card is currently selected
  if (!currentCard)
    return (
      <div className="p-1 flex flex-row h-full w-full text-2xl rounded-b-lg bg-stone-200 gap-x-1">
        <div className="p-1 h-full w-full flex flex-col items-center bg-white rounded-b-lg justify-center text-blue-900 font-bold gap-y-2">
          No card selected!
          <div className="flex flex-row gap-x-2">
            {/* Button to Add Card Form */}
            <button
              onClick={handleAddCard}
              className="px-2 py-1 text-sm font-bold text-white bg-green-600 hover:border-green-500 border-black"
            >
              Add Card
            </button>

            {/* Button to Card Management */}
            <button
              onClick={handleCardList}
              className="px-2 py-1 text-sm font-bold text-white bg-stone-500 hover:border-stone-400 border-black"
            >
              Manage Cards
            </button>
          </div>
        </div>
      </div>
    );

  // Map reward names to logos
  const rewardLogos: any = {
    airline: Airline,
    clear: Clear,
    dining: Dining,
    dunkin: Dunkin,
    equinox: Equinox,
    lulu: Lulu,
    oura: Oura,
    resy: Resy,
    saks: Saks,
    stream: Stream,
    uber: Uber,
    "uber-one": UberOne,
    walmart: Walmart,
  };

  // Handles toggling a reward logo
  const handleRewardClick = (name: string) => {
    // exit if the current card is null;
    if (!currentCard || currentCardIndex === null) return;

    // String key for selected month and year
    const selectedDateKey = `${selectedYear}-${String(
      selectedMonth + 1,
    ).padStart(2, "0")}`;

    // Retrieve reward data
    const rewardData = currentCard.rewards[name];

    // Check if reward has already been used this month
    const used = rewardData.uses.includes(selectedDateKey);

    // If unused
    if (!used) {
      // Check for conflicts based on reward type
      const conflict = rewardData.uses.some((d: string) => {
        const [y, m] = d.split("-").map(Number);
        return isSamePeriod(
          rewardData.type || "monthly",
          y,
          m - 1,
          selectedYear,
          selectedMonth,
        );
      });
      if (conflict) {
        alert(
          `${name} credit already used in this ${
            rewardData.type || "monthly"
          } period.`,
        );
        return;
      }
      // Mark as used for this current month
      rewardData.uses.push(selectedDateKey);
    } else {
      // Remove the use for this current month
      rewardData.uses = rewardData.uses.filter((d: string) => {
        const [y, m] = d.split("-").map(Number);
        return !(y === selectedYear && m - 1 === selectedMonth);
      });
    }

    // Update the cards array with the modified card
    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = { ...currentCard };

    // Update state and localStorage
    setCards(updatedCards);
    setCurrentCard({ ...currentCard });
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  // Computes the full lifetime total of rewards savings
  function computeLifetimeTotal(card: any): string {
    let total = 0;

    Object.values(card.rewards).forEach((reward: any) => {
      reward.uses.forEach(() => {
        total += reward.credit;
      });
    });

    return total.toFixed(2); // string
  }

  return (
    <div className="p-1 bg-stone-200 w-full h-full">
      <div className="flex flex-col items-center w-full h-full bg-white justify-between py-5 rounded-b-lg">
        <div className="flex flex-col items-center justify-center bg-white w-full">
          <div className="flex flex-row items-center justify-center gap-x-4">
            {/* Month drop down selector */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className=" bg-stone-200 text-blue-900 font-bold rounded px-2 py-1"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
            {/* Year drop down selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className=" bg-stone-200 text-blue-900 font-bold rounded px-2 py-1"
            >
              {/* Year options from 2020 to the current year */}
              {Array.from(
                { length: new Date().getFullYear() - 2020 + 1 },
                (_, i) => 2020 + i,
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid of reward logos */}
        <div className="flex flex-col items-center justify-center bg-white w-full">
          <div className="grid grid-cols-4 gap-y-5 gap-x-5 justify-center">
            {Object.keys(currentCard.rewards).map((name) => {
              const rewardData = currentCard.rewards[name];
              const selectedDateKey = `${selectedYear}-${String(
                selectedMonth + 1,
              ).padStart(2, "0")}`;

              const used = rewardData.uses.includes(selectedDateKey);

              const conflict = rewardData.uses.some((d: string) => {
                const [y, m] = d.split("-").map(Number);
                return isSamePeriod(
                  rewardData.type || "monthly",
                  y,
                  m - 1,
                  selectedYear,
                  selectedMonth,
                );
              });

              return (
                <div key={name} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <img
                      src={rewardLogos[name] || "/default.png"}
                      className={`w-[5rem] rounded-full border border-black hover:scale-110 duration-150 ${
                        used
                          ? // greyscale and low opacity if used
                            "grayscale opacity-50"
                          : // lowers brightness if conflict
                            conflict
                            ? "grayscale brightness-75"
                            : // regular unused case
                              ""
                      }`}
                      title={name}
                      onClick={() => handleRewardClick(name)}
                    />
                    {/* divs added over the base logos */}
                    {/* Red if not used this month, but used within the period */}
                    {conflict && !used && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-60 rounded-full pointer-events-none"></div>
                    )}
                    {/* Green if used this month */}
                    {used && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-60 rounded-full pointer-events-none"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Lifetime savings at bottom of window */}
        <div className="flex items-center justify-center text-xl font-bold text-blue-900 bg-white w-full rounded-b-lg">
          Lifetime Savings ${computeLifetimeTotal(currentCard)}
        </div>
      </div>
    </div>
  );
}
