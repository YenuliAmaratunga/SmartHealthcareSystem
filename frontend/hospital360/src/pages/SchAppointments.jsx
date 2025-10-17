import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaStethoscope, FaSearch } from "react-icons/fa";
import AppLayout from "../components/GenericComponents/AppLayout";

export default function SchAppointments() {
  const [doctorName, setDoctorName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch doctor suggestions dynamically
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (doctorName.trim().length > 1) {
        try {
          const res = await axios.get(
            `http://localhost:8081/api/Doctors/getDoctorByName/${doctorName}`
          );
          setSuggestions(res.data || []);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [doctorName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/Sessions/filterSession", {
        params: { name: doctorName, specialization, date },
      });

      // Navigate with results, even if empty
      navigate("/availability", {
        state: {
          results: res.data.results,
          otherSessions: res.data.otherSessions,
          message: res.data.message,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching sessions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-800 py-10 px-6 ">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200 transition transform hover:-translate-y-1"
        >
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2 flex items-center justify-center gap-2">
            <FaStethoscope className="text-indigo-600" /> Schedule an Appointment
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Search for available sessions by doctor, specialization, or date
          </p>

          {/* Doctor Name Input */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaUserMd className="text-indigo-500" /> Doctor Name
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              placeholder="Type to search doctor name..."
              className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
            {/* Animated Suggestions */}
            {suggestions.length > 0 && (
              <ul className="absolute bg-white border w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20 animate-fade-in">
                {suggestions.map((doc) => (
                  <li
                    key={doc._id}
                    onClick={() => {
                      setDoctorName(doc.doctorName);
                      setSpecialization(doc.specialization);
                      setSuggestions([]);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-indigo-100 transition"
                  >
                    <span className="font-medium text-gray-800">{doc.doctorName}</span>{" "}
                    <span className="text-gray-500 text-sm">({doc.specialization})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Specialization */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaStethoscope className="text-indigo-500" /> Specialization
            </label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">Select specialization</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            <FaSearch />
            {loading ? "Searching..." : "Search Availability"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
}
