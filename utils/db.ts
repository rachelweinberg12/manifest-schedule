const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export type Session = {
  id: string;
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts?: string[];
  "Host name"?: string[];
  "Host email"?: string;
  Location: string[];
  "Location name": string[];
  Area: string[];
  Capacity: number;
  NumRSVPs: number;
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
        "NumRSVPs",
      ],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, id: record.id });
      });
      fetchNextPage();
    });

  return sessions;
}

export async function getSessionsByEvent(eventName: string) {
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
        "NumRSVPs",
      ],
      filterByFormula: `{Event name} = "${eventName}"`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        sessions.push({ ...record.fields, id: record.id });
      });
      fetchNextPage();
    });
  return sessions;
}

export type Location = {
  Name: string;
  Area: string;
  "Image url": string;
  Description: string;
  Capacity: number;
  Type: "main" | "side";
  ID: string;
  Color: string;
  Hidden: boolean;
  Bookable: boolean;
  Index: number;
  "Area description"?: string;
};
export async function getLocations() {
  const locations: Location[] = [];
  await base("Spaces")
    .select({
      fields: [
        "Name",
        "Area",
        "Image url",
        "Description",
        "Capacity",
        "Type",
        "ID",
        "Color",
        "Hidden",
        "Bookable",
        "Index",
        "Area description",
      ],
      filterByFormula: `{Hidden} = FALSE()`,
      sort: [{ field: "Index", direction: "asc" }],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        locations.push(record.fields);
      });
      fetchNextPage();
    });
  console.log(locations[0]["Area description"]);
  return locations;
}

export async function getBookableLocations() {
  const locations: Location[] = [];
  await base("Spaces")
    .select({
      fields: [
        "Name",
        "Area",
        "Capacity",
        "Type",
        "ID",
        "Color",
        "Hidden",
        "Bookable",
      ],
      filterByFormula: `AND({Hidden} = FALSE(), {Bookable} = TRUE())`,
      sort: [{ field: "Index", direction: "asc" }],
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
        guests.push({ ...record.fields });
      });
      fetchNextPage();
    });
  return guests;
}

export async function getGuestsByEvent(eventName: string) {
  const guests: Guest[] = [];
  await base("Guest list")
    .select({
      view: eventName,
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
  "Event name": string;
  Event: string[];
  ID: string;
  Sessions: Session[];
};
export async function getDays() {
  const days: Day[] = [];
  await base("Days")
    .select({
      fields: [
        "Start",
        "End",
        "Start bookings",
        "End bookings",
        "Event name",
        "Event",
        "ID",
      ],
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
  console.log("sortedDays", sortedDays);
  return sortedDays;
}

export async function getDaysByEvent(eventName: string) {
  const days: Day[] = [];
  await base("Days")
    .select({
      fields: [
        "Start",
        "End",
        "Start bookings",
        "End bookings",
        "Event name",
        "Event",
        "ID",
      ],
      filterByFormula: `{Event name} = "${eventName}"`,
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

export type Event = {
  Name: string;
  Description: string;
  Website: string;
  Guests: string[];
  Start: string;
  End: string;
  "Location names": string[];
};
export async function getEvents() {
  const events: Event[] = [];
  await base("Events")
    .select({
      fields: ["Name", "Description", "Website", "Guests", "Start", "End"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        if (record.fields.Start && record.fields.End) {
          events.push(record.fields);
        }
      });
      fetchNextPage();
    });
  return events;
}

export async function getEventByName(name: string) {
  const events: Event[] = [];
  await base("Events")
    .select({
      fields: [
        "Name",
        "Description",
        "Website",
        "Guests",
        "Start",
        "End",
        "Location names",
      ],
      filterByFormula: `{Name} = "${name}"`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        events.push(record.fields);
      });
      fetchNextPage();
    });
  return events[0];
}

export type RSVP = {
  Session: [string];
  Guest: [string];
};

export async function getRSVPsByUser(guestId?: string): Promise<RSVP[]> {
  if (!guestId) return [];
  const rsvps: any[] = [];
  await base("RSVPs")
    .select({
      fields: ["Session", "Guest"],
      filterByFormula: `{GuestId} = "${guestId}"`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        rsvps.push(record.fields);
      });
      fetchNextPage();
    });
  return rsvps;
}

export async function getRSVPsBySession(sessionId: string): Promise<RSVP[]> {
  const rsvps: any[] = [];
  await base("RSVPs")
    .select({
      fields: ["Session", "Guest"],
      filterByFormula: `{Session} = "${sessionId}"`,
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        rsvps.push(record.fields);
      });
      fetchNextPage();
    });
  return rsvps;
}
