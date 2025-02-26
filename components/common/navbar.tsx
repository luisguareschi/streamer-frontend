import { usePlatform } from "@/hooks/usePlatform";
import { cn } from "@/lib/utils";
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
      className="flex flex-col items-center justify-center text-white relative size-[56px] active:bg-white active:bg-opacity-10 rounded-lg transition-all"
    >
      <div className="">{icon}</div>
      {isActive && (
        <div className="size-1.5 bg-white rounded-full absolute bottom-1" />
      )}
    </Link>
  );
};

export const Navbar = () => {
  const { isIOS, isPWA } = usePlatform();
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
    <div
      className={cn(
        "fixed bottom-0 left-0 w-screen h-20 bg-black bg-opacity-30 backdrop-blur-lg grid grid-cols-4 justify-items-center items-center",
        isIOS && isPWA && "pb-6 h-24",
      )}
    >
      {items.map((item) => (
        <NavbarItem key={item.href} {...item} />
      ))}
    </div>
  );
};
