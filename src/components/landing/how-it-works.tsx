"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { CalendarCheck, Users, Music, ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Create your ensemble",
    description:
      "Set up your orchestra, choir, or band with custom sections and roles",
    icon: <Users className="h-8 w-8 text-white" />,
    iconBg: "bg-indigo-500",
    delay: 0.1,
  },
  {
    title: "Invite your musicians",
    description: "Send personalized invitations to all your ensemble members",
    icon: <ArrowRight className="h-8 w-8 text-white" />,
    iconBg: "bg-blue-500",
    delay: 0.2,
  },
  {
    title: "Schedule rehearsals",
    description:
      "Create and manage rehearsal schedules with automated notifications",
    icon: <CalendarCheck className="h-8 w-8 text-white" />,
    iconBg: "bg-emerald-500",
    delay: 0.3,
  },
  {
    title: "Share music and notes",
    description:
      "Upload scores, parts, and rehearsal notes for your upcoming performances",
    icon: <Music className="h-8 w-8 text-white" />,
    iconBg: "bg-[#800020]",
    delay: 0.4,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Section heading */}
        <BlurFade
          delay={0.1}
          direction="up"
          inView={true}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            How{" "}
            <span className="text-[#800020] font-['The_Seasons',serif]">
              Maestro
            </span>{" "}
            works
          </h2>
          <p className="text-xl text-gray-600">
            Get your ensemble organized in just a few simple steps
          </p>
        </BlurFade>

        {/* Timeline style steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line connecting steps */}
            <div className="absolute left-[27px] top-0 bottom-0 w-1 bg-gray-200 hidden md:block" />

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <BlurFade
                  key={index}
                  delay={step.delay}
                  direction="right"
                  inView={true}
                  className="relative"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Icon */}
                    <div className="flex-shrink-0 z-10">
                      <div
                        className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full",
                          step.iconBg
                        )}
                      >
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow pt-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-lg text-gray-600">
                        {step.description}
                      </p>
                    </div>

                    {/* Step number */}
                    <div className="absolute -left-4 top-0 text-9xl font-bold text-gray-100 opacity-60 hidden lg:block">
                      {index + 1}
                    </div>
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
