"use client";

// import DashBoardNavBar from "@/components/layout/DashBoardNavBar";
import NavBar from "@/components/layout/NavBar";
import { Skeleton } from "@/components/ui/skeleton";
import { lazy, ReactNode, Suspense } from "react";
const DashBoardNavBar = lazy(() => import('@/components/layout/DashBoardNavBar'));

function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      <Suspense fallback={<Skeleton />} >
        <DashBoardNavBar />
      </Suspense>
      <div className="flex-grow">{children}</div>
    </>
  );
}

export default AuthenticatedLayout;