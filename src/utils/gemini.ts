import { Email } from "@/components/pages/GetEmails";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

export default async function GeminiAPI({ email }: { email: Email[] }) {
  const input = email.map((each) => each.snippet);
  //NOTE: Can use subject instead of snippet for better result but then it gives error if there are more inputs
  console.log({ input });
  const genAI = new GoogleGenerativeAI(
    localStorage.getItem("gemini-api-key") as string
  );

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const generationConfig = {
    responseMimeType: "application/json",
    temperature: 0.3,
  };
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig,
    safetySettings,
  });

  const prompt = `Classify the following JSON objects into categories based on their content:
important: Emails that are personal or work-related and require immediate attention.
promotions: Emails related to sales, discounts, and marketing campaigns.
social: Emails from social networks, friends, and family.
marketing: Emails related to marketing, newsletters, and notifications.
spam: Unwanted or unsolicited emails.
  example question: ["Applications invited for MS in Analytics", "Mahesh, follow Ayushi Kashyap - HR Executive  at Tata Consultancy Services"], 
  example answer: [ "marketing", "social"]. 
  \n\n${input}.`;
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = JSON.parse(response.text());
    console.log({ text });
    return text;
  } catch (e) {
    console.log("Error while generative response: ", e);
  }
}
