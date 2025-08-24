import { SignInButton, SignUpButton } from "@clerk/nextjs";
import React from "react";

const Auth = () => {
  return (
    <div className="h-screen w-screen flex gap-4 items-center justify-center">
      <div className="px-8 py-2 rounded-sm text-white bg-emerald-500">
        <SignInButton></SignInButton>
      </div>
      <div className="px-8 py-2 rounded-sm bg-white border-1 border-emerald-500 text-black">
        <SignUpButton></SignUpButton>
      </div>
    </div>
  );
};

export default Auth;
