"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import Header from "../static/dasboard/Header";
import Sidebar from "../static/dasboard/Sidebar";

export default function DefaultLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const router = useRouter();
  const pathName = usePathname(); // Moved outside conditional check to avoid violating rules of hooks.
  const [sidebarOpen, setSidebarOpen] = useState(false); // Moved outside conditional check.

  if (!session) {
    router.push("/");
    return null;
  }

  const pathNames = pathName
    .split("/")
    .filter(Boolean)
    .map((item, index, arr) => {
      const link = `/${arr.slice(0, index + 1).join("/")}`;
      const title = item
        .replace(/-/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

      return { link, title };
    });

  return (
    <div style={{ fontFamily: "Outfit, sans-serif" }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          session={session}
        />

        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header Component */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={session?.user}
          />

          {/* Main Content */}
          <main>
            {/* Breadcrumb Navigation */}
            <div
              className={cn(
                "flex h-max w-full justify-start px-8 pb-2 pt-7 font-outfit",
              )}
            >
              <Breadcrumb>
                <BreadcrumbList>
                  {pathNames.map((path, index) => {
                    const isEnd = index === pathNames.length - 1;

                    return (
                      <React.Fragment key={index}>
                        <BreadcrumbItem className="text-lg">
                          {isEnd ? (
                            <BreadcrumbPage className="text-blue/95">
                              {path.title}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={path.link}>
                              {path.title}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                        {!isEnd && pathNames.length > 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Page Content */}
            <div className="mx-auto p-4 md:p-5 2xl:p-10">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
