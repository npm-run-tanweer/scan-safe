"use client";
import React from "react";
import { Home, User, Camera, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export const Navigation = () => {
  const pathname = usePathname(); // ✅ replaces location.pathname
  const user = useUser();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/scan", icon: Camera, label: "Scan" },
    { path: "/history", icon: History, label: "History" },
  ];

  return (
    user.isSignedIn && (
      <nav className="bg-white/90 backdrop-blur-md border-t border-emerald-100 fixed w-screen bottom-0 z-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path; // ✅ works fine now

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/50"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "scale-110" : ""
                  } transition-transform`}
                />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
    )
  );  
};
