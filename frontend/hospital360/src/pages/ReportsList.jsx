import React, { useEffect, useState } from "react";
import AppLayout from "../components/GenericComponents/AppLayout";
import { listReports, deleteReport } from "../utils/reportRegistry";

export default function ReportsList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(listReports());
  }, []);

  function handleDelete(id) {
    deleteReport(id);
    setItems(listReports());
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Reports</h1>

        <div className="bg-white rounded-lg shadow divide-y">
          {items.length === 0 && (
            <div className="p-4 text-sm text-gray-600">No reports yet. Generate one first.</div>
          )}
          {items.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{r.title}</div>
                <div className="text-xs text-gray-500">
                  From: {r.filters?.from || "-"} &nbsp; To: {r.filters?.to || "-"} &nbsp; • &nbsp;
                  {new Date(r.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="space-x-3">
                <a
                  className="px-3 py-1.5 rounded bg-[#0f4c81] text-white text-sm hover:bg-[#0e3f6b]"
                  href={r.dataUrl}
                  download={`${r.title.replace(/\s+/g, "_")}_${r.id}.pdf`}
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1.5 rounded bg-gray-100 text-sm hover:bg-gray-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
