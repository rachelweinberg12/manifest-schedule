import { Session } from "./db";

export type Day = {
  start: Date;
  end: Date;
  sessions: Session[];
};

export const days: Day[] = [
  {
    start: new Date("2024-06-07T14:00-07:00"),
    end: new Date("2024-06-07T20:00-07:00"),
    sessions: [],
  },
  {
    start: new Date("2024-06-08T10:00-07:00"),
    end: new Date("2024-06-08T20:00-07:00"),
    sessions: [],
  },
  {
    start: new Date("2024-06-09T10:00-07:00"),
    end: new Date("2024-06-09T22:00-07:00"),
    sessions: [],
  },
];
