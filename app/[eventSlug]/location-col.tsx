import { Session, Location, Day, Guest, RSVP } from "@/utils/db";
import { SessionBlock } from "./session-block";
import { getNumHalfHours } from "@/utils/utils";
import clsx from "clsx";

export function LocationCol(props: {
  sessions: Session[];
  location: Location;
  day: Day;
  guests: Guest[];
  rsvps: RSVP[];
}) {
  const { sessions, location, day, guests, rsvps } = props;
  const sessionsWithBlanks = insertBlankSessions(
    sessions,
    new Date(day.Start),
    new Date(day.End)
  );
  const numHalfHours = getNumHalfHours(new Date(day.Start), new Date(day.End));
  return (
    <div className={"px-0.5"}>
      <div
        className={clsx(
          "grid h-full",
          `grid-rows-[repeat(${numHalfHours},minmax(0,1fr))]`
        )}
      >
        {sessionsWithBlanks.map((session) => (
          <SessionBlock
            day={day}
            key={session["Start time"]}
            session={session}
            location={location}
            guests={guests}
            rsvps={rsvps.filter((rsvp) => rsvp.Session?.[0] === session.id)}
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
  for (
    let currentTime = dayStart.getTime();
    currentTime < dayEnd.getTime();
    currentTime += 1800000
  ) {
    const sessionNow = sessions.find((session) => {
      const startTime = new Date(session["Start time"]).getTime();
      const endTime = new Date(session["End time"]).getTime();
      return startTime <= currentTime && endTime > currentTime;
    });
    if (!!sessionNow) {
      if (new Date(sessionNow["Start time"]).getTime() === currentTime) {
        sessionsWithBlanks.push(sessionNow);
      } else {
        continue;
      }
    } else {
      sessionsWithBlanks.push({
        "Start time": new Date(currentTime).toISOString(),
        "End time": new Date(currentTime + 1800000).toISOString(),
        Title: "",
        Description: "",
        Hosts: [],
        "Host name": [],
        "Host email": "",
        Location: [],
        "Location name": [""],
        Area: [],
        Capacity: 0,
        NumRSVPs: 0,
        id: "",
      });
    }
  }
  return sessionsWithBlanks;
}
