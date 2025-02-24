"use client";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { Battery, Bolt, ChartLine, Home, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Battery Lease", href: "/battery-lease", icon: Battery },
  { name: "Energy Trading", href: "/energy-trading", icon: Bolt },
  { name: "Analytics", href: "/analytics", icon: ChartLine },
  { name: "Admin", href: "/admin", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuroraBackground className="flex h-screen">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="w-64 bg-black/10 backdrop-blur-xl p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="text-2xl font-bold text-[#f78a1d]">ChargeX</div>
          </div>
          <NavigationMenu className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#f78a1d] text-white"
                      : "hover:bg-black/5 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </NavigationMenu>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </AuroraBackground>
  );
}
