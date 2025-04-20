import * as React from "react";
import { BentoGrid, BentoCard } from "@/components/magicui/bento-grid";
import { 
  MusicIcon, 
  BellIcon, 
  TimerIcon, 
  CalendarDays,
  Megaphone,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  // Announcements data (eventually pull from DB)
  const announcements = [
    { title: "Schedule Change", content: "Rehearsal moved to Thursday 7 PM" },
    {
      title: "New Repertoire",
      content: "Added Mahler Symphony No. 5 to our season",
    },
    {
      title: "Guest Conductor",
      content: "Jane Smith will be joining us next month",
    },
    { title: "Venue Update", content: "Summer concert moved to Central Park" },
    {
      title: "Section Leaders Meeting",
      content: "Meeting this Friday at 5 PM",
    },
  ];

  // Rehearsals data
  const rehearsals = [
    { date: "Mon, Jun 10", time: "7:00 PM - 9:30 PM", location: "Main Hall" },
    { date: "Wed, Jun 12", time: "6:30 PM - 9:00 PM", location: "Rehearsal Room B" },
    { date: "Sat, Jun 15", time: "10:00 AM - 1:00 PM", location: "Main Hall" },
  ];

  // Dashboard feature cards
  const features = [
    {
      name: "Announcements",
      className: "col-span-3 md:col-span-1 row-span-1",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#800020]/10 to-background/10 p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#800020]">{announcements[0].title}</h3>
              <p className="text-sm text-gray-600">{announcements[0].content}</p>
              {announcements.length > 1 && (
                <p className="text-xs text-gray-500 mt-2">+{announcements.length - 1} more announcements</p>
              )}
            </div>
          </div>
        </div>
      ),
      Icon: Megaphone,
      description: "View and manage all orchestra announcements",
      href: "/dashboard/announcements",
      cta: "See all announcements",
    },
    {
      name: "Upcoming Rehearsals",
      className: "col-span-3 md:col-span-1 row-span-1",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-background/10 p-6">
            <div className="space-y-2">
              <div className="text-sm">
                <div className="font-medium text-blue-900">{rehearsals[0].date}</div>
                <div className="text-gray-600">{rehearsals[0].time}</div>
                <div className="text-gray-500 text-xs">{rehearsals[0].location}</div>
              </div>
              {rehearsals.length > 1 && (
                <p className="text-xs text-gray-500 mt-2">+{rehearsals.length - 1} more scheduled</p>
              )}
            </div>
          </div>
        </div>
      ),
      Icon: Clock,
      description: "Manage and view upcoming orchestra rehearsals",
      href: "/dashboard/rehearsals",
      cta: "View all rehearsals",
    },
    {
      name: "Calendar",
      className: "col-span-3 md:col-span-1 row-span-1",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-background/10 p-6">
            <div className="space-y-2">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square w-6 flex items-center justify-center rounded-full text-xs 
                    ${i === 14 || i === 16 || i === 19 ? 'bg-emerald-100 text-emerald-700' : 
                      i === 20 ? 'bg-[#800020] text-white' : 'text-gray-400'}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      Icon: CalendarDays,
      description: "View full calendar of rehearsals and performances",
      href: "/dashboard/calendar",
      cta: "Open calendar",
    },
    {
      name: "Sheet Music",
      className: "col-span-3 row-span-1",
      background: (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-background/10 p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-md shadow-sm">
                <MusicIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-900">Music Library</h3>
                <p className="text-xs text-gray-600">Access all your orchestra's sheet music</p>
              </div>
            </div>
          </div>
        </div>
      ),
      Icon: MusicIcon,
      description: "Browse and download your orchestra's sheet music",
      href: "/dashboard/sheet-music",
      cta: "View sheet music",
    }
  ];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Welcome to Maestro
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your orchestra management dashboard
      </p>

      <BentoGrid className="auto-rows-auto md:auto-rows-[20rem] grid-cols-1 md:grid-cols-3 mb-8">
        {features.map((feature) => (
          <BentoCard
            key={feature.name}
            {...feature}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
