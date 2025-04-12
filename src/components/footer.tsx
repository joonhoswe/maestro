"use client";

import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-gray-100">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <BlurFade delay={0.1} direction="up" inView={true}>
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Logo and tagline */}
            <div className="md:max-w-xs">
              <h1 className="text-3xl font-bold text-[#800020] font-['The_Seasons',serif]">
                Maestro
              </h1>
              <p className="mt-2 text-md text-gray-500">
                Orchestrating ensemble management with elegance and precision.
              </p>
            </div>

            {/* Links and Connect section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 md:gap-24">
              {/* Quick links */}
              <div>
                <h4 className="font-medium mb-3">Quick Links</h4>
                <ul className="space-y-1">
                  {["About", "Features", "Pricing", "Contact"].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="text-sm text-gray-600 hover:text-[#800020] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-medium mb-3">Resources</h4>
                <ul className="space-y-1">
                  {["Help Center", "Blog", "Tutorials", "FAQs"].map((item) => (
                    <li key={item}>
                      <Link
                        href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-sm text-gray-600 hover:text-[#800020] transition-colors"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="font-medium mb-3">Connect</h4>
                <div className="flex space-x-4 mt-2">
                  <Link
                    href="https://linkedin.com"
                    className="text-gray-500 hover:text-[#800020] transition-colors"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    className="text-gray-500 hover:text-[#800020] transition-colors"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  </Link>
                  <Link
                    href="https://x.com"
                    className="text-gray-500 hover:text-[#800020] transition-colors"
                  >
                    <FontAwesomeIcon icon={faXTwitter} size="lg" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>

        {/* Copyright */}
        <BlurFade delay={0.2} direction="up" inView={true}>
          <div className="border-t border-gray-100 mt-10 pt-6 text-center text-sm text-gray-500">
            <p>© {currentYear} Maestro. All rights reserved.</p>
          </div>
        </BlurFade>
      </div>
    </footer>
  );
}
