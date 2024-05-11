import { getDays, getLocations, getSessions } from "@/utils/db";
import { DayCol } from "./day";
import { Filter } from "./filter";
import { Suspense } from "react";

export default async function Home() {
  const [days, sessions, locations] = await Promise.all([
    getDays(),
    getSessions(),
    getLocations(),
  ]);
  days.forEach((day) => {
    const dayStartMillis = new Date(day.Start).getTime();
    const dayEndMillis = new Date(day.End).getTime();
    day.Sessions = sessions.filter((s) => {
      const sessionStartMillis = new Date(s["Start time"]).getTime();
      const sessionEndMillis = new Date(s["End time"]).getTime();
      return (
        dayStartMillis <= sessionStartMillis && dayEndMillis >= sessionEndMillis
      );
    });
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 gap-24 sm:p-10 p-4">
        <Filter locations={locations} />
        {days.map((day) => (
          <DayCol key={day.Start} day={day} locations={locations} />
        ))}
      </main>
    </Suspense>
  );
}
