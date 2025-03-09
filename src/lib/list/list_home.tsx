import Greetings from "@/components/static/greetings";
import Image from "next/image";

const list_home: {
  description: React.JSX.Element;
  image: React.JSX.Element;
}[] = [
  {
    description: <Greetings />,
    image: (
      <>
        <Image
          src="/logo/logo_boyolali.svg"
          alt="Logo Boyolali"
          width={250}
          height={250}
          className="pointer-events-auto mx-auto h-[10rem] w-20 md:h-[20rem] md:w-max"
        />
      </>
    ),
  },
];

export default list_home;
