import { usePlatform } from "@/hooks/usePlatform";
import { cn } from "@/lib/utils";
import { Bookmark, HomeIcon, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarItemProps {
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
  label: string;
}

const NavbarItem = ({ icon, href, onClick, label }: NavbarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:w-fit items-center justify-center text-white relative size-[56px] active:bg-white active:bg-opacity-10 rounded-lg transition-all sm:px-3 sm:py-1"
    >
      <div className="sm:hidden">{icon}</div>
      {isActive && (
        <div className="size-1.5 bg-white rounded-full absolute bottom-1 sm:hidden" />
      )}
      <p
        className={cn(
          "hidden sm:block text-gray-200",
          isActive && "text-white font-medium underline underline-offset-8",
        )}
      >
        {label}
      </p>
    </Link>
  );
};

export const Navbar = () => {
  const { isIOS, isPWA, isWebview } = usePlatform();

  const showExtraPadding = (isIOS && isPWA) || isWebview;

  const items: NavbarItemProps[] = [
    {
      icon: <HomeIcon />,
      href: "/home",
      label: "Home",
    },
    {
      icon: <Bookmark />,
      href: "/my-list",
      label: "My List",
    },
    {
      icon: <Search />,
      href: "/search",
      label: "Search",
    },
    {
      icon: <UserRound />,
      href: "/profile",
      label: "Profile",
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-screen h-20 bg-black bg-opacity-30 backdrop-blur-lg grid grid-cols-4 sm:flex sm:gap-0 sm:px-6 justify-items-center items-center sm:top-0",
        showExtraPadding && "pb-6 h-24",
      )}
    >
      <h1 className="text-white font-medium text-2xl hidden sm:block sm:mr-5">
        Streamer
      </h1>
      {items.map((item) => (
        <NavbarItem key={item.href} {...item} />
      ))}
    </div>
  );
};
