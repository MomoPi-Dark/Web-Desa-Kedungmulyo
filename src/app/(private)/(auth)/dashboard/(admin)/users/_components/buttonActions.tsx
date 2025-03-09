import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { logStore } from "@/lib/firebase/log_activity";
import { usr } from "@/lib/firebase/users";
import { cn } from "@/lib/utils";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ButtonActions({
  row,
  rowData,
}: {
  row: any;
  rowData: any[];
}) {
  const router = useRouter();
  const { data, status } = useSession({ required: true });

  const userSession = data?.user;

  const [hiddenElement, setHiddenElement] = useState({
    hapus: true,
  });

  useEffect(() => {
    if (status !== "authenticated" || !userSession) {
      return;
    }

    const targetId = row.getValue("id");

    const targetUser = rowData.find((item) => item.id === targetId) as User;

    if (userSession!.id === targetId) {
      setHiddenElement({ hapus: true });
    } else {
      if (userSession!.role === "Admin" && targetUser.role === "User") {
        setHiddenElement({
          hapus: false,
        });
      } else if (userSession!.role === "User" && targetUser.role === "Admin") {
        setHiddenElement({
          hapus: true,
        });
      } else if (userSession!.role === "Admin" && targetUser.role === "Admin") {
        setHiddenElement({
          hapus: false,
        });
      }

      if (
        userSession!.priority === "System" &&
        targetUser.priority === "Public"
      ) {
        setHiddenElement({
          hapus: false,
        });
      } else if (
        userSession!.priority === "Public" &&
        targetUser.priority === "System"
      ) {
        setHiddenElement({
          hapus: true,
        });
      }
    }
  }, [status, rowData]);

  const handleDelete = async () => {
    try {
      await usr.deleteUser(row.getValue("id"));

      toast({
        title: "Success",
        description: "User deleted successfully",
        className: "bg-red-500",
      });

      await logStore.logActivity({
        activity: `Menghapus user ${row.getValue("username")}`,
        status: "delete",
        identity: userSession?.id,
      });
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
        onClick={() => router.push(`/dashboard/users/${row.getValue("id")}`)}
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
              Apa kamu yakin ingin menghapus pengguna ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Jika pengguna ini dihapus, semua data yang terkait dengan pengguna
              ini akan ikut terhapus.
            </AlertDialogDescription>
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
