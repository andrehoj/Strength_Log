import { GiCheckMark } from "react-icons/gi";
import { FaWeightHanging } from "react-icons/fa";
import { BiTime } from "react-icons/bi";

export default function TemplateCard() {
  const progressInfo = {
    date: "Monday Nov 12",
    totalWeight: 3000,
    time: "30 mins",
  };

  return (
    <div className="bg-overlay rounded-lg p-5 shadow-sm shadow-black ">
      <div className="flex justify-between gap-5">
        <p className="text-2xl font-bold tracking-tight text-white mb-3">
          {progressInfo.date}
        </p>
        <span class="self-start flex items-center w-min h-min gap-1 bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
          Completed <GiCheckMark />
        </span>
      </div>

      <p className="flex gap-2 font-normal text-gray-400">
        <span className="flex items-center gap-1">
          <FaWeightHanging /> Total Weight: {progressInfo.totalWeight}
        </span>
        {progressInfo.time ? (
          <span className="flex items-center gap-1">
            <BiTime />
            {progressInfo.time}
          </span>
        ) : null}
      </p>
    </div>
  );
}
