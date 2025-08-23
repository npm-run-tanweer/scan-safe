"use client"
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useUser } from "@clerk/nextjs";

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
    <div className="max-w-2xl mx-auto pb-24">
      {scans && (
        <div className="space-y-4">
          <h2 className="text-4xl font-semibold text-center py-6">Previous Scans</h2>
          {scans?.length === 0 ? (
            <p className="text-sm text-gray-600">No scans found.</p>
          ) : (
            scans?.map((scan) => (
              <Card key={scan._id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    {scan.productName || "Unnamed Product"} ({scan.barcode})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Status: <b>{scan.analysisResult.status}</b>
                  </p>
                  <p>Reason: {scan.analysisResult.reason}</p>
                  <p>NutriScore: {scan.nutriscore || "N/A"}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Scanned on {new Date(scan.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
