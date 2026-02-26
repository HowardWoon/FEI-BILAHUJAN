import { useState, useEffect } from 'react';
import { saveFloodZone } from '../services/dataCollection';

export interface FloodZone {
  id: string;
  name: string;
  specificLocation: string;
  state: string;
  region: string;
  center: { lat: number; lng: number };
  severity: number;
  forecast: string;
  color: string;
  paths: { lat: number; lng: number }[];
  sources: string[];
  lastUpdated: string;
  drainageBlockage: number; // 0-100
  rainfall: number; // mm/hr
  aiConfidence: number; // 0-100
  aiAnalysisText: string;
  aiAnalysis: {
    waterDepth: string;
    currentSpeed: string;
    riskLevel: string;
    historicalContext: string;
  };
  aiRecommendation: {
    impassableRoads: string;
    evacuationRoute: string;
    evacuationCenter: string;
  };
  estimatedStartTime?: string;
  estimatedEndTime?: string;
  eventType?: string;
  terrain?: { type: string; label: string };
  historical?: { frequency: string; status: string };
  notifiedDepts?: string[];
}

const generateOrganicShape = (lat: number, lng: number, radius: number, points: number = 12) => {
  const paths = [];
  // Use a fixed seed based on lat/lng so the shape is consistent across renders
  const seed = lat * lng;
  const random = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    // Add randomness to radius for organic shape
    const r = radius * (0.6 + random(i) * 0.8);
    paths.push({
      lat: lat + r * Math.cos(angle),
      lng: lng + r * Math.sin(angle) * 1.2, // slightly wider longitude
    });
  }
  return paths;
};

export const createZone = (
  id: string, 
  name: string, 
  specificLocation: string,
  state: string,
  region: string,
  lat: number, 
  lng: number, 
  severity: number, 
  forecast: string, 
  radius: number = 0.05,
  sources: string[] = ['Weather API']
): FloodZone => {
  const color = severity >= 8 ? 'red' : severity >= 4 ? 'orange' : 'green';
  
  // Seeded random data based on lat/lng to keep it consistent but varied
  const seed = lat + lng;
  const drainageBlockage = Math.floor(severity * 10 + (seed % 10));
  const rainfall = Math.floor(severity * 5 + (seed % 20));
  const aiConfidence = Math.floor(85 + (seed % 15));
  
  const waterDepth = severity >= 8 ? `${(severity * 0.1).toFixed(1)}m` : severity >= 4 ? '0.2m' : '0m';
  const currentSpeed = severity >= 8 ? 'rapid current' : severity >= 4 ? 'moderate current' : 'still water';
  const riskLevel = severity >= 8 ? 'Ground floors at risk.' : severity >= 4 ? 'Roads partially flooded.' : 'Normal conditions.';
  
  const historicalContext = severity >= 8 ? 'Matches Dec 2021 pattern' : 'Typical monsoon levels';
  
  const impassableRoads = severity >= 8 ? `Jalan ${name} impassable.` : severity >= 4 ? `Jalan ${name} partially flooded.` : 'All roads clear.';
  const evacuationRoute = `via Jalan ${specificLocation.split(' ')[0] || 'Utama'}`;
  const evacuationCenter = `SMK ${name}`;
  
  const aiAnalysisText = severity >= 8 
    ? "Critical infrastructure failure. Evacuation advised for low-lying sectors due to uncontrolled drainage blockage."
    : severity >= 4
    ? "Moderate risk detected. Localized flooding possible in depression areas. Monitor water levels closely."
    : "Conditions normal. No immediate flood risk detected in this sector.";

  // Generate mock estimated times based on severity
  const now = new Date();
  const estimatedStartTime = severity >= 4 ? new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 2).toLocaleString() : 'N/A';
  const estimatedEndTime = severity >= 4 ? new Date(now.getTime() + Math.random() * 1000 * 60 * 60 * 12).toLocaleString() : 'N/A';

  const terrainTypes = ['Low', 'Flat', 'Hilly', 'Steep'];
  const terrainLabels = ['Depression', 'Plains', 'Slopes', 'High Ground'];
  const terrainIndex = Math.floor(Math.abs(seed) % 4);
  
  const historicalFreqs = ['0×/yr', '1×/yr', '2×/yr', '3+×/yr'];
  const historicalStatuses = ['Inactive', 'Monitor', 'Active', 'Critical'];
  const historicalIndex = Math.floor(Math.abs(seed * 2) % 4);

  return {
    id,
    name,
    specificLocation,
    state,
    region,
    center: { lat, lng },
    severity,
    forecast,
    color,
    paths: generateOrganicShape(lat, lng, radius, 14),
    sources,
    // Mock a recent update time
    lastUpdated: new Date(Date.now() - Math.random() * 1000 * 60 * 15).toISOString(),
    drainageBlockage: Math.min(100, drainageBlockage),
    rainfall,
    aiConfidence: Math.min(100, aiConfidence),
    aiAnalysisText,
    aiAnalysis: {
      waterDepth,
      currentSpeed,
      riskLevel,
      historicalContext,
    },
    aiRecommendation: {
      impassableRoads,
      evacuationRoute,
      evacuationCenter,
    },
    estimatedStartTime,
    estimatedEndTime,
    eventType: severity >= 8 ? 'Flash Flood' : severity >= 4 ? 'Heavy Rain' : 'Normal',
    terrain: { type: terrainTypes[terrainIndex], label: terrainLabels[terrainIndex] },
    historical: { frequency: historicalFreqs[historicalIndex], status: historicalStatuses[historicalIndex] }
  };
};

let floodZonesCache: Record<string, FloodZone> | null = null;

export const getFloodZones = (): Record<string, FloodZone> => {
  if (!floodZonesCache) {
    floodZonesCache = {
      kl: createZone('kl', 'Kuala Lumpur', 'Masjid Jamek', 'Kuala Lumpur', 'Federal Territory', 3.14, 101.69, 8, 'Heavy rain expected. High risk of flash floods in city center.', 0.04, ['Weather API', 'CCTV Live', 'User Reports']),
      shahAlam: createZone('shahAlam', 'Shah Alam', 'Taman Sri Muda', 'Selangor', 'Central Region', 3.07, 101.51, 9, 'Critical water levels at Taman Sri Muda. Evacuation standby.', 0.05, ['CCTV Live', 'Gov Sensors']),
      kajang: createZone('kajang', 'Kajang', 'Taman Jenaris', 'Selangor', 'Central Region', 2.99, 101.79, 8, 'River levels critical. Immediate evacuation advised for low-lying areas.', 0.03, ['User Reports', 'Weather API']),
      seriKembangan: createZone('seriKembangan', 'Seri Kembangan', 'Jalan Besar', 'Selangor', 'Central Region', 3.03, 101.71, 3, 'Light showers. Drainage systems operating normally.', 0.02, ['Weather API']),
      seremban: createZone('seremban', 'Seremban', 'Taman Ampangan', 'Negeri Sembilan', 'Central Region', 2.72, 101.94, 5, 'Moderate rain. Localized flash floods possible.', 0.04, ['Weather API', 'User Reports']),
      jb: createZone('jb', 'Johor Bahru', 'Jalan Wong Ah Fook', 'Johor', 'Southern Region', 1.49, 103.74, 2, 'Clear skies. No flood risk detected.', 0.05, ['Weather API']),
      batu_pahat: createZone('batu_pahat', 'Batu Pahat', 'Pekan Batu Pahat', 'Johor', 'Southern Region', 1.85, 102.93, 4, 'Moderate rain. Monitor low-lying areas near Sungai Batu Pahat.', 0.04, ['Weather API', 'User Reports']),
      muar: createZone('muar', 'Muar', 'Pagoh', 'Johor', 'Southern Region', 2.04, 102.57, 3, 'Light rain. Drainage normal.', 0.03, ['Weather API']),
      melaka: createZone('melaka', 'Melaka', 'Banda Hilir', 'Melaka', 'Southern Region', 2.19, 102.25, 2, 'Normal weather conditions.', 0.04, ['Weather API']),
      alor_gajah: createZone('alor_gajah', 'Alor Gajah', 'Pekan Alor Gajah', 'Melaka', 'Southern Region', 2.38, 102.21, 3, 'Cloudy, isolated showers expected.', 0.03, ['Weather API']),
      kuantan: createZone('kuantan', 'Kuantan', 'Sungai Lembing', 'Pahang', 'East Coast', 3.81, 103.32, 6, 'Continuous rain warning. Monitor river levels.', 0.06, ['Gov Sensors', 'Weather API']),
      temerloh: createZone('temerloh', 'Temerloh', 'Pekan Temerloh', 'Pahang', 'East Coast', 3.45, 102.42, 5, 'River Pahang rising. Moderate risk in low-lying areas.', 0.05, ['Gov Sensors']),
      cameron: createZone('cameron', 'Cameron Highlands', 'Tanah Rata', 'Pahang', 'East Coast', 4.46, 101.38, 4, 'Persistent drizzle and mist. Landslide risk on hilly terrain.', 0.04, ['Weather API']),
      kt: createZone('kt', 'Kuala Terengganu', 'Pantai Batu Buruk', 'Terengganu', 'East Coast', 5.33, 103.15, 7, 'Heavy monsoon rain. Coastal areas at risk.', 0.05, ['Weather API', 'CCTV Live']),
      dungun: createZone('dungun', 'Dungun', 'Paka', 'Terengganu', 'East Coast', 4.75, 103.42, 6, 'Coastal flooding risk. Heavy rainfall east of town.', 0.04, ['Weather API']),
      kb: createZone('kb', 'Kota Bharu', 'Pasir Mas', 'Kelantan', 'East Coast', 6.12, 102.23, 9, 'Severe monsoon flooding expected. Red alert issued.', 0.07, ['Gov Sensors', 'CCTV Live', 'User Reports']),
      tanah_merah: createZone('tanah_merah', 'Tanah Merah', 'Pekan Tanah Merah', 'Kelantan', 'East Coast', 5.80, 102.15, 8, 'Critical: River Kelantan at danger level. Evacuations underway.', 0.05, ['Gov Sensors', 'User Reports']),
      gua_musang: createZone('gua_musang', 'Gua Musang', 'Bandar Gua Musang', 'Kelantan', 'East Coast', 4.88, 101.97, 6, 'Upstream water level rising fast. Heavy rain continues.', 0.04, ['Gov Sensors']),
      ipoh: createZone('ipoh', 'Ipoh', 'Taman Canning', 'Perak', 'Northern Region', 4.59, 101.09, 3, 'Cloudy with isolated showers.', 0.04, ['Weather API']),
      taiping: createZone('taiping', 'Taiping', 'Kamunting', 'Perak', 'Northern Region', 4.85, 100.74, 4, 'Persistent rain. Drains at 60% capacity. Stay alert.', 0.04, ['Weather API', 'User Reports']),
      teluk_intan: createZone('teluk_intan', 'Teluk Intan', 'Pekan Teluk Intan', 'Perak', 'Northern Region', 3.97, 101.02, 5, 'Sungai Perak rising. Moderate flood risk in riverside areas.', 0.04, ['Gov Sensors']),
      penang: createZone('penang', 'Penang Island', 'Georgetown', 'Penang', 'Northern Region', 5.35, 100.28, 6, 'Heavy rain warning. Flash floods likely in Georgetown.', 0.04, ['Weather API', 'User Reports']),
      butterworth: createZone('butterworth', 'Butterworth', 'Seberang Perai', 'Penang', 'Northern Region', 5.40, 100.36, 5, 'Continuous rain. Urban flash flood risk in low areas.', 0.04, ['Weather API']),
      alorSetar: createZone('alorSetar', 'Alor Setar', 'Anak Bukit', 'Kedah', 'Northern Region', 6.12, 100.36, 2, 'Sunny weather. Safe conditions.', 0.05, ['Weather API']),
      sungai_petani: createZone('sungai_petani', 'Sungai Petani', 'Bandar Puteri Jaya', 'Kedah', 'Northern Region', 5.65, 100.49, 4, 'Moderate rain. Flash flood prone areas under watch.', 0.04, ['Weather API']),
      perlis: createZone('perlis', 'Kangar', 'Pekan Kangar', 'Perlis', 'Northern Region', 6.44, 100.20, 3, 'Cloudy. Occasional showers. Low flood risk.', 0.04, ['Weather API']),
      putrajaya: createZone('putrajaya', 'Putrajaya', 'Presint 1', 'Putrajaya', 'Federal Territory', 2.92, 101.69, 2, 'Normal conditions. Drainage infrastructure stable.', 0.03, ['Gov Sensors']),
      labuan: createZone('labuan', 'Labuan', 'Bandar Labuan', 'Labuan', 'Federal Territory', 5.28, 115.24, 3, 'Brief showers. Coastal monitoring active.', 0.04, ['Weather API']),
      kuching: createZone('kuching', 'Kuching', 'Batu Kawa', 'Sarawak', 'East Malaysia', 1.55, 110.35, 3, 'Scattered thunderstorms. Low risk.', 0.06, ['Weather API']),
      sibu: createZone('sibu', 'Sibu', 'Jalan Lanang', 'Sarawak', 'East Malaysia', 2.30, 111.82, 5, 'River water level rising slowly. Monitor updates.', 0.05, ['Gov Sensors']),
      bintulu: createZone('bintulu', 'Bintulu', 'Kidurong', 'Sarawak', 'East Malaysia', 3.17, 113.04, 4, 'Moderate rain. Low-lying areas under watch.', 0.04, ['Weather API']),
      miri: createZone('miri', 'Miri', 'Lutong', 'Sarawak', 'East Malaysia', 4.41, 114.01, 2, 'Clear conditions.', 0.05, ['Weather API']),
      sri_aman: createZone('sri_aman', 'Sri Aman', 'Pekan Sri Aman', 'Sarawak', 'East Malaysia', 1.24, 111.46, 6, 'River Batang Lupar rising. Moderate flood threat.', 0.05, ['Gov Sensors']),
      kk: createZone('kk', 'Kota Kinabalu', 'Likas', 'Sabah', 'East Malaysia', 5.98, 116.07, 3, 'Brief showers expected. Safe.', 0.05, ['Weather API']),
      sandakan: createZone('sandakan', 'Sandakan', 'Batu Sapi', 'Sabah', 'East Malaysia', 5.83, 118.11, 5, 'Moderate rain. Stay alert in coastal areas.', 0.04, ['Weather API', 'User Reports']),
      tawau: createZone('tawau', 'Tawau', 'Bandar Tawau', 'Sabah', 'East Malaysia', 4.25, 117.89, 4, 'Occasional showers. Drainage monitoring active.', 0.04, ['Weather API']),
      keningau: createZone('keningau', 'Keningau', 'Pekan Keningau', 'Sabah', 'East Malaysia', 5.34, 116.16, 3, 'Inland showers. Normal conditions.', 0.04, ['Weather API']),
    };
  }
  return floodZonesCache;
};

export const updateFloodZone = (id: string, updates: Partial<FloodZone>) => {
  if (floodZonesCache && floodZonesCache[id]) {
    floodZonesCache[id] = { ...floodZonesCache[id], ...updates };
    
    // Save to Firebase
    saveFloodZone(floodZonesCache[id]).catch(err => 
      console.error('Error saving zone to Firebase:', err)
    );
  }
};

export const addFloodZone = (zone: FloodZone) => {
  if (floodZonesCache) {
    // Find if a zone with the same name already exists in the same state
    const existingZoneId = Object.keys(floodZonesCache).find(id => {
      const existing = floodZonesCache![id];
      return existing.state === zone.state && 
             (existing.name.toLowerCase() === zone.name.toLowerCase() || 
              existing.specificLocation.toLowerCase() === zone.name.toLowerCase());
    });

    if (existingZoneId) {
      // Merge the new report into the existing zone
      const existing = floodZonesCache[existingZoneId];
      const updatedZone = {
        ...existing,
        severity: Math.max(existing.severity, zone.severity),
        forecast: zone.forecast, // Take the latest forecast
        lastUpdated: new Date().toISOString(),
        drainageBlockage: Math.max(existing.drainageBlockage, zone.drainageBlockage),
        rainfall: Math.max(existing.rainfall, zone.rainfall),
        aiConfidence: Math.max(existing.aiConfidence, zone.aiConfidence),
        aiAnalysisText: zone.aiAnalysisText,
        aiAnalysis: zone.aiAnalysis,
        aiRecommendation: zone.aiRecommendation,
        estimatedStartTime: zone.estimatedStartTime || existing.estimatedStartTime,
        estimatedEndTime: zone.estimatedEndTime || existing.estimatedEndTime,
        eventType: zone.eventType || existing.eventType,
        sources: Array.from(new Set([...existing.sources, ...zone.sources])),
        notifiedDepts: zone.notifiedDepts ? Array.from(new Set([...(existing.notifiedDepts || []), ...zone.notifiedDepts])) : existing.notifiedDepts
      };
      floodZonesCache[existingZoneId] = updatedZone;
      
      // Save to Firebase
      saveFloodZone(updatedZone).catch(err => 
        console.error('Error saving updated zone to Firebase:', err)
      );
      
      window.dispatchEvent(new CustomEvent('floodAlert', { detail: { zoneId: existingZoneId, zone: updatedZone } }));
    } else {
      // Add as a new zone
      floodZonesCache[zone.id] = zone;
      
      // Save to Firebase
      saveFloodZone(zone).catch(err => 
        console.error('Error saving new zone to Firebase:', err)
      );
      
      window.dispatchEvent(new CustomEvent('floodAlert', { detail: { zoneId: zone.id, zone } }));
    }
    // Dispatch a general update event
    window.dispatchEvent(new CustomEvent('floodZonesUpdated'));
  }
};

export const useFloodZones = () => {
  const [zones, setZones] = useState<Record<string, FloodZone>>(getFloodZones());

  useEffect(() => {
    const handleUpdate = () => {
      setZones({ ...getFloodZones() });
    };

    window.addEventListener('floodZonesUpdated', handleUpdate);
    window.addEventListener('floodAlert', handleUpdate);
    
    return () => {
      window.removeEventListener('floodZonesUpdated', handleUpdate);
      window.removeEventListener('floodAlert', handleUpdate);
    };
  }, []);

  return zones;
};
