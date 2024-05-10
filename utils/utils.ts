import { Day } from "./constants";
import { Session } from "./db";

export const getPercentThroughDay = (now: Date, start: Date, end: Date) =>
  ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;

export const getNumHalfHours = (start: Date, end: Date) => {
  const lengthOfDay = end.getTime() - start.getTime();
  return lengthOfDay / 1000 / 60 / 30;
};

export const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

export const convertParamDateTime = (date: string, time: string) => {
  const [month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(2024, month - 1, day, hour, minute);
};

export const dateOnDay = (date: Date, day: Day) => {
  return date >= day.start && date <= day.end;
};

export const validateSession = (
  session: Session,
  existingSessions: Session[]
) => {};
