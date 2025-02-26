"use client";

import * as React from "react";

import {
  AudioWaveform,
  Calendar1Icon,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  TrendingUpDownIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavAdmin } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useAuth } from "./auth/context";

// This is sample data.
const data = {
  user: {
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Manage",
      url: "/manage",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/manage",
        },
        {
          title: "Team Members",
          url: "/manage/team-member",
        },
        {
          title: "Time-off Requests",
          url: "/manage/time-off",
        },
        {
          title: "Admin",
          url: "/manage/admin",
        },
      ],
    },
    {
      title: "Forecast",
      url: "/forecast",
      icon: TrendingUpDownIcon,
      items: [
        {
          title: "Dashboard",
          url: "/forecast",
        },
        {
          title: "Teams",
          url: "/forecast/team",
        },
        {
          title: "Positions",
          url: "/forecast/position",
        },
        {
          title: "Variables",
          url: "/forecast/variable",
        },
        {
          title: "Reports",
          url: "/forecast/report",
        },
        {
          title: "Admin",
          url: "/forecast/admin",
        },
      ],
    },
    {
      title: "Schedule",
      url: "#",
      icon: Calendar1Icon,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  admin: [
    {
      title: "Design Engineering",
      url: "#",
      icon: Frame,
      items: [],
    },
    {
      title: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      items: [],
    },
    {
      title: "Travel",
      url: "#",
      icon: Map,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const auth = useAuth();
  const user = {
    avatar: data.user.avatar,
    email: auth!.user!.email,
    name: auth!.user!.firstName,
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavAdmin items={data.admin} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
