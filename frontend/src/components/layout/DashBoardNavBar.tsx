"use client";
import { Link, useTransitionRouter } from "next-view-transitions";
import { useDashBoardNavBarStore } from "@/store/DashBoardNavBarState";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { delay } from "@/utils/utils";
import { Loader2, ChevronDown } from "lucide-react";
import DateRangePicker from "./DateRangePicker";
import { startOfMonth, endOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  getMonthlyPortfolioReport,
  getOrdersHistoryReport,
} from "@/api/portfolio";

interface Breadcrumb {
  href: string;
  label: string;
}

export default function DashBoardNavBar() {
  const router = useTransitionRouter();
  // main state of dashboard to display different set of buttons
  const DashBoardNavBarState = useDashBoardNavBarStore(
    (state) => state.mainState
  );
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
  const [portfolioName, setPortfolioName] = useState<string | null>(null);
  const [financeNewsName, setFinanceNewsName] = useState<string | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const portfolioId: string = pathParts[1];
  const { toast } = useToast();

  // loader
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  const pages: Record<string, string> = {
    dashboard: "Dashboard",
    financenews: "Finance News",
    createclientportfolio: "Create Client Portfolio",
    optimization: "Optimization",
    neworder: "Create New Order",
    generateorderlist: "Generate Order List",
    editportfolio: "Edit Portfolio",
    editcash: "Edit Cash",
    rulelog: "Rule Logs",
  };

  const handleNavigate = (path: string) => {
    router.push(path); // Navigate to the given path
  };

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
  };

  useEffect(() => {
    const pathParts = pathname.split("/").filter(Boolean);
    if (pathParts[0] === "dashboard") {
      const portfolioName = getPortfolioName();
    } else if (pathParts[0] === "financenews") {
      const financeNewsName = getFinanceNewsName();
    }
    // Handle state update or breadcrumb update based on these
  }, [pathname]);

  const generateBreadcrumbs = (pathname: string) => {
    const pathParts = pathname.split("/").filter(Boolean);
    return pathParts.map((part, index) => {
      const href = "/" + pathParts.slice(0, index + 1).join("/");
      let label = pages[part];
      if (typeof window !== undefined && index === 1) {
        if (
          pathParts[0] === "dashboard" &&
          !Object.hasOwn(pages, pathParts[1])
        ) {
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

  // Generate monthly report
  const handleGenerateMonthlyReport = async () => {
    const portfolioName = getPortfolioName();
    console.log("Generate monthly report");
    setReportLoading(true);
    toast({
      title: `Your report is being generated!`,
      description: `Custom report for portfolio ${portfolioName} will be downloaded to your device!`,
    });
    try {
      await delay(1500);
      await getMonthlyPortfolioReport(portfolioId, portfolioName);
      console.log("delayed Generate monthly report");
      toast({
        title: `Monthly report generated successfully.`,
        description: `Monthly report for portfolio ${portfolioName} will be downloaded to your device!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with your request: ${error}`,
      });
    } finally {
      setReportLoading(false);
    }
  };

  // Generate ranged report
  const handleGenerateOrdersExecutionReport = async () => {
    console.log("Generate range report");
    console.log(date);
    setReportLoading(true);
    toast({
      title: `Your report is being generated!`,
      description: `Custom report for portfolio ${portfolioName} will be downloaded to your device!`,
    });
    try {
      await delay(1500);
      await getOrdersHistoryReport(
        portfolioId,
        portfolioName,
        date?.from,
        date?.to
      );
      toast({
        title: `Full report generated successfully.`,
        description: `Orders History report for portfolio ${portfolioName} will be downloaded to your device!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `There was a problem with your request: ${error}`,
      });
    } finally {
      setReportLoading(false);
    }
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
      const newPortfolioName = localStorage.getItem("portfolioName");
      const newFinanceNewsName = localStorage.getItem("financeNews");

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
    const id = pathname.split("/")[2];

    switch (state) {
      case "Main":
        return (
          <Link href="/dashboard/createclientportfolio">
            <Button variant="destructive" className="bg-transparent hover:bg-gray-200 text-black flex items-center space-x-2 shadow-none border-none">Create Client Portfolio</Button>
          </Link>
        );
      case "Portfolio":
        return (
          <>
            <div className="flex space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-transparent hover:bg-gray-200 text-black flex items-center space-x-2 shadow-none border-none">
                    <span>Portfolio Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      handleNavigate(`/dashboard/${id}/optimization`)
                    }
                  >
                    Portfolio Optimization
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNavigate(`/dashboard/${id}/neworder`)}
                  >
                    Create New Order
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      handleNavigate(`/dashboard/${id}/editportfolio`)
                    }
                  >
                    Edit Portfolio Rules
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNavigate(`/dashboard/${id}/editcash`)}
                  >
                    Edit Cash
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleNavigate(`/dashboard/${id}/rulelog`)}
                  >
                    Rule Logs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {reportLoading ? (
                <Button disabled className="w-52">
                  <span className="flex items-center space-x-2">
                    <span>Generating Report</span>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-transparent hover:bg-gray-200 text-black flex items-center space-x-2 w-52"
                    >
                      <span>Generate Portfolio Reports</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="space-y-2 flex flex-col">
                    <DateRangePicker
                      date={date}
                      setDate={setDate}
                      onGenerateReport={handleGenerateOrdersExecutionReport}
                    />
                    <DropdownMenuItem
                      onClick={handleGenerateMonthlyReport}
                      className="cursor-pointer"
                    >
                      Monthly Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </>
        );
      case "Rulelogger":
        return (
          <>
            <Link href={`/dashboard/${id}/editportfolio`}>
              <Button className="mr-4" variant={"ghost"}>Edit Portfolio Rules</Button>
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
    <nav className="flex items-center justify-between h-16 bg-white text-black-font px-24 border-t border-gray-300">
      <div className="flex items-center ">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  <Link href={crumb.href} className="text-lg text-black underline">
                    {crumb.label}
                  </Link>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>{getButtonSet(DashBoardNavBarState)}</div>
    </nav>
  );
}
