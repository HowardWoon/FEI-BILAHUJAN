import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb } from '../firebase';
import { UserReport, getRecentReports } from './dataCollection';

/**
 * React Hook to monitor live reports from Firebase
 * Usage:
 * const liveReports = useLiveReports();
 */
export const useLiveReports = () => {
  const [reports, setReports] = useState<Record<string, any>>({});

  useEffect(() => {
    const reportsRef = ref(rtdb, 'liveReports');
    const unsubscribe = onValue(reportsRef, (snapshot) => {
      if (snapshot.exists()) {
        setReports(snapshot.val());
      } else {
        setReports({});
      }
    });

    return () => unsubscribe();
  }, []);

  return reports;
};

/**
 * React Hook to monitor system heartbeat
 * Usage:
 * const heartbeat = useSystemHeartbeat();
 */
export const useSystemHeartbeat = () => {
  const [heartbeat, setHeartbeat] = useState<{
    lastUpdate: string;
    status: string;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const heartbeatRef = ref(rtdb, 'systemHeartbeat/status');
    const unsubscribe = onValue(heartbeatRef, (snapshot) => {
      if (snapshot.exists()) {
        setHeartbeat(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, []);

  return heartbeat;
};

/**
 * React Hook to monitor live sensor data
 * Usage:
 * const sensors = useLiveSensors();
 */
export const useLiveSensors = () => {
  const [sensors, setSensors] = useState<Record<string, any>>({});

  useEffect(() => {
    const sensorsRef = ref(rtdb, 'liveSensors');
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      if (snapshot.exists()) {
        setSensors(snapshot.val());
      } else {
        setSensors({});
      }
    });

    return () => unsubscribe();
  }, []);

  return sensors;
};

/**
 * React Hook to get recent reports from Firestore
 * Usage:
 * const [reports, loading, error] = useRecentReports(10);
 */
export const useRecentReports = (limitCount: number = 10) => {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getRecentReports(limitCount);
        setReports(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [limitCount]);

  return [reports, loading, error] as const;
};

/**
 * React Hook to monitor all system logs
 * Usage:
 * const logs = useSystemLogs(20);
 */
export const useSystemLogs = (limitCount: number = 20) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const logsRef = collection(db, 'systemLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLogs(logsData);
    });

    return () => unsubscribe();
  }, [limitCount]);

  return logs;
};

/**
 * React Hook to monitor live flood zones
 * Usage:
 * const liveZones = useLiveZones();
 */
export const useLiveZones = () => {
  const [zones, setZones] = useState<Record<string, any>>({});

  useEffect(() => {
    const zonesRef = ref(rtdb, 'liveZones');
    const unsubscribe = onValue(zonesRef, (snapshot) => {
      if (snapshot.exists()) {
        setZones(snapshot.val());
      } else {
        setZones({});
      }
    });

    return () => unsubscribe();
  }, []);

  return zones;
};

/**
 * Component to display system status
 * Add this to your admin dashboard
 */
export const SystemStatusMonitor = () => {
  const heartbeat = useSystemHeartbeat();
  const liveReports = useLiveReports();
  const sensors = useLiveSensors();
  const logs = useSystemLogs(5);

  const isSystemActive = heartbeat && 
    heartbeat.status === 'active' && 
    (Date.now() - heartbeat.timestamp) < 120000; // Active within last 2 minutes

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">System Status Monitor</h2>
      
      {/* System Health */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isSystemActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-semibold">
            {isSystemActive ? 'System Active' : 'System Inactive'}
          </span>
        </div>
        {heartbeat && (
          <p className="text-sm text-gray-600 mt-1">
            Last update: {new Date(heartbeat.lastUpdate).toLocaleString()}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-2xl font-bold text-blue-600">
            {Object.keys(liveReports).length}
          </div>
          <div className="text-sm text-gray-600">Live Reports</div>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <div className="text-2xl font-bold text-green-600">
            {Object.keys(sensors).length}
          </div>
          <div className="text-sm text-gray-600">Active Sensors</div>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <div className="text-2xl font-bold text-purple-600">
            {logs.length}
          </div>
          <div className="text-sm text-gray-600">Recent Logs</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-semibold mb-2">Recent Activity</h3>
        <div className="space-y-2">
          {logs.slice(0, 5).map((log, index) => (
            <div key={index} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
              <div className="font-medium">{log.activityType}</div>
              <div className="text-gray-500 text-xs">
                {log.date ? new Date(log.date).toLocaleString() : 'Unknown time'}
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-gray-500 text-sm">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Example: Add to your admin screen to monitor data collection
 */
export const DataCollectionDashboard = () => {
  const [reports, loading, error] = useRecentReports(10);
  const liveZones = useLiveZones();
  const sensors = useLiveSensors();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Data Collection Dashboard</h1>

      <SystemStatusMonitor />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Reports</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">Error: {error.message}</p>}
          {!loading && !error && reports.length === 0 && (
            <p className="text-gray-500">No reports yet</p>
          )}
          {!loading && !error && reports.length > 0 && (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="border-b pb-3">
                  <div className="font-medium">{report.location.address}</div>
                  <div className="text-sm text-gray-600">{report.details}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Status: {report.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Zones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Live Flood Zones</h2>
          <div className="space-y-2">
            {Object.entries(liveZones).map(([id, zone]: [string, any]) => (
              <div key={id} className="border-l-4 border-red-500 pl-3 py-2">
                <div className="font-medium">{zone.name}</div>
                <div className="text-sm text-gray-600">
                  Severity: {zone.severity}/10
                </div>
              </div>
            ))}
            {Object.keys(liveZones).length === 0 && (
              <p className="text-gray-500">No active zones</p>
            )}
          </div>
        </div>
      </div>

      {/* Sensor Data */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-bold mb-4">Live Sensor Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(sensors).map(([zoneId, zoneSensors]: [string, any]) => (
            <div key={zoneId} className="border rounded p-4">
              <h3 className="font-semibold mb-2">{zoneId}</h3>
              {zoneSensors.water_level && (
                <div className="text-sm">
                  Water Level: {zoneSensors.water_level.value} {zoneSensors.water_level.unit}
                </div>
              )}
              {zoneSensors.rainfall && (
                <div className="text-sm">
                  Rainfall: {zoneSensors.rainfall.value} {zoneSensors.rainfall.unit}
                </div>
              )}
              {zoneSensors.flow_rate && (
                <div className="text-sm">
                  Flow Rate: {zoneSensors.flow_rate.value} {zoneSensors.flow_rate.unit}
                </div>
              )}
            </div>
          ))}
          {Object.keys(sensors).length === 0 && (
            <p className="text-gray-500 col-span-3">No sensor data available</p>
          )}
        </div>
      </div>
    </div>
  );
};
