import clsx from "clsx";
import { ClockIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import { Location, Day, Session } from "@/utils/db";
import { Tooltip } from "./tooltip";
import { DateTime } from "luxon";
import Link from "next/link";

export function SessionCard(props: {
  session: Session;
  location: Location;
  day: Day;
}) {
  const { session, location, day } = props;
  const startTime = new Date(session["Start time"]).getTime();
  const endTime = new Date(session["End time"]).getTime();
  const sessionLength = endTime - startTime;
  const numHalfHours = sessionLength / 1000 / 60 / 30;
  const isBlank = !session.Title;
  const isBookable =
    !!isBlank &&
    !!location.Bookable &&
    startTime > new Date().getTime() &&
    startTime >= new Date(day["Start bookings"]).getTime() &&
    startTime < new Date(day["End bookings"]).getTime();
  if (
    day.Start === "2024-06-09T17:00:00.000Z" &&
    location.Name === "Rat Park"
  ) {
    console.log("SESSION CARD");
    console.log(
      DateTime.fromISO(session["Start time"])
        .setZone("America/Los_Angeles")
        .toFormat("h:mm a"),
      " - ",
      DateTime.fromISO(session["End time"])
        .setZone("America/Los_Angeles")
        .toFormat("h:mm a")
    );
    console.log("isBlank", isBlank);
    console.log("isBookable", isBookable);
  }
  return isBookable ? (
    <BookableSessionCard
      eventName={day["Event name"][0]}
      session={session}
      location={location}
      numHalfHours={numHalfHours}
    />
  ) : (
    <>
      {isBlank ? (
        <BlankSessionCard numHalfHours={numHalfHours} />
      ) : (
        <RealSessionCard
          session={session}
          location={location}
          numHalfHours={numHalfHours}
        />
      )}
    </>
  );
}

export function BookableSessionCard(props: {
  location: Location;
  session: Session;
  numHalfHours: number;
  eventName: string;
}) {
  const { numHalfHours, session, location, eventName } = props;
  const dayParam = DateTime.fromISO(session["Start time"])
    .setZone("America/Los_Angeles")
    .toFormat("MM-dd");
  const timeParam = DateTime.fromISO(session["Start time"])
    .setZone("America/Los_Angeles")
    .toFormat("HH:mm");
  const eventSlug = eventName.replace(" ", "-");
  return (
    <div className={`row-span-${numHalfHours} my-0.5`}>
      <Link
        className="rounded font-roboto h-full w-full bg-gray-100 flex items-center justify-center"
        href={`/${eventSlug}/add-session?location=${location.Name}&time=${timeParam}&day=${dayParam}`}
      >
        <PlusIcon className="h-4 w-4 text-gray-400" />
      </Link>
    </div>
  );
}

function BlankSessionCard(props: { numHalfHours: number }) {
  const { numHalfHours } = props;
  return <div className={`row-span-${numHalfHours} my-0.5`} />;
}

export function RealSessionCard(props: {
  session: Session;
  numHalfHours: number;
  location: Location;
}) {
  const { session, numHalfHours, location } = props;
  const formattedHostNames = session["Host name"]?.join(", ") ?? "No hosts";
  const TooltipContents = () => (
    <>
      <h1 className="text-lg font-bold leading-tight">{session.Title}</h1>
      <p className="text-xs text-gray-500 mb-2 mt-1">{formattedHostNames}</p>
      <p className="text-sm">{session.Description}</p>
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
    </>
  );
  return (
    <Tooltip
      content={<TooltipContents />}
      className={`row-span-${numHalfHours} my-0.5`}
    >
      <div
        className={clsx(
          "py-1 px-1.5 rounded font-roboto h-full",
          `bg-${location.Color}-200 border-2 border-${location.Color}-400`
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
