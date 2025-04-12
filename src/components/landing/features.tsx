"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";

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
    <section className="py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-70"></div>

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
              <Card className="h-full bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="bg-[#800020]/10 rounded-full p-3 w-fit mb-4 group-hover:bg-[#800020]/20 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-[#800020] transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>

        {/* Call to action section */}
        <BlurFade
          delay={0.7}
          direction="up"
          inView={true}
          className="mt-20 text-center"
        >
          <div className="bg-white p-10 rounded-2xl shadow-md border border-gray-100 max-w-3xl mx-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to enhance your ensemble management?
            </h3>
            <p className="text-gray-600 mb-8">
              Join orchestras worldwide who use{" "}
              <span className="text-[#800020] font-['The_Seasons',serif] font-bold text-lg">
                Maestro
              </span>{" "}
              to streamline their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#800020] hover:bg-[#600010] text-white"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
