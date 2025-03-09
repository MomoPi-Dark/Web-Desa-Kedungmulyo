import SessionProvider from "@/components/providers/sessions-provider";
import { Toaster as ToasterSonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import profile from "../../profile.mjs";

import "@/lib/firebase/firebase";
import "./globals.css";

const { name, sortDescription } = profile;
export const metadata: Metadata = {
  title: {
    template: `${name} - %s`,
    default: `${name} - ${sortDescription}`,
  },
  icons: [
    {
      rel: "icon",
      url: "/logo/logo_boyolali.svg",
      sizes: "50x50",
      type: "image/svg",
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <SessionProvider>
          {children}
          <Toaster />
          <ToasterSonner />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}
