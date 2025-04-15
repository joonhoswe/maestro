"use client"

import * as React from "react"
import { 
  MusicIcon, 
  BellIcon, 
  CalendarIcon, 
  UsersIcon, 
  HomeIcon, 
  TimerIcon
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
  SidebarGroupContent,
  SidebarMenuBadge,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState<string>("home")
  const [open, setOpen] = React.useState<boolean>(true)
  
  // Announcements data
  const announcements = [
    { title: "Schedule Change", content: "Rehearsal moved to Thursday 7 PM" },
    { title: "New Repertoire", content: "Added Mahler Symphony No. 5 to our season" },
    { title: "Guest Conductor", content: "Jane Smith will be joining us next month" },
    { title: "Venue Update", content: "Summer concert moved to Central Park" },
    { title: "Section Leaders Meeting", content: "Meeting this Friday at 5 PM" }
  ]
  
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Welcome to Maestro</h1>
            <p className="text-lg text-gray-600 mb-8">Your orchestra management dashboard</p>
            
            {/* Recent Announcement */}
            <div className="mb-10">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Latest Announcement</h2>
              <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800">{announcements[0].title}</h3>
                <p className="text-gray-600 mt-2">{announcements[0].content}</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard 
                title="Upcoming Rehearsals" 
                count={3} 
                icon={<TimerIcon className="h-6 w-6" />} 
              />
              <DashboardCard 
                title="Sheet Music" 
                count={12} 
                icon={<MusicIcon className="h-6 w-6" />} 
              />
              <DashboardCard 
                title="New Announcements" 
                count={5} 
                icon={<BellIcon className="h-6 w-6" />} 
              />
            </div>
          </div>
        )
      case "announcements":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Announcements</h1>
            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-xl text-gray-800">{announcement.title}</h3>
                  <p className="text-gray-600 mt-2">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "calendar":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Calendar</h1>
            <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm">
              <p className="text-gray-600">Calendar view would be displayed here</p>
            </div>
          </div>
        )
      case "rehearsals":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Rehearsals</h1>
            <div className="space-y-4">
              {[
                { date: "Mon, Jun 10", time: "7:00 PM - 9:30 PM", location: "Main Hall" },
                { date: "Wed, Jun 12", time: "6:30 PM - 9:00 PM", location: "Rehearsal Room B" },
                { date: "Sat, Jun 15", time: "10:00 AM - 1:00 PM", location: "Main Hall" }
              ].map((rehearsal, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-xl text-gray-800">{rehearsal.date}</h3>
                  <p className="text-gray-600 mt-2">{rehearsal.time}</p>
                  <p className="text-gray-500 text-sm mt-1">{rehearsal.location}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "sheet-music":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Sheet Music</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {["Beethoven Symphony No. 5", "Mozart Symphony No. 40", "Tchaikovsky Symphony No. 6", 
                "Bach Brandenburg Concerto No. 3", "Dvořák Symphony No. 9"].map((piece, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <MusicIcon className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800 text-lg">{piece}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "people":
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Orchestra Members</h1>
            <div className="space-y-4">
              {[
                { name: "John Doe", section: "Violin" },
                { name: "Jane Smith", section: "Cello" },
                { name: "Robert Johnson", section: "Trumpet" },
                { name: "Lisa Anderson", section: "Flute" },
                { name: "Michael Brown", section: "Percussion" }
              ].map((member, index) => (
                <div key={index} className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-xl text-gray-800">{member.name}</h3>
                    <p className="text-gray-600 text-md">{member.section}</p>
                  </div>
                </div>
              ))}
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
            <h2 className="text-2xl font-bold text-blue-600">Maestro</h2>
            <p className="text-sm text-gray-500">Orchestra Management</p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("home")}
                      isActive={activeTab === "home"}
                      tooltip="Home"
                      className={activeTab === "home" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("announcements")}
                      isActive={activeTab === "announcements"}
                      tooltip="Announcements"
                      className={activeTab === "announcements" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <BellIcon className="h-5 w-5 mr-3" />
                      <span>Announcements</span>
                      <SidebarMenuBadge className="ml-auto bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        5
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("calendar")}
                      isActive={activeTab === "calendar"}
                      tooltip="Calendar"
                      className={activeTab === "calendar" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("rehearsals")}
                      isActive={activeTab === "rehearsals"}
                      tooltip="Rehearsals"
                      className={activeTab === "rehearsals" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <TimerIcon className="h-5 w-5 mr-3" />
                      <span>Rehearsals</span>
                      <SidebarMenuBadge className="ml-auto bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 text-xs font-medium">
                        3
                      </SidebarMenuBadge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("sheet-music")}
                      isActive={activeTab === "sheet-music"}
                      tooltip="Sheet Music"
                      className={activeTab === "sheet-music" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <MusicIcon className="h-5 w-5 mr-3" />
                      <span>Sheet Music</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab("people")}
                      isActive={activeTab === "people"}
                      tooltip="People"
                      className={activeTab === "people" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-50"}
                    >
                      <UsersIcon className="h-5 w-5 mr-3" />
                      <span>People</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-5 mt-auto border-t border-gray-100">
            <Button 
              variant="outline" 
              className="w-full text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              Logout
            </Button>
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
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg text-gray-700">{title}</h3>
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
          {icon}
        </div>
      </div>
      <p className="text-4xl font-bold mt-4 text-gray-900">{count}</p>
    </div>
  )
}

