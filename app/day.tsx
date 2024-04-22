import { Session, getLocations } from "@/db/db";
import { LocationCol } from "./location";
import { format } from "date-fns";
import clsx from "clsx";

export async function DayCol(props: {
  sessions: Session[];
  start: Date;
  end: Date;
}) {
  const { sessions, start, end } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  const dayGrid = dayGridVars[numHalfHours];
  const locations = await getLocations();
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold">{format(start, "EEEE, MMMM d")}</h2>
      <div className="grid grid-cols-7 divide-x divide-gray-100">
        <TimestampCol start={start} end={end} dayGrid={dayGrid} />
        {locationOrder.map((locationName) => {
          const location = locations.find((loc) => loc.Name === locationName);
          if (!location) {
            return null;
          }
          return (
            <LocationCol
              key={location.Name}
              name={location.Name}
              sessions={sessions.filter(
                (session) => session["Location name"][0] === location.Name
              )}
              start={start}
              end={end}
              dayGrid={dayGrid}
            />
          );
        })}
      </div>
    </div>
  );
}

function TimestampCol(props: { start: Date; end: Date; dayGrid: string }) {
  const { start, end, dayGrid } = props;
  const lengthOfDay = end.getTime() - start.getTime();
  const numHalfHours = lengthOfDay / 1000 / 60 / 30;
  return (
    <div className={clsx("grid gap-1 h-5/6", dayGrid)}>
      {Array.from({ length: numHalfHours }).map((_, i) => (
        <div key={i} className="border-b border-gray-100 text-xs">
          {format(new Date(start.getTime() + i * 30 * 60 * 1000), "h:mm a")}
        </div>
      ))}
    </div>
  );
}

export const locationOrder = [
  "Rat Park",
  "1E Main",
  "Gardens",
  "2B1",
  "B Ground Floor",
  "Old Restaurant",
] as string[];

const dayGridVars = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
  13: "grid-rows-[repeat(13,minmax(0,1fr))]",
  14: "grid-rows-[repeat(14,minmax(0,1fr))]",
  15: "grid-rows-[repeat(15,minmax(0,1fr))]",
  16: "grid-rows-[repeat(16,minmax(0,1fr))]",
  17: "grid-rows-[repeat(17,minmax(0,1fr))]",
  18: "grid-rows-[repeat(18,minmax(0,1fr))]",
  19: "grid-rows-[repeat(19,minmax(0,1fr))]",
  20: "grid-rows-[repeat(20,minmax(0,1fr))]",
  21: "grid-rows-[repeat(21,minmax(0,1fr))]",
  22: "grid-rows-[repeat(22,minmax(0,1fr))]",
} as { [key: number]: string };
