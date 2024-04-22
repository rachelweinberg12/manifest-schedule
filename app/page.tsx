import { Session, getSessions } from "@/db/db";
import { isAfter, isBefore, isEqual } from "date-fns";
import { DayCol } from "./day";

type Day = {
  start: Date;
  end: Date;
  sessions: Session[];
};
export default async function Home() {
  const sessions = await getSessions();
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-32">
      {days.map((day) => (
        <DayCol key={day.start.toISOString()} {...day} />
      ))}
    </main>
  );
}
