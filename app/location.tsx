import { Session } from "@/db/db";
import { SessionCard } from "./session";

export function LocationCol(props: { sessions: Session[]; name: string }) {
  const { sessions, name } = props;
  return (
    <div>
      <h2 className="text-lg">{name}</h2>
      <div className="grid grid-rows-20 gap-4">
        {sessions.map((session) => (
          <SessionCard key={session.Title} session={session} />
        ))}
      </div>
    </div>
  );
}
