"use client";
import { Location, Day } from "@/utils/db";
import { LocationCol } from "./location-col";
import { format } from "date-fns";
import clsx from "clsx";
import { useSearchParams } from "next/navigation";
import { useScreenWidth } from "@/utils/hooks";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tooltip } from "./tooltip";
import { SessionText } from "./session-text";

export function DayText(props: { locations: Location[]; day: Day }) {
  const { day, locations } = props;
  const searchParams = useSearchParams();
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.Name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const includedSessions = day.Sessions.filter((session) => {
    return includedLocations.some((location) =>
      session["Location name"].includes(location.Name)
    );
  });
  const sessionsSortedByLocation = includedSessions.sort((a, b) => {
    return (
      (locations.find((loc) => loc.Name === a["Location name"][0])?.Index ??
        0) -
      (locations.find((loc) => loc.Name === b["Location name"][0])?.Index ?? 0)
    );
  });
  const sessionsSortedByTime = sessionsSortedByLocation.sort((a, b) => {
    return (
      new Date(a["Start time"]).getTime() - new Date(b["Start time"]).getTime()
    );
  });
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-5 w-full text-left">
        {format(day.Start, "EEEE, MMMM d")}
      </h2>
      <div className="flex flex-col divide-y divide-gray-300">
        {sessionsSortedByTime.map((session) => (
          <SessionText
            key={session["Start time"]}
            session={session}
            locations={locations.filter((loc) =>
              session["Location name"].includes(loc.Name)
            )}
          />
        ))}
      </div>
    </div>
  );
}
