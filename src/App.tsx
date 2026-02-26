import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import MapScreen from './screens/MapScreen';
import CameraScreen from './screens/CameraScreen';
import ResultScreen from './screens/ResultScreen';
import AlertsScreen from './screens/AlertsScreen';
import AlertDetailScreen from './screens/AlertDetailScreen';
import ReportScreen from './screens/ReportScreen';
import { FloodAnalysisResult } from './services/gemini';
import { FloodZone } from './data/floodZones';
import { 
  initializeDataCollection, 
  startContinuousMonitoring, 
  stopContinuousMonitoring 
} from './services/dataCollection';
import { getFloodZones } from './data/floodZones';
import { PrivacyNotice } from './components/PrivacyNotice';

type Screen = 'splash' | 'map' | 'camera' | 'result' | 'alerts' | 'alert-detail' | 'report';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [analysisResult, setAnalysisResult] = useState<FloodAnalysisResult | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [startMapWithScan, setStartMapWithScan] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [cameraOrigin, setCameraOrigin] = useState<'map' | 'report' | 'alerts' | 'alert-detail'>('map');
  const [scanLocation, setScanLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [notifications, setNotifications] = useState<{ id: number; zoneId: string; zone: FloodZone }[]>([]);
  useEffect(() => {
    // Initialize 24/7 data collection system
    initializeDataCollection();
    
    // Start continuous monitoring
    const zones = getFloodZones();
    startContinuousMonitoring(zones);
    
    console.log('🚀 BILAHUJAN 24/7 Data Collection Active');
    
    // Cleanup on unmount
    return () => {
      stopContinuousMonitoring();
      console.log('⏹️ Data collection stopped');
    };
  }, []);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setCurrentScreen('map');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFloodAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { zoneId, zone } = customEvent.detail;
      const id = Date.now();
      setNotifications(prev => [...prev, { id, zoneId, zone }]);
    };
    window.addEventListener('floodAlert', handleFloodAlert);
    return () => window.removeEventListener('floodAlert', handleFloodAlert);
  }, [currentScreen]);

  const handleTabChange = (tab: 'map' | 'report' | 'alert') => {
    if (tab === 'map') {
      setStartMapWithScan(false);
      setCurrentScreen('map');
    }
    if (tab === 'report') setCurrentScreen('report');
    if (tab === 'alert') setCurrentScreen('alerts');
  };

  const handleHelpCommunity = () => {
    window.open('https://padlet.com/howardwoonhz06/bilahujan-discord-hjkr0lodg6fqhqqm', '_blank');
  };

  const handleAnalysisComplete = (result: FloodAnalysisResult, uri: string) => {
    setAnalysisResult(result);
    setImageUri(uri);
    if (cameraOrigin === 'report') {
       setCurrentScreen('report');
    } else {
       setCurrentScreen('result');
    }
  };

  return (
    <div className="w-full h-full font-display">
      {currentScreen === 'splash' && <SplashScreen />}
      
      {currentScreen === 'map' && (
        <MapScreen 
          onScanClick={(loc) => {
            if (loc) setScanLocation(loc);
            setCameraOrigin('map');
            setCurrentScreen('camera');
          }} 
          onTabChange={handleTabChange} 
          initialShowLocationModal={startMapWithScan}
        />
      )}
      
      {currentScreen === 'camera' && (
        <CameraScreen 
          onBack={() => {
            if (cameraOrigin === 'report') setCurrentScreen('report');
            else if (cameraOrigin === 'alert-detail') setCurrentScreen('alert-detail');
            else if (cameraOrigin === 'alerts') setCurrentScreen('alerts');
            else setCurrentScreen('map');
          }}
          onAnalysisComplete={handleAnalysisComplete}
          onTabChange={handleTabChange}
        />
      )}
      
      {currentScreen === 'result' && analysisResult && imageUri && (
        <ResultScreen 
          result={analysisResult}
          imageUri={imageUri}
          location={scanLocation}
          onBack={() => setCurrentScreen('camera')}
          onTabChange={handleTabChange}
          zoneId={cameraOrigin === 'alert-detail' ? selectedAlertId : null}
        />
      )}
      
      {currentScreen === 'report' && (
        <div className="block h-full w-full">
          <ReportScreen 
            onTabChange={handleTabChange}
            onScanClick={() => {
              setCameraOrigin('report');
              setCurrentScreen('camera');
            }}
            imageUri={imageUri}
            onClearImage={() => {
              setImageUri(null);
              setAnalysisResult(null); // Clear analysis when image is cleared
              setScanLocation(null);
            }}
            analysisResult={analysisResult}
            initialLocation={scanLocation}
          />
        </div>
      )}
      
      {currentScreen === 'alerts' && (
        <AlertsScreen 
          onTabChange={handleTabChange}
          onAlertClick={(zoneId) => {
            setSelectedAlertId(zoneId);
            setCurrentScreen('alert-detail');
          }}
          onScanClick={handleHelpCommunity}
        />
      )}
      
      {currentScreen === 'alert-detail' && (
        <AlertDetailScreen 
          zoneId={selectedAlertId}
          onBack={() => setCurrentScreen('alerts')}
          onScanClick={() => {
            setCameraOrigin('alert-detail');
            setCurrentScreen('camera');
          }}
          onTabChange={handleTabChange}
        />
      )}

      {/* Global Notification Stack */}
      {notifications.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-[100] p-3 flex flex-col gap-2 pointer-events-none">
          <div className="flex justify-end mb-2 pointer-events-auto">
            <button
              onClick={() => setNotifications([])}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-1.5 rounded-xl shadow border border-slate-300 text-sm transition-all"
            >
              Clear All
            </button>
          </div>
          {notifications.map((notification) => {
            const sev = notification.zone.severity;
            const isFlood = sev >= 4;
            const isCritical = sev >= 8;
            const borderColor = isCritical ? 'border-red-200' : isFlood ? 'border-orange-200' : 'border-green-200';
            const iconBg = isCritical ? 'bg-red-100' : isFlood ? 'bg-orange-100' : 'bg-green-100';
            const iconColor = isCritical ? 'text-red-600' : isFlood ? 'text-orange-500' : 'text-green-600';
            const titleColor = isCritical ? 'text-red-600' : isFlood ? 'text-orange-500' : 'text-green-600';
            const icon = isCritical ? 'warning' : isFlood ? 'water_damage' : 'check_circle';
            const label = isCritical ? 'Flood Alert Nearby' : isFlood ? 'Flood Warning Nearby' : 'Area Status Update';
            return (
              <div key={notification.id} className="pointer-events-auto animate-[slideDown_0.3s_ease-out]">
                <div
                  onClick={() => {
                    setSelectedAlertId(notification.zoneId);
                    setCurrentScreen('alert-detail');
                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                  }}
                  className={`bg-white rounded-2xl shadow-2xl border ${borderColor} px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3`}
                >
                  <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className={`material-icons-round text-lg ${iconColor}`}>{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`${titleColor} font-bold text-xs mb-0.5`}>{label}</h4>
                    <p className="text-slate-800 font-bold text-sm truncate">
                      {notification.zone.name === 'Statewide Overview' ? `${notification.zone.state} - Statewide Overview` : notification.zone.name}
                    </p>
                    <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{notification.zone.forecast}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications(prev => prev.filter(n => n.id !== notification.id));
                    }}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 shrink-0 mt-0.5"
                  >
                    <span className="material-icons-round text-sm">close</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Privacy Notice */}
      <PrivacyNotice />
    </div>
  );
}
