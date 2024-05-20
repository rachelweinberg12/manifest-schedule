import {
  getDaysByEvent,
  getGuestsByEvent,
  getBookableLocations,
  getSessionsByEvent,
  getEventByName,
} from "@/utils/db";
import { AddSessionForm } from "./add-session-form";
import { Suspense } from "react";

export default async function AddSession(props: {
  params: { eventSlug: string };
}) {
  const { eventSlug } = props.params;
  const eventName = eventSlug.replace(/-/g, " ");
  const [event, days, sessions, guests, locations] = await Promise.all([
    getEventByName(eventName),
    getDaysByEvent(eventName),
    getSessionsByEvent(eventName),
    getGuestsByEvent(eventName),
    getBookableLocations(),
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
  const filteredLocations = locations.filter(
    (location) =>
      location.Bookable && event["Location names"].includes(location.Name)
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-2xl mx-auto pb-24">
        <AddSessionForm
          eventName={eventName}
          days={days}
          locations={filteredLocations}
          sessions={sessions}
          guests={guests}
        />
      </div>
    </Suspense>
  );
}
