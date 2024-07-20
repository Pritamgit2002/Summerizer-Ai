"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { signIn } from "next-auth/react";
import React from "react";
import { SignIn } from "./ui/sign-in";

const Navbar = () => {
  // const { data: session } = useSession();

  const handleRegisterShopButtonClick = () => {
    console.log("register");
    signIn("google", { callbackUrl: "/" });
  };
  return (
    <>
      <div className=" w-full px-6 py-2 flex items-center justify-between bg-[#111010] ">
        <span className=" italic text-white text-2xl font-semibold  ">
          Summerizer
        </span>
        <div className="flex gap-x-4 items-center  ">
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
                </ul>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <SignIn />
        </div>
      </div>
    </>
  );
};

export default Navbar;
