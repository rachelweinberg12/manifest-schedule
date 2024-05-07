"use client";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { Input } from "../input";
import { Day } from "@/utils/constants";
import { format } from "date-fns";
import { Session, Location } from "@/utils/db";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/16/solid";

export function AddSessionForm(props: {
  days: Day[];
  sessions: Session[];
  locations: Location[];
}) {
  const { days, sessions, locations } = props;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [day, setDay] = useState(days[0]);
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [hosts, setHosts] = useState("");
  const [location, setLocation] = useState("");
  const availableStartTimes = getAvailableStartTimes(day, sessions, location);
  console.log(availableStartTimes);
  const DURATIONS = [
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label>Session title</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label>Description</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label>Day</label>
        <fieldset>
          <div className="space-y-4">
            {days.map((d) => {
              const formattedDay = format(d.start, "EEEE, MMMM d");
              return (
                <div key={formattedDay} className="flex items-center">
                  <input
                    id={formattedDay}
                    type="radio"
                    checked={d.start === day.start}
                    onChange={() => setDay(d)}
                    className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
                  />
                  <label
                    htmlFor={formattedDay}
                    className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                  >
                    {formattedDay}
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col gap-1 w-72">
        <label>Start Time</label>
        <Listbox value={startTime} onChange={setStartTime}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-rose-400 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-400 sm:text-sm">
              <span className="block truncate">
                {format(startTime, "h:mm a")}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-72 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {availableStartTimes.map((startTime) => {
                  const formattedStartTime = format(startTime, "h:mm a");
                  return (
                    <Listbox.Option
                      key={startTime}
                      value={startTime}
                      // disabled={startTime}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? "bg-rose-100 text-rose-900" : "text-gray-900"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {formattedStartTime}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-rose-400">
                              <CheckIcon className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div className="flex flex-col gap-1">
        <label>Duration</label>
        <fieldset>
          <div className="space-y-4">
            {DURATIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center">
                <input
                  id={label}
                  type="radio"
                  checked={value === duration}
                  onChange={() => setDuration(value)}
                  className="h-4 w-4 border-gray-300 text-rose-400 focus:ring-rose-400"
                />
                <label
                  htmlFor={label}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
      <div className="flex flex-col gap-1">
        <label>Hosts</label>
        <Input value={hosts} onChange={(e) => setHosts(e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label>Location</label>
        <Input value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <button
        type="submit"
        className={clsx(
          "bg-rose-400 text-white font-bold py-2 px-4 rounded",
          "hover:bg-rose-500 active:bg-rose-500"
        )}
      >
        Add Session
      </button>
    </div>
  );
}

function getAvailableStartTimes(
  day: Day,
  sessions: Session[],
  location: string
) {
  const takenStartTimes = sessions
    .filter(
      (session) =>
        session["Location name"] && session["Location name"][0] === location
    )
    .map((session) => new Date(session["Start time"]).getTime());
  const availableStartTimes = [];
  for (
    let i = day.start.getTime();
    i < day.end.getTime();
    i += 30 * 60 * 1000
  ) {
    if (!takenStartTimes.includes(i)) {
      availableStartTimes.push(i);
    }
  }
  return availableStartTimes;
}
