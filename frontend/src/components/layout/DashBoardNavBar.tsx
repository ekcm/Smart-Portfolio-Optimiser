import { Link } from "next-view-transitions";
import { useDashBoardNavBarStore } from "../../store/DashBoardNavBarState";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashBoardNavBar() {
    // main state of dashboard to display different set of buttons
    const DashBoardNavBarState = useDashBoardNavBarStore((state) => state.mainState);
    const setDashBoardNavBarState = useDashBoardNavBarStore((state) => state.setMainState);
    
    const pathname = usePathname();

    // TODO: Fix breadcrumbs labelling
    const generateBreadcrumbs = (pathname: string) => {
      const pathParts = pathname.split('/').filter(Boolean);
      return pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        let label = part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, ' $1').trim();
        const portfolioName = localStorage.getItem("portfolioName");
        if (index === 1 && portfolioName) {
            label = portfolioName;
        }

        return { href, label };
      });
    };

    const breadcrumbs = generateBreadcrumbs(pathname);

    const getButtonSet = (state: string) => {
        const id = pathname.split('/')[2];
        
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
                        <Link href={`/dashboard/${id}/optimization`}>
                            <Button className="mr-4 bg-blue-400">Portfolio Optimization</Button>
                        </Link>
                        <Link href={`/dashboard/${id}/neworder`}>
                            <Button className="mr-4 bg-red-500">Create New Order</Button>
                        </Link>
                        <Link href={`/dashboard/${id}/editportfolio`}>
                            <Button className="mr-4 bg-red-700">Edit Portfolio</Button>
                        </Link>
                        <Link href={`/dashboard/${id}/editcash`}>
                            <Button className="mr-4 bg-green-700">Edit Cash</Button>
                        </Link>
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