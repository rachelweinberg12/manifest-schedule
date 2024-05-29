"use client";
import { Guest, Location } from "@/utils/db";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { DocumentTextIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { UserSelect } from "../user-select";

export function ScheduleSettings(props: {
  locations: Location[];
  guests: Guest[];
}) {
  const { locations, guests } = props;
  const searchParams = useSearchParams();
  const locationsFromParams = searchParams.getAll("loc");
  const [view, setView] = useState(searchParams.get("view") ?? "grid");
  const [includedLocations, setIncludedLocations] = useState(
    locationsFromParams.length === 0
      ? locations.map((loc) => loc.Name)
      : locationsFromParams
  );
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <div className="flex flex-col gap-5 w-full rounded-md border border-gray-100 p-2">
      <div className="flex flex-col gap-2">
        <span className="text-gray-500">Locations</span>
        <SelectLocationsToShow
          locations={locations}
          urlSearchParams={urlSearchParams}
          includedLocations={includedLocations}
          setIncludedLocations={setIncludedLocations}
          pathname={pathname}
          replace={replace}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-500">View</span>
        <SelectView
          urlSearchParams={urlSearchParams}
          view={view}
          setView={setView}
          pathname={pathname}
          replace={replace}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-gray-500">Showing schedule for</span>
        <UserSelect guests={guests} />
      </div>
    </div>
  );
}

function SelectView(props: {
  urlSearchParams: URLSearchParams;
  view: string;
  setView: (view: string) => void;
  pathname: string;
  replace: (url: string) => void;
}) {
  const { urlSearchParams, view, setView, pathname, replace } = props;
  return (
    <div className="flex items-center gap-3">
      <button
        className={clsx(
          "flex gap-1 items-center rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400",
          view === "grid"
            ? "bg-rose-400 text-white"
            : "text-gray-400 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
        )}
        onClick={() => {
          if (view === "grid") return;
          setView("grid");
          urlSearchParams.set("view", "grid");
          replace(`${pathname}?${urlSearchParams.toString()}`);
        }}
      >
        <TableCellsIcon className="h-4 w-4 stroke-2" />
        Grid
      </button>
      <button
        className={clsx(
          "flex gap-1 items-center rounded-md text-sm py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400",
          view === "text"
            ? "bg-rose-400 text-white"
            : "text-gray-400 hover:bg-gray-50 ring-1 ring-inset ring-gray-300"
        )}
        onClick={() => {
          if (view === "text") return;
          setView("text");
          urlSearchParams.set("view", "text");
          replace(`${pathname}?${urlSearchParams.toString()}`);
        }}
      >
        <DocumentTextIcon className="h-4 w-4 stroke-2" />
        Text
      </button>
    </div>
  );
}

function SelectLocationsToShow(props: {
  locations: Location[];
  urlSearchParams: URLSearchParams;
  includedLocations: string[];
  setIncludedLocations: (locations: string[]) => void;
  pathname: string;
  replace: (url: string) => void;
}) {
  const {
    locations,
    urlSearchParams,
    includedLocations,
    setIncludedLocations,
    pathname,
    replace,
  } = props;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
      {locations.map((location) => (
        <div key={location.Name} className="flex items-center">
          <input
            type="checkbox"
            className={clsx(
              "h-4 w-4 rounded border-gray-300 cursor-pointer",
              `text-${location.Color}-400 focus:ring-${location.Color}-400`
            )}
            id={location.Name}
            name={location.Name}
            checked={includedLocations.includes(location.Name)}
            onChange={(event) => {
              if (event.target.checked) {
                urlSearchParams.append("loc", location.Name);
                setIncludedLocations([...includedLocations, location.Name]);
              } else {
                if (
                  includedLocations.length >
                  urlSearchParams.getAll("loc").length
                ) {
                  includedLocations.forEach((loc) => {
                    urlSearchParams.append("loc", loc);
                  });
                }
                urlSearchParams.delete("loc", location.Name);
                setIncludedLocations(
                  includedLocations.filter((loc) => loc !== location.Name)
                );
              }
              replace(`${pathname}?${urlSearchParams.toString()}`);
            }}
          />
          <label
            htmlFor={location.Name}
            className="cursor-pointer pl-2 text-sm text-gray-700"
          >
            {location.Name}
          </label>
        </div>
      ))}
    </div>
  );
}
