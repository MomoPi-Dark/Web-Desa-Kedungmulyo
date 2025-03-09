export type NavbarItem = {
  type: "link" | "trigger";
  link: string;
  title: string;
  content?: React.JSX.Element;
};

export const NavbarItems: NavbarItem[] = [
  { type: "link", link: "/", title: "Beranda" },
  {
    type: "link",
    link: "/profil-desa",
    title: "Profil Desa",
  },
  { type: "link", link: "/spot", title: "Spot" },
  { type: "link", link: "/tips", title: "Tips" },
];
