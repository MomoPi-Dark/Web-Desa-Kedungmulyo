import authConfig from "@/lib/authConfig";
import { usr } from "@/lib/firebase/users";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetUserAndEdit from "./pageClient";

export const revalidate = 60;

const getData = async (id: string) => {
  const user = await usr.getUser(id, "id");

  return {
    user: user
      ? {
          ...user,
          createdAt: user.createdAt ? user.createdAt.seconds : null,
          updatedAt: user.updatedAt ? user.updatedAt.seconds : null,
        }
      : null,
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  const { user } = await getData(id);

  if (!user || !session) {
    redirect("/dashboard/users");
  }

  return (
    <GetUserAndEdit
      session={session}
      targetUser={user!}
    />
  );
}
