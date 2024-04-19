import { Session } from "@/db/db";
import { SessionCard } from "./session";

export function DayCol(props: { sessions: Session[]; start: Date; end: Date }) {
  const { sessions, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  return (
    <div>
      <h2 className="text-3xl font-bold">
        {start.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h2>
      <div className="grid grid-rows-20 gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.Title} session={session} />
        ))}
      </div>
    </div>
  );
}
