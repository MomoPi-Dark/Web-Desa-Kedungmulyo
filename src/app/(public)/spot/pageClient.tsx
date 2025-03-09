"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { SpotPayload, spotStore } from "@/lib/firebase/spot";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const SpotImage = ({
  src,
  alt,
  fallback = "/img/no-image.svg",
  ...props
}: React.ComponentProps<typeof Image> & {
  fallback?: string;
}) => {
  const [img, setImg] = useState(src || fallback);

  return (
    <div className={cn(img === fallback && "h-full w-full p-5")}>
      <Image
        {...props}
        src={img}
        loading="lazy"
        alt={alt || "Image"}
        onError={() => setImg(fallback)}
        className={cn("h-full w-full object-cover", props.className)}
      />
    </div>
  );
};

const SpotCard = ({ title, description, image, lokasi }: any) => (
  <Card className="group h-max w-auto max-w-94 select-none items-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
    <SpotImage
      alt={title}
      width={200}
      height={200}
      src={image}
      className="rounded-t-xl object-cover"
    />
    <CardContent className="p-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </CardContent>
    <CardFooter className="w-full p-4">
      <Link
        href={lokasi || "/"}
        className="h-full w-full"
        target="_blank"
      >
        <Button className="h-full w-full p-4 text-sm">Lihat Lokasi</Button>
      </Link>
    </CardFooter>
  </Card>
);

const SpotLoading = () => {
  return (
    <Card className="group h-max w-auto select-none items-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardHeader className="flex items-center justify-center px-45">
        {/* Skeleton for the image */}
        <div className="h-48 w-full animate-pulse rounded-t-xl bg-gray-300"></div>
      </CardHeader>
      <CardContent className="p-4">
        {/* Skeleton for the title */}
        <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-300"></div>
        {/* Skeleton for the description */}
        <div className="h-4 w-full animate-pulse rounded bg-gray-300"></div>
      </CardContent>
      <CardFooter className="w-full p-4">
        {/* Skeleton for the button */}
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-300"></div>
      </CardFooter>
    </Card>
  );
};

export default function PageClient() {
  const [spots, setSpots] = useState<SpotPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const LoadingPage = () => {
    return Array.from({ length: 3 }).map((_, index) => {
      return <SpotLoading key={index} />;
    });
  };

  const [spotSize, setSpotSize] = useState(3);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = spotStore.subscribe((updatedSpots) => {
      setSpots(updatedSpots);
      setSpotSize(updatedSpots.length || 3);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative py-35">
      <div className="wrapper">
        <div className="mx-auto xl:container">
          <div className="flex flex-col items-center justify-center space-y-6">
            <h1 className="text-center text-3xl font-bold text-gray-800">
              Jelajahi Spot Paling Asik untuk di kunjungi, di Desa Kedungmulyo!
            </h1>
            <p className="text-center text-lg text-gray-600">
              Temukan tempat terbaik untuk menikmati hobi memancing sambil
              bersantai dengan suasana alam yang tenang dan pemandangan
              menakjubkan. Semua yang kamu butuhkan ada di sini!
            </p>
            <div
              className={cn(
                "group grid gap-10 pt-20",
                spotSize >= 3
                  ? `sm:grid-cols-2 xl:grid-cols-3`
                  : `xl:grid-cols-${spotSize} sm:grid-cols-${spotSize}`,
                "grid-cols-1",
              )}
            >
              {!loading && spots.length ? (
                spots.map((item, index) => (
                  <SpotCard
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    lokasi={item.location}
                  />
                ))
              ) : (
                <LoadingPage />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
