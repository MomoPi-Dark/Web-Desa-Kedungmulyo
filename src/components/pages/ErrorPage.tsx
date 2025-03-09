"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";

const ErrorPage = ({
  code,
  message,
  routeBack,
}: {
  code: number;
  message: string;
  routeBack?: string;
}) => {
  const [clicked, setClicked] = useState(false);
  const router = useRouter();

  return (
    <div className="mx-auto pt-5 text-center">
      <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full justify-center">
          <Image
            height={400}
            width={400}
            style={{ width: "30%", height: "auto" }}
            src="/img/bck3.png"
            alt="bck-img"
          />
        </div>

        <div className="mb-8 mt-3">
          <h1 className="text-4xl font-extrabold">{code}</h1>
          <p className="text-xl font-thin text-opacity-75">{message}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            className="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
            onClick={() => {
              setClicked(true);
              routeBack ? router.push(routeBack as any) : router.push("/");
            }}
          >
            {clicked ? (
              <FaSpinner />
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <FaArrowLeft />
                <span>Go Back</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
