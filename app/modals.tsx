"use client";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useState } from "react";
import Image from "next/image";
import {
  ArrowTopRightOnSquareIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import { UserSelect } from "./user-select";
import { Guest, Session } from "@/utils/db";
import { UserContext } from "./context";

export function MapModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-rose-400 text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400"
        onClick={() => setOpen(true)}
      >
        <MapIcon className="h-5 w-5 stroke-2" aria-hidden="true" />
      </button>
      <Modal open={open} setOpen={setOpen}>
        <Image
          src="/LighthavenMap.png"
          alt="Map"
          className="w-full h-full"
          width={500}
          height={500}
        />
      </Modal>
    </div>
  );
}

export function CurrentUserModal({
  open,
  close,
  guests,
  rsvp,
}: {
  open: boolean;
  close: () => void;
  guests: Guest[];
  session: Session;
  rsvp: () => void;
}) {
  const { user } = useContext(UserContext);
  return (
    <Modal open={open} setOpen={close} hideClose={!!user}>
      <h1 className="text-2xl font-bold">Who do you want to RSVP as?</h1>
      <div>
        <span className="text-gray-500">RSVPing as</span>
        <UserSelect guests={guests} />
      </div>
      {user && (
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-400 text-base font-medium text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 sm:text-sm"
          onClick={() => {
            rsvp();
            close();
          }}
        >
          RSVP
        </button>
      )}
    </Modal>
  );
}

export function ExportScheduleModal() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        className="relative inline-flex items-center justify-center rounded-md p-1.5 bg-rose-400 text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-400"
        onClick={() => setOpen(true)}
      >
        <ArrowTopRightOnSquareIcon
          className="h-5 w-5 stroke-2"
          aria-hidden="true"
        />
      </button>
      <Modal open={open} setOpen={setOpen}>
        <h1 className="text-2xl font-bold">Export schedule</h1>
        <p className="mt-2">
          Add the schedule to an external calendar using any of the links below.
        </p>
        <div className="flex flex-col gap-4 mt-3 pl-4">
          <a
            href="https://calendar.google.com/calendar/u/0?cid=fo6ng9e5sji2mli6eisk5lctpk9eb8da@import.calendar.google.com"
            className="text-rose-400 hover:underline"
          >
            Google Calendar link
          </a>
          <a
            href="https://calendar.google.com/calendar/ical/fo6ng9e5sji2mli6eisk5lctpk9eb8da%40import.calendar.google.com/public/basic.ics"
            className="text-rose-400 hover:underline"
          >
            iCal link
          </a>
          <a
            href="https://calendar.google.com/calendar/embed?src=fo6ng9e5sji2mli6eisk5lctpk9eb8da%40import.calendar.google.com&ctz=America%2FLos_Angeles"
            className="text-rose-400 hover:underline"
          >
            Public generic link
          </a>
        </div>
      </Modal>
    </div>
  );
}

export function Modal(props: {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  hideClose?: boolean;
}) {
  const { open, setOpen, children, hideClose } = props;
  return (
    <div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-full overflow-y-auto">
            <div className="flex min-h-full w-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative mb-10 transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  {children}
                  {!hideClose && (
                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-rose-400 text-base font-medium text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-400 sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
