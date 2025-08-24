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
      <div
        className={`p-4 flex flex-col items-center text-white ${
          scan.analysisResult?.status === "safe"
            ? "bg-gradient-to-r from-green-500 to-emerald-500"
            : scan.analysisResult?.status === "unsafe"
            ? "bg-gradient-to-r from-red-500 to-pink-500"
            : "bg-gradient-to-r from-yellow-500 to-orange-500"
        }`}
      >
        {scan.analysisResult?.status === "safe" ? (
          <CircleCheck className="w-10 h-10 mb-2" />
        ) : scan.analysisResult?.status === "unsafe" ? (
          <XCircle className="w-10 h-10 mb-2" />
        ) : (
          <AlertTriangle className="w-10 h-10 mb-2" />
        )}
        <h2 className="text-lg font-semibold capitalize">
          {scan.analysisResult?.status || "Unknown"}
        </h2>
        <p className="text-sm">
          Risk Level:{" "}
          {scan.analysisResult?.status === "safe"
            ? "Low"
            : scan.analysisResult?.status === "unsafe"
            ? "High"
            : "Moderate"}
        </p>
      </div>

      {/* Product Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">
              {scan.productName || "Unknown Product"}
            </h3>
            <p className="text-sm text-gray-500">
              {scan.brand || "Unknown Brand"}
            </p>
          </div>
        </div>

        {/* Tags (Nutriscore, categories, labels) */}
        <div className="flex flex-wrap gap-2">
          {scan.category && (
            <span className="px-2 py-1 text-xs bg-gray-100 rounded-lg">
              {scan.category}
            </span>
          )}
          {scan.nutriscore && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg">
              Nutriscore: {scan.nutriscore.toUpperCase()}
            </span>
          )}
          {scan.labels?.map((label, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Safety Warnings */}
      <div className="px-5 space-y-3">
        {scan.analysisResult?.riskIngredients?.length > 0 && (
          <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <AlertTriangle className="w-4 h-4" />
              Allergy Warning
            </div>
            <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
              {scan.analysisResult.riskIngredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        {scan.analysisResult?.nutritionFlags?.length > 0 && (
          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold">
              <CircleAlert className="w-4 h-4" />
              Dietary Warning
            </div>
            <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
              {scan.analysisResult.nutritionFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {scan.analysisResult?.reason && (
        <div className="px-5 mt-4">
          <h4 className="font-semibold mb-2">Recommendations</h4>
          <p className="text-sm text-gray-600">{scan.analysisResult.reason}</p>
        </div>
      )}

      {/* Nutrition Facts */}
      {scan.nutrition && (
        <div className="px-5 mt-4">
          <h4 className="font-semibold mb-2">Nutrition Facts</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(scan.nutrition).map(([key, value], idx) => (
              <div key={idx} className="p-3 border rounded-lg">
                <p className="text-gray-500 capitalize">{key}</p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients */}
      {scan.ingredients?.length > 0 && (
        <div className="px-5 mt-4">
          <h4 className="font-semibold mb-2">Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {scan.ingredients.map((ing, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-gray-100 rounded-lg"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Known Allergens */}
      {scan.allergens?.length > 0 && (
        <div className="px-5 mt-4">
          <h4 className="font-semibold mb-2">Known Allergens</h4>
          <div className="flex flex-wrap gap-2">
            {scan.allergens.map((allergen, idx) => (
              <span
                key={idx}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-lg"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between gap-3 p-5">
        <Link href="/scan" className="flex-1">
          <button className="w-full py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600">
            Scan Again
          </button>
        </Link>
        <Link href="/history" className="flex-1">
          <button className="w-full py-2 px-4 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300">
            View History
          </button>
        </Link>
      </div>
    </div>
  );
}
