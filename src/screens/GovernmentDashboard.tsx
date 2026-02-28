import { useEffect, useState, FC } from 'react';
import { 
  FloodStatistics, 
  LocationAnalytics,
  TimeSeriesData,
  InfrastructureInsights,
  getFloodStatistics,
  getLocationAnalytics,
  getTimeSeriesData,
  getInfrastructureInsights
} from '../services/governmentAnalytics';
import { DataExportPanel } from '../components/DataExportPanel';

/**
 * Government Dashboard
 * Analytics and insights for government agencies (JPS, NADMA, APM)
 */

export const GovernmentDashboard: FC = () => {
  const [statistics, setStatistics] = useState<FloodStatistics | null>(null);
  const [locationAnalytics, setLocationAnalytics] = useState<LocationAnalytics[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [infrastructure, setInfrastructure] = useState<InfrastructureInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const [stats, locations, series, infra] = await Promise.all([
        getFloodStatistics(startDate, endDate),
        getLocationAnalytics(),
        getTimeSeriesData(dateRange),
        getInfrastructureInsights()
      ]);

      setStatistics(stats);
      setLocationAnalytics(locations);
      setTimeSeries(series);
      setInfrastructure(infra);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">BILAHUJAN Government Dashboard</h1>
        <p className="text-blue-100">Real-time Flood Monitoring Analytics for JPS, NADMA & APM</p>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          <label className="font-medium text-gray-700">Time Range:</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
            <option value={365}>Last Year</option>
          </select>
          
          <button
            onClick={loadDashboardData}
            className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="material-icons-round text-sm">refresh</span>
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Incidents</p>
                <p className="text-3xl font-bold text-gray-800">{statistics?.totalIncidents || 0}</p>
              </div>
              <span className="material-icons-round text-5xl text-red-500">warning</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Severity</p>
                <p className="text-3xl font-bold text-gray-800">
                  {statistics?.averageSeverity.toFixed(1) || '0.0'}/10
                </p>
              </div>
              <span className="material-icons-round text-5xl text-orange-500">speed</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Affected Areas</p>
                <p className="text-3xl font-bold text-gray-800">{statistics?.affectedAreas || 0}</p>
              </div>
              <span className="material-icons-round text-5xl text-blue-500">place</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Drainage Efficiency</p>
                <p className="text-3xl font-bold text-gray-800">
                  {infrastructure?.drainageEfficiency || 0}%
                </p>
              </div>
              <span className="material-icons-round text-5xl text-green-500">water_drop</span>
            </div>
          </div>
        </div>

        {/* Most Affected Region */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="material-icons-round text-red-500">location_city</span>
            Most Affected Region
          </h2>
          <p className="text-2xl font-semibold text-gray-700">
            {statistics?.mostAffectedRegion || 'N/A'}
          </p>
        </div>

        {/* Location Analytics Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="material-icons-round text-blue-500">analytics</span>
            Location Analytics
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Incidents</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg Severity</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Water Level</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Drainage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {locationAnalytics.slice(0, 10).map((loc, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800 font-medium">{loc.location}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{loc.state}</td>
                    <td className="px-4 py-3 text-sm text-center">{loc.incidentCount}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className={`font-semibold ${
                        loc.avgSeverity >= 7 ? 'text-red-600' :
                        loc.avgSeverity >= 4 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {loc.avgSeverity.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">{loc.avgWaterLevel.toFixed(0)}cm</td>
                    <td className="px-4 py-3 text-sm text-center">{loc.avgDrainageBlockage.toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Infrastructure Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="material-icons-round text-yellow-500">engineering</span>
            Infrastructure Insights
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Critical Zones</h3>
              {infrastructure?.criticalZones.length ? (
                <ul className="space-y-1">
                  {infrastructure.criticalZones.map((zone, idx) => (
                    <li key={idx} className="text-red-600 flex items-center gap-2">
                      <span className="material-icons-round text-sm">error</span>
                      {zone}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No critical zones</p>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Maintenance Needed</h3>
              {infrastructure?.maintenanceNeeded.length ? (
                <ul className="space-y-1">
                  {infrastructure.maintenanceNeeded.map((zone, idx) => (
                    <li key={idx} className="text-orange-600 flex items-center gap-2">
                      <span className="material-icons-round text-sm">build</span>
                      {zone}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">All systems operational</p>
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Average Response Time:</strong> {infrastructure?.responseTime} minutes
            </p>
          </div>
        </div>

        {/* Data Export Panel */}
        <DataExportPanel />
      </div>
    </div>
  );
};
