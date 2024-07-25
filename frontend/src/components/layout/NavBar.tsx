import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import ubsLogo from "../../../public/ubs-logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const menuItems = ["Dashboard", "Finance News"];

export default function NavBar() {
    const [username, setUsername] = useState<string>("Chester");
    const pathname = usePathname();

    const isLinkActive = (href: string) => pathname === href;
    const formatMenuItem = (item: string): string => {
        return item.toLowerCase().replace(/\s+/g, '');
    };

    return (
        <nav className="flex items-center justify-between h-20 bg-black-navbar text-white px-24">
            <div className="flex items-center">
                <Image src={ubsLogo} alt="logo" priority className="h-16 w-16"/>
                {menuItems.map((menuItem, index) => {
                    const formattedItem = formatMenuItem(menuItem);
                    return (
                        <div className="ml-4">
                            <Link
                                key={index}
                                href={`/${formattedItem}`}
                                className={`text-lg relative ${isLinkActive(`/${formattedItem}`) ? 'text-white' : 'text-gray-300'}`}
                            >
                                {menuItem}
                                {isLinkActive(`/${formattedItem}`) && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>}
                            </Link>
                        </div>
                    );
                })}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                        <div className="text-lg">Welcome, {username}</div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href="#">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link href="#">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link href="#">Logout</Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    )
}