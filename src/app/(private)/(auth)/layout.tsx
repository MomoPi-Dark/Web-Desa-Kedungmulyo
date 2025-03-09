import NotFoundPublic from "@/app/(public)/[...not-found]/page";
import LayoutDashboard from "@/components/layouts/DefaultLayoutPrivate";
import LayoutPublic from "@/components/layouts/DefaultLayoutPublic";
import { ThemeProvider } from "@/components/providers/theme-provider";
import authConfig from "@/lib/authConfig";
import { getServerSession } from "next-auth";

export default async function RootDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return (
      <LayoutPublic>
        <NotFoundPublic />
      </LayoutPublic>
    );
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <LayoutDashboard session={session}>{children}</LayoutDashboard>
    </ThemeProvider>
  );
}
