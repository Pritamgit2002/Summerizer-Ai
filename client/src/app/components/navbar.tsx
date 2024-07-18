import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className=" w-full bg-neutral-950 px-6 py-2 flex items-center justify-between ">
      <span className=" italic text-white text-2xl font-semibold  ">
        Summerizer
      </span>
      {/* <button className=" p-2 bg-neutral-100 rounded-md font-semibold text-lg  ">
        Sign-In
      </button> */}
      <div
        className={`text-white font-medium p-2 border-[1.75px] rounded-md border-white flex items-center justify-center `}
      >
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
