import { useEffect, useState } from "react";
import { getAccessLogs } from "../../api/patientapi";

export default function RecentAccessLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchLogs = async () => {
    try {
      const res = await getAccessLogs();
      setLogs(res.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchType = filterType === "ALL" || log.accessType === filterType;
    const matchStatus = filterStatus === "ALL" || log.status === filterStatus;
    return matchType && matchStatus;
  });

  if (loading)
    return <p className="text-center text-gray-500">Loading logs...</p>;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 max-w-5xl mx-auto mt-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
        <h2 className="text-xl font-semibold text-center sm:text-left">
          🕒 Recent Access Logs
        </h2>

        {/* Filters */}
        <div className="flex gap-2 justify-center sm:justify-end">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="ALL">All Types</option>
            <option value="CREATE">CREATE</option>
            <option value="SCAN">SCAN</option>
            <option value="TEMP_CREATE">TEMP_CREATE</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Patient ID</th>
              <th className="p-2 border">Staff ID</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-2 border">{log.patientId}</td>
                  <td className="p-2 border">{log.staffId}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        log.accessType === "CREATE"
                          ? "bg-blue-100 text-blue-600"
                          : log.accessType === "SCAN"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {log.accessType}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        log.status === "SUCCESS"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2 border">{log.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 p-3">
                  No logs match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
