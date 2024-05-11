import { getDays, getGuests, getLocations, getSessions } from "@/utils/db";
import { AddSessionForm } from "./add-session-form";
import { Suspense } from "react";

export default async function Home() {
  const [days, sessions, locations, guests] = await Promise.all([
    getDays(),
    getSessions(),
    getLocations(),
    getGuests(),
  ]);
  days.forEach((day) => {
    const dayStartMillis = new Date(day.Start).getTime();
    const dayEndMillis = new Date(day.End).getTime();
    day.Sessions = sessions.filter((s) => {
      const sessionStartMillis = new Date(s["Start time"]).getTime();
      const sessionEndMillis = new Date(s["End time"]).getTime();
      return (
        dayStartMillis >= sessionStartMillis && dayEndMillis <= sessionEndMillis
      );
    });
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-2xl mx-auto pb-24">
        <AddSessionForm
          days={days}
          locations={locations}
          sessions={sessions}
          guests={guests}
        />
      </div>
    </Suspense>
  );
}
