import { Session, getLocations } from "@/db/db";
import { LocationCol } from "./location";
import { format } from "date-fns";

export async function DayCol(props: {
  sessions: Session[];
  start: Date;
  end: Date;
}) {
  const { sessions, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  const locations = await getLocations();
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold">{format(start, "EEEE, MMMM d")}</h2>
      <div className="grid grid-cols-6 divide-x divide-gray-100">
        {locations.map((location) => (
          <LocationCol
            key={location.Name}
            name={location.Name}
            sessions={sessions.filter(
              (session) => session["Location name"][0] === location.Name
            )}
            start={start}
            end={end}
          />
        ))}
      </div>
    </div>
  );
}
