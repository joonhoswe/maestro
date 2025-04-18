import * as React from "react";

export default function Rehearsals() {
  const rehearsals = [
    { date: "Mon, Jun 10", time: "7:00 PM - 9:30 PM", location: "Main Hall" },
    {
      date: "Wed, Jun 12",
      time: "6:30 PM - 9:00 PM",
      location: "Rehearsal Room B",
    },
    { date: "Sat, Jun 15", time: "10:00 AM - 1:00 PM", location: "Main Hall" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Rehearsals</h1>
      <div className="space-y-4">
        {rehearsals.map((rehearsal, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-xl text-gray-800">
              {rehearsal.date}
            </h3>
            <p className="text-gray-600 mt-2">{rehearsal.time}</p>
            <p className="text-gray-500 text-sm mt-1">{rehearsal.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
