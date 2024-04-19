import { Session, getSessions } from "@/db/db";
import { format, isAfter, isBefore, isEqual, isSameDay } from "date-fns";
import Image from "next/image";

type Day = {
  start: Date;
  end: Date;
  sessions: Session[];
};
export default async function Home() {
  const sessions = await getSessions();
  console.log(sessions);
  const days: Day[] = [
    {
      start: new Date("2024-06-07T10:00-07:00"),
      end: new Date("2024-06-07T20:00-07:00"),
      sessions: [],
    },
    {
      start: new Date("2024-06-08T10:00-07:00"),
      end: new Date("2024-06-08T20:00-07:00"),
      sessions: [],
    },
    {
      start: new Date("2024-06-09T10:00-07:00"),
      end: new Date("2024-06-09T20:00-07:00"),
      sessions: [],
    },
  ];
  days.forEach((day) => {
    day.sessions = sessions.filter(
      (session) =>
        (isBefore(day.start, new Date(session["Start time"])) ||
          isEqual(day.start, new Date(session["Start time"]))) &&
        (isAfter(day.end, new Date(session["End time"])) ||
          isEqual(day.end, new Date(session["End time"])))
    );
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {days.map((day) => (
        <div key={format(day.start, "MM/dd/yyyy")}>
          <h2 className="text-3xl font-bold">
            {day.start.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {day.sessions.map((session) => (
              <div className="flex items-center gap-4" key={session.Title}>
                <div className="w-24 h-24 relative"></div>
                <div>
                  <h3 className="text-xl font-bold">{session.Title}</h3>
                  <p>
                    {session["Start time"]} - {session["End time"]}
                  </p>
                  <p>{session.Description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

function removeTimezone(date: string) {
  return date.split("T")[0];
}
