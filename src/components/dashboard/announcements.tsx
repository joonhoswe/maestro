export default function Announcements() {

const announcements = [
  {
    title: "Announcement 1",
    content: "This is the content of announcement 1"
  },
]

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
}