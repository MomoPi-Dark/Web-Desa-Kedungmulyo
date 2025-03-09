import authConfig from "@/lib/authConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function RootAdmin({
  children,
}: {
  children: React.JSX.Element;
}) {
  const session = await getServerSession(authConfig);

  if (session) {
    if (session.user.role !== "Admin") {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}
