"use client";
import React from "react";
import { AlertTriangle, CircleAlert, ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";

export default function ProductAnalysis({ scan }) {
  if (!scan) {
    return <p className="text-gray-500">No analysis available.</p>;
  }

  return (
    // <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
    //   <h2 className="text-xl font-bold mb-4 text-gray-800">
    //     Product Analysis
    //   </h2>

    //   <div className="mb-3">
    //     <p className="text-sm text-gray-500">Product:</p>
    //     <p className="font-medium">{scan.productName || "Unknown"}</p>
    //     <p className="text-gray-600">{scan.brand}</p>
    //   </div>

    //   <div className="mb-3">
    //     <p className="text-sm text-gray-500">Nutriscore:</p>
    //     <span className="px-2 py-1 rounded-lg text-white font-semibold bg-green-500">
    //       {scan.nutriscore?.toUpperCase() || "N/A"}
    //     </span>
    //   </div>

    //   <div className="mb-3">
    //     <p className="text-sm text-gray-500">Status:</p>
    //     <span
    //       className={`px-3 py-1 rounded-lg font-semibold ${
    //         scan.analysisResult?.status === "safe"
    //           ? "bg-green-100 text-green-700"
    //           : scan.analysisResult?.status === "unsafe"
    //           ? "bg-red-100 text-red-700"
    //           : "bg-yellow-100 text-yellow-700"
    //       }`}
    //     >
    //       {scan.analysisResult?.status}
    //     </span>
    //   </div>

    //   <div className="mb-3">
    //     <p className="text-sm text-gray-500">Reason:</p>
    //     <p className="text-gray-700">{scan.analysisResult?.reason}</p>
    //   </div>

    //   <div className="mb-3">
    //     <p className="text-sm text-gray-500">Safety Score:</p>
    //     <p className="font-medium">{scan.analysisResult?.score || "N/A"} / 10</p>
    //   </div>

    //   {scan.analysisResult?.riskIngredients?.length > 0 && (
    //     <div className="mb-3">
    //       <p className="text-sm text-gray-500">Risk Ingredients:</p>
    //       <ul className="list-disc list-inside text-red-600">
    //         {scan.analysisResult.riskIngredients.map((ing, idx) => (
    //           <li key={idx}>{ing}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}

    //   {scan.analysisResult?.nutritionFlags?.length > 0 && (
    //     <div>
    //       <p className="text-sm text-gray-500">Nutrition Concerns:</p>
    //       <ul className="list-disc list-inside text-yellow-600">
    //         {scan.analysisResult.nutritionFlags.map((flag, idx) => (
    //           <li key={idx}>{flag}</li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}
    // </div>

    <div className="max-w-md mx-auto my-6 rounded-2xl shadow-lg overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 flex flex-col items-center">
        <XCircle className="w-10 h-10 mb-2" />
        <h2 className="text-lg font-semibold">Not Safe</h2>
        <p className="text-sm">Risk Level: High</p>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Dark Chocolate Bar</h3>
            <p className="text-sm text-gray-500">Premium Foods</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs bg-gray-100 rounded-lg">Confectionery</span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg">Organic</span>
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg">Fair Trade</span>
        </div>
      </div>

      {/* Safety Warnings */}
      <div className="px-5 space-y-3">
        <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 text-orange-600 font-semibold">
            <AlertTriangle className="w-4 h-4" />
            Allergy Warning
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Warning: may contain milk
          </p>
        </div>

        <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-700 font-semibold">
            <CircleAlert className="w-4 h-4" />
            Dietary Warning
          </div>
          <p className="text-sm text-gray-700 mt-1">
            Contains animal product (cocoa butter) - not suitable for vegan diet
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-5 mt-4">
        <h4 className="font-semibold mb-2">Recommendations</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Consider the warnings before consuming</li>
          <li>Monitor your body’s response if you decide to consume</li>
        </ul>
      </div>

      {/* Nutrition Facts */}
      <div className="px-5 mt-4">
        <h4 className="font-semibold mb-2">Nutrition Facts</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Calories</p>
            <p className="font-semibold">220</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Sugar</p>
            <p className="font-semibold">12g</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Sodium</p>
            <p className="font-semibold">5mg</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="text-gray-500">Protein</p>
            <p className="font-semibold">4g</p>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="px-5 mt-4">
        <h4 className="font-semibold mb-2">Ingredients</h4>
        <div className="flex flex-wrap gap-2">
          {["dark chocolate", "cocoa sugar", "cocoa butter", "vanilla extract"].map((ing, idx) => (
            <span key={idx} className="px-2 py-1 text-xs bg-gray-100 rounded-lg">
              {ing}
            </span>
          ))}
        </div>
      </div>

      {/* Known Allergens */}
      <div className="px-5 mt-4">
        <h4 className="font-semibold mb-2">Known Allergens</h4>
        <div className="flex flex-wrap gap-2">
          {["may contain milk"].map((allergen, idx) => (
            <span key={idx} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg">
              {allergen}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between gap-3 p-5">
        <Link href="/scan" className="flex-1">
          <button className="w-full py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600">
            Scan Again
          </button>
        </Link>
        <Link href="/scan" className="flex-1">
          <button className="w-full py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            View History
          </button>
        </Link>
      </div>
    </div>
  );
}
