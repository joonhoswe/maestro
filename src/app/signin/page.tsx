import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SignInForm from "@/components/signin/signin-form";
import { Music } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

export default function SignIn() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="max-w-lg w-full mx-auto px-4 flex flex-col items-center">
          <BlurFade delay={0.1} direction="up" inView={true}>
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center size-12 rounded-full bg-[#800020]/10 mb-4">
                <Music className="h-6 w-6 text-[#800020]" />
              </div>
              <h1 className="text-3xl font-bold text-center">
                Welcome back to{" "}
                <span className="text-[#800020] font-['The_Seasons',serif]">
                  Maestro
                </span>
              </h1>
              <p className="text-gray-600 text-center mt-2">
                Sign in to your account to access your ensembles
              </p>
            </div>
          </BlurFade>

          <div className="w-full flex justify-center">
            <BlurFade
              delay={0.2}
              direction="up"
              inView={true}
              className="w-full flex justify-center"
            >
              <SignInForm />
            </BlurFade>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
