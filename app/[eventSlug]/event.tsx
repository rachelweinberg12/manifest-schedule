"use client";
import { Day, Location, Event } from "@/utils/db";
import { Filter } from "./filter";
import { DayCol } from "./day";

export function EventDisplay(props: {
  event: Event;
  days: Day[];
  locations: Location[];
}) {
  const { event, days, locations } = props;
  const daysForEvent = days.filter(
    (day) => day["Event name"][0] === event.Name
  );
  return (
    <div className="flex flex-col items-start w-full">
      <h1 className="text-4xl font-bold text-center mt-5">{event.Name}</h1>
      <p className="text-gray-900 mt-3 mb-5">{event.Description}</p>
      <Filter locations={locations} />
      <div className="flex flex-col gap-24 mt-12">
        {daysForEvent.map((day) => (
          <DayCol key={day.Start} day={day} locations={locations} />
        ))}
      </div>
    </div>
  );
}
