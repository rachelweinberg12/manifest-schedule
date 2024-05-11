const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base("appklVAIrAhkGj98d");

export type Session = {
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts: string[];
  "Host name": string[];
  "Host email": string;
  Location: string[];
  "Location name": string[];
  Area: string[];
  Capacity: number[];
};
export async function getSessions() {
  const sessions: Session[] = [];
  await base("Sessions")
    .select({
      view: "Scheduled sessions",
      fields: [
        "Title",
        "Description",
        "Start time",
        "End time",
        "Hosts",
        "Host name",
        "Host email",
        "Location",
        "Location name",
        "Area",
        "Capacity",
      ],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push(record.fields);
      });
      fetchNextPage();
    });
  return sessions;
}

export type Location = {
  Name: string;
  Area: string;
  Capacity: number;
  Type: "main" | "side";
  ID: string;
};
export async function getLocations() {
  const locations: Location[] = [];
  await base("Spaces")
    .select({
      fields: ["Name", "Area", "Capacity", "Type", "ID"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        locations.push(record.fields);
      });
      fetchNextPage();
    });
  return locations;
}

export type Guest = {
  "Full name": string;
  Email: string;
  "Manifest ticket type": string;
  ID: string;
};
export async function getGuests() {
  const guests: Guest[] = [];
  await base("Guest list")
    .select({
      fields: ["Full name", "Email", "Manifest ticket type", "ID"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        guests.push(record.fields);
      });
      fetchNextPage();
    });
  return guests;
}

export type Day = {
  Start: string;
  End: string;
  "Start bookings": string;
  "End bookings": string;
  Event: string;
  Sessions: Session[];
};
export async function getDays() {
  const days: Day[] = [];
  await base("Days")
    .select({
      fields: ["Start", "End", "Start bookings", "End bookings", "Event"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        days.push({ ...record.fields, Sessions: [] });
      });
      fetchNextPage();
    });
  const sortedDays = days.sort((a, b) => {
    return new Date(a.Start).getTime() - new Date(b.Start).getTime();
  });
  return sortedDays;
}
