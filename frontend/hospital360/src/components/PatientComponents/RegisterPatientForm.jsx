import { useState } from "react";
import { registerPatient } from "../../api/patientapi";
import { useNavigate } from "react-router-dom";

export default function RegisterPatientForm() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    address: "",
    bloodGroup: "",
    allergies: "",
    medications: "",
    insuranceProvider: "",
    medicalHistoryCondition: "",
    medicalHistoryNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ✅ Convert list-type fields (comma-separated strings) into arrays
    const payload = {
      ...formData,
      allergies: formData.allergies
        ? formData.allergies.split(",").map((a) => a.trim())
        : [],
      medications: formData.medications
        ? formData.medications.split(",").map((m) => m.trim())
        : [],
      medicalHistory: formData.medicalHistoryCondition
        ? [
            {
              condition: formData.medicalHistoryCondition,
              notes: formData.medicalHistoryNotes,
              lastUpdated: new Date(),
            },
          ]
        : [],
      address: formData.address || "", // ensure defined
      bloodGroup: formData.bloodGroup || "", // ensure defined
    };

    try {
      const res = await registerPatient(payload);

      // ✅ Reset form
      setFormData({
        name: "",
        dob: "",
        gender: "",
        contact: "",
        address: "",
        bloodGroup: "",
        allergies: "",
        medications: "",
        insuranceProvider: "",
        medicalHistoryCondition: "",
        medicalHistoryNotes: "",
      });

      navigate(`/patients/${res.data.patientId}`, {
        state: { patient: res.data },
      });
    } catch (err) {
      console.error("Error registering patient:", err);
      alert("Error registering patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg p-8 rounded-2xl max-w-2xl mx-auto space-y-6 border border-gray-200"
    >
      <h2 className="text-2xl font-semibold text-center text-blue-700">
        🏥 Register New Patient
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Blood Group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

        <input
          name="insuranceProvider"
          placeholder="Insurance Provider"
          value={formData.insuranceProvider}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="allergies"
          placeholder="Allergies (comma separated)"
          value={formData.allergies}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
        />

        <input
          name="medications"
          placeholder="Medications (comma separated)"
          value={formData.medications}
          onChange={handleChange}
          className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-full"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          🩺 Medical History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="medicalHistoryCondition"
            placeholder="Condition (e.g., Diabetes)"
            value={formData.medicalHistoryCondition}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="medicalHistoryNotes"
            placeholder="Notes"
            value={formData.medicalHistoryNotes}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none md:col-span-2"
            rows="3"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-3 rounded-xl w-full font-medium hover:bg-blue-700 transition-colors duration-200"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register Patient"}
      </button>
    </form>
  );
}
