"use client";

import WalkingNumber from "@/components/static/WalkingNumber";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AdminPendudukFields,
  adminPendudukStore,
} from "@/lib/firebase/admin_penduduk";
import { logStore } from "@/lib/firebase/log_activity";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaExchangeAlt,
  FaFemale,
  FaHome,
  FaMale,
  FaPassport,
  FaRegEdit,
  FaUsers,
} from "react-icons/fa";
import { z } from "zod";

const formSchema = z.object({
  value: z.string(),
});

type DataList = {
  icon: React.JSX.Element;
  color: string;
  title: string;
  value: number;
  key: AdminPendudukFields;
};

const dataStatsList: DataList[] = [
  {
    icon: (
      <FaUsers
        size={20}
        color="white"
      />
    ),
    color: "#4CAF50",
    title: "Penduduk",
    value: 0,
    key: "penduduk",
  },
  {
    icon: (
      <FaHome
        size={20}
        color="white"
      />
    ),
    color: "#FF9800",
    title: "Kepala Keluarga",
    value: 0,
    key: "kepala_keluarga",
  },
  {
    icon: (
      <FaMale
        size={20}
        color="white"
      />
    ),
    color: "#2196F3",
    title: "Laki-Laki",
    value: 0,
    key: "lk",
  },
  {
    icon: (
      <FaFemale
        size={20}
        color="white"
      />
    ),
    color: "#E91E63",
    title: "Perempuan",
    value: 0,
    key: "pr",
  },
  {
    icon: (
      <FaPassport
        size={20}
        color="white"
      />
    ),
    color: "#FFC107",
    title: "Penduduk Sementara",
    value: 0,
    key: "penduduk_sementara",
  },
  {
    icon: (
      <FaExchangeAlt
        size={20}
        color="white"
      />
    ),
    color: "#607D8B",
    title: "Mutasi Penduduk",
    value: 0,
    key: "mutasi_penduduk",
  },
];

const DataPenduduk: React.FC<{}> = () => {
  const session = useSession({ required: true });

  const user = session.data?.user;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataList[]>(dataStatsList);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (
    key: AdminPendudukFields,
    newValue: string,
    oldValue: number,
  ) => {
    const value = parseInt(newValue);

    if (value < 0) {
      form.setError("value", {
        type: "value",
        message: "Value must be greater than 0",
      });
    }

    try {
      setIsLoading(true);
      await adminPendudukStore.update(key, value);
      form.reset();
      setIsLoading(false);

      logStore.logActivity({
        activity: `Mengubah ${key} ${oldValue} menjadi ${value}`,
        status: "update",
        identity: user?.id || "unknown",
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = adminPendudukStore.subscribe(async (data) => {
      const updatedPopulationData = dataStatsList.map((item) => ({
        ...item,
        value: data[item.key]?.value || 0,
      }));

      setData(updatedPopulationData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Data Penduduk</h1>
        <Separator className="my-4" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {data.map((item, index) => {
          const { currentValue, ref } = WalkingNumber({
            start: 0,
            end: item.value ?? 0,
            duration: 1000,
          });

          return (
            <div
              key={index}
              className="rounded-[10px] bg-gray-100 p-6 shadow-1 dark:bg-gray-dark"
            >
              <div className="flex justify-between">
                <div
                  className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
                  style={{ backgroundColor: item.color }}
                >
                  {item.icon}
                </div>

                <Dialog>
                  <DialogTrigger
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        className: "bg-gray-200 dark:bg-gray-900",
                      }),
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <FaRegEdit />
                      <span>Ubah</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Masukan Nilai</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit((values) =>
                          handleSubmit(item.key, values.value, item.value),
                        )}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="grid flex-1 gap-2">
                            <FormField
                              control={form.control}
                              name="value"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder={item.value.toString()}
                                      type="number"
                                      required
                                      min={0}
                                      {...field}
                                      value={field.value ?? ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <DialogFooter className="pt-4 sm:justify-start">
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="secondary"
                            >
                              Close
                            </Button>
                          </DialogClose>
                          {form.formState.errors.value ? (
                            <Button type="submit">Confirm</Button>
                          ) : (
                            <DialogClose asChild>
                              <Button type="submit">Confirm</Button>
                            </DialogClose>
                          )}
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-6 flex items-end justify-between">
                <div ref={ref}>
                  <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                    {currentValue.toLocaleString("id-ID")}
                  </h4>
                  <span className="text-body-sm font-medium">{item.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DataPenduduk;
