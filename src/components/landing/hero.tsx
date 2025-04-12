import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, Music, MessageSquare, Users } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function Hero() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column: Text content with staggered animations */}
          <div className="flex flex-col gap-6">
            {/* Announcement badge - First element to animate in */}
            <BlurFade delay={0.1} direction="up" inView={true}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/10 text-[#800020] text-sm font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#800020] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#800020]"></span>
                </span>
                Launching soon!
              </div>
            </BlurFade>

            {/* Main headline - Second element to animate in */}
            <BlurFade delay={0.2} direction="up" inView={true}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                Orchestrate your{" "}
                <span className="text-[#800020] font-['The_Seasons',serif]">
                  ensembles
                </span>{" "}
                with ease
              </h1>
            </BlurFade>

            {/* Subtitle/description - Third element to animate in */}
            <BlurFade delay={0.3} direction="up" inView={true}>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
                <span className="text-[#800020] font-['The_Seasons',serif] font-bold text-xl sm:text-2xl">
                  Maestro
                </span>{" "}
                connects conductors and musicians in one seamless platform for
                scheduling, communication, and music management.
              </p>
            </BlurFade>

            {/* CTA buttons - Fourth element to animate in */}
            <BlurFade delay={0.4} direction="up" inView={true}>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
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
                  className="border-gray-300"
                  asChild
                >
                  <Link href="/demo">Request Demo</Link>
                </Button>
              </div>
            </BlurFade>

            {/* Feature list - Final text element to animate in */}
            <BlurFade delay={0.5} direction="up" inView={true}>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {[
                  {
                    icon: <CalendarDays className="h-5 w-5 text-[#800020]" />,
                    text: "Rehearsal Scheduling",
                  },
                  {
                    icon: <Music className="h-5 w-5 text-[#800020]" />,
                    text: "Sheet Music Sharing",
                  },
                  {
                    icon: <MessageSquare className="h-5 w-5 text-[#800020]" />,
                    text: "Ensemble Communication",
                  },
                  {
                    icon: <Users className="h-5 w-5 text-[#800020]" />,
                    text: "Member Management",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {feature.icon}
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>

          {/* Right column: Dashboard preview with right-to-left animation */}
          <BlurFade delay={0.3} direction="right" inView={true}>
            <div className="relative">
              {/* Gradient background for the mockup */}
              <div className="absolute -inset-4 bg-gradient-to-r from-gray-100 to-gray-50 rounded-3xl -z-10"></div>

              {/* Browser/app mockup container */}
              <div className="relative bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                {/* Browser-like toolbar with window controls */}
                <div className="h-12 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  </div>
                </div>

                {/* Dashboard image container */}
                <div className="aspect-[16/10] relative">
                  <Image
                    src="/not-found.png"
                    alt="Maestro Dashboard Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Decorative blur elements for visual interest */}
              <div className="absolute top-1/4 -right-12 w-24 h-24 bg-[#800020]/5 rounded-full blur-xl"></div>
              <div className="absolute bottom-1/3 -left-12 w-32 h-32 bg-[#800020]/10 rounded-full blur-xl"></div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
