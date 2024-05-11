import { getDays, getGuests, getLocations, getSessions } from "@/utils/db";
import { AddSessionForm } from "./add-session-form";

export default async function Home() {
  const sessions = await getSessions();
  const days = await getDays();
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
  const locations = await getLocations();
  const guests = await getGuests();
  return (
    <div className="p-8 max-w-2xl mx-auto pb-24">
      <AddSessionForm
        days={days}
        locations={locations}
        sessions={sessions}
        guests={guests}
      />
    </div>
  );
}
