import { jest, describe, it, expect } from '@jest/globals';
import { mockRes } from './testUtils.js';

// Make ages land in predictable buckets for current year (~2025)
jest.unstable_mockModule('../data/patientsApi.js', () => ({
  getAllPatients: jest.fn().mockResolvedValue([
    { dob: '2012-01-01', gender: 'Male',   bloodGroup: 'A+', type: 'REGULAR' },   // ~13y -> <18
    { dob: '1998-06-15', gender: 'Female', bloodGroup: 'B-', type: 'TEMPORARY' }, // ~27y -> 18-29
    { dob: '1986-03-10', gender: 'Other',  bloodGroup: 'O+', type: 'REGULAR' },   // ~39y -> 30-44
    { dob: '1971-11-20', gender: 'Male',   bloodGroup: 'AB+', type: 'REGULAR' },  // ~53y -> 45-59
    { dob: '1940-05-05', gender: 'Female', bloodGroup: 'A-', type: 'REGULAR' },   // ~85y -> 60+
    { dob: null,         gender: null,     bloodGroup: 'ZZ', type: null }         // unknowns
  ])
}));

const {
  getAgeBuckets,
  getGenderDistribution,
  getBloodGroupDistribution,
  getPatientTypeDistribution
} = await import('../controllers/distributionsController.js');

function firstBody(res){ return res.json.mock.calls[0][0]; }

describe('distributions', () => {
  it('age buckets sum to total', async () => {
    const res = mockRes();
    await getAgeBuckets({ query: {} }, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const m = firstBody(res);
    const total = Object.values(m).reduce((s,n)=>s+n,0);
    expect(total).toBe(6);
  });

  it('gender distribution includes UNKNOWN', async () => {
    const res = mockRes();
    await getGenderDistribution({ query: {} }, res);
    const m = firstBody(res);
    expect(m.Male + m.Female + m.Other + m.UNKNOWN).toBe(6);
    expect(m.UNKNOWN).toBeGreaterThanOrEqual(1);
  });

  it('blood group distribution includes UNKNOWN', async () => {
    const res = mockRes();
    await getBloodGroupDistribution({ query: {} }, res);
    const m = firstBody(res);
    const sum = Object.values(m).reduce((s,n)=>s+n,0);
    expect(sum).toBe(6);
    expect(m.UNKNOWN).toBeGreaterThanOrEqual(1);
  });

  it('patient type distribution includes UNKNOWN', async () => {
    const res = mockRes();
    await getPatientTypeDistribution({ query: {} }, res);
    const m = firstBody(res);
    expect(m.REGULAR + m.TEMPORARY + m.UNKNOWN).toBe(6);
    expect(m.UNKNOWN).toBeGreaterThanOrEqual(1);
  });
});
