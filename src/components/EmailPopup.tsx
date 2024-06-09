"use client";
import { Dispatch, SetStateAction } from "react";
import { Email } from "./pages/GetEmails";

const EmailPopup = ({
  setShowPopup,
  email,
  classification,
  setMyClassification,
}: {
  setShowPopup: Dispatch<SetStateAction<boolean>>;
  email: Email | null;
  classification: string;
  setMyClassification: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <div
      className=" fixed inset-0 bg-black/80 flex justify-center h-screen  items-center"
      onClick={() => {
        setShowPopup(false);
        setMyClassification("");
      }}
    >
      <div
        className="bg-white p-10 rounded-lg < 100  w-[100%] max-w-mds max-w-xl  mt-16 max-h-[100%] overflow-y-auto right-0 fixed"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" mb-5 flex justify-between">
          <div className=" font-bold text-2xl">{email?.from.split("<")[0]}</div>
          <div
            className={` font-bold
                    ${classification == "important" && "text-green-600"}
                    ${classification == "promotional" && "text-blue-600"}
                    ${classification == "social" && "text-yellow-600"}
                    ${classification == "marketing" && "text-orange-600"}
                    ${classification == "spam" && "text-red-600"}
                       `}
          >
            {classification}
          </div>
        </div>
        <div className="mb-5 font-semibold text-xl">{email?.subject}</div>
        <div className=" mb-5">{email?.body}</div>
      </div>
    </div>
  );
};

export default EmailPopup;
