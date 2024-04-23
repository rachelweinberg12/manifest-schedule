var Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
var base = Airtable.base("appklVAIrAhkGj98d");

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
};
export async function getLocations() {
  const locations: Location[] = [];
  await base("Spaces")
    .select({
      fields: ["Name", "Area", "Capacity", "Type"],
    })
    .eachPage(function page(records: any, fetchNextPage: any) {
      records.forEach(function (record: any) {
        locations.push(record.fields);
      });
      fetchNextPage();
    });
  return locations;
}
