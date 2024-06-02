import {
  getDaysByEvent,
  getEventByName,
  getGuests,
  getLocations,
  getRSVPsByUser,
  getSessionsByEvent,
} from "@/utils/db";
import { EventDisplay } from "./event";
import { Suspense } from "react";
import { cookies } from "next/headers";

export default async function EventSchedule(props: {
  params: { eventSlug: string };
}) {
  const { eventSlug } = props.params;
  const eventName = eventSlug.replace(/-/g, " ");
  const cookieStore = cookies();
  const currentUser = cookieStore.get("user")?.value;
  const [event, days, sessions, locations, guests, rsvps] = await Promise.all([
    getEventByName(eventName),
    getDaysByEvent(eventName),
    getSessionsByEvent(eventName),
    getLocations(),
    getGuests(),
    getRSVPsByUser(currentUser),
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
      <EventDisplay
        event={event}
        days={days}
        locations={locations}
        guests={guests}
        rsvps={rsvps}
      />
    </Suspense>
  );
}
