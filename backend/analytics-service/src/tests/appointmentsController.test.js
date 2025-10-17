import { jest, describe, it, expect } from '@jest/globals';
import { mockRes } from './testUtils.js';

// Mocks for multiple controllers
jest.unstable_mockModule('../data/appointmentsApi.js', () => ({
  getAllAppointments: jest.fn().mockResolvedValue([
    // for department counts
    { sessionDate: '2025-10-22', speacialization: 'Dermatologist' },
    { sessionDate: '2025-10-23', speacialization: 'Orthopedic Surgeon' },
    { sessionDate: '2025-10-23', speacialization: 'Orthopedic Surgeon' },

    // for revenue-by-doctor
    { sessionDate: '2025-10-25', doctor: 'D1', totalAmount: 3000 },
    { sessionDate: '2025-10-26', doctor: 'D2', doctorFee: 500, hospitalFee: 1500, onlineBookingFee: 200 }
  ])
}));
jest.unstable_mockModule('../data/doctorsApi.js', () => ({
  getAllDoctors: jest.fn().mockResolvedValue([
    { _id: 'D1', doctorName: 'Dr. Alice' },
    { _id: 'D2', doctorName: 'Dr. Bob' }
  ])
}));

const {
  getAppointmentsByDepartment,
  getRevenueByDoctor
} = await import('../controllers/appointmentsController.js');

describe('appointments analytics', () => {
  it('groups appointments by department', async () => {
    const req = { query: { from: '2025-10-22', to: '2025-10-23' } };
    const res = mockRes();

    await getAppointmentsByDepartment(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const rows = res.json.mock.calls[0][0]; // [{name,count}]
    const derm = rows.find(r => r.name === 'Dermatologist');
    const ortho = rows.find(r => r.name?.includes('Orthopedic'));
    expect(derm?.count).toBe(1);
    expect(ortho?.count).toBe(2);
  });

  it('sums revenue by doctor (uses names map)', async () => {
    const req = { query: { from: '2025-10-25', to: '2025-10-26' } };
    const res = mockRes();

    await getRevenueByDoctor(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    const rows = res.json.mock.calls[0][0]; // [{doctor,amount}]
    const a = rows.find(r => r.doctor === 'Dr. Alice'); // 3000
    const b = rows.find(r => r.doctor === 'Dr. Bob');   // 500+1500+200=2200
    expect(a?.amount).toBe(3000);
    expect(b?.amount).toBe(2200);
  });
});
