"use client";
import { Location } from "@/db/db";
import {
  ReadonlyURLSearchParams,
  useSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";

export function Filter(props: { locations: Location[] }) {
  const { locations } = props;
  const paramsString = window.location.search;
  const searchParams = useSearchParams();
  return (
    <SelectLocationsToShow locations={locations} searchParams={searchParams} />
  );
}

// TODO: store in airtable
const MAIN_SESSION_SPACES = ["Rat Park", "1E Main"];
// function SelectSessionsToShow(props: { locations: Location[] }) {
//   const { locations } = props;
//   const sessionCategories = [
//     { name: "All", locations: locations },
//     {
//       name: "Main",
//       locations: locations.filter((loc) =>
//         MAIN_SESSION_SPACES.includes(loc.Name)
//       ),
//     },
//     {
//       name: "Side",
//       locations: locations.filter(
//         (loc) => !MAIN_SESSION_SPACES.includes(loc.Name)
//       ),
//     },
//   ];
//   return (
//     <div>
//     <div className="sm:hidden">
//       <label htmlFor="tabs" className="sr-only">
//         Select a tab
//       </label>
//       {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
//       <select
//         id="tabs"
//         name="tabs"
//         className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
//         defaultValue={sessionCategories.find((tab) => tab.current).name}
//       >
//         {sessionCategories.map((tab) => (
//           <option key={tab.name}>{tab.name}</option>
//         ))}
//       </select>
//     </div>
//     <div className="hidden sm:block">
//       <nav className="flex space-x-4" aria-label="sessionCategories">
//         {sessionCategories.map((tab) => (
//           <a
//             key={tab.name}
//             href={tab.href}
//             className={classNames(
//               tab.current
//                 ? "bg-indigo-100 text-indigo-700"
//                 : "text-gray-500 hover:text-gray-700",
//               "rounded-md px-3 py-2 text-sm font-medium"
//             )}
//             aria-current={tab.current ? "page" : undefined}
//           >
//             {tab.name}
//           </a>
//         ))}
//       </nav>
//     </div>
//   </div>
//   )
// }

function SelectLocationsToShow(props: {
  locations: Location[];
  searchParams: ReadonlyURLSearchParams;
}) {
  const { locations, searchParams } = props;
  const urlSearchParams = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  return (
    <div className="grid grid-cols-3 gap-4">
      {locations.map((location) => (
        <div key={location.Name} className="flex gap-1">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
            id={location.Name}
            name={location.Name}
            checked={
              urlSearchParams.has("loc") &&
              urlSearchParams.getAll("loc").includes(location.Name)
            }
            onChange={(event) => {
              if (event.target.checked) {
                urlSearchParams.append("loc", location.Name);
              } else {
                urlSearchParams.delete("loc", location.Name);
              }
              replace(`${pathname}?${urlSearchParams.toString()}`);
              console.log(urlSearchParams.toString());
            }}
          />
          <label htmlFor={location.Name}>{location.Name}</label>
        </div>
      ))}
    </div>
  );
}
