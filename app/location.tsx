import { Session } from "@/db/db";
import { SessionCard } from "./session";
import { add, isBefore, isEqual } from "date-fns";

export function LocationCol(props: {
  sessions: Session[];
  name: string;
  start: Date;
  end: Date;
}) {
  const { sessions, name, start, end } = props;
  const sessionsWithBlanks = insertBlankSessions(sessions, start, end);
  return (
    <div>
      <h2 className="text-lg">{name}</h2>
      <div className="grid grid-rows-[repeat(20,minmax(0,1fr))] gap-1 h-screen">
        {sessionsWithBlanks.map((session) => (
          <SessionCard key={session["Start time"]} session={session} />
        ))}
      </div>
    </div>
  );
}

function insertBlankSessions(
  sessions: Session[],
  dayStart: Date,
  dayEnd: Date
) {
  const sessionsWithBlanks: Session[] = [];
  let currentTime = new Date(dayStart);
  while (isBefore(currentTime, dayEnd)) {
    const sessionNow = sessions.find((session) =>
      isEqual(new Date(session["Start time"]), currentTime)
    );
    if (!!sessionNow) {
      sessionsWithBlanks.push(sessionNow);
      currentTime = new Date(sessionNow["End time"]);
    } else {
      const currentEnd = add(new Date(currentTime), { minutes: 30 });
      sessionsWithBlanks.push({
        "Start time": currentTime.toISOString(),
        "End time": currentEnd.toISOString(),
        Title: "",
        Description: "",
        Hosts: [],
        "Host name": "",
        "Host email": "",
        Location: [],
        "Location name": [""],
        Area: [],
        Capacity: [],
      });
      currentTime = currentEnd;
    }
  }
  return sessionsWithBlanks;
}
