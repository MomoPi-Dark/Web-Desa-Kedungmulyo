import Image from "next/image";

export default function BGLayout() {
  return (
    <>
      <div className="absolute top-0 -z-10 h-[700px] w-full bg-gradient-to-b from-color_custom-500 to-transparent opacity-[25%]" />

      <div className="pointer-events-none fixed left-[-10vw] top-[8vw] -z-10 h-[35vw] flex-shrink-0 rotate-[6deg] opacity-20 grayscale">
        <Image
          alt="banner"
          width="512"
          height="512"
          src="/logo/logo_boyolali.svg"
          className="rounded-full"
        />
      </div>

      <div className="pointer-events-none fixed right-[-10vw] top-[15vw] -z-10 hidden h-[35vw] flex-shrink-0 rotate-[-6deg] opacity-20 grayscale bg_image_1:inline-block">
        <Image
          alt="banner"
          width="512"
          height="512"
          src="/logo/logo_boyolali.svg"
          className="rounded-full"
        />
      </div>
    </>
  );
}
