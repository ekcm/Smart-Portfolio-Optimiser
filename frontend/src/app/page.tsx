"use client";

import { CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Image from "next/image";

import ubsLogo from "../../public/ubs-logo.png"
import { Link } from "next-view-transitions";
import { useTransitionRouter } from 'next-view-transitions';

export default function Home() {
  const router = useTransitionRouter();

  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center items-center">
            <Image src={ubsLogo} alt="logo" priority className="h-32 w-32" />
            <CardTitle className="text-2xl">
              Login to your account
            </CardTitle>
            <CardDescription>
              Enter your email and password to login
            </CardDescription>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-2">
                <Input type="email" placeholder="name@example.com" />
                <Input type="password" placeholder="Password" />
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/dashboard')
                  }}
                >
                  Login
                </Button>
              </div>
            </form>
          </div>
          <div className="flex w-full flex-row justify-between">
            <Link href="register">
              <CardDescription className="hover:underline cursor-pointer">
                Don&apos;t have an account? Register
              </CardDescription>
            </Link>
            <Link href="forget-password">
              <CardDescription className="hover:underline cursor-pointer">
                Forgot password?
              </CardDescription>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
