"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavbarItem, NavbarItems } from "@/lib/list/list_nav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface NavbarLinkProps {
  link: string;
  children: React.ReactNode;
  disableSelectedUnderscore?: boolean;
  className?: string;
  key?: number;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  link,
  key,
  disableSelectedUnderscore,
  className,
  children,
}) => {
  const pathName = usePathname();
  const isActive = pathName === link;

  return (
    <Link
      key={key}
      href={link as any}
      passHref
      className={cn(
        className,
        "font-sans relative inline-block text-lg font-bold",
        "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-white after:transition-transform after:duration-200 after:content-['']",
        !disableSelectedUnderscore && isActive
          ? "after:origin-center after:scale-x-100 hover:after:transition-none"
          : "after:origin-bottom-right after:scale-x-0 hover:after:origin-center hover:after:scale-x-100",
      )}
      style={{ fontFamily: "'Outfit'" }}
    >
      {children}
    </Link>
  );
};

const NavbarTrigger: React.FC<NavbarLinkProps> = ({ children, link }) => {
  return (
    <NavigationMenuTrigger
      className={cn(
        "text-lg font-bold text-white",
        "bg-transparent px-0 py-0 no-underline transition-colors hover:bg-transparent hover:text-white focus:bg-transparent focus:text-white data-[active]:bg-transparent data-[closed]:bg-transparent data-[state=open]:bg-transparent data-[active]:text-white",
      )}
    >
      <NavbarLink link={link}>{children}</NavbarLink>
    </NavigationMenuTrigger>
  );
};

const NavbarSubmenu: React.FC<{ key?: number; item: NavbarItem }> = ({
  item,
  key,
}) => {
  return (
    <NavigationMenu key={key || 1}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavbarTrigger link={item.link}>{item.title}</NavbarTrigger>
          <NavigationMenuContent className="bg-gray-800">
            {item.content}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const Navbar: React.FC = () => {
  const path = usePathname();

  const pathName = usePathname();
  const [isScrolledPast, setIsScrolledPast] = useState(true);
  const [open, setOpen] = useState(false);

  const useMobile = useIsMobile();

  useEffect(() => {
    if (pathName !== "/" && isScrolledPast) {
      setIsScrolledPast(false);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolledPast(!entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const target = document.querySelector(".preview-container-1");
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [pathName, isScrolledPast]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        "bg-gray-800 text-white",
        pathName === "/" &&
          !isScrolledPast &&
          "custom_desktop:bg-transparent custom_desktop:text-black",
      )}
      style={{
        transition: "background-color 0.3s ease, color 0.3s ease",
        fontFamily: "'Outfit'",
      }}
    >
      <div className="mx-auto lg:container">
        <div className="flex max-w-7xl items-center justify-between px-5 py-3 text-white lg:px-10">
          <Link
            className="flex items-center"
            href="/"
          >
            <Image
              src="/logo/logo_boyolali.svg"
              alt="Logo"
              width={40}
              height={40}
            />
            <div className="ml-3">
              <h1 className="text-lg font-bold">Desa Kedungmulyo</h1>
              <h2 className="text-sm">Kabupaten Boyolali</h2>
            </div>
          </Link>
          <nav className="relative flex items-center space-x-1">
            <div className="hidden items-center gap-1 space-x-5 pr-2 md:flex md:flex-row">
              {NavbarItems.map((item, index) => (
                <NavigationMenu key={index}>
                  <NavigationMenuList className="space-x-6">
                    <NavigationMenuItem>
                      {item.type === "link" ? (
                        <NavbarLink link={item.link}>{item.title}</NavbarLink>
                      ) : (
                        <NavbarSubmenu
                          key={index}
                          item={item}
                        />
                      )}
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ))}
            </div>

            <li className="relative block md:hidden">
              <Sheet
                open={open}
                modal
                onOpenChange={setOpen}
                key={"top"}
              >
                <SheetTrigger
                  className="text-semibold ml-2 items-center"
                  asChild
                >
                  <div className="relative flex h-11 w-11 cursor-pointer items-center justify-center gap-x-2 rounded-xl bg-gradient-to-tl from-color_custom-500 to-color_custom-700 py-2.5 font-medium text-white shadow-lg shadow-color_custom-600/20 drop-shadow-md transition-all duration-200 hover:opacity-80">
                    <div className="rounded-md bg-transparent px-2 py-2 text-center text-white">
                      {open ? (
                        <FaTimes
                          className="text-lg"
                          size={20}
                        />
                      ) : (
                        <FaBars
                          className="text-lg"
                          size={20}
                        />
                      )}
                    </div>
                  </div>
                </SheetTrigger>

                <SheetContent
                  className="border-gray-900 bg-gray-900 text-white"
                  side={"left"}
                >
                  <SheetHeader>
                    <SheetTitle className="flex border-b-4 border-white/20 px-5 py-4">
                      <div className="flex items-center">
                        <Image
                          alt=""
                          width="33"
                          height="33"
                          className="icon-glow mr-2 rounded-full"
                          src="/logo/logo_boyolali.svg"
                        />

                        <div className="ml-1 text-lg text-white">
                          <h1 className="text-lg font-bold">
                            Desa Kedungmulyo
                          </h1>
                          <h2 className="text-sm">Kabupaten Boyolali</h2>
                        </div>
                      </div>
                    </SheetTitle>

                    <SheetDescription className="rounded-lg text-lg">
                      <div className="h-full w-full space-y-2">
                        {NavbarItems.filter((a) => a.link).map(
                          (item, itemIndex) => {
                            return (
                              <Link
                                href={item.link as any}
                                key={itemIndex}
                                className={cn(
                                  "flex cursor-pointer items-center justify-between rounded-lg px-2 transition-all duration-150 hover:bg-teal-400 hover:bg-opacity-5 hover:text-white/100",
                                  path === item.link
                                    ? "bg-teal-400 bg-opacity-5 text-white/100"
                                    : "text-white/75",
                                )}
                                onClick={() => {
                                  setTimeout(() => setOpen(false), 100);
                                }}
                              >
                                <div
                                  key={itemIndex}
                                  className={`z-50 block w-max cursor-pointer p-4 font-semibold opacity-75 transition-all duration-150 hover:opacity-100`}
                                >
                                  {item.title}
                                </div>
                              </Link>
                            );
                          },
                        )}
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </li>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
