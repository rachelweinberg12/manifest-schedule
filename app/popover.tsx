import { Popover } from "@headlessui/react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PopoverPanel(props: { children?: React.ReactNode }) {
  const { children } = props;
  return (
    <Popover.Panel className="absolute bottom-5 left-5 z-10 rounded-md rounded-bl-sm bg-gray-50 p-3 shadow-md">
      {children}
    </Popover.Panel>
  );
}
