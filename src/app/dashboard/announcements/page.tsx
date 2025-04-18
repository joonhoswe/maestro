import * as React from "react";

export default function Announcements() {
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-xl text-gray-800">
              {announcement.title}
            </h3>
            <p className="text-gray-600 mt-2">{announcement.content}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Posted {index === 0 ? "today" : `${index} days ago`}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Read more
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
