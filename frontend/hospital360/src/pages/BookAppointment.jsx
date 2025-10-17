import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // ✅ Hardcoded patient ID (replace later)
  const patientId = "68efcec358b7cc455827075d";

  // 🧮 Calculate appointment time and number
  const getAppointmentDetails = () => {
    const max = session.maxPatients || 10;
    const remaining = session.availableSlots ?? 0;
    const appointmentNumber = max - remaining + 1; // next in queue
    const slotMinutes = 15;

    const [timePart, modifier] = session.startTime.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const totalMins = hours * 60 + minutes + (appointmentNumber - 1) * slotMinutes;
    const slotH = Math.floor(totalMins / 60) % 24;
    const slotM = totalMins % 60;
    const slotTime = `${((slotH + 11) % 12) + 1}:${slotM.toString().padStart(2, "0")} ${
      slotH >= 12 ? "PM" : "AM"
    }`;

    return { appointmentNumber, slotTime };
  };

  const { appointmentNumber, slotTime } = getAppointmentDetails();

  // ✅ Handle booking (simulated payment success)
  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        doctorId: session.doctorId,
        date: session.date,
        time: slotTime,
        patient: patientId,
        paymentStatus : "success"
        
      };
      console.log(payload);

      await axios.put("http://localhost:8081/api/Sessions/reserveSlot", payload);

      setStatus(`✅ Appointment confirmed! 
        \nAppointment No: #${appointmentNumber} 
        \nTime: ${slotTime}`);

     setTimeout(() => navigate("/appointments"), 3000); // go home after success
    } catch (err) {
      console.error("❌ Booking error:", err);
      setStatus(err.response?.data?.message || "Failed to confirm booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!session)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <p>No session details provided.</p>
      </div>
    );

  // Helper for date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-4">
          Confirm Your Appointment
        </h1>

        <div className="space-y-4 mb-8 text-gray-700 text-sm sm:text-base">
          <div className="bg-indigo-50 rounded-lg p-4">
            <p className="font-semibold text-indigo-800">Dr. {session.doctorName}</p>
            <p className="text-gray-600">{session.specialization}</p>
          </div>

          <p>
            <strong>Date:</strong> {formatDate(session.date)}
          </p>
          <p>
            <strong>Session Time:</strong> {session.startTime} – {session.endTime}
          </p>
          <p>
            <strong>Your Appointment No:</strong>{" "}
            <span className="text-indigo-700 font-semibold">#{appointmentNumber}</span>
          </p>
          <p>
            <strong>Expected Time Slot:</strong>{" "}
            <span className="text-green-700 font-semibold">{slotTime}</span>
          </p>
        </div>

        {status ? (
          <div className="text-center mb-6">
            <p className="text-green-600 font-semibold whitespace-pre-line animate-pulse">
              {status}
            </p>
          </div>
        ) : (
          <>
            <button
              onClick={handleConfirmBooking}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading ? "Processing Payment..." : "Pay & Confirm Appointment"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full mt-3 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}