import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Option = {
  value: string;
  available: boolean;
};
export function MyListbox(props: {
  options: Option[];
  currValue?: string;
  setCurrValue: (value: string) => void;
  placeholder: string;
}) {
  const { options, currValue, setCurrValue, placeholder } = props;
  return (
    <Listbox value={currValue} onChange={setCurrValue}>
      <div className="relative mt-1">
        <Listbox.Button className="h-12 rounded-md border px-4 shadow-sm transition-colors invalid:border-red-500 invalid:text-red-900 focus:outline-none relative w-full cursor-pointer border-gray-300 focus:ring-2 focus:ring-rose-400 focus:outline-0 focus:border-none bg-white py-2 pl-3 pr-10 text-left">
          {currValue ? (
            <span className="block truncate">{currValue}</span>
          ) : (
            <span className="block truncate text-gray-400">{placeholder}</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-72 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {options.map((option) => {
              return (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-rose-100 text-rose-900" : "text-gray-900"
                    }`
                  }
                  disabled={!option.available}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.value}
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
  );
}
