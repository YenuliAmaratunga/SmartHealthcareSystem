import { jest, describe, it, expect } from '@jest/globals';
import { mockRes } from './testUtils.js';

jest.unstable_mockModule('../data/appointmentsApi.js', () => ({
  getAllAppointments: jest.fn().mockResolvedValue([
    { sessionDate: '2025-10-22T10:00:00Z' },
    { sessionDate: '2025-10-22T11:12:00Z' },
    { sessionDate: '2025-10-23T08:00:00Z' }
  ])
}));

const { getVisitsByDay } = await import('../controllers/trendsController.js');

describe('getVisitsByDay', () => {
  it('groups appointments by day in range', async () => {
    const req = { query: { from: '2025-10-22', to: '2025-10-23' } };
    const res = mockRes();

    await getVisitsByDay(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const rows = res.json.mock.calls[0][0];
    // should contain a day with count 2
    const d22 = rows.find(r => r.date === '2025-10-22');
    expect(d22?.count).toBe(2);
    // and a day with count 1
    const d23 = rows.find(r => r.date === '2025-10-23');
    expect(d23?.count).toBe(1);
  });
});
