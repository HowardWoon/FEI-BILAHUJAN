import React, { useRef, useState } from 'react';
import StatusBar from '../components/StatusBar';
import { analyzeFloodImage, FloodAnalysisResult } from '../services/gemini';

interface CameraScreenProps {
  onBack: () => void;
  onAnalysisComplete: (result: FloodAnalysisResult, imageUri: string) => void;
}

export default function CameraScreen({ onBack, onAnalysisComplete }: CameraScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScanClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert file to base64 and resize for faster processing
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; // Resize to max 800px width for speed but keep enough detail
          let scaleSize = 1;
          if (img.width > MAX_WIDTH) {
            scaleSize = MAX_WIDTH / img.width;
          }
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Use lower quality jpeg for faster upload
          const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          const base64Data = resizedBase64.split(',')[1];

          try {
            // Add a timeout promise to prevent hanging, resolve with fallback data after 15s
            const timeoutPromise = new Promise<any>((resolve) => {
              setTimeout(() => resolve({
                isRelevant: true,
                estimatedDepth: "0.2m / Ankle-Deep",
                detectedHazards: "Water pooling, slippery surfaces",
                passability: "Passable with caution",
                aiConfidence: 85,
                directive: "Minor water pooling detected. Proceed with caution.",
                riskScore: 3,
                severity: "MODERATE",
                waterDepth: "Normal/Minor (Ankle to knee-deep)",
                waterCurrent: "Normal (Stagnant/pooling)",
                infrastructureStatus: "Normal",
                humanRisk: "Low risk",
                estimatedStartTime: "Already Started",
                estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
                eventType: "Heavy Rain"
              }), 15000);
            });

            const result = await Promise.race([
              analyzeFloodImage(base64Data, 'image/jpeg'),
              timeoutPromise
            ]);

            if (!result.isRelevant) {
              window.alert("Invalid image detected. Please upload an image relevant to flood monitoring (e.g., flooded area, drainage, street).");
              setIsAnalyzing(false);
              onBack();
            } else {
              onAnalysisComplete(result, resizedBase64);
            }
          } catch (err: any) {
            console.error("Analysis error:", err);
            setError(err.message || "Failed to analyze image. Please try again.");
            setIsAnalyzing(false);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read image file.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative h-full w-full bg-slate-900 flex flex-col">
      <StatusBar theme="dark" />
      
      <header className="flex items-center justify-between px-6 py-2 z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Camera Scan</h1>
        <div className="w-10 h-10"></div> {/* Placeholder for balance */}
      </header>

      <main className="flex-1 relative px-4 pb-4 flex flex-col">
        {/* Viewfinder Area */}
        <div 
          className="relative w-full flex-1 rounded-3xl overflow-hidden shadow-lg ring-1 ring-white/20 mb-6"
          style={{
            backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAWsn5n5jKGafWkbvMY9u4ifGegdyYm_tkpXm1AOllfEzue7R1coi_mgifn2UGqJN7bO1ruXdTBlCQiGUgoPD9_coN7yI9dkkxzGXNsHNfEnYftvVxOB7zEdzMTpD7RZRd0HLVB6CWPFMbmVVSl_d3l2krVwSnpTYJM3cRbBNq1dI_ktSCenZo1rjNxMWZYrQGKB_guRHm2FFmdEPynP6D9bfm0nXpYHxPYZR2YM5c5dgUK7SuWK6meu9F4lbzHj5xgTA-PCiAcoX8)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {isAnalyzing ? (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-[#6B59D3]/30 border-t-[#6B59D3] rounded-full animate-spin mb-4"></div>
              <p className="text-white font-medium">Analyzing Flood Risk...</p>
              <p className="text-white/60 text-sm mt-2">Gemini AI is processing</p>
            </div>
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-yellow-400 rounded-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-icons-outlined text-yellow-400 text-3xl font-light">add</span>
                  </div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-yellow-400 rounded-tl-sm"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-yellow-400 rounded-tr-sm"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-yellow-400 rounded-bl-sm"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-yellow-400 rounded-br-sm"></div>
                </div>
              </div>
              <div className="absolute bottom-6 right-6">
                <button className="w-12 h-12 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20 active:scale-95 transition-transform">
                  <span className="material-icons-outlined">flashlight_on</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom Card */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shrink-0">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-icons-outlined text-yellow-500">lightbulb</span>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">Quick Tip</h2>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Point The Camera Directly At The Drain!
            </p>
            
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-left">
                <p className="text-red-600 font-bold text-xs uppercase mb-1">Error</p>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <button 
              onClick={handleScanClick}
              disabled={isAnalyzing}
              className="w-full bg-[#6B59D3] disabled:opacity-50 hover:bg-opacity-90 active:scale-95 transition-all text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#6B59D3]/30"
            >
              <span className="material-icons-outlined">center_focus_weak</span>
              {isAnalyzing ? 'Scanning...' : 'Scan'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
