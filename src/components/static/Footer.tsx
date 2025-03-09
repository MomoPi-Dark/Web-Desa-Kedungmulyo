import { NavbarItems } from "@/lib/list/list_nav";
import { Clock, Home, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaPhone } from "react-icons/fa6";
import { IoLinkSharp } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const menu = [
  {
    icon: <Mail size={20} />,
    description: "desakedungmulyo12@gmail.com",
  },
  {
    icon: <FaPhone size={18} />,
    description: "+62 821 433 407 29",
  },
  {
    icon: <Clock size={20} />,
    description: (
      <span className="text-gray-300">Senin - Jumat, 08.00 - 15.00 WIB</span>
    ),
  },
  {
    icon: <Home size={20} />,
    description: (
      <span className="text-gray-300">Kedungmulyo, Kemusu, Boyolali</span>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="rounded-t-3xl border-t border-gray-700 bg-gray-800 p-8 backdrop-blur-md xl:mx-3">
      <div className="mx-auto pt-5 xl:px-10 xl:pb-20 xl:pt-10">
        <div className="gap-10 space-y-4 xl:grid xl:grid-cols-12 xl:space-y-0">
          <div className="col-span-12 flex items-start gap-5 gap-x-5 xl:col-span-5">
            <Image
              alt="logo"
              width={64}
              height={64}
              src="/logo/logo_boyolali.svg"
              className="w-16 lg:w-20"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Desa Kedungmulyo
              </h2>
              <p className="mt-2 text-base text-gray-300">
                Kecamatan Kemusu, Kabupaten Boyolali, Provinsi Jawa Tengah.
              </p>
            </div>
          </div>
          <div className="col-span-4 hidden xl:block">
            <h4 className="text-xl font-bold text-white">Kontak Desa</h4>
            <div className="mt-4 text-base text-gray-300">
              {menu.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 pb-5"
                  >
                    {item.icon}
                    {item.description}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="block pt-10 xl:hidden">
            <Accordion
              type="single"
              collapsible
            >
              <AccordionItem
                value="item-1"
                className="border-b-0"
              >
                <AccordionTrigger className="text-white hover:no-underline">
                  <div className="flex items-center justify-center gap-5">
                    <FaPhone size={18} />
                    <span className="text-xl">Kontak Desa</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-5 pl-10">
                  {menu.map((item, index) => {
                    return (
                      <p
                        key={index}
                        className="mt-4 flex items-center gap-5 text-base text-gray-300"
                      >
                        {item.icon}
                        {item.description}
                      </p>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-2 hidden xl:block">
            <h4 className="text-2xl font-bold text-white">Links</h4>
            <ul className="mt-6 space-y-3">
              {NavbarItems.map((item, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={item.link as any}
                      className="text-lg text-gray-300 hover:text-white"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="block xl:hidden">
            <Accordion
              type="single"
              collapsible
            >
              <AccordionItem
                value="item-1"
                className="border-b-0"
              >
                <AccordionTrigger className="text-white hover:no-underline">
                  <div className="flex items-center justify-center gap-5">
                    <IoLinkSharp size={22} />
                    <span className="text-xl">Links</span>
                  </div>
                </AccordionTrigger>
                {NavbarItems.map((item, index) => {
                  return (
                    <AccordionContent
                      key={index}
                      className="space-y-3 pl-10 pt-5"
                    >
                      <Link
                        href={item.link as any}
                        className="text-lg text-gray-300 hover:text-white"
                      >
                        {item.title}
                      </Link>
                    </AccordionContent>
                  );
                })}
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-6 text-center">
        <p className="text-base text-gray-400">
          &copy; {new Date().getFullYear()} KKNT UNIVERSITAS DUTA BANGSA. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
