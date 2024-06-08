"use client";
import { signIn, useSession } from "next-auth/react";
import OpenAIKeyInput from "./OpenAIKeyInput";
import { useState } from "react";
import Loader from "./Loader";
export default function Login() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  if (status === "loading") {
    return (
      <>
        <Loader />
      </>
    );
  }
  return (
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
        <OpenAIKeyInput />
      )}
    </div>
  );
}
