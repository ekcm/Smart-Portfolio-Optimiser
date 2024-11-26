import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import ubsLogo from "../../../public/logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const menuItems = ["Dashboard", "Finance News"];

export default function NavBar() {
  const [username, setUsername] = useState<string>("Chester");
  const pathname = usePathname();

  const isLinkActive = (href: string) => pathname.includes(href);
  const formatMenuItem = (item: string): string => {
    return item.toLowerCase().replace(/\s+/g, "");
  };

  return (
    <nav className="flex items-center justify-between h-20 px-24 bg-white">
      <div className="flex items-center">
        <Image src={ubsLogo} alt="logo" priority className="h-12 w-20" />
        <div className="hidden md:flex">
          {menuItems.map((menuItem, index) => {
            const formattedItem = formatMenuItem(menuItem);
            return (
              <div className="ml-4" key={index}>
                <Link
                  href={`/${formattedItem}`}
                  className={`text-md relative ${
                    isLinkActive(`/${formattedItem}`)
                      ? "text-blue-900 font-semibold"
                      : "text-black"
                  }`}
                >
                  {menuItem}
                </Link>
              </div>
            );
          })}
        </div>
        <div className="md:hidden ml-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <div className="flex flex-col space-y-1">
                  <span className="block w-6 h-0.5 bg-black"></span>
                  <span className="block w-6 h-0.5 bg-black"></span>
                  <span className="block w-6 h-0.5 bg-black"></span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {menuItems.map((menuItem, index) => {
                const formattedItem = formatMenuItem(menuItem);
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link
                      href={`/${formattedItem}`}
                      className={`text-md relative ${
                        isLinkActive(`/${formattedItem}`)
                          ? "text-blue-900 font-semibold"
                          : "text-black"
                      }`}
                    >
                      {menuItem}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-md text-black">Welcome, {username}</span>
      </div>
    </nav>
  );
}
