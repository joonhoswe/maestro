import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/100 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold text-[#800020] font-['The_Seasons',serif]">
              Maestro
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button
            className="bg-[#800020] hover:bg-[#600010] text-white"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
