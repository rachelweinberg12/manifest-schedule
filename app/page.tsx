import { Session, getSessions } from "@/db/db";
import { format, isSameDay } from "date-fns";
import Image from "next/image";

type Day = {
  date: Date;
  sessions: Session[];
};
export default async function Home() {
  const sessions = await getSessions();
  console.log(sessions);
  const days: Day[] = [
    {
      date: new Date("2024-06-07"),
      sessions: [],
    },
    {
      date: new Date("2024-06-08"),
      sessions: [],
    },
    {
      date: new Date("2024-06-09"),
      sessions: [],
    },
  ];
  days.forEach((day) => {
    day.sessions = sessions.filter((session) =>
      isSameDay(new Date(session["Start time"]), day.date)
    );
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {days.map((day) => (
        <div key={format(day.date, "MM/dd/yyyy")}>
          <h2 className="text-3xl font-bold">
            {day.date.toLocaleDateString(undefined, {
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
