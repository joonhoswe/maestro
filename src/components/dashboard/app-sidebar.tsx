"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Home,
  MusicIcon,
  BellIcon,
  Calendar,
  Users,
  TimerIcon,
  User2,
  ChevronUp,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Announcments",
    url: "#",
    icon: BellIcon,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Rehearsals",
    url: "#",
    icon: TimerIcon,
  },
  {
    title: "Sheet Music",
    url: "#",
    icon: MusicIcon,
  },
  {
    title: "People",
    url: "#",
    icon: Users,
  },
];

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("Home");

  return (
    <Sidebar>
      {/* Main Content */}
      <SidebarContent>
        <div className="pl-4 pt-4">
          <span className="text-3xl font-bold text-[#800020] font-['The_Seasons',serif]">
            Maestro
          </span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium">
            Orchestra Name
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="hover:bg-[#800020]/5 data-[active=true]:bg-[#800020]/10 data-[active=true]:text-[#800020]"
                    isActive={activeItem === item.title}
                  >
                    <a
                      href={item.url}
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveItem(item.title);
                      }}
                    >
                      <item.icon
                        className={
                          activeItem === item.title
                            ? "text-[#800020]"
                            : "text-gray-500"
                        }
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="hover:bg-[#800020]/5">
                  <Avatar className="h-6 w-6 ring-1 ring-[#800020]/10">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback className="bg-[#800020]/5 text-[#800020]">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span>John Doe</span>
                  <ChevronUp className="ml-auto text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[239px]">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-10 w-10 ring-1 ring-[#800020]/10">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="User"
                    />
                    <AvatarFallback className="bg-[#800020]/5 text-[#800020]">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">John Doe</span>
                    <span className="text-xs text-gray-500">
                      john.doe@example.com
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-[#800020]/5 hover:text-[#800020]">
                  <User2 className="mr-2 h-4 w-4 text-[#800020]" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#800020]/5 hover:text-[#800020]">
                  <CreditCard className="mr-2 h-4 w-4 text-[#800020]" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-[#800020]/5 hover:text-[#800020]">
                  <LogOut className="mr-2 h-4 w-4 text-[#800020]" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
