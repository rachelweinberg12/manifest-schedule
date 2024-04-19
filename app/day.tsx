import { Session } from "@/db/db";

export function Day(props: { sessions: Session[]; start: Date; end: Date }) {
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
  );
}
