import { Session } from "@/db/db";
import clsx from "clsx";
export function SessionCard(props: { session: Session }) {
  const { session } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const formattedHostNames = session["Host name"].join(", ");
  return (
    <div
      className={clsx(
        "py-1 my-0.5 px-2 rounded font-roboto",
        rowSpanVars[numHalfHours],
        locationColors[session["Location name"][0]]
      )}
    >
      <p className="font-medium text-xs leading-tight line-clamp-2">
        {session.Title}
      </p>
      <p className="text-[10px] leading-tight">{formattedHostNames}</p>
    </div>
  );
}

const rowSpanVars = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
} as { [key: number]: string };

const locationColors = {
  "Rat Park": "bg-rose-200",
  "1E Main": "bg-orange-200",
  Gardens: "bg-yellow-200",
  "2B1": "bg-green-200",
  "B Ground Floor": "bg-teal-200",
  "Old Restaurant": "bg-sky-200",
} as { [key: string]: string };
