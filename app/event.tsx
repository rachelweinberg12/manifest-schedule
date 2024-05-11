"use client";
import { Day, Location } from "@/utils/db";
import { Filter } from "./filter";
import { DayCol } from "./day";
import { useSearchParams } from "next/navigation";

export function Event(props: { days: Day[]; locations: Location[] }) {
  const { days, locations } = props;
  const searchParams = useSearchParams();
  const eventName = searchParams.get("event") ?? "Manifest";
  const daysForEvent = days.filter((day) => day.Event === eventName);
  return (
    <div>
      <h1 className="text-3xl font-bold text-center">{eventName}</h1>
      <Filter locations={locations} />
      {daysForEvent.map((day) => (
        <DayCol key={day.Start} day={day} locations={locations} />
      ))}
    </div>
  );
}
