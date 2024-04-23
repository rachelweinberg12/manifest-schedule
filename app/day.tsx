"use client";
import { Session, Location } from "@/utils/db";
import { LocationCol } from "./location";
import { format } from "date-fns";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { getNumHalfHours, getPercentThroughDay } from "@/utils/utils";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useSafeLayoutEffect, useScreenSize } from "@/utils/hooks";

export function DayCol(props: {
  sessions: Session[];
  locations: Location[];
  start: Date;
  end: Date;
}) {
  const { sessions, locations, start, end } = props;
  const searchParams = useSearchParams();
  const locParams = searchParams.getAll("loc");
  const includedLocations = locationOrder.filter((loc) =>
    locParams.includes(loc)
  );
  const screenSize = useScreenSize();
  console.log(screenSize);
  return (
    <div className="w-full">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-3xl font-bold">{format(start, "EEEE, MMMM d")}</h2>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-xs">
            Showing locations 1-3 of 6
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md bg-white px-1.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-1.5 py-1.5 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>
      <div
        className={clsx(
          "grid divide-x divide-gray-100 h-5/6",
          `grid-cols-[60px_repeat(${includedLocations.length},minmax(0,2fr))]`
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
          `grid-cols-[60px_repeat(${includedLocations.length},minmax(0,2fr))]`
        )}
      >
        <NowBar start={start} end={end} />
        <TimestampCol start={start} end={end} />
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
            />
          );
        })}
      </div>
    </div>
  );
}

function TimestampCol(props: { start: Date; end: Date }) {
  const { start, end } = props;
  const numHalfHours = getNumHalfHours(start, end);
  return (
    <div
      className={clsx(
        "grid h-full",
        `grid-rows-[repeat(${numHalfHours},minmax(0,1fr))]`
      )}
    >
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

function NowBar(props: { start: Date; end: Date }) {
  const { start, end } = props;
  const percentThroughDay = getPercentThroughDay(
    new Date("2024-06-08T11:36-07:00"),
    start,
    end
  );
  if (percentThroughDay < 100 && percentThroughDay > 0) {
    return (
      <div
        className="bg-transparent w-full absolute border-b border-rose-600 flex items-end"
        style={{ height: `${percentThroughDay}%` }}
      >
        <span className="text-[10px] relative bg-rose-600 rounded-t px-2 text-white top-[1px]">
          now
        </span>
      </div>
    );
  } else {
    return null;
  }
}

export const locationOrder = [
  "Rat Park",
  "1E Main",
  "Gardens",
  "2B1",
  "B Ground Floor",
  "Old Restaurant",
] as string[];
