import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import doctorImage from "../assets/doctor.png"; // replace with your doctor image

export default function AvailabilityResults() {
const location = useLocation();
const navigate = useNavigate();

const results = location.state?.results || [];
const [otherSessions, setOtherSessions] = useState(location.state?.otherSessions || []);
const message = location.state?.message || "No sessions found.";

const firstSession = results[0] || otherSessions[0]; 
if (!firstSession?.doctorId && otherSessions.length > 0) {
  firstSession.doctorId = otherSessions[0].doctorId;
}



  // Helper: format date cleanly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Fetch other sessions by same doctor + specialization
  useEffect(() => {
    const fetchOtherSessions = async () => {
      try {
        if (!firstSession?.doctorName || !firstSession?.specialization) {
          console.warn("Doctor name or specialization missing");
          return;
        }

        console.log("📡 Fetching other sessions:", {
          doctorName: firstSession.doctorName,
          specialization: firstSession.specialization,
          doctorId : firstSession.doctorId
        });

        const response = await axios.get(
          "http://localhost:8080/api/Sessions/fetchByNameAndSpecialization",
          {
            params: {
              doctorName: firstSession.doctorName,
              specialization: firstSession.specialization,
            },
          }
        );

        console.log("✅ Backend responded:", response.data);
       

        // Handle both array and {results: [...]}
        const dataArray = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];

        // ✅ Avoid filtering out all sessions — only remove identical date+day
        const remaining = dataArray.filter(
          (s) =>
            !results.some(
              (r) =>
                r.date === s.date &&
                r.day === s.day &&
                r.doctorName === s.doctorName
            )
        );

        console.log("🟩 Remaining other sessions:", remaining);
        setOtherSessions(remaining);
      } catch (error) {
        console.error("❌ Error fetching other sessions:", error);
      }
    };

    fetchOtherSessions();
  }, [firstSession]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Doctor Header */}
        {firstSession && (
          <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-200 p-6">
            <img
              src={doctorImage}
              alt="Doctor"
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-red-600">
                {firstSession.doctorName}
              </h2>
              <p className="text-gray-700 text-sm mt-1">
                {firstSession.specialization}
              </p>
              <p className="text-gray-500 text-sm">Special Notes: — </p>
            </div>
          </div>
        )}

        {/* Matching Sessions Table */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-red-600 mr-2"></span> Your Matching Sessions
          </h3>

          {results.length === 0 ? (
            <p className="text-center text-gray-600 font-medium mb-6">
              {message}
            </p>
          ) : (
            <div className="overflow-x-auto mb-10">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="p-3">Date</th>
                    <th className="p-3">Day / Time</th>
                    <th className="p-3">Active Appointments</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((session, index) => {
                    const isFull = session.availableSlots <= 0;
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-200 text-sm bg-yellow-50"
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {formatDate(session.date)}
                        </td>
                        <td className="p-3 text-gray-700">
                          {session.day} ({session.startTime} -{" "}
                          {session.endTime})
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            isFull ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {isFull
                            ? "Fully Booked"
                            : `${session.availableSlots || 0} Active`}
                        </td>
                        <td className="p-3 text-center">
                          {isFull ? (
                            <button
                              disabled
                              className="px-4 py-2 text-sm font-semibold rounded bg-gray-300 text-gray-600 cursor-not-allowed"
                            >
                              Contact Hospital
                            </button>
                          ) : (
                            <button 
                            onClick={() =>
                                navigate("/book-appointment", {
                                  state: { session },
                                })
                              }
                            
                            className="px-4 py-2 text-sm font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition">
                              Book Appointment
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Other Sessions Table */}
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span className="text-red-600 mr-2"></span> Other Sessions by {" "}
            {firstSession?.doctorName}
          </h3>

          {otherSessions.length === 0 ? (
            <p className="text-center text-gray-500 mb-6">
              No other sessions found for this doctor.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-sm text-gray-700">
                    <th className="p-3">Date</th>
                    <th className="p-3">Day / Time</th>
                    <th className="p-3">Active Appointments</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {otherSessions.map((session, index) => {
                    const isFull = session.availableSlots <= 0;
                    return (
                      <tr
                        key={`${session.date}-${index}`}
                        className="border-b border-gray-200 text-sm hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium text-gray-800">
                          {formatDate(session.date)}
                        </td>
                        <td className="p-3 text-gray-700">
                          {session.day} ({session.startTime} -{" "}
                          {session.endTime})
                        </td>
                        <td
                          className={`p-3 font-semibold ${
                            isFull ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {isFull
                            ? "Fully Booked"
                            : `${session.availableSlots || 0} Active`}
                        </td>
                        <td className="p-3 text-center">
                          {isFull ? (
                            <button
                              disabled
                              className="px-4 py-2 text-sm font-semibold rounded bg-gray-300 text-gray-600 cursor-not-allowed"
                            >
                              Contact Hospital
                            </button>
                          ) : (
                            <button
                            onClick={() =>
             navigate("/book-appointment", {
            state: { session },
            })
  }
                            
                            className="px-4 py-2 text-sm font-semibold rounded bg-red-600 text-white hover:bg-red-700 transition">
                              Book Appointment
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="p-6 border-t border-gray-200 text-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            ← Back to Search
          </button>
        </div>
      </div>
    </div>
  );
}