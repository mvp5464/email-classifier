import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const storedKey = localStorage.getItem("gemini-api-key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;
    setApiKey(key);
  };

  return (
    <div className=" flex flex-col justify-center items-center gap-4">
      <p className=" font-bold text-xl">Enter Your Gemini API Key</p>
      <div>
        <input
          type="text"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Gemini API Key"
          className="px-4 py-2 border rounded"
        />
        <button
          className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded ml-4"
          onClick={() => {
            localStorage.setItem("gemini-api-key", apiKey);
            router.push("/emails");
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
