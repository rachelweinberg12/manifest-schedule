"use client";
import { Day, Location, Event } from "@/utils/db";
import { ScheduleSettings } from "./schedule-settings";
import { DayGrid } from "./day-grid";
import { CalendarIcon, LinkIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { DayText } from "./day-text";

export function EventDisplay(props: {
  event: Event;
  days: Day[];
  locations: Location[];
}) {
  const { event, days, locations } = props;
  const daysForEvent = days.filter(
    (day) => day["Event name"][0] === event.Name
  );
  const locationsForEvent = locations.filter((loc) =>
    event["Location names"].includes(loc.Name)
  );
  const searchParams = useSearchParams();
  const view = searchParams.get("view") ?? "grid";
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="sm:text-4xl text-3xl font-bold mt-5">
        {event.Name} Schedule
      </h1>
      <div className="flex text-gray-500 text-sm mt-1 gap-5 font-medium">
        <span className="flex gap-1 items-center">
          <CalendarIcon className="h-4 w-4 stroke-2" />
          <span>
            {DateTime.fromFormat(event.Start, "yyyy-MM-dd", {
              zone: "America/Los_Angeles",
            }).toFormat("LLL d")}
            {" - "}
            {DateTime.fromFormat(event.End, "yyyy-MM-dd", {
              zone: "America/Los_Angeles",
            }).toFormat("LLL d")}
          </span>
        </span>
        <a
          className="flex gap-1 items-center hover:underline"
          href={`https://${event.Website}`}
        >
          <LinkIcon className="h-4 w-4 stroke-2" />
          <span>{event.Website}</span>
        </a>
      </div>
      <p className="text-gray-900 mt-3 mb-5">{event.Description}</p>
      <ScheduleSettings
        locations={locations.filter((loc) =>
          event["Location names"].includes(loc.Name)
        )}
      />
      <div className="flex flex-col gap-24 mt-12 w-full">
        {daysForEvent.map((day) => (
          <div key={day.Start}>
            {view === "grid" ? (
              <DayGrid day={day} locations={locationsForEvent} />
            ) : (
              <DayText day={day} locations={locationsForEvent} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
