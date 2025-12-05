import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface Progress {
  percent: number;
  total: number;
  target: number;
}

interface CountdownProps {
  setProgress: (progress: Progress) => void;
}

export default function Countdown({ setProgress }: CountdownProps) {
  const [card, setCard] = useState<any | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [rewardNames, setRewardNames] = useState<string[]>([]);

  const navigate = useNavigate();
  const handleHistory = () => navigate("/RewardHistory");

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

  function parseYearMonth(key: string) {
    const [y, m] = key.split("-").map(Number);
    return { year: y, month: m - 1 };
  }

  function yearMonthLessThan(a: any, b: any) {
    if (a.year < b.year) return true;
    if (a.year === b.year && a.month < b.month) return true;
    return false;
  }

  function isSamePeriod(
    useKey: string,
    selectedYear: number,
    selectedMonth: number,
    type: string,
    renewalYear: number,
    renewalMonthZeroBased: number
  ) {
    const { year: useYear, month: useMonth } = parseYearMonth(useKey);
    if (
      yearMonthLessThan(
        { year: useYear, month: useMonth },
        { year: renewalYear, month: renewalMonthZeroBased }
      )
    ) {
      return false;
    }
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

  function computeProgress(card: any): Progress {
    const targets: any = { gold: 325, platinum: 895 };
    const target = targets[card.type] || 100;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const renewalMonth = card.renewalMonth || 1;
    const renewalMonthZeroBased = renewalMonth - 1;
    let renewalYear = currentYear;
    if (currentMonth < renewalMonthZeroBased) renewalYear -= 1;

    const renewalKey = `${renewalYear}-${String(renewalMonth).padStart(
      2,
      "0"
    )}`;
    let total = 0;

    Object.values(card.rewards).forEach((reward: any) => {
      reward.uses.forEach((useKey: string) => {
        if (useKey >= renewalKey) total += reward.credit;
      });
    });

    return {
      percent: Math.min((total / target) * 100, 100),
      total,
      target,
    };
  }

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cards") || "[]");
    const idx = Number(localStorage.getItem("currentCard"));
    const selected = c[idx];

    setCards(c);
    setCurrentCardIndex(idx);
    setCard(selected);

    if (selected) {
      setRewardNames(Object.keys(selected.rewards || {}));
      setProgress(computeProgress(selected));
    }
  }, [setProgress]);

  function toggleReward(name: string) {
    if (!card || currentCardIndex === null) return;

    const now = new Date();
    const selectedYear = now.getFullYear();
    const selectedMonth = now.getMonth();

    const renewalMonth = card.renewalMonth || 1;
    const renewalMonthZeroBased = renewalMonth - 1;
    let renewalYear = selectedYear;
    if (selectedMonth < renewalMonthZeroBased) renewalYear -= 1;

    const rewardData = card.rewards[name];
    const type = rewardData.type || "monthly";

    const usedThisPeriod = rewardData.uses.some((useKey: string) =>
      isSamePeriod(
        useKey,
        selectedYear,
        selectedMonth,
        type,
        renewalYear,
        renewalMonthZeroBased
      )
    );

    if (usedThisPeriod) {
      rewardData.uses = rewardData.uses.filter(
        (u: string) =>
          !isSamePeriod(
            u,
            selectedYear,
            selectedMonth,
            type,
            renewalYear,
            renewalMonthZeroBased
          )
      );
    } else {
      const newUseKey = `${selectedYear}-${String(selectedMonth + 1).padStart(
        2,
        "0"
      )}`;
      rewardData.uses.push(newUseKey);
    }

    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = { ...card };
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    setCard({ ...card });
    setProgress(computeProgress(card));
  }

  return (
    <div className="flex flex-col bg-white rounded-br-lg items-center justify-center flex-1 p-3 overflow-auto">
      <div className="grid grid-cols-2 gap-x-5 gap-y-2" id="rewardUser">
        {rewardNames.map((name) => {
          const rewardData = card.rewards[name];
          const now = new Date();
          const selectedYear = now.getFullYear();
          const selectedMonth = now.getMonth();

          const renewalMonth = card.renewalMonth || 1;
          const renewalMonthZeroBased = renewalMonth - 1;
          let renewalYear = selectedYear;
          if (selectedMonth < renewalMonthZeroBased) renewalYear -= 1;

          const type = rewardData.type || "monthly";
          const used = rewardData.uses.some((useKey: string) =>
            isSamePeriod(
              useKey,
              selectedYear,
              selectedMonth,
              type,
              renewalYear,
              renewalMonthZeroBased
            )
          );

          return (
            <div
              key={name}
              className="flex items-center border border-black hover:scale-105 duration-150 rounded-full space-x-2 cursor-pointer"
              onClick={() => toggleReward(name)}
            >
              <img
                src={rewardLogos[name] || "/default.png"}
                title={name.toUpperCase()}
                className={`w-[3.55rem] rounded-full select-none ${
                  used ? "grayscale opacity-40" : ""
                }`}
              />
            </div>
          );
        })}
        <div
          onClick={handleHistory}
          className="p-1 border flex rounded-full bg-gray-200 hover:scale-105 duration-150 items-center justify-center w-[3.55rem] h-[3.55rem] bg-white cursor-pointer"
        >
          <img src={History} className="w-[75%]"></img>
        </div>
      </div>
    </div>
  );
}
