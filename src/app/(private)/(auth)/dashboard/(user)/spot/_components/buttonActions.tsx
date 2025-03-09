import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { logStore } from "@/lib/firebase/log_activity";
import { spotStore } from "@/lib/firebase/spot";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ButtonActions({
  row,
  rowData,
}: {
  row: any;
  rowData: any[];
}) {
  const router = useRouter();
  const session = useSession({ required: true });

  const [hiddenElement, setHiddenElement] = useState({
    hapus: false,
  });

  const handleDelete = async () => {
    try {
      const id = row.getValue("id");

      const targetSpot = await spotStore.getSpot(id);

      if (targetSpot) {
        const fileNameWithExtension = targetSpot.image.split("/").pop() || "";

        const previousImagePublicId =
          "webdesa/spot/" +
          fileNameWithExtension
            .split(".")
            .slice(0, -1)
            .join(".")
            .replaceAll("%20", " ");

        if (previousImagePublicId) {
          fetch(`/api/image/delete`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              publicId: previousImagePublicId,
            }),
          });
        }

        await spotStore.deleteSpot(id);

        toast({
          title: "Success",
          description: "Spot deleted successfully",
          className: "bg-red-500",
        });

        await logStore.logActivity({
          activity: `Menghapus spot ${row.getValue("id")}`,
          status: "delete",
          identity: session?.data?.user.id,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        className: "bg-red-500",
      });
    }
  };

  return (
    <div className="flex gap-x-2">
      <Button
        variant="secondary"
        className="bg-blue-600 text-white hover:bg-blue-500"
        onClick={() => router.push(`/dashboard/spot/${row.getValue("id")}`)}
      >
        Lihat
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          disabled={hiddenElement.hapus}
          className={cn(buttonVariants({ variant: "destructive" }))}
        >
          Hapus
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Apa kamu yakin ingin menghapus spot ini?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: "destructive" })}
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
