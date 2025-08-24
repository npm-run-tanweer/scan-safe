import { Card, CardContent } from "@/app/components/ui/card";
import { Sparkles, Loader2} from "lucide-react";
import React from "react";

export const LoadResult = () => {
  return (
    <div className="p-6 flex justify-center items-center animate-fade-in">
      <Card className="w-full bg-white/90 backdrop-blur-lg shadow-floating border-white/20">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 gradient-primary rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-500 animate-bounce-subtle" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">
              Analyzing Product...
            </h3>
            <p className="text-slate-600">
              We're checking this product against your profile
            </p>
            <div className="flex justify-center space-x-1">
              {[0, 150, 300].map((delay) => (
                <div
                  key={delay}
                  className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


export const LoadPage = () => {
  return <div>  
    loading page ...
  </div>
}

export const PageLoader = ({text}) => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Spinning Icon */}
      <div className="p-4 bg-white rounded-full shadow-lg animate-spin-slow">
        <Loader2 className="w-10 h-10 text-emerald-600" />
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
        {text}
      </p>
    </div>
  );
}


export function MiniLoader() {
  return <Loader2 className="w-4 h-4 animate-spin-slow" />;
}