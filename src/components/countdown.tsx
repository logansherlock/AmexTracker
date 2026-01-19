// Component that tracks and displays reward usage on home page for the current card
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
import History from "../assets/history.png";

// Type for progress toward annual fee
interface Progress {
  percent: number;
  total: number;
  target: number;
}

// Props: setProgress function to update parent component on home page
interface CountdownProps {
  setProgress: (progress: Progress) => void;
}

export default function Countdown({ setProgress }: CountdownProps) {
  // Current card object
  const [currentCard, setCurrentCard] = useState<any | null>(null);

  // Index of currently selected card
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);

  // Array of all saved cards
  const [cards, setCards] = useState<any[]>([]);

  // Array of card reward names
  const [rewardNames, setRewardNames] = useState<string[]>([]);

  // Used to move between app pages
  const navigate = useNavigate();

  // Handle move to Reward History Page
  const handleHistory = () => navigate("/RewardHistory");

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

  // Convert YYYY-MM string to {year, month} object
  function parseYearMonth(key: string) {
    const [y, m] = key.split("-").map(Number);
    return { year: y, month: m - 1 };
  }

  // Compare two {year, month} objects
  function yearMonthLessThan(a: any, b: any) {
    if (a.year < b.year) return true;
    if (a.year === b.year && a.month < b.month) return true;
    return false;
  }

  /* 
    Check if a reward useKey belongs to the current period
      - useKey: string like '2025-12'
      - selectedYear / selectedMonth: current month being evaluated
      - type: reward type (monthly, quarterly, etc.)
      - renewalYear / renewalMonthZeroBased: card's renewal start
  */
  function isSamePeriod(
    useKey: string,
    selectedYear: number,
    selectedMonth: number,
    type: string,
    renewalYear: number,
    renewalMonth: number,
  ) {
    const { year: useYear, month: useMonth } = parseYearMonth(useKey);

    // Ignore uses before the last renewal
    if (
      yearMonthLessThan(
        { year: useYear, month: useMonth },
        { year: renewalYear, month: renewalMonth },
      )
    ) {
      return false;
    }

    // Different logic for different reward types
    switch (type) {
      case "monthly":
        return useYear === selectedYear && useMonth === selectedMonth;
      case "quarterly":
        return (
          useYear === selectedYear &&
          Math.floor(useMonth / 3) === Math.floor(selectedMonth / 3)
        );
      case "biannually":
        return (
          useYear === selectedYear &&
          Math.floor(useMonth / 6) === Math.floor(selectedMonth / 6)
        );
      case "annually":
        return useYear === selectedYear;
      default:
        return useYear === selectedYear && useMonth === selectedMonth;
    }
  }

  // Compute progress towards card's annual fee
  function computeProgress(card: any): Progress {
    const targets: any = { gold: 325, platinum: 895 };
    const target = targets[card.type] || 100;

    // Current date
    const now = new Date();
    const currentMonth = now.getMonth(); // (0-11)
    const currentYear = now.getFullYear();

    // Card renewal month (1-12 from stored card data)
    const renewalMonth = card.renewalMonth || 1;

    // Convert to zero-based
    const renewalMonthZeroBased = renewalMonth - 1;

    // Determine renewal year
    let renewalYear = currentYear;
    if (currentMonth < renewalMonthZeroBased) renewalYear -= 1;

    // String key for filtering rewards used since last renewal (YYYY-MM)
    const renewalKey = `${renewalYear}-${String(renewalMonth).padStart(
      2,
      "0",
    )}`;

    // Initialize total rewards since last renewal
    let total = 0;

    // Sum all reward credits used since last renewal
    Object.values(card.rewards).forEach((reward: any) => {
      reward.uses.forEach((useKey: string) => {
        if (useKey >= renewalKey) total += reward.credit;
      });
    });

    /*
      Return progress info
        - percent: capped at 100
        - total: total credit used
        - target: annual fee
    */
    return {
      percent: Math.min((total / target) * 100, 100),
      total,
      target,
    };
  }

  /*
    Runs on mount
      - Card list from localStorage
      - Current card from localStorage
  */
  useEffect(() => {
    // Retrieve stored cards from localStorage
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");

    // Retrieve index of currentCard from localStorage
    const index = Number(localStorage.getItem("currentCard"));

    // Retrieve current card object using index
    const card = storedCards[index];

    // Set saved info in state
    setCards(storedCards);
    setCurrentCardIndex(index);
    setCurrentCard(card);

    // If a card is selected, initialize rewards and compute progress
    if (card) {
      setRewardNames(Object.keys(card.rewards || {}));
      setProgress(computeProgress(card));
    }
  }, [setProgress]);

  // Marks a reward available or not for the current period
  function toggleReward(name: string) {
    // If no card is selected
    if (!currentCard || currentCardIndex === null) return;

    // Current date
    const now = new Date();
    const selectedYear = now.getFullYear();
    const selectedMonth = now.getMonth();

    // Card renewal month (1-12 from stored card data)
    const renewalMonth = currentCard.renewalMonth || 1;

    // Convert to zero-based
    const renewalMonthZeroBased = renewalMonth - 1;

    // Determine renewal year
    let renewalYear = selectedYear;
    if (selectedMonth < renewalMonthZeroBased) renewalYear -= 1;

    // Get reward object for the reward name
    const rewardData = currentCard.rewards[name];
    const type = rewardData.type || "monthly"; // default if not specified

    // Check if the reward has been already used this period
    const usedThisPeriod = rewardData.uses.some((useKey: string) =>
      isSamePeriod(
        useKey,
        selectedYear,
        selectedMonth,
        type,
        renewalYear,
        renewalMonthZeroBased,
      ),
    );

    // Toggling use button if already used this period
    if (usedThisPeriod) {
      // Remove the use from this period
      rewardData.uses = rewardData.uses.filter(
        (u: string) =>
          !isSamePeriod(
            u,
            selectedYear,
            selectedMonth,
            type,
            renewalYear,
            renewalMonthZeroBased,
          ),
      );
    } else {
      /* 
        Reward not used this period
        User clicked reward to mark as used
        Construct use data and add to object
       */
      const newUseKey = `${selectedYear}-${String(selectedMonth + 1).padStart(
        2,
        "0",
      )}`;
      rewardData.uses.push(newUseKey);
    }

    // Create an array copy
    const updatedCards = [...cards];

    // Update card info at currently selected index
    updatedCards[currentCardIndex] = { ...currentCard };

    // Save updated card list in state
    setCards(updatedCards);

    // Store updated card list in localStorage
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    // Update card state
    setCurrentCard({ ...currentCard });

    // Update goal progress of current card
    setProgress(computeProgress(currentCard));
  }

  return (
    <div className="flex flex-col bg-white rounded-br-lg items-center justify-center flex-1 p-3 overflow-auto">
      {/* Grid layout of reward logos */}
      <div className="grid grid-cols-2 gap-x-5 gap-y-2" id="rewardUser">
        {rewardNames.map((name) => {
          // Get reward data for object
          const rewardData = currentCard.rewards[name];

          // Current date
          const now = new Date();
          const selectedYear = now.getFullYear();
          const selectedMonth = now.getMonth();

          // Renewal info
          const renewalMonth = currentCard.renewalMonth || 1;
          const renewalMonthZeroBased = renewalMonth - 1;
          let renewalYear = selectedYear;
          if (selectedMonth < renewalMonthZeroBased) renewalYear -= 1;

          // Reward type
          const type = rewardData.type || "monthly";

          // Check if reward has been used in the current period
          const used = rewardData.uses.some((useKey: string) =>
            isSamePeriod(
              useKey,
              selectedYear,
              selectedMonth,
              type,
              renewalYear,
              renewalMonthZeroBased,
            ),
          );

          // Display the reward logo button
          return (
            <div
              key={name}
              className="flex items-center border border-black hover:scale-105 duration-150 rounded-full space-x-2 cursor-pointer"
              onClick={() => toggleReward(name)}
            >
              {/* Reward logo */}
              <img
                src={rewardLogos[name] || "/default.png"}
                title={name.toUpperCase()}
                // Full color if unused, grey-scale if used
                className={`w-[3.55rem] rounded-full select-none ${
                  used ? "grayscale opacity-40" : ""
                }`}
              />
            </div>
          );
        })}
        {/* Button to navigate to reward history page */}
        <button
          onClick={handleHistory}
          className="p-1 border flex rounded-full border border-black bg-gray-200 hover:scale-105 duration-150 items-center justify-center w-[3.55rem] h-[3.55rem] bg-white cursor-pointer"
        >
          {/* History icon */}
          <img src={History} className="w-[75%]"></img>
        </button>
      </div>
    </div>
  );
}
