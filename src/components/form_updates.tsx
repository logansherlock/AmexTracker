import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface Reward {
  type: string;
  credit: number;
  uses: any[];
}

interface Card {
  type: string;
  renewalMonth: number;
  lastFour: string;
  rewards: Record<string, Reward>;
}

const rewardTypesByCard: Record<
  string,
  { name: string; type: string; credit: number }[]
> = {
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
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const cardType = formData.get("cardType") as string;
    const renewalMonth = parseInt(formData.get("renewalMonth") as string);
    const lastFour = formData.get("lastFour") as string;

    const rewards: Record<string, Reward> = {};
    (rewardTypesByCard[cardType] || []).forEach((reward) => {
      rewards[reward.name] = {
        type: reward.type,
        credit: reward.credit,
        uses: [],
      };
    });

    const cardData: Card = { type: cardType, renewalMonth, lastFour, rewards };

    const existingCards: Card[] = JSON.parse(
      localStorage.getItem("cards") || "[]"
    );
    existingCards.push(cardData);
    localStorage.setItem("cards", JSON.stringify(existingCards));

    console.log("Card saved!", cardData);

    navigate("/");
  };

  return (
    <div className="bg-red-500 h-screen w-screen">
      <a href="index.html" className="text-blue-800 hover:underline">
        Back Home
      </a>
      <div className="flex flex-col bg-white m-0 p-0 w-screen h-screen rounded-b-2xl">
        <div className="text-blue-900 text-center">Add Card Info</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
          <div className="flex flex-row justify-center gap-x-5">
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                name="cardType"
                value="gold"
                className="hidden peer"
                required
              />
              <div className="w-6 h-6 bg-yellow-400 rounded-full peer-checked:ring-1 peer-checked:ring-white"></div>
              <span className="text-blue-900">Gold</span>
            </label>
            <label className="flex flex-col items-center cursor-pointer">
              <input
                type="radio"
                name="cardType"
                value="platinum"
                className="hidden peer"
                required
              />
              <div className="w-6 h-6 bg-gray-400 rounded-full peer-checked:ring-1 peer-checked:ring-white"></div>
              <span className="text-blue-900">Platinum</span>
            </label>
          </div>

          <div className="flex flex-row justify-center text-blue-900 gap-x-5">
            <select name="renewalMonth" required>
              <option value="">Select month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row justify-center text-blue-900 gap-x-5">
            <label>Last 4:</label>
            <input
              type="text"
              name="lastFour"
              placeholder="xxxx"
              className="bg-stone-200 rounded-sm text-black px-1 w-16 text-center"
              required
            />
          </div>

          <div className="flex flex-row justify-center">
            <button
              type="submit"
              className="bg-green-600 rounded-md text-blue-900 px-4 py-2 w-32"
            >
              Save Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
