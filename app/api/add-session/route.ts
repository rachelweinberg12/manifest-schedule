import { Guest, Session, Location, getSessions } from "@/utils/db";
import { Day } from "@/utils/db";
import { DateTime } from "luxon";

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
  Event: string[];
  Day: string[];
  "Attendee scheduled": boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(req: Request) {
  const {
    title,
    description,
    hosts,
    location,
    day,
    startTimeString,
    duration,
  } = (await req.json()) as SessionParams;
  const dayStartDT = DateTime.fromJSDate(new Date(day.Start));
  const dayISOFormatted = dayStartDT.toFormat("yyyy-MM-dd");
  console.log(2);
  const [rawHour, rawMinute, ampm] = startTimeString.split(/[: ]/);
  const hourNum = parseInt(rawHour);
  const hour24Num = ampm === "PM" && hourNum !== 12 ? hourNum + 12 : hourNum;
  const hourStr = hour24Num < 10 ? `0${hour24Num}` : hour24Num.toString();
  const minuteNum = parseInt(rawMinute);
  const minuteStr = minuteNum < 10 ? `0${minuteNum}` : rawMinute;
  console.log(
    "formatted",
    `${dayISOFormatted}T${hourStr}:${minuteStr}:00-07:00`
  );
  const startTimeStamp = new Date(
    `${dayISOFormatted}T${hourStr}:${minuteStr}:00-07:00`
  );
  console.log(3);
  const session: SessionInsert = {
    Title: title,
    Description: description,
    Hosts: hosts.map((host) => host.ID),
    Location: [location.ID],
    "Start time": startTimeStamp.toISOString(),
    "End time": new Date(
      startTimeStamp.getTime() + duration * 60 * 1000
    ).toISOString(),
    Event: [day["Event"][0]],
    Day: [day.ID],
    "Attendee scheduled": true,
  };
  const existingSessions = await getSessions();
  const sessionValid = validateSession(session, existingSessions);

  if (sessionValid) {
    const Airtable = require("airtable");
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: process.env.AIRTABLE_API_KEY,
    });
    const base = Airtable.base(process.env.AIRTABLE_BASE_ID);
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
    console.log(5);
    return Response.json({ success: true });
    // return res.status(200).json({ success: true });
  } else {
    // console.error("Invalid session");
    return Response.error();
    // return res.status(400).json({ success: false });
  }
}

const validateSession = (
  session: SessionInsert,
  existingSessions: Session[]
) => {
  console.log("session to add", session);
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
      (sStart < sessionStart && sEnd > sessionStart) ||
      (sStart < sessionEnd && sEnd > sessionEnd) ||
      (sStart > sessionStart && sEnd < sessionEnd)
    );
  });

  const sessionValid =
    sessionStartsBeforeEnds &&
    sessionStartsAfterNow &&
    concurrentSessions.length === 0 &&
    session["Title"] &&
    session["Location"][0] &&
    session["Hosts"][0];
  console.log("valid", sessionValid);
  return sessionValid;
};
