"use client";

import { getPrompts } from "@/actions/get-history";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { IPrompt } from "@/models/user";
import { Tooltip } from "react-tooltip";

type Props = {};
const POLLING_INTERVAL = 5000;

const History = (props: Props) => {
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

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please log in to see your history.</div>;
  }

  const handleCopyPrompt = async (index: number) => {
    try {
      const promptText = prompts[index];
      await navigator.clipboard.writeText(promptText);
      alert("Prompt copied to clipboard.");
      console.log("Successfully copied prompt to clipboard.");
    } catch (error) {
      alert("Failed to copy text");
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="w-72 h-full max-h-max bg-black text-white px-2">
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
              content="Click to copy prompt."
              place="right"
              style={{ backgroundColor: "#fff", color: "#000" }}
            />
          </React.Fragment>
        ))
      ) : (
        <div>No prompts available.</div>
      )}
    </div>
  );
};

export default History;
