import authConfig from "@/lib/authConfig";
import { perangkatStore } from "@/lib/firebase/perangkat_desa";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetAndEdit from "./pageClient";

export const revalidate = 60;

const getData = async (id: string) => {
  const data = await perangkatStore.get(id as any);

  return {
    data,
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authConfig);
  const { data } = await getData(id);

  if (!data || !session) {
    redirect("/dashboard");
  }

  return (
    <GetAndEdit
      session={session}
      targetData={data}
    />
  );
}
