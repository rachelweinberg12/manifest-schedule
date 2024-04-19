import { Session } from "@/db/db";
import { SessionCard } from "./session";
import { LocationCol } from "./location";

export function DayCol(props: { sessions: Session[]; start: Date; end: Date }) {
  const { sessions, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  const locations = Object.fromEntries(
    sessions.map((session) => [session["Location name"][0], [] as Session[]])
  );
  sessions.forEach((session) => {
    locations[session["Location name"][0]].push(session);
  });
  return (
    <div>
      <h2 className="text-3xl font-bold">
        {start.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>
      <div className="grid grid-cols-5">
        {Object.entries(locations).map(([location, sessions]) => (
          <LocationCol key={location} sessions={sessions} name={location} />
        ))}
      </div>
    </div>
  );
}
