import authConfig from "@/lib/authConfig";
import { spotStore } from "@/lib/firebase/spot";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetSpotAndEdit from "./pageClient";

export const revalidate = 60;

const getData = async (id: string) => {
  const spot = await spotStore.getSpot(id);

  return {
    spot: spot
      ? {
          ...spot,
          createdAt: spot.createdAt ? spot.createdAt.seconds : Date.now(),
          updatedAt: spot.updatedAt ? spot.updatedAt.seconds : Date.now(),
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
  const { spot } = await getData(id);

  if (!spot || !session) {
    redirect("/dashboard/users");
  }

  return (
    <GetSpotAndEdit
      session={session}
      targetSpot={spot as any}
    />
  );
}
