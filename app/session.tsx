import { Session } from "@/utils/db";
import clsx from "clsx";
import { locationColors } from "./class-constants";
import { Popover } from "@headlessui/react";
import { PopoverPanel } from "./popover";

export function SessionCard(props: { session: Session; isMain: boolean }) {
  const { session, isMain } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const formattedHostNames = session["Host name"].join(", ");
  const isBlank = session.Title === "";
  return (
    <Popover className="relative">
      <Popover.Button
        className={clsx(
          "py-1 px-1.5 my-0.5 rounded font-roboto w-full flex flex-col items-start justify-start",
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
        <p className="font-medium text-xs leading-tight line-clamp-2 text-left">
          {session.Title}
        </p>
        <p className="text-[10px] leading-tight">{formattedHostNames}</p>
      </Popover.Button>
      <PopoverPanel>
        <span>hello</span>
      </PopoverPanel>
    </Popover>
  );
}
