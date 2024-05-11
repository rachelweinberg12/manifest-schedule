import { getDays, getLocations, getSessions } from "@/utils/db";
import { Suspense } from "react";
import { uniq } from "lodash";
import { EventSelect } from "./event-select";
import { Event } from "./event";

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
  const eventNames = uniq(days.map((day) => day.Event));
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 gap-10 sm:p-10 p-4">
        <EventSelect eventNames={eventNames} />
        <Event days={days} locations={locations} />
      </main>
    </Suspense>
  );
}
