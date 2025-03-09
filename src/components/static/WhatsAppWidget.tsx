"use client";

import { animated, AnimatedProps, useTransition } from "@react-spring/web";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaWhatsapp } from "react-icons/fa";

type AnimatedDivProps = AnimatedProps<React.HTMLAttributes<HTMLDivElement>> & {
  children?: React.ReactNode;
};

const WhatsAppWidget = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, resetField } = useForm({
    defaultValues: {
      message: "",
    },
  });

  const transitions = useTransition(open, {
    from: { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -30 },
    config: {
      friction: 30,
    },
  });

  const onClick = () => {
    resetField("message", { defaultValue: "" });
    return setOpen((a) => !a);
  };

  const isMobileDevice = () => {
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileRegex.test(navigator.userAgent);
  };

  const onSubmit = handleSubmit((data) => {
    const defaultMessage = "Halo, saya ingin bertanya";
    const message = data?.message ?? defaultMessage;
    const phoneNumber = "6282143340729";

    if (isMobileDevice()) {
      window.open(
        `whatsapp://send?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`,
      );
    } else {
      window.open(
        `https://web.whatsapp.com/send/?phone=${phoneNumber}&text=${message}&type=phone_number&app_absent=0`,
      );
    }

    onClick();
  });

  return (
    <div className="fixed bottom-4 right-4 z-[99999] shadow-sm">
      <div className="flex flex-col items-end gap-4">
        {transitions(
          (style, key, _, index) =>
            key && (
              // @ts-expect-error
              <animated.div
                key={index}
                style={style}
                className={
                  "flex h-96 w-64 flex-col justify-between overflow-hidden rounded-md bg-white lg:w-80"
                }
              >
                <div className="flex h-24 items-center justify-between gap-2 bg-white px-4 py-2">
                  <div className="flex items-center gap-2 bg-white">
                    <Image
                      alt="administrasi"
                      className="h-12 w-12 rounded-full bg-red-500"
                      width={500}
                      height={500}
                      src={"/img/profile.svg"}
                      unoptimized
                      priority
                    />
                    <div>
                      <p className="text-xl font-semibold text-black">
                        Administrasi
                      </p>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <p className="text-xs text-black">Online</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClick}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="h-full w-full bg-[url('/img/whatsapp.webp')]">
                  <div className="p-4">
                    <p className="w-fit rounded-md border border-black/20 bg-white px-2 py-1 text-sm text-black">
                      Hey there! Sure thing, how can I assist you?
                    </p>
                  </div>
                </div>
                <form
                  onSubmit={onSubmit}
                  className="flex h-24 items-center justify-center gap-2 bg-white px-4"
                >
                  <input
                    {...register("message")}
                    placeholder="type a message..."
                    className="w-full rounded-2xl border bg-gray-100 px-3 py-2 text-black outline-none"
                  />
                  <button type="submit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-8 w-8 text-blue-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </form>
              </animated.div>
            ),
        )}

        <button
          onClick={onClick}
          type="button"
          className="rounded-full bg-green-500 p-2 text-white lg:p-2"
        >
          <FaWhatsapp className="h-7 w-7 lg:h-8 lg:w-8" />
        </button>
      </div>
    </div>
  );
};

export default WhatsAppWidget;
