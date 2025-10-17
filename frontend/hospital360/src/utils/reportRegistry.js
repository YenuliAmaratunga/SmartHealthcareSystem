const KEY = "analytics_reports_v1";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function write(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export function saveReport({ title, filters, sections, dataUrl }) {
  const list = read();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  list.unshift({ id, title, filters, sections, dataUrl, createdAt: new Date().toISOString() });
  write(list);
  return id;
}

export function listReports() {
  return read();
}

export function deleteReport(id) {
  write(read().filter(r => r.id !== id));
}
