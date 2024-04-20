import { Session } from "@/db/db";
import clsx from "clsx";
export function SessionCard(props: { session: Session }) {
  const { session } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  console.log(session);
  return (
    <div
      className={clsx(
        "py-1 px-2 rounded",
        rowSpanVars[numHalfHours],
        locationColors[session["Location name"][0]]
      )}
    >
      <p className="font-semibold text-xs">{session.Title}</p>
      <p className="text-[10px] leading-none">{session["Host name"]}</p>
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
  "Rat Park": "bg-red-300",
  "1E Main": "bg-orange-300",
  Gardens: "bg-yellow-300",
  "2B1": "bg-green-300",
  "B Ground Floor": "bg-teal-300",
  "Old Restaurant": "bg-sky-300",
} as { [key: string]: string };
