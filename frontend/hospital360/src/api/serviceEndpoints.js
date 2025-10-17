const PORTS = {
  ANALYTICS:   5000,
  PATIENTS:    5001,
  APPOINTMENTS:8081,
  DOCTORS:     8081,
};

const host = (p) => `http://localhost:${p}`;

export const ANALYTICS_API_BASE = `${host(PORTS.ANALYTICS)}/api/analytics`;
export const PATIENT_API_BASE   = `${host(PORTS.PATIENTS)}/api/patient`;
export const APPT_API_BASE      = `${host(PORTS.APPOINTMENTS)}/api`;
export const DOCTOR_API_BASE    = `${host(PORTS.DOCTORS)}/api`;