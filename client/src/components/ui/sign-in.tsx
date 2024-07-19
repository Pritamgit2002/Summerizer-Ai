"use client";

import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Mail } from "lucide-react";

export function SignIn() {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-2  ">
        <p className=" text-white ">Hello, {session.user.name}</p>
        <Dialog>
          <DialogTrigger>
            {session.user.image ? (
              <Avatar>
                <AvatarImage
                  src={session.user.image!}
                  alt={session.user.name!}
                />
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center justify-between gap-10">
            <div className="rounded-full p-2 shadow-xl">
              <Image
                width={80}
                height={80}
                src={session.user.image!}
                alt={session.user.name!}
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col items-center gap-2  ">
              <h1 className="text-2xl font-semibold">{session.user.name}</h1>
              <div className="flex items-center gap-2 opacity-60">
                <Mail size={16} />
                <p className="text-sm">{session.user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => signOut()}
              className="w-full rounded-full flex gap-2"
            >
              <p>Sign Out</p> <LogOut size={18} />
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return <Button onClick={() => signIn("google")}>Sign In</Button>;
}
