"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { z } from "zod";
import { DataList } from "./page";

const formSchema = z.object({
  value: z.string().optional(),
  image: z.any().optional(),
});

const CallBackImage = ({
  src,
  alt,
  fallback = "/img/no-image.svg",
  ...props
}: React.ComponentProps<typeof Image> & { fallback?: string }) => {
  const [img, setImg] = useState(src || fallback);

  return (
    <div className={cn(img === fallback && "h-full w-full p-5")}>
      <Image
        {...props}
        src={img}
        alt={alt || "Image"}
        loading="lazy"
        onError={() => setImg(fallback)}
        className={cn("h-full w-full object-cover", props.className)}
      />
    </div>
  );
};

const DatasCard = ({
  title,
  items,
}: {
  title: string;
  items: DataList[];
  session: Session;
}) => {
  const router = useRouter();

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {items.map(({ id, image, jabatan, name }) => {
          return (
            <div key={id}>
              <Card className="rounded-lg bg-gray-100 p-6 shadow-1 dark:bg-gray-dark">
                <CardHeader className="space-y-7 p-0 pb-6">
                  <CallBackImage
                    src={image!}
                    width={400}
                    height={400}
                    alt={`${name}_image`}
                    className="rounded-full border-4 border-white shadow-lg"
                  />

                  <Button
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        className:
                          "text-black transition-all hover:scale-105 dark:text-white",
                      }),
                    )}
                    onClick={() =>
                      router.push(`/dashboard/data-pengurus/${id}`)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <FaRegEdit />
                      <span className="font-semibold">Ubah</span>
                    </div>
                  </Button>
                </CardHeader>

                <CardContent className="p-0 px-4">
                  <div className="text-lg font-semibold text-gray-700 dark:text-white">
                    {jabatan}
                  </div>

                  <div className="mt-2 flex items-center space-x-4">
                    {name === "" ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse text-gray-500">...</div>
                        <div className="text-sm text-gray-400">
                          Tunggu sebentar...
                        </div>
                      </div>
                    ) : name ? (
                      <span className="text-xl font-medium text-gray-800 dark:text-gray-200">
                        {name}
                      </span>
                    ) : (
                      <span className="text-xl font-medium text-red-800 dark:text-red-200">
                        Belum Diisi
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <style jsx>{`
                @keyframes pulse {
                  0% {
                    opacity: 0.2;
                  }
                  50% {
                    opacity: 1;
                  }
                  100% {
                    opacity: 0.2;
                  }
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function PageClient({
  session,
  data,
}: {
  session: Session;
  data: Record<string, DataList[]>;
}) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <DatasCard
          title="Pengurus Desa"
          items={data.pengurusDesa}
          session={session}
        />
      </div>

      <div className="mb-6">
        <DatasCard
          title="Kepala Dusun"
          items={data.kepalaDusun}
          session={session}
        />
      </div>
      <div className="mb-6">
        <DatasCard
          title="Kepala Seksi"
          items={data.kepalaSeksi}
          session={session}
        />
      </div>
      <div className="mb-6">
        <DatasCard
          title="Kepala Urusan"
          items={data.kepalaUrusan}
          session={session}
        />
      </div>
    </div>
  );
}
