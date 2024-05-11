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
    <div className="flex flex-col gap-5 items-start w-full">
      <h1 className="text-3xl font-bold text-center">{eventName}</h1>
      <Filter locations={locations} />
      <div className="flex flex-col gap-24 mt-12">
        {daysForEvent.map((day) => (
          <DayCol key={day.Start} day={day} locations={locations} />
        ))}
      </div>
    </div>
  );
}
