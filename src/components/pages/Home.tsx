"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { adminPendudukStore } from "@/lib/firebase/admin_penduduk";
import listHome from "@/lib/list/list_home";
import initialPopulationData from "@/lib/list/list_pupulate_data";
import { cn } from "@/lib/utils";
import { useInView } from "@react-spring/web";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WalkingNumber from "../static/WalkingNumber";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

const carouselNews = [
  {
    title: "Desa Kedungmulyo",
    description:
      "Perkenalan sebagai Desa Kedungmulyo, Kecamatan Kedungmulyo, Kabupaten Boyolali dan Provinsi Jawa Tengah",
    backgroundImage: "/img/home_proper_1.png",
    center: true,
  },
];

const ImageFallback = ({
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

const CardData = (itemData: any, index: number) => {
  const { image, description } = itemData;
  const isEven = index % 2 === 0;
  const sectionRef = useRef(null);
  const inViewRef = useInView(() => sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      key={index}
      className="image-alignment flex grid-flow-row-dense grid-cols-12 flex-col gap-20 px-8 md:px-10 lg:grid lg:items-start"
    >
      <div
        className={cn(
          `col-span-4 ${isEven ? "" : "lg:order-1"}`,
          "transition-transform duration-500 ease-in-out",
          inViewRef ? `visible translate-y-0` : `invisible translate-y-[100px]`,
        )}
      >
        {image}
      </div>

      <div
        className={cn(
          "relative col-span-8 mt-0 flex flex-col",
          "transition-transform duration-500 ease-in-out",
          inViewRef ? `visible translate-y-0` : `invisible translate-y-[100px]`,
        )}
      >
        {description}
      </div>
    </section>
  );
};

export default function HomeClient({ data }: { data: any[] }) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isCarouselFocused, setIsCarouselFocused] = useState(false);

  useEffect(() => {
    if (!carouselApi) return;

    setTotalSlides(carouselApi.scrollSnapList().length);
    setCurrentSlide(carouselApi.selectedScrollSnap() + 1);

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
    });
  }, [carouselApi]);

  const [populationData, setPopulationData] = useState(initialPopulationData);

  useEffect(() => {
    const unsubscribe = adminPendudukStore.subscribe((data) => {
      const updatedPopulationData = initialPopulationData.map((item) => ({
        ...item,
        value: data[item.key]?.value || 0,
      }));

      setPopulationData(updatedPopulationData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const useMobile = useIsMobile();
  const [isMobile, setIsMobile] = useState(useMobile);

  useEffect(() => {
    setIsMobile(useMobile);
  }, [useMobile]);

  return (
    <div className="relative mx-auto">
      <div
        className={cn(
          "preview-container-1 relative overflow-hidden",
          "px-2 pt-25 custom_desktop:px-0 custom_desktop:pt-0",
        )}
      >
        <Carousel
          className="flex custom_desktop:hidden"
          setApi={isMobile ? undefined : setCarouselApi}
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 10000,
              stopOnFocusIn: true,
              stopOnMouseEnter: true,
              active: isCarouselFocused,
            }),
          ]}
        >
          <CarouselContent>
            {carouselNews.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative flex h-50 w-auto overflow-hidden rounded-xl">
                  <Image
                    src={item.backgroundImage}
                    alt=""
                    width={1920}
                    height={1080}
                    className="absolute inset-0 z-0 rounded-xl bg-black/25 opacity-70"
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="relative flex h-full w-full flex-col items-center justify-center px-5 text-center text-white">
                    <h1 className="text-base font-bold lg:text-xl">
                      {item.title}
                    </h1>
                    <p className="text-shadow-black mt-2 text-center text-xs lg:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <Carousel
          className="hidden custom_desktop:flex"
          setApi={isMobile ? undefined : setCarouselApi}
          opts={{ loop: true }}
          plugins={[
            Autoplay({
              delay: 10000,
              stopOnFocusIn: true,
              stopOnMouseEnter: true,
              active: isCarouselFocused,
            }),
          ]}
        >
          <CarouselContent>
            {carouselNews.map((item, index) => (
              <CarouselItem
                key={index}
                className="relative h-screen w-screen"
              >
                <div
                  style={{
                    backgroundImage: `url(${item.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: item.center ? "center" : "auto",
                  }}
                  className="absolute inset-0 z-0 bg-black/25 opacity-70"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative flex h-full flex-col items-center justify-center px-20 text-center text-white">
                  <h1 className="text-shadow-black text-2xl font-bold shadow-md xl:text-5xl">
                    {item.title}
                  </h1>
                  <p className="text-shadow-black mt-4 text-sm xl:text-lg">
                    {item.description}
                  </p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {carouselNews.length > 1 && (
            <>
              <Button
                variant="ghost"
                onClick={() => carouselApi?.scrollPrev()}
                onMouseEnter={() => setIsCarouselFocused(false)}
                onMouseLeave={() => setIsCarouselFocused(true)}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
              >
                ◀
              </Button>
              <Button
                variant="ghost"
                onClick={() => carouselApi?.scrollNext()}
                onMouseEnter={() => setIsCarouselFocused(false)}
                onMouseLeave={() => setIsCarouselFocused(true)}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-gray-700 p-2 text-white hover:bg-gray-600"
              >
                ▶
              </Button>
            </>
          )}
        </Carousel>
      </div>

      <div className="rounded-sm bg-gradient-to-r from-blue-100/20 to-green-100/20">
        <div className="wrapper">
          <div className="mx-auto xl:container">
            <div className="lg:pt-53 py-20 pt-31">{listHome.map(CardData)}</div>

            <div className="pt-15">
              <h1 className="pb-3 text-center text-4xl font-bold text-gray-800 xl:text-start">
                Administrasi Penduduk
              </h1>

              <p className="text-center text-xl xl:text-start">
                Sistem digital yang berfungsi mempermudah pengelolaan data dan
                informasi terkait dengan kependudukan dan pendayagunaannya untuk
                pelayanan publik yang efektif dan efisien.
              </p>

              <div className="mx-auto mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {populationData.map((item, index) => {
                  const { currentValue, ref: refWalk } = WalkingNumber({
                    start: 0,
                    end: item.value ?? 0,
                    duration: 1000,
                  });

                  return (
                    <div
                      key={index}
                      ref={refWalk}
                      className="flex flex-col items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-pink-500 px-7 py-6 text-white shadow-md sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="text-center text-3xl font-bold sm:text-left">
                        {currentValue.toLocaleString("id-ID")}
                      </span>
                      <span className="mt-2 text-center text-xl font-medium text-gray-100 sm:ml-4 sm:mt-0 sm:text-right">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 py-20">
              <h1 className="pb-3 text-center text-4xl font-bold text-gray-800 xl:text-start">
                SOTK
              </h1>

              <p className="text-center text-xl xl:text-start">
                Struktur Organisasi dan Tata Kerja Desa Kedungmulyo.
              </p>

              <div className="mx-auto mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:md:grid-cols-3 xl:grid-cols-4">
                {data.map((value, index) => {
                  return (
                    <Card key={index}>
                      <CardHeader className="p-0">
                        <ImageFallback
                          src={value.image}
                          alt={value.name}
                          width={700}
                          height={700}
                        />
                      </CardHeader>
                      <CardContent className="items-center justify-center pt-6">
                        <div className="flex flex-col items-center justify-center">
                          <span className="items-center text-xl">
                            {value.name}
                          </span>
                          <span className="items-center text-xl">
                            {value.jabatan}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5 py-20">
              <div className="text-center xl:text-start">
                <h1 className="pb-3 text-4xl font-semibold text-gray-800">
                  Peta Desa
                </h1>
                <h2 className="text-xl">Menampilkan Peta Desa Kedungmulyo</h2>
              </div>
              <div className="rounded-md border border-gray-200">
                <iframe
                  className="rounded-md border-4 border-gray-200" // Border tebal (4px) dan warna abu-abu gelap
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13311.944349487942!2d110.75337653365388!3d-7.278935577187057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70a08cf0b86591%3A0xf893bbf891e8fa4b!2sKedungmulyo%2C%20Kec.%20Kemusu%2C%20Kabupaten%20Boyolali%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1736904616477!5m2!1sid!2sid"
                  width="100%"
                  height="500"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
