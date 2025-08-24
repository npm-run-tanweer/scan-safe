"use client";
import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  // ✅ Run only on client
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          // Stop stream immediately, just testing access
          stream.getTracks().forEach((track) => track.stop());
          setHasCamera(true);
        })
        .catch((err) => {
          console.error("Camera access error:", err);
          setHasCamera(false);
        });
    } else {
      console.warn("Camera not supported in this browser");
      setHasCamera(false);
    }
  }, []);

  const startScanner = () => {
    if (scannerRef.current && !isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment", // ✅ mobile back camera
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          decoder: {
            readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"],
          },
          locate: true,
        },
        (err) => {
          if (err) {
            console.error("Quagga init error:", err);
            return;
          }
          Quagga.start();
          setIsScanning(true);
        }
      );

      Quagga.onDetected((data) => {
        if (data?.codeResult?.code) {
          setResult({
            code: data.codeResult.code,
            format: data.codeResult.format,
          });
          onScan(data.codeResult.code);

          // ✅ Optional: stop after first scan
          stopScanner();
        }
      });
    }
  };

  const stopScanner = () => {
    if (isScanning) {
      Quagga.stop();
      Quagga.offDetected(() => {});
      setIsScanning(false);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (isScanning) stopScanner();
    };
  }, [isScanning]);

  // --- Image Upload Scanner ---
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (!reader.result) return;
      Quagga.decodeSingle(
        {
          src: reader.result,
          numOfWorkers: 0, // needs to be 0 when used with decodeSingle
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader",
            ],
          },
        },
        (data) => {
          if (data && data.codeResult) {
            setResult({
              code: data.codeResult.code,
              format: data.codeResult.format,
            });
            onScan(data.codeResult.code);
          } else {
            setResult({ error: "No barcode detected in image" });
          }
        }
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* Scanner Box */}
      <div
        ref={scannerRef}
        className="relative w-full aspect-video max-h-[80vh] bg-black rounded-lg overflow-hidden"
      >
        {!hasCamera && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/80 p-4 text-center">
            <p>
              Camera access is required. Please allow camera permission in your
              browser settings.
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex gap-3 w-full justify-center">
        <button
          onClick={startScanner}
          disabled={isScanning || !hasCamera}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? "Scanning..." : "Start Scanner"}
        </button>
        <button
          onClick={stopScanner}
          disabled={!isScanning}
          className="px-6 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop Scanner
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 w-full">
          <pre className="p-3 bg-slate-800 text-slate-100 rounded-lg overflow-x-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {/* Image Upload Alternative */}
      <div className="mt-6 w-full">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-600">Or upload image</span>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="mt-4 w-fit text-sm py-4 file:mr-4 file:py-4 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 mx-auto hover:file:bg-emerald-100 file:cursor-pointer"
        />
      </div>
    </div>
  );
}
