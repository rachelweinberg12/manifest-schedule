import { Session } from "@/utils/db";
import { SessionCard } from "./session";
import { add, isBefore, isEqual } from "date-fns";
import { getNumHalfHours } from "@/utils/utils";
import clsx from "clsx";

export function LocationCol(props: {
  sessions: Session[];
  start: Date;
  end: Date;
  isMain: boolean;
}) {
  const { sessions, start, end, isMain } = props;
  const sessionsWithBlanks = insertBlankSessions(sessions, start, end);
  const numHalfHours = getNumHalfHours(start, end);
  return (
    <div className={"px-0.5"}>
      <div
        className={clsx(
          "grid h-full",
          `grid-rows-[repeat(${numHalfHours},minmax(0,1fr))]`
        )}
      >
        {sessionsWithBlanks.map((session) => (
          <SessionCard
            key={session["Start time"]}
            session={session}
            isMain={isMain}
          />
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
        "Host name": [],
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
