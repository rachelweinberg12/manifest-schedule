"use client";
import { Location } from "@/utils/db";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { useState } from "react";
import clsx from "clsx";

export function Filter(props: { locations: Location[] }) {
  const { locations } = props;
  const searchParams = useSearchParams();
  const locationsFromParams = searchParams.getAll("loc");
  const [includedLocations, setIncludedLocations] = useState(
    locationsFromParams.length === 0
      ? locations.map((loc) => loc.Name)
      : locationsFromParams
  );
  return (
    <div className="flex flex-col gap-4 w-full rounded-md border border-gray-100 p-2">
      <SelectLocationsToShow
        locations={locations}
        searchParams={searchParams}
        includedLocations={includedLocations}
        setIncludedLocations={setIncludedLocations}
      />
    </div>
  );
}

function SelectLocationsToShow(props: {
  locations: Location[];
  searchParams?: ReadonlyURLSearchParams;
  includedLocations: string[];
  setIncludedLocations: (locations: string[]) => void;
}) {
  const { locations, searchParams, includedLocations, setIncludedLocations } =
    props;
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
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
              const start = new Date();
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
              const end = new Date();
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
