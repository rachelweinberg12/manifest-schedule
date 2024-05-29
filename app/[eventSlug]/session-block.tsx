import clsx from "clsx";
import { ClockIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";
import { Location, Day, Session, Guest, RSVP } from "@/utils/db";
import { Tooltip } from "./tooltip";
import { DateTime } from "luxon";
import Link from "next/link";
import { useContext, useState } from "react";
import { CurrentUserModal } from "../modals";
import { UserContext } from "../context";

export function SessionBlock(props: {
  session: Session;
  location: Location;
  day: Day;
  guests: Guest[];
  rsvps: RSVP[];
}) {
  const { session, location, day, guests, rsvps } = props;
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
          guests={guests}
          rsvps={rsvps}
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
    <div className={`row-span-${numHalfHours} my-0.5 min-h-10`}>
      <Link
        className="rounded font-roboto h-full w-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        href={`/${eventSlug}/add-session?location=${location.Name}&time=${timeParam}&day=${dayParam}`}
      >
        <PlusIcon className="h-4 w-4 text-gray-400" />
      </Link>
    </div>
  );
}

function BlankSessionCard(props: { numHalfHours: number }) {
  const { numHalfHours } = props;
  return <div className={`row-span-${numHalfHours} my-0.5 min-h-10`} />;
}

async function rsvp(guestId: string, sessionId: string, remove = false) {
  await fetch("/api/add-rsvp", {
    method: "POST",
    body: JSON.stringify({
      guestId, sessionId, remove
    }),
  });
}

export function RealSessionCard(props: {
  session: Session;
  numHalfHours: number;
  location: Location;
  guests: Guest[];
  rsvps: RSVP[];
}) {
  const { session, numHalfHours, location, guests, rsvps } = props;
  const formattedHostNames = session["Host name"]?.join(", ") ?? "No hosts";
  const [expandedRSVPs, setExpandedRSVPs] = useState(false);
  const [optimisticRSVPResponse, setOptimisticRSVPResponse] = useState<boolean| null>(null);
  const { user: currentUser } = useContext(UserContext);
  const rsvpStatus = optimisticRSVPResponse !== null ? optimisticRSVPResponse : rsvps.length > 0
  const handleClick = () => {
    if (currentUser) {
      rsvp(currentUser, session.id, !!rsvpStatus);
      setOptimisticRSVPResponse(!rsvpStatus);
    } else {
      setExpandedRSVPs(true);
    }
  }
  

  const TooltipContents = () => (
    <>
      <h1 className="text-lg font-bold leading-tight">{session.Title}</h1>
      <p className="text-xs text-gray-500 mb-2 mt-1">{formattedHostNames}</p>
      <p className="text-sm whitespace-pre-line">{session.Description}</p>
      <div className="flex justify-between mt-2 gap-4 text-xs text-gray-500">
        <div className="flex gap-1">
          <UserIcon className="h-4 w-4" />
          <span>{session.Capacity} ({session.NumRSVPs + (optimisticRSVPResponse ? 1 : 0)})</span>
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
      className={`row-span-${numHalfHours} my-0.5 overflow-hidden`}
    >
      <CurrentUserModal guests={guests} session={session} close={() => setExpandedRSVPs(false)} open={expandedRSVPs} />
      <div
        className={clsx(
          "py-1 px-1.5 rounded font-roboto h-full min-h-10 cursor-pointer",
          `bg-${location.Color}-200 border-2 border-${location.Color}-400`
        )}
        onClick={handleClick}
      >
        <p
          className={clsx(
            "font-medium text-xs leading-tight text-left",
            numHalfHours > 1 ? "line-clamp-2" : "line-clamp-1"
          )}
        >
          {session.Title}
        </p>
        <p
          className={clsx(
            "text-[10px] leading-tight text-left ",
            numHalfHours > 2
              ? "line-clamp-3"
              : numHalfHours > 1
              ? "line-clamp-2"
              : "line-clamp-1"
          )}
        >
          {formattedHostNames}
        </p>
        {rsvpStatus && (
          <div className="text-[10px] leading-tight text-left">
            RSVP'd
          </div>
        )}
      </div>
    </Tooltip>
  );
}
