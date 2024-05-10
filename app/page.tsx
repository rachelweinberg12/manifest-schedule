import { getLocations, getSessions } from "@/utils/db";
import { isAfter, isBefore, isEqual } from "date-fns";
import { DayCol } from "./day";
import { Filter } from "./filter";
import { Suspense } from "react";
import { days } from "@/utils/constants";

export default async function Home() {
  const sessions = await getSessions();
  console.log(sessions);
  days.forEach((day) => {
    day.sessions = sessions.filter(
      (session) =>
        (isBefore(day.start, new Date(session["Start time"])) ||
          isEqual(day.start, new Date(session["Start time"]))) &&
        (isAfter(day.end, new Date(session["End time"])) ||
          isEqual(day.end, new Date(session["End time"])))
    );
  });
  const locations = await getLocations();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 gap-24 sm:p-10 p-4">
        <Filter locations={locations} />
        {days.map((day) => (
          <DayCol
            key={day.start.toISOString()}
            {...day}
            locations={locations}
          />
        ))}
      </main>
    </Suspense>
  );
}
