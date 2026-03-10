"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {

  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    queueMicrotask(() => {
      setLoggedIn(!!token);
      setUser(name || "");
    });
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  };

  return (

    <nav className="flex justify-between items-center p-4 border-b">

      <Link href="/">
        <h1 className="text-xl font-bold cursor-pointer">
          Travel Explorer
        </h1>
      </Link>

      <div className="flex gap-4 items-center">

        <Link href="/">Home</Link>

        {loggedIn && (
          <>
            {user && <span className="text-gray-600">Hello, {user}</span>}
            <Link href="/create">Create</Link>
          </>
        )}

        {!loggedIn && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}

        {loggedIn && (
          <button
            onClick={handleLogout}
            className="bg-black text-white px-3 py-1"
          >
            Logout
          </button>
        )}

      </div>

    </nav>

  );
}