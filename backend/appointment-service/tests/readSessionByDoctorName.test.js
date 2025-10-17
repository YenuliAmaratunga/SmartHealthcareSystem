const { readSessionByDoctorName } = require("../controllers/appointmentController");
const Doctor = require("../models/Doctor");
const DocorMeetups = require("../models/DocorMeetups");

jest.mock("../models/Doctor");
jest.mock("../models/DocorMeetups");


describe("readSessionByDoctorName controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { doctorName: "John" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("✅ should return 201 with sessions if doctor and sessions exist", async () => {
    const mockDoctor = { _id: "12345" };
    const mockSessions = [{ sessionDate: "2025-10-17", doctorId: "12345" }];

    Doctor.findOne.mockResolvedValue(mockDoctor);
    DocorMeetups.find.mockResolvedValue(mockSessions);

    await readSessionByDoctorName(req, res);

    expect(Doctor.findOne).toHaveBeenCalledWith({ doctorName: { $regex: "John", $options: "i" } });
    expect(DocorMeetups.find).toHaveBeenCalledWith({ doctorId: "12345" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSessions);
  });

  test("❌ should return 404 if doctor not found", async () => {
    Doctor.findOne.mockResolvedValue(null);

    await readSessionByDoctorName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No any doctors found under the name John" });
  });

  test("❌ should return 404 if doctor found but no sessions", async () => {
    const mockDoctor = { _id: "12345" };
    Doctor.findOne.mockResolvedValue(mockDoctor);
    DocorMeetups.find.mockResolvedValue([]);

    await readSessionByDoctorName(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No sessions found under John" });
  });

  test("🚨 should return 500 if error occurs", async () => {
    Doctor.findOne.mockRejectedValue(new Error("DB error"));

    await readSessionByDoctorName(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "DB error" }));
  });
});
