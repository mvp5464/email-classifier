"use client";
import { signIn, useSession } from "next-auth/react";
import ApiKeyInput from "../ApiKeyInput";
import { useState } from "react";
import Loader from "../icons/Loader";
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
  );
}
