import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GoldCard from "../assets/gold_card.png";
import PlatinumCard from "../assets/platinum_card.png";
import GoldCardSample from "../assets/gold_card_sample.png";
import PlatinumCardSample from "../assets/platinum_card_sample.png";

const rewardTypesByCard: any = {
  platinum: [
    { name: "airline", type: "annually", credit: 200 },
    { name: "clear", type: "annually", credit: 209 },
    { name: "equinox", type: "annually", credit: 300 },
    { name: "lulu", type: "quarterly", credit: 75 },
    { name: "oura", type: "annually", credit: 200 },
    { name: "resy", type: "quarterly", credit: 100 },
    { name: "saks", type: "annually", credit: 100 },
    { name: "stream", type: "monthly", credit: 25 },
    { name: "uber", type: "monthly", credit: 15 },
    { name: "uber-one", type: "monthly", credit: 10 },
    { name: "walmart", type: "monthly", credit: 12.95 },
  ],
  gold: [
    { name: "dining", type: "monthly", credit: 10 },
    { name: "dunkin", type: "monthly", credit: 7 },
    { name: "resy", type: "biannually", credit: 50 },
    { name: "uber", type: "monthly", credit: 10 },
  ],
};

export default function Form() {
  const [cardType, setCardType] = useState("");
  const [renewalMonth, setRenewalMonth] = useState("");
  const [lastFour, setLastFour] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const existingCards = JSON.parse(localStorage.getItem("cards") || "[]");

    const rewards: any = {};
    const rewardsList = rewardTypesByCard[cardType] || [];
    rewardsList.forEach((reward: any) => {
      rewards[reward.name] = {
        type: reward.type,
        credit: reward.credit,
        uses: [],
      };
    });

    const cardData = {
      type: cardType,
      renewalMonth: parseInt(renewalMonth),
      lastFour: lastFour,
      rewards,
    };

    existingCards.push(cardData);
    localStorage.setItem("cards", JSON.stringify(existingCards));

    const newIndex = existingCards.length - 1;
    localStorage.setItem("currentCard", newIndex.toString());

    navigate("/");
  };

  return (
    <div className="p-1 w-full h-full bg-stone-200 ">
      <div className="flex flex-row items-center justify-center bg-white w-full h-full gap-x-12 rounded-b-lg">
        <div className="flex items-center justify-center text-blackborder border-black h-full w-[55%] h-full w-[55%]">
          {cardType === "gold" || cardType === "platinum" ? (
            <div className="flex justify-center items-center w-full shadow-black shadow-2xl rounded-2xl">
              {cardType === "gold" ? (
                <img
                  src={GoldCard}
                  alt={`${cardType} card`}
                  className="w-full h-full border border-black rounded-2xl object-contain"
                />
              ) : cardType === "platinum" ? (
                <img
                  src={PlatinumCard}
                  alt={`${cardType} card`}
                  className="w-full h-full border border-black rounded-2xl object-contain"
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center text-blue-900 w-full h-full text-2xl rounded-2xl  font-semibold">
              Enter card information!
            </div>
          )}
        </div>
        <div className="flex bg-blue-800 text-white border border-black rounded-md flex-col py-3 px-3">
          {/* <div className="font-bold text-center mt-1 mb-2">Add Card Info</div> */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-y-3">
            <div className="flex flex-row justify-between">
              <label className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="cardType"
                  value="gold"
                  className="hidden peer"
                  required
                  onChange={(e) => setCardType(e.target.value)}
                />
                <img
                  src={GoldCardSample}
                  className="w-12 h-8 bg-yellow-400 rounded-md peer-checked:ring-2 peer-checked:ring-black"
                ></img>
                {/* <span className="text-sm font-bold">Gold</span> */}
              </label>

              <label className="flex flex-col items-center cursor-pointer">
                <input
                  type="radio"
                  name="cardType"
                  value="platinum"
                  className="hidden peer"
                  required
                  onChange={(e) => setCardType(e.target.value)}
                />
                <img
                  src={PlatinumCardSample}
                  className="w-12 h-8 bg-gray-300 rounded-md peer-checked:ring-2 peer-checked:ring-black"
                ></img>
                {/* <span className="text-sm font-bold">Platinum</span> */}
              </label>
            </div>
            <div className="flex flex-row justify-center text-blue-900 gap-x-5">
              <select
                className="bg-stone-100 text-sm p-1 w-full font-semibold rounded-md cursor-pointer"
                id="renewalMonth"
                name="renewalMonth"
                required
                value={renewalMonth}
                onChange={(e) => setRenewalMonth(e.target.value)}
              >
                <option value="">Select month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div className="flex flex-row items-center justify-center font-semibold tracking-tighter text-white gap-x-2">
              <label className="text-sm">Last 4:</label>
              <input
                type="number"
                id="lastFour"
                name="lastFour"
                placeholder="xxxx"
                max={9999}
                className="bg-stone-100 text-blue-900 rounded-sm text-black px-1 w-16 text-center no-spinner"
                required
                value={lastFour}
                onChange={(e) => {
                  // Keep only digits
                  let value = e.target.value.replace(/\D/g, "");
                  // Limit to max 4 digits
                  if (value.length > 4) value = value.slice(0, 4);
                  setLastFour(value);
                }}
                onBlur={() => {
                  // Pad with leading zeros to always have 4 digits
                  if (lastFour.length > 0) {
                    setLastFour(lastFour.padStart(4, "0"));
                  }
                }}
              />
            </div>
            <div className="flex flex-row justify-center">
              <button
                type="submit"
                className="bg-green-600 text-sm w-full rounded-md text-white font-bold py-1 hover:border-green-500 border-black cursor-pointer"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
