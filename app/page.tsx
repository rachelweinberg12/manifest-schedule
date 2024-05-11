import { getDays, getEvents, getLocations, getSessions } from "@/utils/db";
import { Suspense } from "react";
import { EventSelect } from "./event-select";
import { EventDisplay } from "./[eventSlug]/event";
import NavBar from "./nav-bar";

export default async function Home() {
  const [events, days, sessions, locations] = await Promise.all([
    getEvents(),
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
  const eventNames = events.map((event) => event.Name);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventDisplay event={events[0]} days={days} locations={locations} />
    </Suspense>
  );
}
