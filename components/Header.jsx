"use client";

import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/useStoreUser";
import { BarLoader } from "react-spinners";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

const Header = () => {
  const { isLoading } = useStoreUser();
  const path = usePathname();

  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50">
      <nav className="w-full mx-auto px-4 h-16 flex items-center justify-between border-2">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/logos/logo-s.ico"}
            alt="DividoFlex"
            width={200}
            height={60}
            className="h-11 w-auto object-contain"
          />
          <span className="text-xl hidden md:block text-green-600">ettleUp</span>
        </Link>

        {path === "/" && (
          <div className="hidden md:flex md:items-center md:justify-center gap-6 text-gray-800 ml-28">
            <Link
              href="#features"
              className="text-sm font-medim hover:text-gren-600 transition hover:text-green-950"
            >
              Features
            </Link>

            <Link
              href="#Highlights"
              className="text-sm font-medim hover:text-gren-800 transition hover:text-green-950"
            >
              Highlights
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Unauthenticated>
            <SignInButton>
              <Button variant={"ghost"}>Sign In</Button>
            </SignInButton>

            <SignUpButton>
              <Button className="bg-black hover:bg-green-800 border-none">
                Let's Go
              </Button>
            </SignUpButton>
          </Unauthenticated>

          <Authenticated>
            <Link href="/dashboard">

              <Button variant="outline" className="hidden md:inline-flex items-center gap-2 hover:text-green-600">
                <LayoutDashboard className="h-4 w-4" />
                DashBoard
              </Button>

              <Button variant={"ghost"} className="w-10 h-10 p-0 md:hidden">
                <LayoutDashboard className="h-4 w-4"/>
              </Button>

            </Link>
            
            <UserButton/>
          </Authenticated>
        </div>
      </nav>

      {isLoading && <BarLoader width={"100%"} color="gray" />}
    </header>
  );
};

export default Header;
