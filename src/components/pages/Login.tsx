"use client";
import { signIn, useSession } from "next-auth/react";
import ApiKeyInput from "../ApiKeyInput";
import { useState } from "react";
import Loader from "../icons/Loader";
import Link from "next/link";
export default function Login() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  if (status === "loading") {
    return (
      <>
        <Loader info={"Getting Session Info"} />
      </>
    );
  }
  return (
    <>
      <div className=" flex flex-col items-center justify-center bg-gray-100">
        <div>
          IF CANNOT LOGIN, VISIT THE GITHUB AS THE WEBSITE IS UNDER VERIFICATION
          BY GOOGLE FOR USING GMAIL API{" "}
        </div>
        <Link
          href="https://github.com/mvp5464/email-classifier"
          target="_blank"
          className=" underlineS cursor-pointer px-4 py-2 bg-green-500 text-white rounded"
        >
          github link
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {!session ? (
          <button
            onClick={async () => {
              setLoading(true);
              await signIn("google");
              setLoading(false);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Loading..." : "Login with Google"}
          </button>
        ) : (
          <ApiKeyInput />
        )}
      </div>
    </>
  );
}
