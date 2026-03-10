"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const desktopUserMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    queueMicrotask(() => {
      setLoggedIn(!!token);
      setUser(name || "");
    });
  }, [pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const insideDesktop = desktopUserMenuRef.current?.contains(e.target);
      const insideMobile = mobileUserMenuRef.current?.contains(e.target);
      if (!insideDesktop && !insideMobile) setUserMenuOpen(false);
    };
    if (userMenuOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [userMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  const navLink = "text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors font-medium";
  const activeLink = "text-teal-600 dark:text-teal-400";

  const navLinks = (
    <>
      <Link
        href="/"
        className={pathname === "/" ? activeLink : navLink}
      >
        Home
      </Link>
      {loggedIn && (
        <Link
          href="/create"
          className={pathname === "/create" ? activeLink : navLink}
        >
          Create
        </Link>
      )}
      {!loggedIn && (
        <>
          <Link href="/login" className={navLink}>
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            Sign up
          </Link>
        </>
      )}
      {loggedIn && user && (
        <div className="relative" ref={desktopUserMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold shrink-0 hover:ring-2 hover:ring-teal-400 hover:ring-offset-2 transition-all"
            title={user}
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            {user.charAt(0).toUpperCase()}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 py-1 min-w-[120px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (

    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
              Travel Explorer
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            {loggedIn && user && (
              <div className="relative" ref={mobileUserMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-semibold shrink-0"
                  title={user}
                >
                  {user.charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 py-1 min-w-[120px] rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-3">
              <Link href="/" className={`py-2 ${pathname === "/" ? activeLink : navLink}`}>
                Home
              </Link>
              {loggedIn && (
                <Link href="/create" className={`py-2 ${pathname === "/create" ? activeLink : navLink}`}>
                  Create
                </Link>
              )}
              {!loggedIn && (
                <>
                  <Link href="/login" className="py-2">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex justify-center py-2.5 px-4 rounded-full bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors w-fit"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </nav>

  );
}
