'use client';
import { Link } from "next-view-transitions";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { delay } from "@/utils/utils";

interface Breadcrumb {
  href: string;
  label: string;
}

export default function DashBoardNavBar() {
    // main state of dashboard to display different set of buttons
    const DashBoardNavBarState = useDashBoardNavBarStore((state) => state.mainState);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const pathname = typeof window !== "undefined" ? usePathname() : "";
    const [portfolioName, setPortfolioName] = useState<string | null>(null);
    const [financeNewsName, setFinanceNewsName] = useState<string | null>(null);


    const pages: Record<string, string> = {
        dashboard: "Dashboard",
        financenews: "Finance News",
        createclientportfolio: "Create Client Portfolio",
        optimization: "Optimization",
        neworder: "Create New Order",
        generateorderlist: "Generate Order List",
        editportfolio: "Edit Portfolio",
        editcash: "Edit Cash",
    }

    const getPortfolioName = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("portfolioName");
        }
        return null;
    };
    
    const getFinanceNewsName = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("financeNews");
        }
        return null;
    }

    useEffect(() => {
        const pathParts = pathname.split('/').filter(Boolean);
        if (pathParts[0] === "dashboard") {
            const portfolioName = getPortfolioName();
        } else if (pathParts[0] === "financenews") {
            const financeNewsName = getFinanceNewsName();
        }
        // Handle state update or breadcrumb update based on these
    }, [pathname]);

    // TODO: Fix breadcrumbs labelling
    const generateBreadcrumbs = (pathname: string) => {
      const pathParts = pathname.split('/').filter(Boolean);
      return pathParts.map((part, index) => {
        const href = '/' + pathParts.slice(0, index + 1).join('/');
        let label = pages[part];
        if (typeof window !== undefined && index === 1) {
            if (pathParts[0] === "dashboard") {
                const portfolioName = getPortfolioName();
                label = portfolioName ? portfolioName : label;
            } else if (pathParts[0] === "financenews") {
                const financeNewsName = getFinanceNewsName();
                label = financeNewsName ? financeNewsName : label;
            }
        }

        return { href, label };
      });
    };

    useEffect(() => {
        if (pathname) {
        const newBreadcrumbs = generateBreadcrumbs(pathname);
        setBreadcrumbs(newBreadcrumbs);
        }
    }, [pathname, portfolioName, financeNewsName]);

  // Custom hook to check for localStorage changes
    useEffect(() => {
        const handleLocalStorageChange = () => {
            const newPortfolioName = localStorage.getItem('portfolioName');
            const newFinanceNewsName = localStorage.getItem('financeNews');

            // Only update if the value has changed
            if (newPortfolioName !== portfolioName) {
                setPortfolioName(newPortfolioName);
            }
            if (newFinanceNewsName !== financeNewsName) {
                setFinanceNewsName(newFinanceNewsName);
            }
        };

        // Set up an interval to periodically check for changes
        const intervalId = setInterval(handleLocalStorageChange, 1000); // Check every second

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [portfolioName, financeNewsName]);


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