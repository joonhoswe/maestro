"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  MessageSquare,
  Bell,
  FileUp,
  BookOpen,
  CheckCircle,
} from "lucide-react";

// Define the features to display
const features = [
  {
    title: "Instant Announcements",
    description: "Send important updates to all members with just one click",
    icon: <Bell className="h-8 w-8 text-[#800020]" />,
    delay: 0.1,
  },
  {
    title: "Music Library",
    description: "Upload and organize sheet music for the entire ensemble",
    icon: <FileUp className="h-8 w-8 text-[#800020]" />,
    delay: 0.2,
  },
  {
    title: "Rehearsal Notes",
    description: "Document and share notes from each rehearsal session",
    icon: <BookOpen className="h-8 w-8 text-[#800020]" />,
    delay: 0.3,
  },
  {
    title: "Attendance Tracking",
    description: "Monitor member attendance and receive absence notifications",
    icon: <CheckCircle className="h-8 w-8 text-[#800020]" />,
    delay: 0.4,
  },
  {
    title: "Event Calendar",
    description: "View and plan upcoming rehearsals and performances",
    icon: <CalendarDays className="h-8 w-8 text-[#800020]" />,
    delay: 0.5,
  },
  {
    title: "Section Chat",
    description: "Communicate directly with your section members",
    icon: <MessageSquare className="h-8 w-8 text-[#800020]" />,
    delay: 0.6,
  },
];

export default function Features() {
  return (
    <section className="py-12 sm:py-16 relative">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section heading with animation */}
        <BlurFade
          delay={0.1}
          direction="up"
          inView={true}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Powerful features for{" "}
            <span className="text-[#800020] font-['The_Seasons',serif]">
              every role
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            <span className="text-[#800020] font-['The_Seasons',serif] font-bold text-2xl">
              Maestro
            </span>{" "}
            provides specialized tools to streamline orchestra management for
            everyone involved.
          </p>
        </BlurFade>

        {/* Feature cards - using a grid layout with 3 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <BlurFade
              key={index}
              delay={feature.delay}
              direction="up"
              inView={true}
            >
              <Card className="h-full overflow-hidden bg-white border-none shadow-md hover:shadow-xl transition-all duration-300 group relative">
                {/* Decorative background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#800020]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Top accent line with animated gradient on hover */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#800020]/30 via-[#800020]/50 to-[#800020]/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

                <CardHeader className="pb-2">
                  <div className="bg-[#800020]/10 rounded-full p-3 w-fit mb-4 group-hover:bg-[#800020]/20 transition-all duration-300 transform group-hover:-translate-y-1">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-[#800020] transition-colors duration-300 flex items-center gap-2">
                    {feature.title}
                    <div className="h-px flex-grow bg-gray-200 group-hover:bg-[#800020]/30 transition-colors duration-300 ml-2 hidden sm:block"></div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base relative">
                    {feature.description}
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-[#800020]/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                  </CardDescription>
                </CardContent>

                {/* Interactive corner accent */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#800020]/0 group-hover:bg-[#800020]/10 transition-colors duration-300 rounded-tl-xl"></div>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
