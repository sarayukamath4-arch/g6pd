"use client";

import { useState, useRef } from "react";
import { Camera, Upload, AlertCircle, X } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { InfoBanner } from "@/components/layout/InfoBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VerificationModal } from "@/components/scan/VerificationModal";
import { compressImage } from "@/lib/imageCompression";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Scanner() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [scanData, setScanData] = useState({ product_name: "", ingredients: [] as string[] });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dailyScanCount, setDailyScanCount] = useState(0);
  const [scanLimitReached, setScanLimitReached] = useState(false);

  const DAILY_SCAN_LIMIT = 25;

  // Check daily scan limit
  const checkScanLimit = () => {
    const today = new Date().toDateString();
    const storedData = localStorage.getItem(`scan-count-${user?.id}-${today}`);
    const count = storedData ? parseInt(storedData) : 0;
    
    if (count >= DAILY_SCAN_LIMIT) {
      setScanLimitReached(true);
      return false;
    }
    
    setDailyScanCount(count);
    return true;
  };

  const incrementScanCount = () => {
    const today = new Date().toDateString();
    const currentCount = localStorage.getItem(`scan-count-${user?.id}-${today}`);
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1;
    localStorage.setItem(`scan-count-${user?.id}-${today}`, newCount.toString());
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processImage(file);
    }
  };

  const handleCameraCapture = () => {
    fileInputRef.current?.click();
  };

  const processImage = async (file: File) => {
    if (!checkScanLimit()) return;

    setProcessing(true);
    setError("");

    try {
      // Compress image
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, {
        type: 'image/jpeg',
        lastModified: Date.now()
      });

      // Send to OCR API
      const formData = new FormData();
      formData.append('image', compressedFile);

      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setScanData(result.data);
        setShowVerification(true);
        incrementScanCount();
      } else {
        if (result.fallback) {
          // OCR failed, allow manual entry
          setScanData({
            product_name: "Unknown Product",
            ingredients: []
          });
          setShowVerification(true);
          setError(result.error || "OCR processing failed. You can enter ingredients manually.");
        } else {
          setError(result.error || "Failed to process image");
        }
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError("Failed to process image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleVerificationConfirm = (data: { productName: string; ingredients: string[] }) => {
    // Store data for journal entry
    sessionStorage.setItem('pending-scan-data', JSON.stringify({
      productName: data.productName,
      ingredients: data.ingredients,
      exposureDate: new Date().toISOString().split('T')[0]
    }));
    
    // Redirect to journal
    router.push('/journal');
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScanData({ product_name: "", ingredients: [] });
    setSelectedFile(null);
    setError("");
  };

  if (!user) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <PageHeader
          eyebrow="AUTHENTICATION REQUIRED"
          title="Please sign in"
          subtitle="You need to be signed in to use the scanner"
        />
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Sign in to access the label scanner</p>
          <Button onClick={() => router.push('/auth/login')} className="bg-emerald-600 hover:bg-emerald-700">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        eyebrow="PRODUCT ANALYSIS"
        title="Label scanner"
        subtitle="Photograph product labels to extract and analyze ingredients"
      />

      {scanLimitReached && (
        <InfoBanner type="warning" title="Daily scan limit reached">
          You've reached the daily limit of {DAILY_SCAN_LIMIT} scans. You can still enter ingredients manually in the journal.
        </InfoBanner>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {!scanned ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-slate-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Scan a product label
                  </h2>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Photograph the ingredients panel and GeneGuide will extract
                    the ingredients for you to review.
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleCameraCapture}
                      disabled={processing || scanLimitReached}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleCameraCapture}
                      disabled={processing || scanLimitReached}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>

                  {processing && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                      <p className="text-sm text-slate-600">Extracting ingredients via Groq Vision...</p>
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mt-4">
                    Powered by Groq Vision API for OCR processing
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 mb-2">SCAN COMPLETE</p>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Ingredients detected
                  </h2>

                  <div className="space-y-3 max-w-md mx-auto mb-6">
                    {scanData.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <span className="text-xs text-slate-400 font-mono">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="font-medium text-slate-900">{ingredient}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={handleScanAgain}
                  >
                    Scan another label
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs font-semibold text-slate-500 mb-4">HOW IT WORKS</p>
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                From label to evidence
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Capture</p>
                    <p className="text-sm text-slate-600">Take a photo of the ingredients panel</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Review</p>
                    <p className="text-sm text-slate-600">Confirm extracted ingredients are correct</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Investigate</p>
                    <p className="text-sm text-slate-600">Compare with clinical evidence</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 mb-2">
                  <strong>Daily scans:</strong> {dailyScanCount}/{DAILY_SCAN_LIMIT}
                </p>
                <p className="text-xs text-slate-500">
                  Resets at midnight
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <VerificationModal
        isOpen={showVerification}
        onClose={() => setShowVerification(false)}
        productData={scanData}
        onConfirm={handleVerificationConfirm}
      />
    </div>
  );
}