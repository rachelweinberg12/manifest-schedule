import { Session, Location } from "@/db/db";
import { LocationCol } from "./location";
import { format } from "date-fns";
import clsx from "clsx";

export async function DayCol(props: {
  sessions: Session[];
  locations: Location[];
  start: Date;
  end: Date;
}) {
  const { sessions, locations, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  const dayGrid = dayGridVars[numHalfHours];
  const percentThroughDay = getPercentThroughDay(
    new Date("2024-06-08T11:36-07:00"),
    start,
    end
  );
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold">{format(start, "EEEE, MMMM d")}</h2>
      <div className="grid grid-cols-7 divide-x divide-gray-100 h-5/6">
        <span className="p-1 border-b border-gray-100" />
        {locationOrder.map((locationName) => (
          <span
            key={locationName}
            className="text-sm p-1 border-b border-gray-100"
          >
            {locationName}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x divide-gray-100 relative">
        {percentThroughDay < 100 && percentThroughDay > 0 && (
          <div
            className="bg-transparent w-full absolute border-b border-rose-600 flex items-end"
            style={{ height: `${percentThroughDay}%` }}
          >
            <span className="text-[10px] relative bg-rose-600 rounded-t px-2 text-white top-[1px]">
              now
            </span>
          </div>
        )}
        <TimestampCol start={start} end={end} dayGrid={dayGrid} />
        {locationOrder.map((locationName) => {
          const location = locations.find((loc) => loc.Name === locationName);
          if (!location) {
            return null;
          }
          return (
            <LocationCol
              key={location.Name}
              sessions={sessions.filter(
                (session) => session["Location name"][0] === location.Name
              )}
              start={start}
              end={end}
              dayGrid={dayGrid}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimestampCol(props: { start: Date; end: Date; dayGrid: string }) {
  const { start, end, dayGrid } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  return (
    <div className={clsx("grid h-full", dayGrid)}>
      {Array.from({ length: numHalfHours }).map((_, i) => (
        <div
          key={i}
          className="border-b border-gray-100 text-[10px] p-1 text-right"
        >
          {format(new Date(start.getTime() + i * 30 * 60 * 1000), "h:mm a")}
        </div>
      ))}
    </div>
  );
}

const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const locationOrder = [
  "Rat Park",
  "1E Main",
  "Gardens",
  "2B1",
  "B Ground Floor",
  "Old Restaurant",
] as string[];

const dayGridVars = {
  1: "grid-rows-1",
  2: "grid-rows-2",
  3: "grid-rows-3",
  4: "grid-rows-4",
  5: "grid-rows-5",
  6: "grid-rows-6",
  7: "grid-rows-7",
  8: "grid-rows-8",
  9: "grid-rows-9",
  10: "grid-rows-10",
  11: "grid-rows-11",
  12: "grid-rows-12",
  13: "grid-rows-[repeat(13,minmax(0,1fr))]",
  14: "grid-rows-[repeat(14,minmax(0,1fr))]",
  15: "grid-rows-[repeat(15,minmax(0,1fr))]",
  16: "grid-rows-[repeat(16,minmax(0,1fr))]",
  17: "grid-rows-[repeat(17,minmax(0,1fr))]",
  18: "grid-rows-[repeat(18,minmax(0,1fr))]",
  19: "grid-rows-[repeat(19,minmax(0,1fr))]",
  20: "grid-rows-[repeat(20,minmax(0,1fr))]",
  21: "grid-rows-[repeat(21,minmax(0,1fr))]",
  22: "grid-rows-[repeat(22,minmax(0,1fr))]",
  23: "grid-rows-[repeat(23,minmax(0,1fr))]",
  24: "grid-rows-[repeat(24,minmax(0,1fr))]",
} as { [key: number]: string };
