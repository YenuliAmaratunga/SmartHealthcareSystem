import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  CalendarDays,
  History,
  Edit2,
  Trash2,
  Clock,
  Stethoscope,
  Activity,
  AlertCircle,
  FileText,
  HelpCircle,
  X,
} from "lucide-react";

dayjs.extend(isSameOrAfter);

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const patientId = "68efcec358b7cc455827075d"; // demo ID

  // ✅ Fetch Appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/Appointments/viewAppointments/${patientId}`
        );
        setAppointments(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [patientId]);

  // ✅ Confirm delete modal
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // ✅ Handle Delete
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/Appointments/deleteAppointments/${deleteId}`
      );
      setAppointments((prev) => prev.filter((a) => a._id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete appointment!");
    }
  };

  // ✅ Handle Edit
  const handleEdit = (id) => {
    alert(`Edit form coming soon for appointment ${id}`);
  };

  // ✅ Tab logic
  const today = dayjs().format("YYYY-MM-DD");
  const upcoming = appointments.filter((a) =>
    dayjs(a.sessionDate).isAfter(today, "day")
  );
  const ongoing = appointments.filter((a) =>
    dayjs(a.sessionDate).isSame(today, "day")
  );
  const history = appointments.filter((a) =>
    dayjs(a.sessionDate).isBefore(today, "day")
  );

  // ✅ Status colors
  const getStatusColor = (date) => {
    if (dayjs(date).isSame(today, "day")) return "bg-yellow-100 text-yellow-700";
    if (dayjs(date).isAfter(today, "day")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  // ✅ Loading & Error states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <Activity className="animate-spin mr-2" size={20} />
        Loading appointments...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 gap-2">
        <AlertCircle size={20} />
        {error}
      </div>
    );

  // ✅ Card Design
  const renderCard = (a) => {
    const statusColor = getStatusColor(a.sessionDate);
    const isToday = dayjs(a.sessionDate).isSame(today, "day");

    return (
      <div
        key={a._id}
        className={`rounded-2xl border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-white p-6 ${
          isToday ? "border-blue-500 bg-blue-50/50" : "border-gray-200"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Stethoscope size={22} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 leading-snug">
                {a.doctor?.doctorName || "Dr. Unknown"}
              </h3>
              <p className="text-sm text-gray-500">
                {a.speacialization || a.doctor?.specialization || "General Medicine"}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}
          >
            {isToday ? "Today" : dayjs(a.sessionDate).format("MMM D, YYYY")}
          </span>
        </div>

        {/* Info Section */}
        <div className="space-y-3 text-[15px] text-gray-700">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Appointment No:</span>
            <span className="font-semibold text-gray-800">
              {a.apointmentNumber || "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Session Time:</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <Clock size={15} className="text-gray-400" />
              {a.sessionTime || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Doctor Fee:</span>
            <span className="text-gray-800">Rs. {a.doctorFee}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-600">Hospital Fee:</span>
            <span className="text-gray-800">Rs. {a.hospitalFee}</span>
          </div>

          <div className="flex items-center justify-between border-t pt-2">
            <span className="font-semibold text-gray-800">Total:</span>
            <span className="font-bold text-blue-600">
              Rs.{" "}
              {a.totalAmount ||
                a.doctorFee + a.hospitalFee + (a.onlineBookingFee || 0)}
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-3">
          
          <button
            onClick={() => confirmDelete(a._id)}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow-sm transition"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>
    );
  };

  // ✅ Tab Content
  const renderTabContent = () => {
    const list =
      activeTab === "upcoming"
        ? upcoming
        : activeTab === "ongoing"
        ? ongoing
        : history;

    if (list.length === 0)
      return (
        <p className="text-center text-gray-500 py-10">
          No appointments found.
        </p>
      );

    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {list.map(renderCard)}
      </div>
    );
  };

  // ✅ Main Render
  return (
    <div className="min-h-screen bg-gray-50 relative">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Appointment Management
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            View, update, or manage your hospital appointments
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center gap-4 border-b border-gray-200 pb-2">
          {["upcoming", "ongoing", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-t-lg font-medium transition-all ${
                activeTab === tab
                  ? tab === "upcoming"
                    ? "border-b-4 border-blue-500 text-blue-600"
                    : tab === "ongoing"
                    ? "border-b-4 border-yellow-500 text-yellow-600"
                    : "border-b-4 border-gray-600 text-gray-700"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              {tab === "upcoming" && <CalendarDays size={18} />}
              {tab === "ongoing" && <Activity size={18} />}
              {tab === "history" && <History size={18} />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderTabContent()}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center relative animate-fadeIn">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <HelpCircle
                  size={64}
                  className="text-blue-500 animate-pulse drop-shadow-lg"
                />
                <div className="absolute inset-0 rounded-full blur-lg bg-blue-400 opacity-30 animate-ping"></div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Delete Appointment?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to remove this appointment? This action
              cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition"
              >
                Yes, Delete
              </button>
            </div>

            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
