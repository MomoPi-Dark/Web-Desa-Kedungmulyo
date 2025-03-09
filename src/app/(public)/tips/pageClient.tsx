"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TipsPayload, tipsStore } from "@/lib/firebase/tips";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

const TipsImage = ({
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
        alt={alt || "Image"}
        loading="lazy"
        onError={() => setImg(fallback)}
        className={cn("h-full w-full object-cover", props.className)}
      />
    </div>
  );
};

const TimpsCard = ({ image, index }: any) => {
  return (
    <Card className="group h-max select-none items-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardContent className="flex items-center justify-center p-0">
        <TipsImage
          alt={"image_" + index}
          width={700}
          height={500}
          src={image}
          className="rounded-t-xl object-cover"
        />
      </CardContent>
    </Card>
  );
};

const SpotLoading = () => {
  return (
    <Card className="group h-max select-none items-center rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-4 px-45">
        <div className="h-4 w-full animate-pulse rounded bg-gray-300 py-60"></div>
      </CardContent>
    </Card>
  );
};
export default function PageClient() {
  const [tips, setTips] = useState<TipsPayload[]>([]);
  const [loading, setLoading] = useState(true);

  const LoadingPage = () => {
    return Array.from({ length: 3 }).map((_, index) => {
      return <SpotLoading key={index} />;
    });
  };

  const [spotSize, setSpotSize] = useState(3);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = tipsStore.subscribe((updatedTips) => {
      setTips(updatedTips);
      setSpotSize(updatedTips.length || 3);
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
              Tips
            </h1>
            <p className="text-center text-lg text-gray-600">
              Pelajari cara menjaga lingkungan tetap bersih, memanfaatkan sumber
              daya alam secara bijak, dan mendukung kegiatan komunitas lokal.
              Bersama, kita bisa menciptakan kehidupan yang lebih baik dan
              berkelanjutan untuk semua!
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
              {!loading && tips.length ? (
                tips.map(({ image }, index) => (
                  <TimpsCard
                    key={index}
                    image={image}
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
