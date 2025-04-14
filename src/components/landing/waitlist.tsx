"use client";

import { useState } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Music, CheckCircle } from "lucide-react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would connect to your actual waitlist API
    console.log("Submitting email:", email);
    setSubmitted(true);
    setEmail("");
    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-20 w-40 h-40 rounded-full bg-[#800020]/5 blur-2xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-40 h-40 rounded-full bg-[#800020]/10 blur-2xl"></div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <BlurFade
          delay={0.1}
          direction="up"
          inView={true}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Join the{" "}
            <span className="text-[#800020] font-['The_Seasons',serif]">
              waitlist
            </span>{" "}
            today
          </h2>
          <p className="text-xl text-gray-600">
            Be the first to experience {" "}
            <span className="text-[#800020] font-['The_Seasons',serif] font-bold">
              Maestro
            </span>{" "}
            when we launch
          </p>
        </BlurFade>

        {/* Form Section */}
        <BlurFade
          delay={0.2}
          direction="up"
          inView={true}
          className="max-w-md mx-auto"
        >
          <div className="relative w-full p-6 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="absolute -top-6 -right-6">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full bg-[#800020]">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800020]/30 focus:border-[#800020]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#800020] hover:bg-[#600010] text-white"
                  size="lg"
                >
                  Join Waitlist
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  We&apos;ll only email you about updates.
                </p>
              </form>
            ) : (
              <div className="py-6 text-center">
                <CheckCircle className="h-12 w-12 text-[#800020] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You&apos;re on the list!
                </h3>
                <p className="text-gray-600">
                  We&apos;ll notify you when we launch.
                </p>
              </div>
            )}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
