"use client";
import { Disclosure } from "@headlessui/react";
import {
  ArrowTrendingUpIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  PencilIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  name: string;
  href: string;
  icon: any;
};
const navigation = [
  { name: "Manifest", href: "/Manifest", icon: ArrowTrendingUpIcon },
  { name: "Summer Camp", href: "/Summer-Camp", icon: SunIcon },
  { name: "LessOnline", href: "/LessOnline", icon: PencilIcon },
] as NavItem[];

export default function Example() {
  return (
    <Disclosure as="nav" className="bg-rose-400 shadow fixed w-full">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-4 sm:pr-0">
                  <CalendarIcon className="block h-8 w-auto text-white" />
                </div>
                <div className="hidden sm:ml-10 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavBarItem key={item.name} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <SmallNavBarItem key={item.name} item={item} />
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

function NavBarItem(props: { item: NavItem }) {
  const { item } = props;
  const isCurrentPage = item.href === usePathname() && item.href != null;
  return (
    <Link
      key={item.name}
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-700 text-rose-200"
          : "text-white hover:bg-rose-300",
        "group flex gap-1 cursor-pointer items-center rounded-md px-3 py-2 text-sm font-medium"
      )}
    >
      <item.icon className="block h-5 w-auto" />
      {item.name}
    </Link>
  );
}

function SmallNavBarItem(props: { item: NavItem }) {
  const { item } = props;
  const isCurrentPage = item.href === usePathname() && item.href != null;
  return (
    <Disclosure.Button
      key={item.name}
      as="a"
      href={item.href}
      className={clsx(
        isCurrentPage
          ? "bg-rose-700 text-rose-200"
          : "text-white hover:bg-rose-300",
        "flex gap-2 rounded-md px-3 py-2 text-base font-medium"
      )}
    >
      <item.icon className="block h-5 w-auto" />
      {item.name}
    </Disclosure.Button>
  );
}
