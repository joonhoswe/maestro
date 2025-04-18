import * as React from "react";

export default function People() {
  const members = [
    { name: "John Doe", section: "Violin" },
    { name: "Jane Smith", section: "Cello" },
    { name: "Robert Johnson", section: "Trumpet" },
    { name: "Lisa Anderson", section: "Flute" },
    { name: "Michael Brown", section: "Percussion" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Orchestra Members
      </h1>
      <div className="space-y-4">
        {members.map((member, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-lg">
              {member.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-xl text-gray-800">
                {member.name}
              </h3>
              <p className="text-gray-600 text-md">{member.section}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
