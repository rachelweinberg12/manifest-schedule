import Airtable from "airtable";

type RSVPParams = {
  sessionId: string;
  guestId: string;
  remove?: boolean;
};

export const dynamic = "force-dynamic"; // defaults to auto

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
// @ts-ignore
const base = Airtable.base(process.env.AIRTABLE_BASE_ID);

export async function POST(req: Request) {
  const { sessionId, guestId, remove } = (await req.json()) as RSVPParams;

  if (!remove) {
    await base("RSVPs").create(
      [
        {
          fields: { Session: [sessionId], Guest: [guestId] },
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
  } else {
    await base("RSVPs")
      .select({
        filterByFormula: `AND({SessionId} = "${sessionId}", {GuestId} = "${guestId}")`,
      })
      .eachPage(function page(records: any, fetchNextPage: any) {
        console.log({ records });
        records.forEach(function (record: any) {
          base("RSVPs").destroy([record.getId()], function (err: string) {
            if (err) {
              console.error(err);
              return;
            }
          });
        });
        fetchNextPage();
      });
  }

  return Response.json({ success: true });
}
