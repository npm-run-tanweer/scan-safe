"use client";
import { useEffect, useRef, useState } from "react";
import Quagga from "quagga";

export default function BarcodeScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  // --- Live Camera Scanner ---
  const startScanner = () => {
    if (scannerRef.current && !isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: { facingMode: "environment" },
          },
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
        setResult({
          code: data.codeResult.code,
          format: data.codeResult.format,
        });
        onScan(data.codeResult.code);
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
    <div className="flex flex-col items-center">
      {/* Live Camera */}
      <div
        ref={scannerRef}
        className="w-[400px] h-[300px] border border-gray-400"
      />

      <div className="mt-4 flex gap-2">
        <button
          onClick={startScanner}
          disabled={isScanning}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          Start Scanner
        </button>
        <button
          onClick={stopScanner}
          disabled={!isScanning}
          className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
        >
          Stop Scanner
        </button>
      </div>

      {/* Image Upload */}
      <div className="mt-6">
        <input type="file" accept="image/*" onChange={handleFileUpload} />
      </div>

      {result && (
        <pre className="mt-4 p-2 bg-black text-white rounded w-[400px] overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
