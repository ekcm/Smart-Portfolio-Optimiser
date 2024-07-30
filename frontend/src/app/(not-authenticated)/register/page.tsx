"use client";

import { useState } from "react";

import { CardTitle, CardDescription } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

import Image from "next/image";

import ubsLogo from "../../../../public/ubs-logo.png";

export default function Register() {
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const toggleFormType = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsRegister(!isRegister);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div
          className={`mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] transition-opacity duration-500 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="flex flex-col space-y-2 text-center items-center">
            <Image src={ubsLogo} alt="logo" priority className="h-32 w-32" />
            <CardTitle className="text-2xl">
              {isRegister ? "Create an account" : "Login to your account"}
            </CardTitle>
            <CardDescription>
              {isRegister
                ? "Enter your email below to create your account"
                : "Enter your email and password to login"}
            </CardDescription>
          </div>
          <div className="grid gap-6">
            <form>
              <div className="grid gap-2">
                <Input type="email" placeholder="name@example.com" />
                {isRegister ? (
                  <Button>Create account</Button>
                ) : (
                  <>
                    <Input type="password" placeholder="Password" />
                    <Button>Login</Button>
                  </>
                )}
              </div>
            </form>
          </div>
          <div className="flex w-full flex-row justify-between">
            <CardDescription
              className="hover:underline cursor-pointer"
              onClick={toggleFormType}
            >
              {isRegister
                ? "Have an account? Login"
                : "Don't have an account? Register"}
            </CardDescription>
            {!isRegister && (
              <CardDescription className="hover:underline cursor-pointer">
                Forgot password?
              </CardDescription>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
