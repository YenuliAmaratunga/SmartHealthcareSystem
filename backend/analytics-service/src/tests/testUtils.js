import { jest } from "@jest/globals";

export function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
}

export function mockReq(queryOrBody = {}) {
  return { query: queryOrBody, body: queryOrBody, params: queryOrBody };
}
