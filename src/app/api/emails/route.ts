import { authOptions, session } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET() {
  const session: session = (await getServerSession(authOptions)) as session;

  if (!session) {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });
  const gmail = google.gmail({ version: "v1", auth });
  try {
    const response = await gmail.users.messages.list({
      userId: "me",
    });

    const emails = await Promise.all(
      (response.data.messages || []).map(async (msg: any) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: msg.id,
          format: "full",
        });
        return {
          id: email.data.id,
          subject: email.data.payload?.headers?.find(
            (f) => f.name === "Subject"
          )?.value,
          from: email.data.payload?.headers?.find((f) => f.name === "From")
            ?.value,
          snippet: email.data.snippet,
          body:
            email.data.payload?.parts?.[0].body?.data ||
            email.data.payload?.body?.data ||
            "null",
        };
      })
    );
    const value = emails.map((email) => {
      const data = email.body;
      const info = Buffer.from(data, "base64").toString("utf-8");
      const dom = new JSDOM(info);
      email.body = dom.window.document.body.textContent as string;

      return email;
    });

    return NextResponse.json(value, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Error while Fetching Emails" },
      { status: 503 }
    );
  }
}
