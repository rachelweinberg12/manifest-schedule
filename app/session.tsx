import { Session } from "@/utils/db";
import clsx from "clsx";
import { locationColors } from "./class-constants";
import { Popover } from "@headlessui/react";
import { ClockIcon, UserIcon } from "@heroicons/react/20/solid";

export function SessionCard(props: { session: Session; isMain: boolean }) {
  const { session, isMain } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const formattedHostNames = session["Host name"].join(", ");
  const isBlank = session.Title === "";
  return (
    <Popover
      className={clsx(
        "py-1 px-1.5 my-0.5 rounded font-roboto w-full flex relative",
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
      <Popover.Button className="w-full h-full focus:outline-0 flex flex-col justify-start">
        <p className="font-medium text-xs leading-tight line-clamp-2 text-left">
          {session.Title}
        </p>
        <p className="text-[10px] leading-tight text-left">
          {formattedHostNames}
        </p>
      </Popover.Button>
      <Popover.Panel className="absolute bottom-5 left-5 rounded-md p-3 shadow-md z-10 bg-white border border-gray-100 font-monteserrat w-80">
        <h1 className="text-lg font-bold">{session.Title}</h1>
        <p className="text-xs">{formattedHostNames}</p>
        <p className="text-sm">{session.Description}</p>
        <div className="flex justify-between mt-2 text-xs">
          <div className="flex gap-1">
            <UserIcon className="h-4 w-4" />
            <span>60</span>
          </div>
          <div className="flex gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>
              {new Date(session["Start time"]).toLocaleTimeString()} -{" "}
              {new Date(session["End time"]).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
}
