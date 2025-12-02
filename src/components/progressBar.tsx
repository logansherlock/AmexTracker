export default function ProgressBar({
  percent,
  total,
  target,
}: {
  percent: number;
  total: number;
  target: number;
}) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[90%] p-4">
        <div className="h-6 bg-gray-300 rounded">
          <div
            className="h-full bg-green-600 rounded transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-blue-900 mt-2 text-center select-none">
          You've saved <span className="text-sm font-bold">${total}</span>{" "}
          towards the <span className="text-sm font-bold">${target}</span>{" "}
          annual fee!
        </div>
      </div>
    </div>
  );
}
