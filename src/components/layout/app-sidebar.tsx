
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Leaf,
  Calendar,
  CloudSun,
  Info,
  LineChart,
  BotMessageSquare,
  UserSquare,
  Map,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/hooks";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "dashboard" },
  { href: "/dashboard/crop-recommendation", icon: Leaf, label: "crop_recommendation" },
  { href: "/dashboard/crop-calendar", icon: Calendar, label: "crop_calendar" },
  { href: "/dashboard/weather", icon: CloudSun, label: "weather_forecast" },
  { href: "/dashboard/fertilizer-info", icon: Info, label: "fertilizer_info" },
  { href: "/dashboard/market-watch", icon: LineChart, label: "market_watch" },
  { href: "/dashboard/ai-advisory", icon: BotMessageSquare, label: "ai_advisory" },
  { href: "/dashboard/ask-expert", icon: UserSquare, label: "ask_expert" },
  { href: "/dashboard/resources", icon: Map, label: "resources" },
  { href: "/dashboard/direct-sales", icon: Store, label: "direct_sales" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const logo = PlaceHolderImages.find(img => img.id === 'app-logo');

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-xl shadow-md border-2 border-primary/20 bg-white">
            {logo && (
              <Image 
                src={logo.imageUrl} 
                alt="Farmekox Logo" 
                fill 
                className="object-cover"
              />
            )}
          </div>
          <h1 className="font-headline text-2xl font-bold text-primary">
            {t('farmekox')}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: t(item.label as any) }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{t(item.label as any)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  );
}
