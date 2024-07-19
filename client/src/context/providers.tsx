"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: React.FC<ProvidersProps> = (props) => {
  return <SessionProvider>{props.children}</SessionProvider>;
};
