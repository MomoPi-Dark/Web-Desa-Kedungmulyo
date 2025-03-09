"use client";

import { badgeVariants } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LogActivityPayload, logStore } from "@/lib/firebase/log_activity";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChartBar } from "react-icons/fa";

const LogColors: Record<LogActivityPayload["status"], string> = {
  create: "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200",
  update: "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200",
  delete: "bg-red-200 text-red-800 dark:bg-red-800 dark:text-white",
  error: "bg-red-800 text-white dark:bg-red-900 dark:text-white",
  info: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  read: "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200",
  success: "bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-100",
  warning:
    "bg-yellow-300 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100",
  unknown: "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const BandageColors: Record<LogActivityPayload["status"], string> = {
  create: badgeVariants({
    variant: "outline",
    className:
      "bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200 shadow-md border-green-500",
  }),
  update: badgeVariants({
    className:
      "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 shadow-md border-blue-500",
    variant: "outline",
  }),
  delete: badgeVariants({
    variant: "outline",
    className:
      "bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 shadow-md border-red-500",
  }),
  error: badgeVariants({
    variant: "outline",
    className:
      "bg-red-800 text-white dark:bg-red-900 dark:text-white border-red-800 shadow-md",
  }),
  info: badgeVariants({
    variant: "outline",
    className:
      "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow-md border-gray-500",
  }),
  read: badgeVariants({
    className:
      "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200 shadow-md border-yellow-500",
    variant: "outline",
  }),
  success: badgeVariants({
    className:
      "bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-100 shadow-md border-green-500",
    variant: "outline",
  }),
  warning: badgeVariants({
    className:
      "bg-yellow-300 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 shadow-md border-yellow-500",
    variant: "outline",
  }),
  unknown: badgeVariants({
    className:
      "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 shadow-md border-gray-500",
    variant: "outline",
  }),
};

export default function DataPage() {
  const router = useRouter();
  const session = useSession();

  if (
    session.status === "authenticated" &&
    session.data.user?.role !== "Admin"
  ) {
    router.back();
  }

  const [logs, setLogs] = useState<LogActivityPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = logStore.subscribe((logs) => {
      const sortedLogs = logs.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );

      const latestLog = sortedLogs[0];

      const latestLogActivity =
        latestLog && latestLog.timestamp !== logs[0]?.timestamp
          ? latestLog.activity
          : null;

      setLogs(sortedLogs);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Log Activity</h1>
        <Separator className="my-4" />
      </div>
      {loading ? (
        <ul className="space-y-4 text-xl">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <li
                key={index}
                className="animate-pulse"
              >
                <Card className="bg-gray-300 dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle
                      className={cn("grid grid-cols-2 items-center gap-3")}
                    >
                      <span
                        className={cn(
                          "flex items-center space-x-2 justify-self-start",
                          "h-6 w-30 rounded bg-gray-400 dark:bg-gray-600",
                        )}
                      />
                      <span
                        className={cn(
                          "items-center justify-self-end",
                          "h-6 w-25 rounded bg-gray-400 dark:bg-gray-600",
                        )}
                      />
                    </CardTitle>

                    <div className="py-4">
                      <p
                        className={cn(
                          "h-6 w-1/2 rounded bg-gray-400 dark:bg-gray-600",
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 items-center justify-between">
                      <span
                        className={cn(
                          "col-span-1 text-left text-sm",
                          "h-6 w-30 rounded bg-gray-400 dark:bg-gray-600",
                        )}
                      />
                      <span
                        className={cn(
                          "col-span-2 justify-self-end text-sm",
                          "h-6 w-1/2 rounded bg-gray-400 dark:bg-gray-600",
                        )}
                      />
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
        </ul>
      ) : logs.length !== 0 ? (
        <ul className="space-y-4">
          {logs.map((log, index) => {
            const color = LogColors[log.status];
            const badgeColor = BandageColors[log.status];

            return (
              <li key={index}>
                <Card className={cn(color)}>
                  <CardHeader>
                    <CardTitle className="grid grid-cols-2 items-center gap-3">
                      <div className="flex items-center space-x-2 justify-self-start">
                        <FaChartBar size={24} />
                        <span>Log Activity</span>
                      </div>
                      <div className="items-center justify-self-end">
                        <span className={cn(badgeColor, "text-sm")}>
                          {log.status.toUpperCase()}
                        </span>
                      </div>
                    </CardTitle>

                    <p className="py-2">{log.activity}</p>

                    <div className="grid grid-cols-3 items-center justify-between">
                      <span className="col-span-1 text-left text-sm">
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "short",
                          timeStyle: "short",
                          timeZone: "Asia/Jakarta",
                        }).format(log.timestamp)}
                      </span>
                      <span className="col-span-2 text-right text-sm">
                        By:{" "}
                        {!log.identity
                          ? "Anonymous"
                          : log.identity === "unknown"
                            ? "Unknown"
                            : log.identity}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex h-14 items-center justify-center">
          <p className="text-gray-400 dark:text-gray-500">Tidak ada log</p>
        </div>
      )}
    </>
  );
}
