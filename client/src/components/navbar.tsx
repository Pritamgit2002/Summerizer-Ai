"use client";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SignIn } from "./ui/sign-in";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getPrompts } from "@/actions/get-history";
import toast, { Toaster } from "react-hot-toast";
import { BsExclamationTriangle } from "react-icons/bs";
import { GoQuestion } from "react-icons/go";
import { Tooltip } from "react-tooltip";

const Navbar = () => {
  const POLLING_INTERVAL = 5000;

  const handleRegisterShopButtonClick = () => {
    console.log("register");
    signIn("google", { callbackUrl: "/" });
  };
  const { data: session, status } = useSession();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("");
  const [prompts, setPrompts] = useState<string[]>([]);
  const userEmail = session?.user?.email;

  const fetchPrompts = async () => {
    if (userEmail) {
      // console.log("Fetching prompts for email:", userEmail);

      try {
        const getPromptsResults = await getPrompts({ userEmail: userEmail });
        // console.log("Prompts received:", getPromptsResults);

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
  return (
    <>
      <div className=" w-full px-4 sm:px-6 py-2 flex items-center justify-between bg-[#111010] ">
        <span className=" italic text-white text-2xl font-semibold  ">
          Summerizer
        </span>
        <div className="flex gap-x-2 sm:gap-x-4 items-center  ">
          <Dialog>
            <DialogTrigger className="text-white/80 text-2xl font-semibold tracking-wide cursor-pointer hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
              <HiOutlineInformationCircle />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className=" text-2xl ">
                  Information about Summerizer!
                </DialogTitle>
                <ul className="list-disc ml-4 text-sm text-white/80 space-y-2 pt-4 ">
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">1.</b> Summarerizer is using
                      Gemini's 1.5-flash model to generate.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">2.</b> The response may take a
                      few seconds to generate
                      <i>(Maximum one minute)</i>.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">3.</b> If the response is not
                      generated within one minute, then click it again.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">4.</b> Prompt is getting
                      stored in database by the user's profile.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">5.</b> Previous prompt can be
                      copied from the history.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">6.</b> Every edge case is
                      handled and tested.
                    </DialogDescription>
                  </li>
                  <li>
                    <DialogDescription>
                      <b className=" text-black ">7.</b> More features will be
                      added soon.
                    </DialogDescription>
                  </li>
                </ul>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger className="block sm:hidden">
              <span className="text-2xl cursor-pointer text-white hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
                <TbLayoutSidebarLeftCollapse />
              </span>
            </SheetTrigger>
            <SheetContent className="bg-black">
              <SheetHeader>
                <SheetTitle className=" text-xl text-white ">
                  History
                </SheetTitle>
                {status === "unauthenticated" && (
                  <SheetDescription className=" flex flex-col items-center justify-center gap-y-2  text-white ">
                    <span className="text-2xl font-bold">
                      <BsExclamationTriangle />
                    </span>
                    <span className=" text-lg font-medium tracking-tight text-center ">
                      Please log in to see your history.
                    </span>
                    <SignIn />
                  </SheetDescription>
                )}
                {status === "loading" && (
                  <SheetDescription className=" flex flex-col items-center justify-center gap-y-2  text-white ">
                    <span className="text-2xl font-bold">
                      <BsExclamationTriangle />
                    </span>
                    <span className=" text-lg font-medium tracking-tight ">
                      Loading...
                    </span>
                  </SheetDescription>
                )}
                {status === "authenticated" && (
                  <SheetDescription className=" flex flex-col h-full  center justify-between gap-y-2  text-white overflow-auto ">
                    <div>
                      {prompts.length > 0 ? (
                        prompts.map((prompt, index) => (
                          <React.Fragment key={index}>
                            <div
                              id={`tooltip-anchor-${index}`}
                              className="w-full flex items-center justify-start gap-x-[2px] pl-2 py-[6px] rounded-lg hover:bg-gray-800/80 transition-all duration-300 ease-out cursor-pointer mb-2"
                              onClick={() => handleCopyPrompt(index)}
                            >
                              <span>{index + 1}.</span>
                              <h3 className="line-clamp-1 space-y-10 text-left ">
                                {prompt}
                              </h3>
                            </div>
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
                    </div>
                  </SheetDescription>
                )}
              </SheetHeader>
            </SheetContent>
          </Sheet>

          <SignIn />
        </div>
      </div>
    </>
  );
};

export default Navbar;
