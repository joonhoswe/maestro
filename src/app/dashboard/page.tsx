import * as React from "react";
import { MusicIcon, BellIcon, TimerIcon } from "lucide-react";

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

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">
        Welcome to Maestro
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your orchestra management dashboard
      </p>

      {/* Recent Announcement */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Latest Announcement
        </h2>
        <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold text-gray-800">
            {announcements[0].title}
          </h3>
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
  );
}

interface DashboardCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

function DashboardCard({ title, count, icon }: DashboardCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-lg text-gray-700">{title}</h3>
        <div className="p-3 bg-blue-100 rounded-full text-blue-600">{icon}</div>
      </div>
      <p className="text-4xl font-bold mt-4 text-gray-900">{count}</p>
    </div>
  );
}
