//       <div className="">
//         <SignedIn>
//           <SignOutButton />
//         </SignedIn>
//         <SignedOut>
//           <SignInButton forceRedirectUrl="/profile" />
//         </SignedOut>
//       </div>
"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
// import { useUser } from '../context/UserContext';
import { Camera, User, Shield, Zap, Heart, CheckCircle } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import Auth from "./components/Auth";
const Home = () => {
  // const { user, isProfileComplete, scanHistory } = useUser();
  const user = useUser();
  const userId = user?.user?.id
  const isProfileComplete = false;
  const [dbUser, setDbUser] = useState(null);
  const [scans, setScans] = useState([]);
  const clerkId = user?.user?.id;
  useEffect(() => {
    if (!clerkId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users?clerkId=${clerkId}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setDbUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkId]);

  useEffect(() => {
      if (!userId) return;
  
      async function fetchScans() {
        try {
          const res = await fetch(`/api/getscans?userId=${userId}`);
          const data = await res.json();
  
          if (res.ok) setScans(data.scans);
          else console.error("Error:", data.error);
        } catch (err) {
          console.error("Fetch error:", err);
        } finally {
          setLoading(false);
          console.log(user.user.id);
        }
      }
  
      fetchScans();
    }, [userId]);

  return (
    user.isSignedIn ? (
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-24">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Hii {user?.user?.firstName}, Welcome to{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            SafeEats
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Instantly check if packaged foods are safe for your allergies and
          medical conditions. Scan, analyze, and eat with confidence.
        </p>
      </div>

      {/* Quick Stats */}
      {dbUser && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">{scans.length}</div>
            <div className="text-sm text-slate-600">Scans</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">
              {dbUser?.allergens?.length}
            </div>
            <div className="text-sm text-slate-600">Allergies</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-emerald-100">
            <div className="text-2xl font-bold text-emerald-600">
              {dbUser?.conditions?.length}
            </div>
            <div className="text-sm text-slate-600">Conditions</div>
          </div>
        </div>
      )}

      {/* Action Cards */}
      <div className="grid gap-6 mb-8">
        {!isProfileComplete && (
          <Link
            href="/profile"
            className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-slate-800 mb-1">
                  Complete Your Profile
                </h3>
                <p className="text-slate-600">
                  Set up your allergies and medical conditions for personalized
                  safety checks
                </p>
              </div>
            </div>
          </Link>
        )}

        <Link
          href="/scan"
          className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-500 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-slate-800 mb-1">
                Scan Food Products
              </h3>
              <p className="text-slate-600">
                Use your camera to scan barcodes and get instant safety results
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-emerald-100 mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Why Choose SafeEats?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-emerald-100 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Instant Results
            </h3>
            <p className="text-sm text-slate-600">
              Get safety analysis in 2-3 seconds with clear warnings
            </p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Personalized Care
            </h3>
            <p className="text-sm text-slate-600">
              Tailored to your specific allergies and health conditions
            </p>
          </div>
          <div className="text-center">
            <div className="bg-emerald-100 w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Proven Accuracy
            </h3>
            <p className="text-sm text-slate-600">
              Cross-referenced with comprehensive ingredient databases
            </p>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      {/* {scanHistory.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-emerald-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800">Recent Scans</h2>
            <Link href="/history" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {scanHistory.slice(0, 3).map((scan, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                <div className={`w-3 h-3 rounded-full ${
                  scan.analysis.isSafe ? 'bg-emerald-400' : 'bg-red-400'
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">{scan.product.name}</p>
                  <p className="text-xs text-slate-500">{scan.product.brand}</p>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  scan.analysis.isSafe 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {scan.analysis.isSafe ? 'Safe' : 'Unsafe'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
    ) : (
      <Auth/>
    )
  );
};

export default Home;
