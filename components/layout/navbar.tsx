"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMockSession } from "@/components/providers/session-provider";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Lightbulb,
  Users,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const session = useMockSession();

  if (!session) return null;

  const isBrandOwner = session.user.role === "BRAND_OWNER";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Posts", href: "/posts", icon: FileText, show: true },
    { name: "Inspiration", href: "/inspiration", icon: Lightbulb, show: true },
    { name: "Users", href: "/users", icon: Users, show: isBrandOwner },
    { name: "Brand Voice", href: "/brand-voice", icon: Settings, show: isBrandOwner },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-primary">
                BrandCat
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) =>
                item.show ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium",
                      pathname === item.href
                        ? "border-primary text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {session.user.name || session.user.email}
            </span>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert("Demo mode - sign out disabled")}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
