import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SignUpForm from "@/components/signup/signup-form";
import { Music } from "lucide-react";

export default function SignUp() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-lg w-full mx-auto px-4 flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#800020]/10 mb-4">
              <Music className="h-6 w-6 text-[#800020]" />
            </div>
            <h1 className="text-3xl font-bold text-center">
              Join{" "}
              <span className="text-[#800020] font-['The_Seasons',serif]">
                Maestro
              </span>
            </h1>
            <p className="text-gray-600 text-center mt-2">
              Create your account and start orchestrating your ensembles
            </p>
          </div>

          <SignUpForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
