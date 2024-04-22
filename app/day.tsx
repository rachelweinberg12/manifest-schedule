"use client";
import { Session, Location } from "@/db/db";
import { LocationCol } from "./location";
import { format } from "date-fns";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";

export function DayCol(props: {
  sessions: Session[];
  locations: Location[];
  start: Date;
  end: Date;
}) {
  const { sessions, locations, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const dayGridRows = lengthOfDay / 1000 / 60 / 30;
  const percentThroughDay = getPercentThroughDay(
    new Date("2024-06-08T11:36-07:00"),
    start,
    end
  );
  const searchParams = useSearchParams();
  const locParams = searchParams.getAll("loc");
  const includedLocations = locationOrder.filter((loc) =>
    locParams.includes(loc)
  );
  const dayGridCols = includedLocations.length + 1;
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold">{format(start, "EEEE, MMMM d")}</h2>
      <div
        className={clsx(
          "grid divide-x divide-gray-100 h-5/6",
          `grid-cols-${dayGridCols}`
        )}
      >
        <span className="p-1 border-b border-gray-100" />
        {includedLocations.map((locationName) => (
          <span
            key={locationName}
            className="text-sm p-1 border-b border-gray-100"
          >
            {locationName}
          </span>
        ))}
      </div>
      <div
        className={clsx(
          "grid divide-x divide-gray-100 relative",
          `grid-cols-${dayGridCols}`
        )}
      >
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
        <TimestampCol
          start={start}
          end={end}
          dayGridRows={`grid-rows-[repeat(${dayGridRows},minmax(0,1fr))]`}
        />
        {includedLocations.map((locationName) => {
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
              dayGridRows={`grid-rows-[repeat(${dayGridRows},minmax(0,1fr))]`}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimestampCol(props: { start: Date; end: Date; dayGridRows: string }) {
  const { start, end, dayGridRows } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  return (
    <div className={clsx("grid h-full", dayGridRows)}>
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
