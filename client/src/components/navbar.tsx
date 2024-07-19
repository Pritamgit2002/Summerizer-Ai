"use client";
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
    <div className=" w-full px-6 py-2 flex items-center justify-between bg-[#111010] ">
      <span className=" italic text-white text-2xl font-semibold  ">
        Summerizer
      </span>

      <SignIn />
    </div>
  );
};

export default Navbar;
