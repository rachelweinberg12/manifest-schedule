import { Session } from "@/db/db";
export function Session(props: { session: Session }) {
  const { session } = props;
  const sessionLength =
    new Date(session["End time"]).getTime() -
    new Date(session["Start time"]).getTime();
  const numHalfHours = sessionLength / 1000 / 60 / 30;
}

const rowSpanVars = ["row-span-1", "row-span-2", "row-span-3", "row-span-4"];
