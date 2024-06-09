"use client";
import { SetStateAction, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "../icons/Loader";
import GeminiAPI from "@/utils/gemini";
import EmailPopup from "../EmailPopup";
import toast from "react-hot-toast";

export interface classifications {
  [key: number]: string;
}

export interface Email {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  body: string;
}
export default function GetEmails() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [myEmail, setMyEmail] = useState<Email | null>(null);
  const [myClassification, setMyClassification] = useState<string>("");
  const [classifications, setClassifications] = useState<classifications[]>([]);
  const [classifyEmail, setClassifyEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [fetchingCategories, setFetchingCategories] = useState<boolean>(false);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emails");
      const data = await res.json();
      setEmails(data);
      setLoading(false);
      toast.success("Email Fetched successfully");
    } catch (e) {
      setLoading(false);
      toast.success("Error while fetching emails");
      console.log({ e });
    }
  };

  useEffect(() => {
    if (session) {
      fetchEmails();
    }
  }, [session]);

  if (status === "loading") {
    return <Loader info={"Getting Session Info"} />;
  }

  if (loading) {
    return <Loader info={"Fetching Emails"} />;
  }

  if (!emails.length) {
    return (
      <div className=" flex justify-center items-center h-screen font-bold text-3xl bg-black/30 text-red-700">
        <div>Error While fetching emails. Login again and try</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-8">
        <div className=" flex justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="px-4 py-5 bg-blue-300 rounded-xl mb-4"
            >
              <Button variant="outline">
                Classify Emails: {classifyEmail}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-300 ml-8">
              <DropdownMenuLabel>Emails to Classify</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={classifyEmail}
                onValueChange={setClassifyEmail}
              >
                <DropdownMenuRadioItem
                  className="hover:bg-gray-500 cursor-pointer"
                  value="0"
                >
                  0
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className="hover:bg-gray-500 cursor-pointer"
                  value="10"
                >
                  10
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className="hover:bg-gray-500 cursor-pointer"
                  value="15"
                >
                  15
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className="hover:bg-gray-500 cursor-pointer"
                  value="20"
                >
                  20
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className=" flex justify-center gap-2">
            {+classifyEmail !== 0 && (
              <button
                disabled={fetchingCategories}
                onClick={async () => {
                  setFetchingCategories(true);
                  const classifications: classifications[] = await GeminiAPI({
                    email: emails.slice(0, +classifyEmail),
                  });
                  typeof classifications !== "undefined" &&
                  classifications !== null
                    ? (setClassifications(classifications),
                      toast.success("Categories Fetched successfully"))
                    : toast.error("Error while fetching categories");

                  setFetchingCategories(false);
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-xl mb-4"
              >
                {fetchingCategories ? "Fetching..." : "Classify Emails"}
              </button>
            )}
          </div>
        </div>
        <div>
          {emails.map((email, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-white rounded shadow hover:cursor-pointer hover:bg-slate-300"
              onClick={() => {
                setShowPopup(true);
                setMyEmail(email);
                classifications[index] &&
                  setMyClassification(
                    classifications[index] as SetStateAction<string>
                  );
              }}
            >
              <div className=" flex justify-between">
                <h1 className="font-bold mb-4">{email.from.split("<")[0]}</h1>
                <p
                  className={` font-bold
                    ${
                      classifications?.[index] == "important" &&
                      "text-green-600"
                    }
                    ${
                      classifications?.[index] == "promotional" &&
                      "text-blue-600"
                    }
                    ${classifications?.[index] == "social" && "text-yellow-600"}
                    ${
                      classifications?.[index] == "marketing" &&
                      "text-orange-600"
                    }
                    ${classifications?.[index] == "spam" && "text-red-600"}
                       `}
                >
                  {classifications[index] &&
                    Object.values(classifications?.[index])}
                </p>
              </div>
              <h3 className="font-bold">{email.snippet}</h3>
            </div>
          ))}
        </div>
      </div>

      {showPopup && (
        <div className=" ">
          <EmailPopup
            setShowPopup={setShowPopup}
            email={myEmail}
            classification={myClassification}
            setMyClassification={setMyClassification}
          />
        </div>
      )}
    </>
  );
}
