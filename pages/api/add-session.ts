import { Guest, Session, Location, getSessions } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import { Day } from "@/utils/constants";
import { getDay, getMonth } from "date-fns";

type SessionParams = {
  title: string;
  description: string;
  hosts: Guest[];
  location: Location;
  day: Day;
  startTimeString: string;
  duration: number;
};
type SessionInsert = {
  Title: string;
  Description: string;
  "Start time": string;
  "End time": string;
  Hosts: string[];
  Location: string[];
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    title,
    description,
    hosts,
    location,
    day,
    startTimeString,
    duration,
  } = (await req.body) as SessionParams;
  const [hour, minute] = startTimeString.split(":").map(Number);
  const startTimeStamp = new Date(
    2024,
    getMonth(day.start),
    getDay(day.start),
    hour,
    minute
  );
  const session: SessionInsert = {
    Title: title,
    Description: description,
    Hosts: hosts.map((host) => host.ID),
    Location: [location.ID],
    "Start time": startTimeStamp.toISOString(),
    "End time": new Date(
      startTimeStamp.getTime() + duration * 30 * 60 * 1000
    ).toISOString(),
  };
  const existingSessions = await getSessions();
  const sessionValid = validateSession(session, existingSessions);
  if (sessionValid) {
    const Airtable = require("airtable");
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    const base = Airtable.base("appklVAIrAhkGj98d");
    await base("Sessions").create(
      [
        {
          fields: session,
        },
      ],
      function (err: string, records: any) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record: any) {
          console.log(record.getId());
        });
      }
    );
    return res.status(200).json({ success: true });
  } else {
    console.error("Invalid session");
    return res.status(400).json({ success: false });
  }
}

export const validateSession = (
  session: SessionInsert,
  existingSessions: Session[]
) => {
  const sessionStart = new Date(session["Start time"]);
  const sessionEnd = new Date(session["End time"]);
  const sessionStartsBeforeEnds = sessionStart < sessionEnd;
  const sessionStartsAfterNow = sessionStart > new Date();
  const sessionsHere = existingSessions.filter((s) => {
    return s["Location"][0] === session["Location"][0];
  });
  const concurrentSessions = sessionsHere.filter((s) => {
    const sStart = new Date(s["Start time"]);
    const sEnd = new Date(s["End time"]);
    return (
      (sStart <= sessionStart && sEnd >= sessionStart) ||
      (sStart <= sessionEnd && sEnd >= sessionEnd) ||
      (sStart >= sessionStart && sEnd <= sessionEnd)
    );
  });
  const sessionValid =
    sessionStartsBeforeEnds &&
    sessionStartsAfterNow &&
    concurrentSessions.length === 0 &&
    session["Title"] &&
    session["Location"][0] &&
    session["Hosts"][0];
  return sessionValid;
};
