import LayoutPublic from "@/components/layouts/DefaultLayoutPublic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutPublic>{children}</LayoutPublic>;
}
