import React from "react";

export default function ActivityList({ days }) {
  if (!Array.isArray(days) || !days.length) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Recent System Activity</h3>
        <div className="text-sm text-gray-500">No data in range.</div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2">Recent System Activity</h3>
      <ul className="divide-y">
        {days.slice(-7).map((d) => (
          <li key={d.date} className="py-2 flex justify-between">
            <span className="text-gray-700">{d.date}</span>
            <span className="text-gray-900 font-medium">{d.count} check-ins</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
