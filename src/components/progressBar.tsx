// Progress bar component, visual progress bar showing progress towards annual fee
export default function ProgressBar({
  percent, // percentage of target complete (0-100)
  total, // total reward value accumulated so far
  target, // annual fee
}: {
  percent: number;
  total: number;
  target: number;
}) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[90%] p-4">
        {/* Background bar, grey (represents 100% of target) */}
        <div className="h-6 bg-gray-300 rounded">
          {/* Foreground bar, green (represents progress towards target) */}
          <div
            className="h-full bg-green-600 rounded transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Text below progress bar showing written progress */}
        <div className="text-blue-900 mt-2 text-center select-none">
          You've saved <span className="text-sm font-bold">${total}</span>{" "}
          towards the <span className="text-sm font-bold">${target}</span>{" "}
          annual fee!
        </div>
      </div>
    </div>
  );
}
