import clsx from "clsx";
import { DateTime } from "luxon";
import { Tooltip } from "./tooltip";
import { Session, Location } from "@/utils/db";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";

export function SessionText(props: {
  session: Session;
  locations: Location[];
}) {
  const { session, locations } = props;
  const formattedHostNames = session["Host name"]?.join(", ") ?? "No hosts";
  return (
    <div className={clsx("py-1 px-1.5 rounded h-full min-h-10")}>
      <h1 className="font-bold leading-tight mb-1">{session.Title}</h1>
      <div className="flex items-center gap-1">
        {locations.map((loc) => (
          <LocationTag key={loc.Name} location={loc} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-2 mt-1">{formattedHostNames}</p>
      <p className="text-sm whitespace-pre-line">{session.Description}</p>
      <div className="flex justify-between mt-2 gap-4 text-xs text-gray-500">
        <div className="flex gap-1">
          <UserIcon className="h-4 w-4" />
          <span>{session.Capacity}</span>
        </div>
        <div className="flex gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>
            {DateTime.fromISO(session["Start time"])
              .setZone("America/Los_Angeles")
              .toFormat("h:mm a")}{" "}
            -{" "}
            {DateTime.fromISO(session["End time"])
              .setZone("America/Los_Angeles")
              .toFormat("h:mm a")}
          </span>
        </div>
      </div>
    </div>
  );
}

function LocationTag(props: { location: Location }) {
  const { location } = props;
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full py-0.5 px-2 text-xs font-semibold w-fit",
        `text-${location.Color}-500 bg-${location.Color}-100 border-2 border-${location.Color}-400`
      )}
    >
      {location.Name}
    </div>
  );
}
