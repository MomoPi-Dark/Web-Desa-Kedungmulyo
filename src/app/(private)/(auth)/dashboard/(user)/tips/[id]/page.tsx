import authConfig from "@/lib/authConfig";
import { tipsStore } from "@/lib/firebase/tips";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetSpotAndEdit from "./pageClient";

export const revalidate = 60;

const getData = async (id: string) => {
  const spot = await tipsStore.getTips(id);

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
    redirect("/dashboard/tips");
  }

  return (
    <GetSpotAndEdit
      session={session}
      targetTips={spot as any}
    />
  );
}
