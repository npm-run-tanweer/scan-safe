"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  CircleCheck,
  Clock,
  History,
  Package,
  XCircle,
} from "lucide-react";

const Page = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [scans, setScans] = useState([]);

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
    <div className="max-w-2xl mx-auto py-12 pb-24">
      {scans && (
        <div className="space-y-4">
          <div className="bg-[#2E3A4D] text-white rounded-t-2xl p-8 flex items-center gap-3">
            <History className="w-10 h-10" />
            <div>
              <h2 className="text-4xl font-semibold">Scan History</h2>
              <p className="text-base text-gray-300">{scans?.length} total scans</p>
            </div>
          </div>
          {scans?.length === 0 ? (
            <p className="text-sm text-gray-600">No scans found.</p>
          ) : (
            // scans?.map((scan) => (
            //   <Card key={scan._id} className="shadow-sm">
            //     <CardHeader>
            //       <CardTitle className="text-base font-medium">
            //         {scan.productName || "Unnamed Product"} ({scan.barcode})
            //       </CardTitle>
            //     </CardHeader>
            //     <CardContent>
            //       <p>
            //         Status: <b>{scan.analysisResult.status}</b>
            //       </p>
            //       <p>Reason: {scan.analysisResult.reason}</p>
            //       <p>NutriScore: {scan.nutriscore || "N/A"}</p>
            //       <p className="text-xs text-gray-500 mt-2">
            //         Scanned on {new Date(scan.createdAt).toLocaleString()}
            //       </p>
            //     </CardContent>
            //   </Card>
            // ))
            scans?.map((scan, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow p-4 space-y-3 border"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <Package className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {scan.productName || "Unnamed Product"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex items-center gap-1 
                      ${
                        scan.analysisResult.status === "unsafe"
                          ? "text-red-600 bg-red-100"
                          : "text-green-600 bg-green-100"
                      } 
                      px-2 py-0.5 rounded-full text-sm font-medium`}
                    >
                      {scan.analysisResult.status === "unsafe" ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        <CircleCheck className="w-4 h-4" />
                      )}
                      {scan.analysisResult.status}
                    </div>

                    <div className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {scan.analysisResult.score}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  {new Date(scan.createdAt).toLocaleString()}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Warning: {scan.analysisResult.reason}
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    {scan.analysisResult.reason}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
