import Image from "next/image";
import { UserProfileForm } from "./components/UserProfileForm";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { Heart, Scan, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8 pt-12 animate-fade-in">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 blur-3xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-floating animate-pulse-slow">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Scan & Safe
          </h1>
          <p className="text-lg text-slate-600 max-w-sm mx-auto">
            Your intelligent food safety companion that protects your health
            with every scan
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Scan className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-slate-600">Quick Scan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12  bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-slate-600">AI Safety</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-slate-600">Health First</p>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl="/profile" />
        </SignedOut>
      </div>
    </div>
  );
}
