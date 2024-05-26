"use client";
import { Location, Day, Session } from "@/utils/db";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { SessionText } from "./session-text";

export function DayText(props: {
  locations: Location[];
  day: Day;
  search: string;
}) {
  const { day, locations, search } = props;
  const searchParams = useSearchParams();
  const locParams = searchParams?.getAll("loc");
  const locationsFromParams = locations.filter((loc) =>
    locParams?.includes(loc.Name)
  );
  const includedLocations =
    locationsFromParams.length === 0 ? locations : locationsFromParams;
  const includedSessions = day.Sessions.filter((session) => {
    return (
      includedLocations.some((location) =>
        session["Location name"].includes(location.Name)
      ) && sessionMatchesSearch(session, search)
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
    <div className="flex flex-col max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold w-full text-left">
        {format(day.Start, "EEEE, MMMM d")}
      </h2>
      <div className="flex flex-col divide-y divide-gray-300">
        {sessionsSortedByTime.length ? (
          <>
            {sessionsSortedByTime.map((session) => (
              <SessionText
                key={`${session["Title"]} + ${session["Start time"]}`}
                session={session}
                locations={locations.filter((loc) =>
                  session["Location name"].includes(loc.Name)
                )}
              />
            ))}
          </>
        ) : (
          <p className="text-gray-500 italic text-sm w-full text-left">
            No sessions
          </p>
        )}
      </div>
    </div>
  );
}

function sessionMatchesSearch(session: Session, search: string) {
  return (
    checkStringForSearch(search, session.Title ?? "") ||
    checkStringForSearch(search, session.Description ?? "") ||
    checkStringForSearch(
      search,
      (session["Host name"] ?? []).join(" ") ?? ""
    ) ||
    checkStringForSearch(search, session["Location name"].join(" ") ?? "")
  );
}

function checkStringForSearch(search: string, string: string) {
  return string.toLowerCase().includes(search.toLowerCase());
}
