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

export default function Rewards() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [currentCard, setCurrentCard] = useState<any | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const navigate = useNavigate();
  const handleAddCard = () => navigate("/AddCard");
  const handleCardList = () => navigate("/CardManager");

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    const idx = Number(localStorage.getItem("currentCard"));
    setCards(storedCards);
    setCurrentCardIndex(idx);
    setCurrentCard(storedCards[idx]);
  }, []);

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

  const getMostRecentRenewal = (
    year: number,
    month: number,
    renewalMonth: number
  ) => {
    if (month >= renewalMonth) {
      return { year, month: renewalMonth };
    } else {
      return { year: year - 1, month: renewalMonth };
    }
  };

  const isBefore = (y1: number, m1: number, y2: number, m2: number) => {
    return y1 < y2 || (y1 === y2 && m1 < m2);
  };

  const isSamePeriod = (
    type: string,
    useY: number,
    useM: number,
    selY: number,
    selM: number
  ) => {
    if (type === "monthly") return useY === selY && useM === selM;
    if (type === "quarterly")
      return useY === selY && Math.floor(useM / 3) === Math.floor(selM / 3);
    if (type === "biannually")
      return useY === selY && Math.floor(useM / 6) === Math.floor(selM / 6);
    if (type === "annually") return useY === selY;
    return false;
  };

  if (!currentCard)
    return (
      <div className="p-1 flex flex-row h-full w-full text-2xl rounded-b-lg bg-stone-200 gap-x-1">
        <div className="p-1 h-full w-full flex flex-col items-center bg-white rounded-b-lg justify-center text-blue-900 font-bold gap-y-2">
          No card selected!
          <div className="flex flex-row gap-x-2">
            <button
              onClick={handleAddCard}
              className="px-2 py-1 text-sm font-bold text-white bg-green-600 hover:border-green-500 border-black"
            >
              Add Card
            </button>
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

  const handleRewardClick = (name: string) => {
    if (!currentCard || currentCardIndex === null) return;

    const selDateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}`;
    const rewardData = currentCard.rewards[name];
    const renewalMonthZeroBased = (currentCard.renewalMonth || 1) - 1;
    const recentRenewal = getMostRecentRenewal(
      selectedYear,
      selectedMonth,
      renewalMonthZeroBased
    );

    if (
      isBefore(
        selectedYear,
        selectedMonth,
        recentRenewal.year,
        recentRenewal.month
      )
    ) {
      alert(
        `Cannot add reward use before the renewal month (${monthNames[renewalMonthZeroBased]}).`
      );
      return;
    }

    const used = rewardData.uses.includes(selDateKey);

    if (!used) {
      const conflict = rewardData.uses.some((d: string) => {
        const [y, m] = d.split("-").map(Number);
        return isSamePeriod(
          rewardData.type || "monthly",
          y,
          m - 1,
          selectedYear,
          selectedMonth
        );
      });
      if (conflict) {
        alert(
          `${name} credit already used in this ${
            rewardData.type || "monthly"
          } period.`
        );
        return;
      }
      rewardData.uses.push(selDateKey);
    } else {
      rewardData.uses = rewardData.uses.filter((d: string) => {
        const [y, m] = d.split("-").map(Number);
        return !(y === selectedYear && m - 1 === selectedMonth);
      });
    }

    const updatedCards = [...cards];
    updatedCards[currentCardIndex] = { ...currentCard };
    setCards(updatedCards);
    setCurrentCard({ ...currentCard });
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

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
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className=" bg-stone-200 text-blue-900 font-bold rounded px-2 py-1"
            >
              {Array.from(
                { length: new Date().getFullYear() - 2020 + 1 },
                (_, i) => 2020 + i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center bg-white w-full">
          <div className="grid grid-cols-4 gap-y-5 gap-x-5 justify-center">
            {Object.keys(currentCard.rewards).map((name) => {
              const rewardData = currentCard.rewards[name];
              const selDateKey = `${selectedYear}-${String(
                selectedMonth + 1
              ).padStart(2, "0")}`;

              const used = rewardData.uses.includes(selDateKey);

              const conflict = rewardData.uses.some((d: string) => {
                const [y, m] = d.split("-").map(Number);
                return isSamePeriod(
                  rewardData.type || "monthly",
                  y,
                  m - 1,
                  selectedYear,
                  selectedMonth
                );
              });

              return (
                <div key={name} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <img
                      src={rewardLogos[name] || "/default.png"}
                      className={`w-[5rem] rounded-full border border-black hover:scale-110 duration-150 ${
                        used
                          ? "grayscale opacity-50"
                          : conflict
                          ? "grayscale brightness-75"
                          : ""
                      }`}
                      title={name}
                      onClick={() => handleRewardClick(name)}
                    />
                    {conflict && !used && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-60 rounded-full pointer-events-none"></div>
                    )}
                    {used && (
                      <div className="absolute inset-0 bg-green-500 bg-opacity-60 rounded-full pointer-events-none"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center text-xl font-bold text-blue-900 bg-white w-full rounded-b-lg">
          Lifetime Savings ${computeLifetimeTotal(currentCard)}
        </div>
      </div>
    </div>
  );
}
