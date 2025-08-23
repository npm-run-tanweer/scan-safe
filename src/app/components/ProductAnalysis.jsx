"use client";
import React from "react";

export default function ProductAnalysis({ scan }) {
  if (!scan) {
    return <p className="text-gray-500">No analysis available.</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Product Analysis
      </h2>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Product:</p>
        <p className="font-medium">{scan.productName || "Unknown"}</p>
        <p className="text-gray-600">{scan.brand}</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Nutriscore:</p>
        <span className="px-2 py-1 rounded-lg text-white font-semibold bg-green-500">
          {scan.nutriscore?.toUpperCase() || "N/A"}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Status:</p>
        <span
          className={`px-3 py-1 rounded-lg font-semibold ${
            scan.analysisResult?.status === "safe"
              ? "bg-green-100 text-green-700"
              : scan.analysisResult?.status === "unsafe"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {scan.analysisResult?.status}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Reason:</p>
        <p className="text-gray-700">{scan.analysisResult?.reason}</p>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-500">Safety Score:</p>
        <p className="font-medium">{scan.analysisResult?.score || "N/A"} / 10</p>
      </div>

      {scan.analysisResult?.riskIngredients?.length > 0 && (
        <div className="mb-3">
          <p className="text-sm text-gray-500">Risk Ingredients:</p>
          <ul className="list-disc list-inside text-red-600">
            {scan.analysisResult.riskIngredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
        </div>
      )}

      {scan.analysisResult?.nutritionFlags?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500">Nutrition Concerns:</p>
          <ul className="list-disc list-inside text-yellow-600">
            {scan.analysisResult.nutritionFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
