import { Session } from "@/db/db";
export function SessionCard(props: { session: Session }) {
  const { session } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  return (
    <div
      className={`flex items-center gap-4 ${rowSpanVars[numHalfHours]} ${
        locationColors[session["Location name"][0]]
      }`}
    >
      <div className="w-24 h-24 relative"></div>
      <div>
        <h3 className="text-xl font-bold">{session.Title}</h3>
        <p>
          {session["Start time"]} - {session["End time"]}
        </p>
        <p>{session.Description}</p>
      </div>
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
  "Rat Park": "bg-red-500",
  "1E Main": "bg-orange-500",
  Gardens: "bg-yellow-500",
  "2B1": "bg-green-500",
  "B Ground Floor": "bg-teal-500",
  "Old Restaurant": "bg-sky-500",
} as { [key: string]: string };
