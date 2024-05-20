import { getDays, getEvents, getLocations, getSessions } from "@/utils/db";
import { Suspense } from "react";
import { EventDisplay } from "./[eventSlug]/event";
import {
  ArrowRightIcon,
  CalendarIcon,
  LinkIcon,
} from "@heroicons/react/16/solid";
import { DateTime } from "luxon";
import Link from "next/link";

export default async function Home() {
  const events = await getEvents();
  const sortedEvents = events.sort((a, b) => {
    return new Date(a.Start).getTime() - new Date(b.Start).getTime();
  });
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mt-5">Festival Season Schedule</h1>
        <p className="mt-3">
          From May 31st to June 9th 2024, Lighthaven will be hosting a series of
          festivals. Check out the schedule below!
        </p>
        <div className="flex flex-col gap-8 pl-5 mt-10">
          {sortedEvents.map((event) => (
            <div key={event.Name}>
              <h1 className="sm:text-2xl text-xl font-bold">{event.Name}</h1>
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
              <p className="text-gray-900 mt-2">{event.Description}</p>
              <Link
                href={`/${event.Name.replace(" ", "-")}`}
                className="font-semibold text-rose-400 hover:text-rose-500 flex gap-1 items-center text-sm justify-end mt-2"
              >
                View schedule
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Suspense>
  );
}
