"use client";
import { Location } from "@/db/db";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { locationOrder } from "./day";
import { useState } from "react";
import clsx from "clsx";
import { locationColors } from "./class-constants";

export function Filter(props: { locations: Location[] }) {
  const { locations } = props;
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col gap-4">
      <SelectLocCategoryToShow
        locations={locations}
        searchParams={searchParams}
      />
      <SelectLocationsToShow
        locations={locations}
        searchParams={searchParams}
      />
    </div>
  );
}

// TODO: store in airtable
const MAIN_SESSION_SPACES = ["Rat Park", "1E Main"];
function SelectLocCategoryToShow(props: {
  locations: Location[];
  searchParams: ReadonlyURLSearchParams;
}) {
  const { locations, searchParams } = props;
  const locCategories = [
    { name: "all", locations: locations },
    {
      name: "main",
      locations: locations.filter((loc) =>
        MAIN_SESSION_SPACES.includes(loc.Name)
      ),
    },
    {
      name: "side",
      locations: locations.filter(
        (loc) => !MAIN_SESSION_SPACES.includes(loc.Name)
      ),
    },
  ];
  const currentLocCategory = locCategories.find(
    (category) => category.name === props.searchParams.get("locCategory")
  );
  const pathname = usePathname();
  const { replace } = useRouter();
  const urlSearchParams = new URLSearchParams(searchParams);
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500"
          defaultValue={locCategories[0].name}
        >
          {locCategories.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="locCategories">
          {locCategories.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                urlSearchParams.set("locCategory", tab.name);
                replace(`${pathname}?${urlSearchParams.toString()}`);
              }}
              className={clsx(
                currentLocCategory === tab
                  ? "bg-gray-100 text-gray-700"
                  : "text-gray-500 hover:text-gray-700",
                "rounded-md px-3 py-2 text-sm font-medium"
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function SelectLocationsToShow(props: {
  locations: Location[];
  searchParams: ReadonlyURLSearchParams;
}) {
  const { locations, searchParams } = props;
  const urlSearchParams = new URLSearchParams(searchParams);
  const [includedLocations, setIncludedLocations] = useState(
    urlSearchParams.getAll("loc")
  );
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <div className="grid grid-cols-3 gap-4">
      {locationOrder.map((location) => (
        <div key={location} className="flex items-center">
          <input
            type="checkbox"
            className={clsx(
              "h-4 w-4 rounded border-gray-300 cursor-pointer",
              `text-${locationColors[location]}-400 focus:ring-${locationColors[location]}-400`
            )}
            id={location}
            name={location}
            checked={includedLocations.includes(location)}
            onChange={(event) => {
              const start = new Date();
              if (event.target.checked) {
                urlSearchParams.append("loc", location);
                setIncludedLocations([...includedLocations, location]);
              } else {
                urlSearchParams.delete("loc", location);
                setIncludedLocations(
                  includedLocations.filter((loc) => loc !== location)
                );
              }
              replace(`${pathname}?${urlSearchParams.toString()}`);
              const end = new Date();
              console.log(
                "Time to update URL:",
                end.getTime() - start.getTime()
              );
            }}
          />
          <label htmlFor={location} className="cursor-pointer pl-2">
            {location}
          </label>
        </div>
      ))}
    </div>
  );
}
