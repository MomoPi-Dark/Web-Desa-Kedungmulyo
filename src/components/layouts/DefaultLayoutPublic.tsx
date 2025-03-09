import { cn } from "@/lib/utils";
import Footer from "../static/Footer";
import Navbar from "../static/Navbar";
import WhatsAppWidget from "../static/WhatsAppWidget";

export default function LayoutPublic({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <>
      <Navbar />
      <main className={cn(className)}>{children}</main>
      <Footer />
      <WhatsAppWidget />
    </>
  );
}
