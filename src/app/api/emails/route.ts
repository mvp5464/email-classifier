// import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions, session } from "@/lib/auth";
import { google } from "googleapis";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function GET() {
  //@ts-ignore
  const session: session = await getServerSession(authOptions);
  // console.log({ session });

  if (!session) {
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
  // console.log({ session: session.user });
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken as string });
  // console.log({ auth });
  const gmail = google.gmail({ version: "v1", auth });
  // console.log({ gmail });
  console.log("-------------");

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });
  // console.log({ response });
  // console.log("-------------");

  const emails = await Promise.all(
    //change this any
    (response.data.messages || []).map(async (msg: any) => {
      const email = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        // format: "raw",
        format: "full",
      });
      return email.data;
      // return {
      //   author: email.data.payload?.headers?.find((f) => f.name === "From")
      //     ?.value,
      //   emails: email.data.snippet,
      // };
    })
  );

  return NextResponse.json(emails, { status: 200 });
}
