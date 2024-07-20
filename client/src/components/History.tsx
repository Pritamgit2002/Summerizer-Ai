"use client";
import toast, { Toaster } from "react-hot-toast";
import { getPrompts } from "@/actions/get-history";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IPrompt } from "@/models/user";
import { Tooltip } from "react-tooltip";
import { BsExclamationTriangle } from "react-icons/bs";
import { SignIn } from "./ui/sign-in";
import { GoQuestion } from "react-icons/go";
type Props = {};
const POLLING_INTERVAL = 5000;

const History = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const userEmail = session?.user?.email;

  const fetchPrompts = async () => {
    if (userEmail) {
      console.log("Fetching prompts for email:", userEmail);

      try {
        const getPromptsResults = await getPrompts({ userEmail: userEmail });
        console.log("Prompts received:", getPromptsResults);

        if (getPromptsResults.success) {
          setPrompts(getPromptsResults.text || []);
          setName(getPromptsResults.name || "");
          setEmail(getPromptsResults.email || "");
          setAvatar(getPromptsResults.avatar || "");
        } else {
          console.error("Error getting prompts:", getPromptsResults.message);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
      }
    }
  };

  useEffect(() => {
    fetchPrompts();
    const intervalId = setInterval(fetchPrompts, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [userEmail]);
  const handleCopyPrompt = async (index: number) => {
    try {
      const promptText = prompts[index];
      await navigator.clipboard.writeText(promptText);
      // alert("Prompt copied to clipboard.");
      toast.success("Prompt copied to clipboard.");
      console.log("Successfully copied prompt to clipboard.");
    } catch (error) {
      // alert("Failed to copy text");
      toast.error("Failed to copy Prompt");
      console.error("Failed to copy text:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="w-56 md:w-64 lg:w-72 min-h-screen h-full max-h-max flex flex-col items-center justify-center gap-y-2 bg-black text-white  ">
        <div className="h-16 flex items-center pl-2 bg-[#111010]">
          <span className="text-white text-2xl font-semibold tracking-wide">
            History
          </span>
        </div>
        <span className="text-2xl font-bold">
          <BsExclamationTriangle />
        </span>
        <span className=" text-lg font-medium tracking-tight ">Loading...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="w-56 md:w-64 lg:w-72 min-h-screen h-full max-h-max flex flex-col items-center justify-start gap-y-2 bg-black text-white ">
        <div className=" w-full h-16 flex items-center pl-3 mb-32 bg-[#111010]">
          <span className="text-white text-2xl font-semibold tracking-wide">
            History
          </span>
        </div>
        <span className="text-2xl font-bold">
          <BsExclamationTriangle />
        </span>
        <span className=" text-lg font-medium tracking-tight text-center ">
          Please log in to see your history.
        </span>
        <SignIn />
      </div>
    );
  }

  return (
    <div className="w-56 md:w-64 lg:w-72 h-full min-h-screen overflow-y-auto bg-black text-white px-2">
      <div className="h-16 flex items-center pl-2 bg-[#111010]">
        <span className="text-white text-2xl font-semibold tracking-wide">
          History
        </span>
      </div>
      {prompts.length > 0 ? (
        prompts.map((prompt, index) => (
          <React.Fragment key={index}>
            <div
              id={`tooltip-anchor-${index}`}
              className="w-full flex items-center justify-start gap-x-[2px] pl-2 py-[6px] rounded-lg hover:bg-gray-800/80 transition-all duration-300 ease-out cursor-pointer mb-2"
              onClick={() => handleCopyPrompt(index)}
            >
              <span>{index + 1}.</span>
              <h3 className="line-clamp-1 space-y-10">{prompt}</h3>
            </div>
            <Tooltip
              anchorSelect={`#tooltip-anchor-${index}`}
              content="Click to copy prompt"
              place="right"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                zIndex: 100,
                fontSize: "14px",
              }}
            />
          </React.Fragment>
        ))
      ) : (
        <div className="w-56 md:w-64 lg:w-72 min-h-screen h-full max-h-max flex flex-col items-center justify-center gap-y-2 bg-black text-white ">
          <span className="">
            <GoQuestion />
          </span>
          <span className="text-lg font-medium tracking-tight ">
            No prompts available.
          </span>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default History;
