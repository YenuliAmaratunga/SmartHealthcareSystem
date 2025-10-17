// Import dependencies
import {fetchAppointments } from "../controllers/appointmentController.js";
import BookDoctor from "../models/BookDoctor.js";

// Mock the Mongoose model
jest.mock("../models/BookDoctor.js");

describe("fetchAppointments controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { patientId: "12345" } };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("✅ should return 200 and appointments when found", async () => {
    const mockAppointments = [
      {
        _id: "1",
        doctor: { doctorName: "Dr. John", specialization: "Cardiologist" },
        sessionDate: "2025-10-17",
      },
    ];

    // Mock the query chain
    BookDoctor.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue(mockAppointments),
    });

    await fetchAppointments(req, res);

    expect(BookDoctor.find).toHaveBeenCalledWith({ patient: "12345" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockAppointments);
  });

  test("❌ should return 404 if no appointments found", async () => {
    BookDoctor.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    });

    await fetchAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No appointments found" });
  });

  test("🚨 should return 500 on error", async () => {
    BookDoctor.find.mockImplementation(() => {
      throw new Error("Database error");
    });

    await fetchAppointments(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
  });
});
