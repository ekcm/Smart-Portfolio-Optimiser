import { Link } from "next-view-transitions";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import ubsLogo from "../../../public/ubs-logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function NavBar() {
    const [username, setUsername] = useState<string>("Chester");
    const pathname = usePathname();

    const isLinkActive = (href: string) => pathname === href;

    return (
        <nav className="flex items-center justify-between h-16 bg-black-navbar text-white px-24">
            <div className="flex items-center">
                <Image src={ubsLogo} alt="logo" priority className="h-16 w-16"/>
                <div className="ml-4">
                    <Link 
                        href="/dashboard" 
                        className={`text-lg relative ${isLinkActive('/dashboard') ? 'text-white' : 'text-gray-300'}`}
                    >
                        Dashboard
                        {isLinkActive('/dashboard') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>}
                    </Link>
                </div>
                <div className="ml-4">
                    <Link 
                        href="/financenews" 
                        className={`text-lg relative ${isLinkActive('/financenews') ? 'text-white' : 'text-gray-300'}`}
                    >
                        Finance News
                        {isLinkActive('/financenews') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></span>}
                    </Link>
                </div>
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