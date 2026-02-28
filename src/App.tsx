import { useState, useEffect, useRef } from 'react';
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

  // Track which states already have a notification — prevents any duplicate regardless of event timing
  const notifiedStates = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleFloodAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { zoneId, zone } = customEvent.detail;
      // One notification per state only — if state already notified, skip entirely
      if (notifiedStates.current.has(zone.state)) return;
      notifiedStates.current.add(zone.state);
      const id = Date.now();
      setNotifications(prev => [...prev, { id, zoneId, zone }]);
    };
    window.addEventListener('floodAlert', handleFloodAlert);
    return () => window.removeEventListener('floodAlert', handleFloodAlert);
  }, []); // [] — listener doesn't depend on screen state, must be stable across navigations

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
      
      {/* Keep ReportScreen mounted while camera is open (cameraOrigin==='report') so local state (location, address, marker) is preserved */}
      {(currentScreen === 'report' || (currentScreen === 'camera' && cameraOrigin === 'report')) && (
        <div className={`${currentScreen === 'report' ? 'block' : 'hidden'} h-full w-full`}>
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
              onClick={() => {
                notifications.forEach(n => notifiedStates.current.delete(n.zone.state));
                setNotifications([]);
              }}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-1.5 rounded-xl shadow border border-slate-300 text-sm transition-all"
            >
              Clear All
            </button>
          </div>
          {notifications.map((notification) => {
            const sev = notification.zone.severity;
            const isCritical = sev >= 8;
            const isFlood = sev >= 4;
            const stateName = notification.zone.state || notification.zone.name;

            const borderColor = isCritical ? 'border-l-red-500' : isFlood ? 'border-l-orange-400' : 'border-l-green-500';
            const statusColor = isCritical ? 'text-red-600' : isFlood ? 'text-orange-500' : 'text-green-600';
            const statusText = isCritical
              ? 'Flooding reported in this area.'
              : isFlood
              ? 'Water levels are rising. Stay alert.'
              : 'No flood threat detected.';

            return (
              <div key={notification.id} className="pointer-events-auto animate-[slideDown_0.3s_ease-out]">
                <div
                  onClick={() => {
                    notifiedStates.current.delete(notification.zone.state);
                    setSelectedAlertId(notification.zoneId);
                    setCurrentScreen('alert-detail');
                    setNotifications(prev => prev.filter(n => n.id !== notification.id));
                  }}
                  className={`bg-white rounded-xl shadow-lg border border-slate-100 border-l-4 ${borderColor} px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-3`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-extrabold text-base truncate">{stateName}</p>
                    <p className="text-slate-400 text-[10px] uppercase tracking-wide -mt-0.5 mb-0.5">State Overview</p>
                    <p className={`font-medium text-xs ${statusColor}`}>{statusText}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      notifiedStates.current.delete(notification.zone.state);
                      setNotifications(prev => prev.filter(n => n.id !== notification.id));
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 shrink-0"
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
