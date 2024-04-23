import { Session } from "@/utils/db";
import clsx from "clsx";
import { locationColors } from "./class-constants";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { Location } from "@/utils/db";
import { Tooltip } from "./tooltip";

export function SessionCard(props: { session: Session; location: Location }) {
  const { session, location } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const formattedHostNames = session["Host name"].join(", ");
  const isBlank = session.Title === "";
  const isMain = location.Type === "main";
  const TooltipContents = () => (
    <>
      <h1 className="text-lg font-bold">{session.Title}</h1>
      <p className="text-xs text-gray-500 mb-2">{formattedHostNames}</p>
      <p className="text-sm">{session.Description}</p>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <div className="flex gap-1">
          <UserIcon className="h-4 w-4" />
          <span>{location.Capacity}</span>
        </div>
        <div className="flex gap-1">
          <ClockIcon className="h-4 w-4" />
          <span>
            {format(new Date(session["Start time"]), "h:mm")} -{" "}
            {format(new Date(session["End time"]), "h:mm")}
          </span>
        </div>
      </div>
    </>
  );
  return (
    <Tooltip
      content={isBlank ? null : <TooltipContents />}
      className={`row-span-${numHalfHours} my-0.5`}
    >
      <div
        className={clsx(
          "py-1 px-1.5 rounded font-roboto h-full",
          isMain && !isBlank
            ? `bg-${
                locationColors[session["Location name"][0]]
              }-200 border-2 border-${
                locationColors[session["Location name"][0]]
              }-400`
            : `bg-${locationColors[session["Location name"][0]]}-200`
        )}
      >
        <p className="font-medium text-xs leading-tight line-clamp-2 text-left">
          {session.Title}
        </p>
        <p className="text-[10px] leading-tight text-left">
          {formattedHostNames}
        </p>
      </div>
    </Tooltip>
  );
}
