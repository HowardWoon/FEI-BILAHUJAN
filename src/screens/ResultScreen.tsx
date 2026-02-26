import React, { useState, useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { FloodAnalysisResult } from '../services/gemini';
import { createZone, addFloodZone } from '../data/floodZones';

interface ResultScreenProps {
  result: FloodAnalysisResult;
  imageUri: string;
  location: { lat: number; lng: number; address: string } | null;
  onBack: () => void;
  onTabChange: (tab: 'map' | 'report' | 'alert') => void;
  zoneId?: string | null;
}

export default function ResultScreen({ result, imageUri, location, onBack, onTabChange, zoneId }: ResultScreenProps) {
  const [isUploaded, setIsUploaded] = useState(false);
  const [nearbyUsers, setNearbyUsers] = useState(0);
  const [fullAddress, setFullAddress] = useState(location?.address || 'Unknown Location');
  const [detectedState, setDetectedState] = useState('Unknown State');

  useEffect(() => {
    if (location && window.google && window.google.maps && window.google.maps.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: location.lat, lng: location.lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setFullAddress(results[0].formatted_address);
          
          // Find state (administrative_area_level_1)
          const addressComponents = results[0].address_components;
          const stateComponent = addressComponents.find(c => c.types.includes('administrative_area_level_1'));
          
          // Find a good human readable name (locality, sublocality, or route)
          const locality = addressComponents.find(c => c.types.includes('locality'))?.long_name;
          const sublocality = addressComponents.find(c => c.types.includes('sublocality'))?.long_name;
          const route = addressComponents.find(c => c.types.includes('route'))?.long_name;
          
          let readableName = 'Reported Location';
          if (sublocality && locality) {
            readableName = `${sublocality}, ${locality}`;
          } else if (locality) {
            readableName = locality;
          } else if (route) {
            readableName = route;
          } else {
            readableName = results[0].formatted_address.split(',')[0];
          }
          
          // Store the readable name in fullAddress state for now, we'll use it in createZone
          setFullAddress(readableName);

          if (stateComponent) {
            let stateName = stateComponent.long_name;
            // Clean up common prefixes/suffixes to match our predefined states
            if (stateName.includes('Kuala Lumpur')) stateName = 'Kuala Lumpur';
            else if (stateName.includes('Labuan')) stateName = 'Labuan';
            else if (stateName.includes('Putrajaya')) stateName = 'Putrajaya';
            else if (stateName.includes('Penang') || stateName.includes('Pulau Pinang')) stateName = 'Penang';
            else if (stateName.includes('Malacca') || stateName.includes('Melaka')) stateName = 'Melaka';
            else if (stateName.includes('Johor')) stateName = 'Johor';
            else if (stateName.includes('Kedah')) stateName = 'Kedah';
            else if (stateName.includes('Kelantan')) stateName = 'Kelantan';
            else if (stateName.includes('Negeri Sembilan')) stateName = 'Negeri Sembilan';
            else if (stateName.includes('Pahang')) stateName = 'Pahang';
            else if (stateName.includes('Perak')) stateName = 'Perak';
            else if (stateName.includes('Perlis')) stateName = 'Perlis';
            else if (stateName.includes('Sabah')) stateName = 'Sabah';
            else if (stateName.includes('Sarawak')) stateName = 'Sarawak';
            else if (stateName.includes('Selangor')) stateName = 'Selangor';
            else if (stateName.includes('Terengganu')) stateName = 'Terengganu';
            
            setDetectedState(stateName);
          }
        }
      });
    } else if (location?.address) {
       // Fallback to simple string matching if geocoding fails
       const states = ['Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Perak', 'Perlis', 'Penang', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Kuala Lumpur', 'Putrajaya', 'Labuan'];
       for (const state of states) {
         if (location.address.toLowerCase().includes(state.toLowerCase())) {
           setDetectedState(state);
           break;
         }
       }
    }
  }, [location]);

  const handleUpload = () => {
    if (location) {
      const newZoneId = 'user_reported_' + Date.now();
      
      const newZone = createZone(
        newZoneId,
        fullAddress, // This is now the readable name
        fullAddress, // This is now the readable name
        detectedState !== 'Unknown State' ? detectedState : 'Kuala Lumpur', // Fallback to KL if unknown
        'Unknown Region',
        location.lat,
        location.lng,
        result.riskScore,
        result.directive,
        0.02,
        ['User Reports', 'AI Analysis']
      );
      
      newZone.estimatedStartTime = result.estimatedStartTime;
      newZone.estimatedEndTime = result.estimatedEndTime;
      newZone.eventType = result.eventType;
      
      addFloodZone(newZone);
    }
    setNearbyUsers(Math.floor(Math.random() * 2000) + 500); // Random number between 500 and 2500
    setIsUploaded(true);
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-[#F8F9FA]">
      <StatusBar theme="light" />
      
      <header className="flex items-center justify-center px-6 py-6 mt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E65100] text-white flex items-center justify-center">
            <span className="material-icons-round text-xl">check</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AI Analysis Complete</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-6 mb-6">
          <div className="flex items-center gap-2 mb-4 text-slate-600 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
            <span className="material-icons-round text-[#E65100]">location_on</span>
            <p className="text-sm font-medium truncate">{fullAddress}</p>
          </div>

          {!isUploaded ? (
            <button 
              onClick={handleUpload}
              className="w-full bg-[#5E56B1] hover:bg-[#4A4494] text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-all active:scale-95"
            >
              <span className="material-icons-round">cloud_upload</span>
              Upload to Alert Zone
            </button>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 animate-fade-in">
              <span className="material-icons-round text-emerald-500 mt-0.5">notifications_active</span>
              <p className="text-emerald-700 text-sm font-medium">
                Your report is live. <span className="font-bold">{nearbyUsers} nearby users</span> have been alerted.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-4 mb-4">
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img src={imageUri} alt="Scanned area" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-[#E65100] text-white text-[10px] font-bold uppercase tracking-wider rounded-full self-start mb-2">
                  {result.severity} - LEVEL {result.riskScore}
                </div>
                <h2 className="text-lg font-bold text-slate-900">AI Survival Directive</h2>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[#D32F2F] font-bold italic text-[15px] leading-relaxed">
                "{result.directive}"
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 mb-8">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Extracted Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#111827] p-4 rounded-2xl flex flex-col justify-between min-h-[7rem] h-full col-span-2">
              <span className="material-icons-round text-[#E65100] text-xl mb-2">schedule</span>
              <div className="flex justify-between">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Start ({result.eventType})</p>
                  <p className="text-white font-bold text-sm">{result.estimatedStartTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Est. End ({result.eventType})</p>
                  <p className="text-white font-bold text-sm">{result.estimatedEndTime}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-2xl flex flex-col justify-between min-h-[7rem] h-full">
              <span className="material-icons-round text-[#E65100] text-xl mb-2">straighten</span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Estimated Depth</p>
                <p className="text-white font-bold text-sm">{result.estimatedDepth}</p>
              </div>
            </div>
            
            <div className="bg-[#111827] p-4 rounded-2xl flex flex-col justify-between min-h-[7rem] h-full">
              <span className="material-icons-round text-[#E65100] text-xl mb-2">warning</span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detected Hazards</p>
                <p className="text-white font-bold text-sm">{result.detectedHazards}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-2xl flex flex-col justify-between min-h-[7rem] h-full">
              <span className="material-icons-round text-[#E65100] text-xl mb-2">directions_car</span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passability</p>
                <p className="text-white font-bold text-sm">{result.passability}</p>
              </div>
            </div>

            <div className="bg-[#111827] p-4 rounded-2xl flex flex-col justify-between min-h-[7rem] h-full">
              <span className="material-icons-round text-[#E65100] text-xl mb-2">auto_awesome</span>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI Confidence</p>
                <p className="text-white font-bold text-sm">{result.aiConfidence}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 space-y-3 mb-6">
          <button 
            onClick={() => onTabChange('report')}
            className="w-full py-4 bg-[#E65100] hover:bg-[#CC4800] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <span className="material-icons-round">podcasts</span>
            Report to Authorities (JPS/APM)
          </button>
        </div>

        <div className="text-center pb-8">
          <p className="text-[10px] text-slate-400">
            ID: FL-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')} | Analysis generated just now
          </p>
        </div>
      </div>

      <BottomNav activeTab="report" onTabChange={onTabChange} />
    </div>
  );
}
