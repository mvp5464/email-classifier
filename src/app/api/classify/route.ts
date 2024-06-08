// import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// const openai = new OpenAI({apiKey:localStorage.getItem("openaiKey") || ""});

export async function POST(req: NextRequest) {
  const { emails, openaiKey } = await req.json();
  const openai = new OpenAI({ apiKey: openaiKey });
  console.log("++++----+++");
  const classifications = await Promise.all(
    emails.map(async (email: { snippet: string }) => {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Classify the following email into categories: important, promotional, social, marketing, or spam.\n\n${email}`,
          },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 100,
      });
      console.log({ response });
      console.log({ responseAfter: response.choices[0] });
      return response.choices[0];
    })
  );

  return NextResponse.json(classifications, { status: 200 });
}
