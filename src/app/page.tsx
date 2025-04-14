import Navbar from "@/components/navbar";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Footer from "@/components/footer";
import HowItWorks from "@/components/landing/how-it-works";
import Waitlist from "@/components/landing/waitlist";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
