import { Session, getLocations, getSessions } from "@/utils/db";
import { isAfter, isBefore, isEqual } from "date-fns";
import { days } from "@/utils/constants";
import { AddSessionForm } from "./add-session-form";

export default async function Home() {
  const sessions = await getSessions();
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
    <div className="p-6">
      <AddSessionForm days={days} locations={locations} sessions={sessions} />
    </div>
  );
}
