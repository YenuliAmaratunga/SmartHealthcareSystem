import { jest, describe, it, expect } from '@jest/globals';
import { mockRes } from './testUtils.js';

// mock upstream APIs FIRST
jest.unstable_mockModule('../data/patientsApi.js', () => ({
  getAllPatients: jest.fn().mockResolvedValue([{}, {}, {}]) // 3 patients
}));
jest.unstable_mockModule('../data/doctorsApi.js', () => ({
  getAllDoctors: jest.fn().mockResolvedValue([{_id:'d1'}, {_id:'d2'}]) // 2 doctors
}));
jest.unstable_mockModule('../data/appointmentsApi.js', () => ({
  getAllAppointments: jest.fn().mockResolvedValue([
    { sessionDate: '2025-10-22', totalAmount: 1200 },
    { sessionDate: '2025-10-23', doctorFee: 500, hospitalFee: 1500, onlineBookingFee: 200 }
  ])
}));

// now import SUT
const { getTotals } = await import('../controllers/totalsController.js');

describe('getTotals', () => {
  it('returns computed totals', async () => {
    const req = { query: {} };
    const res = mockRes();

    await getTotals(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const body = res.json.mock.calls[0][0];

    expect(body.totalPatients).toBe(3);
    expect(body.totalPractitioners).toBe(2);
    expect(body.upcomingAppointments).toBeGreaterThanOrEqual(0);
    expect(body.scheduledRevenue).toBe(3400);
  });
});
