"use client";
import { Location, Day } from "@/utils/db";
import { LocationCol } from "./location";
import { format } from "date-fns";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { getNumHalfHours, getPercentThroughDay } from "@/utils/utils";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { useScreenWidth } from "@/utils/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { DateTime } from "luxon";
import { Tooltip } from "./tooltip";

export function DayCol(props: { locations: Location[]; day: Day }) {
  const { day, locations } = props;
  const searchParams = useSearchParams();
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.Name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const numIncludedLocations = includedLocations.length;
  const screenWidth = useScreenWidth();
  const numDisplayedLocations = getNumDisplayedLocations(
    screenWidth,
    includedLocations.length
  );
  const [displayStartIdx, setDisplayStartIdx] = useState(0);
  useEffect(() => {
    setDisplayStartIdx(
      Math.min(displayStartIdx, numIncludedLocations - numDisplayedLocations)
    );
  }, [numDisplayedLocations]);
  const displayedLocations = includedLocations.slice(
    displayStartIdx,
    displayStartIdx + numDisplayedLocations
  );
  const includePagination = includedLocations.length > numDisplayedLocations;
  const start = new Date(day.Start);
  const end = new Date(day.End);
  return (
    <div className="w-full">
      <div className="flex flex-col mb-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {format(day.Start, "EEEE, MMMM d")}
          </h2>
          {includePagination && (
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs hidden sm:block">
                Showing locations {displayStartIdx + 1}-
                {displayStartIdx + numDisplayedLocations} of{" "}
                {includedLocations.length}
              </span>
              <PaginationButtons
                setDisplayStartIdx={setDisplayStartIdx}
                displayStartIdx={displayStartIdx}
                numDisplayedLocations={numDisplayedLocations}
                numIncludedLocations={includedLocations.length}
              />
            </div>
          )}
        </div>
        {includePagination && (
          <span className="text-gray-500 text-xs sm:hidden text-right mt-1">
            Showing locations {displayStartIdx + 1}-
            {displayStartIdx + numDisplayedLocations} of{" "}
            {includedLocations.length}
          </span>
        )}
      </div>
      <div
        className={clsx(
          "grid divide-x divide-gray-100 h-5/6 w-full",
          `grid-cols-[55px_repeat(${numDisplayedLocations},minmax(0,2fr))]`
        )}
      >
        <span className="p-1 border-b border-gray-100" />
        {displayedLocations.map((loc) => (
          <Tooltip
            key={loc.Name}
            content={<p className="text-sm p-2">{loc.Description}</p>}
            placement="bottom-start"
          >
            <span
              key={loc.Name}
              className="p-1 border-b border-gray-100 flex flex-col justify-between h-full"
            >
              <div>
                <h3 className="font-semibold text-xs sm:text-sm">{loc.Name}</h3>
                <p className="text-xs text-gray-500">
                  {loc.Capacity ? `max ${loc.Capacity}` : <br />}
                </p>
              </div>
              <Image
                key={loc.Name}
                src={loc["Image url"]}
                alt={loc.Name}
                className="w-full mt-1 aspect-[4/3]"
                style={{ maxHeight: 200 }}
                width={500}
                height={500}
              />
            </span>
          </Tooltip>
        ))}
      </div>
      <div
        className={clsx(
          "grid divide-x divide-gray-100 relative",
          `grid-cols-[55px_repeat(${numDisplayedLocations},minmax(0,2fr))]`
        )}
      >
        <NowBar start={start} end={end} />
        <TimestampCol start={start} end={end} />
        {displayedLocations.map((location) => {
          if (!location) {
            return null;
          }
          return (
            <LocationCol
              key={location.Name}
              sessions={day.Sessions.filter((session) =>
                session["Location name"].includes(location.Name)
              )}
              day={day}
              location={location}
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
          {DateTime.fromMillis(start.getTime() + i * 30 * 60 * 1000)
            .setZone("America/Los_Angeles")
            .toFormat("h:mm a")}
        </div>
      ))}
    </div>
  );
}

function NowBar(props: { start: Date; end: Date }) {
  const { start, end } = props;
  const percentThroughDay = getPercentThroughDay(new Date(), start, end);
  if (percentThroughDay < 100 && percentThroughDay > 0) {
    return (
      <div
        className="bg-transparent w-full absolute flex flex-col justify-end border-none z-10"
        style={{ top: `${percentThroughDay}%` }}
      >
        <div className="w-full h-[1.5px] bg-rose-600" />
        <span className="text-[10px] relative bg-rose-600 rounded-b px-2 text-white bottom-[1px] w-fit">
          now
        </span>
      </div>
    );
  } else {
    return null;
  }
}

function PaginationButtons(props: {
  setDisplayStartIdx: (idx: number) => void;
  displayStartIdx: number;
  numDisplayedLocations: number;
  numIncludedLocations: number;
}) {
  const {
    setDisplayStartIdx,
    displayStartIdx,
    numDisplayedLocations,
    numIncludedLocations,
  } = props;
  return (
    <span className="isolate inline-flex rounded-md shadow-sm gap-0.5">
      <button
        type="button"
        disabled={displayStartIdx === 0}
        className="relative inline-flex items-center rounded-l-md bg-rose-400 ring-1 ring-rose-500 px-2 py-2 text-white hover:bg-rose-500 focus:z-10 disabled:cursor-default disabled:opacity-40"
        onClick={() =>
          setDisplayStartIdx(
            Math.max(0, displayStartIdx - numDisplayedLocations)
          )
        }
      >
        <ChevronLeftIcon className="h-4 w-4 stroke-2" aria-hidden="true" />
      </button>
      <button
        type="button"
        disabled={
          displayStartIdx + numDisplayedLocations >= numIncludedLocations
        }
        className="relative -ml-px inline-flex items-center rounded-r-md  bg-rose-400 ring-1 ring-rose-500  px-2 py-2 text-white hover:bg-rose-500 focus:z-10 disabled:cursor-default disabled:opacity-40"
        onClick={() =>
          setDisplayStartIdx(
            Math.min(
              numIncludedLocations - numDisplayedLocations,
              displayStartIdx + numDisplayedLocations
            )
          )
        }
      >
        <ChevronRightIcon className="h-4 w-4 stroke-2" aria-hidden="true" />
      </button>
    </span>
  );
}

const MAX_COLS = {
  xxs: 3,
  xs: 3,
  sm: 5,
  md: 6,
  lg: 7,
  xl: 9,
  "2xl": 12,
};

function getBreakpoint(screenWidth: number) {
  if (screenWidth < 400) {
    return "xxs";
  } else if (screenWidth < 640) {
    return "xs";
  } else if (screenWidth < 768) {
    return "sm";
  } else if (screenWidth < 1024) {
    return "md";
  } else if (screenWidth < 1280) {
    return "lg";
  } else if (screenWidth < 1536) {
    return "xl";
  } else {
    return "2xl";
  }
}

function getNumDisplayedLocations(screenWidth: number, numLocations: number) {
  const breakpoint = getBreakpoint(screenWidth);
  return Math.min(MAX_COLS[breakpoint], numLocations);
}
