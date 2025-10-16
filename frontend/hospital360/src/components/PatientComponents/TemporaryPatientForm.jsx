import { useState } from "react";
import { registerTempPatient } from "../../api/patientapi";
import { useNavigate } from "react-router-dom";
import { FaUserClock } from "react-icons/fa"; // temporary patient icon

export default function TemporaryPatientForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    reasonForVisit: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerTempPatient(formData);

      // Reset form
      setFormData({
        name: "",
        dob: "",
        gender: "",
        contact: "",
        reasonForVisit: "",
      });

      navigate(`/patients/${res.data.patientId}`, {
        state: { patient: res.data },
      });
    } catch (err) {
      console.error("Error registering temporary patient:", err);
      alert("⚠️ Failed to register temporary patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl p-8 rounded-2xl max-w-md mx-auto space-y-6 border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-center space-x-2">
        <FaUserClock className="text-orange-500 text-2xl" />
        <h2 className="text-2xl font-semibold text-orange-600">
          Temporary Patient Registration
        </h2>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            name="name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
          <input
            name="contact"
            placeholder="Enter contact number"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Reason for Visit</label>
          <select
            name="reasonForVisit"
            value={formData.reasonForVisit}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="">Select Reason</option>
            <option>Checkup</option>
            <option>Emergency</option>
            <option>Consultation</option>
            <option>Follow-up</option>
          </select>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 text-white font-medium px-4 py-3 rounded-lg w-full hover:bg-orange-600 focus:ring-2 focus:ring-orange-300 transition-all duration-200"
      >
        {loading ? "Registering Temporary Patient..." : "Register Temporary Patient"}
      </button>
    </form>
  );
}
