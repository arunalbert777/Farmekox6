"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Leaf,
  Calendar,
  CloudSun,
  Calculator,
  LineChart,
  BotMessageSquare,
  UserSquare,
  Map,
  Tractor,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/hooks";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "dashboard" },
  { href: "/dashboard/crop-recommendation", icon: Leaf, label: "crop_recommendation" },
  { href: "/dashboard/crop-calendar", icon: Calendar, label: "crop_calendar" },
  { href: "/dashboard/weather", icon: CloudSun, label: "weather_forecast" },
  { href: "/dashboard/fertilizer-calculator", icon: Calculator, label: "fertilizer_calculator" },
  { href: "/dashboard/market-watch", icon: LineChart, label: "market_watch" },
  { href: "/dashboard/ai-advisory", icon: BotMessageSquare, label: "ai_advisory" },
  { href: "/dashboard/ask-expert", icon: UserSquare, label: "ask_expert" },
  { href: "/dashboard/resources", icon: Map, label: "resources" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Tractor className="size-8 text-primary" />
          <h1 className="font-headline text-2xl font-bold text-primary">
            {t('farmekox')}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarMenu className="flex-1 p-2">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={{ children: t(item.label as any) }}
              >
                <item.icon />
                <span>{t(item.label as any)}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter>
        {/* Can add user profile or settings here */}
      </SidebarFooter>
    </Sidebar>
  );
}
