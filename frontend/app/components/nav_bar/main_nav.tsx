"use client";

import Link from "next/link";
import React, { useContext, useState } from "react";
import { LoginRegistrationContext } from "@/app/context/login_registration";
import { UseGetMethod } from "@/app/hooks/get_method";
import { usePathname } from "next/navigation";
interface User {
  name: string;
  surname: string;
  email: string;
}

interface Report {
  date: Date;
  amount: number;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
    isPayer: boolean;
    dept: number;
  };
}

interface Payload {
  user: User;
  reports: Report[];
}
export default function MainNavBar() {
  const context = useContext(LoginRegistrationContext);
  const { dataHook } = UseGetMethod<Payload>("getuser", context?.response);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  return (
    <header className="bg-blue-600 p-4">
      <div className="flex justify-between items-center">
        {/* Hamburger icon (shown only on small screens) */}
        <button
          className="text-white text-2xl lg:hidden w-fit m-0 bg-blue-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex gap-6 text-white">
          <Link
            href="/"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/" ? "bg-amber-600" : ""}
          >
            Domov
          </Link>
          <Link
            href="/prihlasenie"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/prihlasenie" ? "bg-amber-600" : ""}
          >
            Prihlásenie
          </Link>
          <Link
            href="/registracia"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/registracia" ? "bg-amber-600" : ""}
          >
            Registrácia
          </Link>
          {dataHook && (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              href={`users/${dataHook.user.name.toLowerCase()}-${dataHook.user.surname.toLowerCase()}`}
              className={pathname.startsWith("/users") ? "bg-amber-600" : ""}
            >
              {dataHook.user.name} {dataHook.user.surname}
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <nav className="flex flex-col gap-3 mt-4 text-white lg:hidden">
          <Link
            href="/"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/" ? "bg-amber-600" : ""}
          >
            Domov
          </Link>
          <Link
            href="/prihlasenie"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/prihlasenie" ? "bg-amber-600" : ""}
          >
            Prihlásenie
          </Link>
          <Link
            href="/registracia"
            onClick={() => setIsOpen(!isOpen)}
            className={pathname === "/registracia" ? "bg-amber-600" : ""}
          >
            Registrácia
          </Link>
          {dataHook && (
            <Link
              onClick={() => setIsOpen(!isOpen)}
              href={`users/${dataHook.user.name.toLowerCase()}-${dataHook.user.surname.toLowerCase()}`}
              className={pathname.startsWith("/users") ? "bg-amber-600" : ""}
            >
              {dataHook.user.name} {dataHook.user.surname}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
