"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import Loader from "./Loader";
import SortIcon from "./icons/SortIcon";

interface Email {
  id: string;
  snippet: string;
  raw: any;
  payload: { headers: { name: string; value: string }[]; body: { data: any } };
}
export default function GetEmails() {
  const { data: session, status } = useSession();
  const [emails, setEmails] = useState<Email[]>([]);
  const [classifications, setClassifications] = useState<string[]>([]);
  const [classifyEmail, setClassifyEmail] = useState<string>("");
  const [sortEmail, setSortEmail] = useState<string>("Sort");
  const [loading, setLoading] = useState<boolean>(false);

  const findAuthor = useCallback(
    (email: Email) => {
      const author = email.payload?.headers.find((f) => f.name === "From");
      return author?.value.split("<")[0];
    },
    [emails]
  );
  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/emails");
      const data = await res.json();
      setEmails(data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log({ e });
    }
  };

  const classifyEmails = async () => {
    const res = await fetch("/api/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails, openaiKey }),
    });
    const data = await res.json();
    setClassifications(data);
  };

  useEffect(() => {
    if (session) {
      fetchEmails();
    }
  }, [session]);

  const openaiKey = useMemo(() => {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      const key = localStorage.getItem("openaiKey");
      return key;
    }
  }, []);

  if (status === "loading" || loading) {
    return <Loader />;
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
              className="px-4 py-5 bg-blue-300 rounded-xl"
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
                  value="20"
                >
                  20
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  className="hover:bg-gray-500 cursor-pointer"
                  value="30"
                >
                  30
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className=" flex justify-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="px-4 py-5 bg-blue-300 rounded-xl"
              >
                <Button variant="outline">
                  <SortIcon /> {sortEmail}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-300 ml-8 ">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortEmail}
                  onValueChange={setSortEmail}
                >
                  {/* Get names from array instead of directly adding here */}
                  <DropdownMenuRadioItem
                    value="Sort"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    All
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="important"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    important
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="promotional"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    promotional
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="social"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    social
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="marketing"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    marketing
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="spam"
                    className="hover:bg-gray-500 cursor-pointer"
                  >
                    spam
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={classifyEmails}
              className="px-4 py-2 bg-green-500 text-white rounded-xl mb-4"
            >
              Classify Emails
            </button>
          </div>
        </div>
        <div>
          {/* {JSON.stringify({ emails: emails[0] })} */}
          {/* {JSON.stringify({ doc2 })} */}
          {/* {JSON.stringify({ session })} */}
          {emails.map((email, index) => (
            <div key={index} className="mb-4 p-4 bg-white rounded shadow">
              <div className=" flex justify-between">
                <h1 className="font-bold mb-4">{findAuthor(email)}</h1>
                <p>{findAuthor(email)}</p>
              </div>
              <h3 className="font-bold">{email.snippet}</h3>
              <p>{classifications[index]}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
