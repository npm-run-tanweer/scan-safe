"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import {
  Scan,
  Camera,
  AlertTriangle,
  Zap,
  Target,
  Sparkles,
  Hash,
} from "lucide-react";
import ProductAnalysis from "../components/ProductAnalysis";
import BarcodeScanner from "../components/BarcodeScanner";
import { LoadResult } from "../components/Loader";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
export default function Scanner() {
  const [scannedProduct, setScannedProduct] = useState({});
  const [manualBarcode, setManualBarcode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [barcode, setBarcode] = useState("");

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedItems, setSuggestedItems] = useState([]);

  const user = useUser();
  const userId = user?.user?.id;
  async function handleScan(barcode) {
    try {
      const res = await fetch(
        `http://localhost:3000/api/scan/${barcode}.json?user=${userId}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch scan analysis: ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("Error in handleScan:", error);
      return { error: error.message };
    }
  }

  const onScan = (code) => setBarcode(code);

  useEffect(() => {
    if (barcode) {
      setIsLoading(true);
      handleScan(barcode).then((data) => {
        setScannedProduct(data);
        setIsLoading(false);
      });
    }
  }, [barcode]);

  // useEffect(() => {
  //   if (!userId || !scannedProduct?.categories?.[0]) {
  //     setLoading(false); // Reset loading if no userId or category
  //     return;
  //   }

  //   console.log(scannedProduct?.categories?.[0]);
  //   async function fetchSuggestions() {
  //     setLoading(true); // Set loading when starting fetch
  //     try {
  //       const res = await fetch(`/api/suggestions?userId=${userId}`, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           category: scannedProduct.categories[0].toLowerCase().trim(),
  //         }),
  //       });
  //       const data = await res.json();

  //       if (res.ok) {
  //         console.log("Received suggestions:", data); // Debug log
  //         setSuggestedItems(data.products);
  //       } else {
  //         console.error("API Error:", data.error);
  //         setError(data.error);
  //       }
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //       setError("Failed to load suggestions");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchSuggestions();
  // }, [scannedProduct?.categories, userId]);

  const handleSuggestions = async () => {
    setLoading(true); // Set loading when starting fetch
    try {
      const res = await fetch(`/api/suggestions?userId=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: scannedProduct?.categories[0]?.toLowerCase().trim(),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Received suggestions:", data); // Debug log
        setSuggestedItems(data.products);
      } else {
        console.error("API Error:", data.error);
        setError(data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load suggestions");
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (!userId) return;

  //   async function fetchSuggestions() {
  //     try {
  //       const res = await fetch(`/api/suggestions?userId=${userId}`);
  //       const data = await res.json();

  //       if (res.ok) setScans(data.scans);
  //       else console.error("Error:", data.error);
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //     } finally {
  //       setLoading(false);
  //       console.log(user.user.id);
  //     }
  //   }

  //   fetchScans();
  // }, [userId]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center gap-2">
  //       <Loader2 className="animate-spin w-5 h-5 text-emerald-600" />
  //       <span>Loading scans...</span>
  //     </div>
  //   );
  // }

  if (isLoading) {
    return <LoadResult />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pb-24 space-y-6 animate-fade-in">
      {/* Scanner Controls */}
      <Card className="w-full bg-white/90">
        <CardHeader className="text-center pb-4">
          {isScannerOpen ? (
            <BarcodeScanner onScan={onScan} />
          ) : (
            <>
              <div className="w-16 h-16 gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                <Scan className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-emerald-500" />
                Scan Product
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Use the camera simulator or enter barcode manually
              </p>
            </>
          )}
          <Button
            onClick={() => setIsScannerOpen(!isScannerOpen)}
            className="max-w-xl mx-auto gradient-primary text-white font-semibold py-4 text-lg shadow-card hover:shadow-floating transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            {isScannerOpen ? (
              "Back"
            ) : (
              <>
                <Camera className="w-6 h-6" />
                Camera Scan
              </>
            )}
            {/* <Zap className="w-5 h-5" /> */}
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-white px-4 text-slate-500 font-medium">
                Or enter manually
              </span>
            </div>
          </div>

          {/* Manual Entry */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter barcode manually"
                value={manualBarcode}
                onChange={(e) => setManualBarcode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onScan(manualBarcode)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 outline-none transition-all duration-200"
              />
            </div>
            <Button
              onClick={() => onScan(manualBarcode)}
              className="px-6 gradient-accent text-white hover:shadow-md transition-all duration-200"
              disabled={!manualBarcode.trim()}
            >
              Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertDescription className="text-red-700 font-medium">
            {error}
          </AlertDescription>
        </Alert>
      ) : loading ? (
        <Card className="w-full bg-white/90">
          <CardContent className="flex items-center justify-center gap-2 py-8">
            <Loader2 className="animate-spin w-5 h-5 text-emerald-600" />
            <span>Loading suggestions...</span>
          </CardContent>
        </Card>
      ) : suggestedItems.length > 0 ? (
        <Card className="w-full bg-white/90">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              Suggested Alternatives ({suggestedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {suggestedItems.map((item, index) => (
                <li
                  key={index}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50 animate-slide-up">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <AlertDescription className="text-red-700 font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Product Analysis */}
      {scannedProduct && (
        <>
          <div className="animate-slide-up">
            <ProductAnalysis scan={scannedProduct} />
            <button onClick={handleSuggestions}>Show alternatives</button>
          </div>
          <Card className="w-full bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h4 className="font-semibold text-slate-800">
                  Ready to scan another product?
                </h4>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsScannerOpen(true)}
                    variant="outline"
                    className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Scan Again
                  </Button>
                  <Button
                    onClick={() => {
                      setScannedProduct(null);
                      setError("");
                    }}
                    variant="outline"
                    className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Clear Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
