"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ButtonAdd() {
  const router = useRouter();

  const handleClick = async () => {
    router.push("/dashboard/spot/create");
  };

  return (
    <div className="flex justify-end pr-5">
      <Button
        variant={"secondary"}
        className="bg-yellow-400 text-black hover:bg-yellow-300"
        onClick={() => handleClick()}
      >
        Buat Spot Baru
      </Button>
    </div>
  );
}
