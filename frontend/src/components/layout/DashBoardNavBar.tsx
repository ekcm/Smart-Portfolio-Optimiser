import { Link } from "next-view-transitions";
import { useDashBoardNavBarStore } from "../../../store/DashBoardNavBarState";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashBoardNavBar() {
    // main state of dashboard to display different set of buttons
    const DashBoardNavBarState = useDashBoardNavBarStore((state) => state.mainState);
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    
    const pathname = usePathname();

    const generateBreadcrumbs = (pathname: string) => {
      const pathParts = pathname.split('/').filter(Boolean);
      return pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, ' $1').trim();
        return { href, label };
      });
    };

    const breadcrumbs = generateBreadcrumbs(pathname);

    // TODO: Add button actions
    const getButtonSet = (state: string) => {
        switch (state) {
            case "Main":
                return (
                    <Link href="/dashboard/createclientportfolio">
                        <Button variant="destructive">
                            Create Client Portfolio
                        </Button>
                    </Link>
                );

            case "Portfolio":
                return (
                    <>
                        <Button className="mr-4 bg-blue-400">Portfolio Optimization</Button>
                        <Button className="mr-4 bg-red-500">Create New Order</Button>
                        <Button className="mr-4 bg-red-700">Edit Portfolio</Button>
                    </>
                );
            case "Empty":
                return <></>;
            default:
                return null;
      }
    };

    return (
        <nav className="flex items-center justify-between h-16 bg-grey-navbar text-black-font px-24">
            <div className="flex items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.href}>
                                <BreadcrumbItem>
                                    <Link href={crumb.href} className="text-lg">
                                        {crumb.label}
                                    </Link>
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div>
                {getButtonSet(DashBoardNavBarState)}
            </div>
        </nav>
    )
}