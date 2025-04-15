"use client"

import * as React from "react"
import { 
  MusicIcon, 
  BellIcon, 
  CalendarIcon, 
  UsersIcon, 
  SettingsIcon, 
  HomeIcon, 
  StickyNoteIcon,
  SearchIcon,
  PlusIcon,
  ChevronDownIcon
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenuBadge,
  SidebarMenuAction,
  SidebarSeparator,
  SidebarInput,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<string>("home")
  const [open, setOpen] = React.useState<boolean>(true)
  const [subMenuOpen, setSubMenuOpen] = React.useState<boolean>(false)
  
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Welcome to Maestro</h1>
            <p className="text-gray-500 mb-6">Your orchestra management dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Upcoming Rehearsals" 
                count={3} 
                icon={<CalendarIcon className="h-5 w-5" />} 
              />
              <DashboardCard 
                title="Sheet Music" 
                count={12} 
                icon={<MusicIcon className="h-5 w-5" />} 
              />
              <DashboardCard 
                title="New Announcements" 
                count={5} 
                icon={<BellIcon className="h-5 w-5" />} 
              />
            </div>
          </div>
        )
      case "sheet-music":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Sheet Music</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {["Beethoven Symphony No. 5", "Mozart Symphony No. 40", "Tchaikovsky Symphony No. 6", 
                "Bach Brandenburg Concerto No. 3", "Dvořák Symphony No. 9"].map((piece, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <MusicIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-gray-800">{piece}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "announcements":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Announcements</h1>
            <div className="space-y-4">
              {[
                { title: "Schedule Change", content: "Rehearsal moved to Thursday 7 PM" },
                { title: "New Repertoire", content: "Added Mahler Symphony No. 5 to our season" },
                { title: "Guest Conductor", content: "Jane Smith will be joining us next month" },
                { title: "Venue Update", content: "Summer concert moved to Central Park" },
                { title: "Section Leaders Meeting", content: "Meeting this Friday at 5 PM" }
              ].map((announcement, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold text-gray-800">{announcement.title}</h3>
                  <p className="text-gray-500 mt-1">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "calendar":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Calendar</h1>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <p className="text-gray-500">Calendar view would be displayed here</p>
            </div>
          </div>
        )
      case "members":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Orchestra Members</h1>
            <div className="space-y-3">
              {[
                { name: "John Doe", section: "Violin" },
                { name: "Jane Smith", section: "Cello" },
                { name: "Robert Johnson", section: "Trumpet" },
                { name: "Lisa Anderson", section: "Flute" },
                { name: "Michael Brown", section: "Percussion" }
              ].map((member, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-medium">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{member.name}</h3>
                    <p className="text-gray-500 text-sm">{member.section}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "notes":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Conductor Notes</h1>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <p className="text-gray-500">Your conductor notes would be displayed here</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">Settings</h1>
            <div className="bg-white border border-gray-100 rounded-lg p-5">
              <p className="text-gray-500">Account and application settings would be displayed here</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} defaultOpen={true}>
      <div className="flex h-screen bg-white">
        <Sidebar collapsible="icon" variant="sidebar" className="border-r border-gray-100">
          <SidebarHeader className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Maestro</h2>
            <p className="text-sm text-gray-400">Orchestra Management</p>
          </SidebarHeader>
          
          <SidebarContent>
            <div className="px-4 py-3">
              <SidebarInput placeholder="Search..." className="bg-gray-50 border-0 focus-visible:ring-blue-500" />
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel className="px-5 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Dashboard
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("home")}
                      isActive={activeTab === "home"}
                      tooltip="Home"
                      className={activeTab === "home" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <HomeIcon className="h-4 w-4 mr-3" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("calendar")}
                      isActive={activeTab === "calendar"}
                      tooltip="Calendar"
                      className={activeTab === "calendar" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <CalendarIcon className="h-4 w-4 mr-3" />
                      <span>Calendar</span>
                      <SidebarMenuBadge className="ml-auto bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        3
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator className="my-1 bg-gray-100" />
            
            <SidebarGroup>
              <div className="flex items-center justify-between px-5 py-2">
                <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Music Library
                </SidebarGroupLabel>
                <SidebarMenuAction asChild showOnHover={false}>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </SidebarMenuAction>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("sheet-music")}
                      isActive={activeTab === "sheet-music"}
                      tooltip="Sheet Music"
                      className={activeTab === "sheet-music" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <MusicIcon className="h-4 w-4 mr-3" />
                      <span>Sheet Music</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setSubMenuOpen(!subMenuOpen)}
                      tooltip="Repertoire Categories"
                      className="text-gray-600 hover:bg-gray-50"
                    >
                      <span className="flex items-center w-full">
                        <MusicIcon className="h-4 w-4 mr-3" />
                        <span>Repertoire</span>
                        <ChevronDownIcon className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${subMenuOpen ? "transform rotate-180" : ""}`} />
                      </span>
                    </SidebarMenuButton>
                    {subMenuOpen && (
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="pl-9 text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            Classical
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="pl-9 text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            Romantic
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="pl-9 text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                            Contemporary
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator className="my-1 bg-gray-100" />
            
            <SidebarGroup>
              <SidebarGroupLabel className="px-5 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Communication
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("announcements")}
                      isActive={activeTab === "announcements"}
                      tooltip="Announcements"
                      className={activeTab === "announcements" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <BellIcon className="h-4 w-4 mr-3" />
                      <span>Announcements</span>
                      <SidebarMenuBadge className="ml-auto bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        5
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("members")}
                      isActive={activeTab === "members"}
                      tooltip="Members"
                      className={activeTab === "members" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <UsersIcon className="h-4 w-4 mr-3" />
                      <span>Members</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator className="my-1 bg-gray-100" />
            
            <SidebarGroup>
              <SidebarGroupLabel className="px-5 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Personal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("notes")}
                      isActive={activeTab === "notes"}
                      tooltip="Notes"
                      className={activeTab === "notes" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                    >
                      <StickyNoteIcon className="h-4 w-4 mr-3" />
                      <span>Notes</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-5 mt-auto border-t border-gray-100">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab("settings")}
                  isActive={activeTab === "settings"}
                  tooltip="Settings"
                  className={activeTab === "settings" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}
                >
                  <SettingsIcon className="h-4 w-4 mr-3" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 overflow-auto bg-white">
          <SidebarTrigger className="absolute top-4 left-4 md:hidden" />
          <main className="min-h-screen">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

interface DashboardCardProps {
  title: string
  count: number
  icon: React.ReactNode
}

function DashboardCard({ title, count, icon }: DashboardCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-blue-50 rounded-full text-blue-600">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mt-4 text-gray-900">{count}</p>
    </div>
  )
}

