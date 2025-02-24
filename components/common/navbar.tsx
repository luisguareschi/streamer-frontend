import { Bookmark, HomeIcon, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarItemProps {
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
}

const NavbarItem = ({ icon, href, onClick }: NavbarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center justify-center text-white relative"
    >
      <div className="active:bg-white active:bg-opacity-10 rounded-lg p-4 transition-all">
        {icon}
      </div>
      {isActive && (
        <div className="size-1.5 bg-white rounded-full absolute bottom-4" />
      )}
    </Link>
  );
};

export const Navbar = () => {
  const items: NavbarItemProps[] = [
    {
      icon: <HomeIcon />,
      href: "/home",
    },
    {
      icon: <Bookmark />,
      href: "/my-list",
    },
    {
      icon: <Search />,
      href: "/search",
    },
    {
      icon: <UserRound />,
      href: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-screen h-20 bg-black bg-opacity-30 backdrop-blur-lg grid grid-cols-4">
      {items.map((item) => (
        <NavbarItem key={item.href} {...item} />
      ))}
    </div>
  );
};
