import { Session } from "@/utils/db";
import clsx from "clsx";
import { locationColors } from "./class-constants";

export function SessionCard(props: { session: Session; isMain: boolean }) {
  const { session, isMain } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const formattedHostNames = session["Host name"].join(", ");
  const isBlank = session.Title === "";
  return (
    <div
      className={clsx(
        "py-1 my-0.5 px-2 rounded font-roboto",
        `row-span-${numHalfHours}`,
        isMain && !isBlank
          ? `bg-${
              locationColors[session["Location name"][0]]
            }-200 border-2 border-${
              locationColors[session["Location name"][0]]
            }-400`
          : `bg-${locationColors[session["Location name"][0]]}-200`
      )}
    >
      <p className="font-medium text-xs leading-tight line-clamp-2">
        {session.Title}
      </p>
      <p className="text-[10px] leading-tight">{formattedHostNames}</p>
    </div>
  );
}
