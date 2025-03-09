"use client";

import { Skeleton } from "@/components/ui/skeleton";
import useLocalStorage from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useState } from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaMapMarkerAlt, FaUsers, FaUserShield } from "react-icons/fa";
import { FaClipboardList, FaPeopleGroup } from "react-icons/fa6";
import ClickOutside from "../clickOutside";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  session: Session;
}

export type MenuItem = {
  icon: React.JSX.Element;
  label: string;
  route?: string;
  message?: React.JSX.Element;
  adminOnly?: boolean;
  children?: (Omit<MenuItem, "icon" | "children" | "route"> &
    Required<Pick<MenuItem, "route">>)[];
};

export interface MenuGroupsProps {
  name: string;
  menuItems: MenuItem[];
}

export const sideBarMenuDashboard: MenuGroupsProps[] = [
  {
    name: "MAIN MENU",
    menuItems: [
      {
        label: "Data Pengurus",
        route: "/dashboard/data-pengurus",
        icon: <FaPeopleGroup size={28} />,
      },
      {
        label: "Data Penduduk",
        route: "/dashboard/data-penduduk",
        icon: <FaUsers size={28} />, // Ikon pengguna grup
      },
      {
        label: "Spot",
        route: "/dashboard/spot",
        icon: <FaMapMarkerAlt size={28} />, // Ikon lokasi
      },
      {
        label: "Tips",
        route: "/dashboard/tips",
        icon: <FaClipboardList size={28} />,
      },
    ],
  },
  {
    name: "ADMIN",
    menuItems: [
      {
        label: "Admin Users",
        adminOnly: true,
        route: "/dashboard/users",
        icon: <FaUserShield size={28} />, // Ikon admin pengguna
      },
      {
        label: "Logs",
        adminOnly: true,
        route: "/dashboard/logs",
        icon: <BsGraphUpArrow size={24} />, // Ikon log grafik naik
      },
    ],
  },
];

const SidebarItem = dynamic(() => import("./SidebarItem"), {
  ssr: true,
  loading: () => {
    return (
      <Skeleton
        className={cn(
          "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white",
          "group relative flex items-center gap-3 rounded-[7px] px-3.5 py-[1.55rem] font-medium",
        )}
      />
    );
  },
});

function filterMenu(session: Session) {
  const userSession = session.user;

  const updatedMenu = sideBarMenuDashboard.map((group) => ({
    ...group,
    menuItems: group.menuItems.filter((menuItem) => {
      if (menuItem.children) {
        menuItem.children = menuItem.children.filter((child) => {
          if (child.adminOnly) {
            return (
              userSession.priority === "System" || userSession.role === "Admin"
            );
          }
          return true;
        });

        return menuItem.children.length > 0;
      } else if (menuItem.adminOnly) {
        return (
          userSession.priority === "System" || userSession.role === "Admin"
        );
      }
      return true;
    }),
  }));

  return updatedMenu;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, session }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage<string>(
    "selectedMenu",
    "overview",
  );

  const [filteredMenu] = useState<MenuGroupsProps[]>(filterMenu(session));

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden border-r border-stroke bg-white dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear"
            : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-10">
          <Link
            className="flex items-center"
            href="/"
          >
            <div className="ml-3">
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 8.175H2.987L9.362 1.688a.75.75 0 1 0-1.2-.901L.4 8.363a.75.75 0 0 0 0 1.2l7.762 7.875a.75.75 0 0 0 1.2-.9L3.025 9.862H19a.75.75 0 0 0 0-1.5z" />
            </svg>
          </button>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {filteredMenu.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {group.name}
                </h3>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
