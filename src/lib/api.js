import { getAuthToken } from './auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5215';

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  const text = await response.text();
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const validationErrors = payload?.errors
      ? Object.values(payload.errors).flat().join(' ')
      : '';
    const message =
      payload?.detail ||
      payload?.message ||
      payload?.title ||
      validationErrors ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export const api = {
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request('/api/auth/me'),

  getStaff: () => request('/api/admin/staff'),
  getStaffById: (id) => request(`/api/admin/staff/${id}`),
  createStaff: (payload) => request('/api/admin/staff', { method: 'POST', body: payload }),
  updateStaff: (id, payload) => request(`/api/admin/staff/${id}`, { method: 'PUT', body: payload }),

  getVendors: () => request('/api/admin/vendors'),
  createVendor: (payload) => request('/api/admin/vendors', { method: 'POST', body: payload }),
  updateVendor: (id, payload) => request(`/api/admin/vendors/${id}`, { method: 'PUT', body: payload }),
  deleteVendor: (id) => request(`/api/admin/vendors/${id}`, { method: 'DELETE' }),

  getParts: () => request('/api/admin/parts'),
  createPart: (payload) => request('/api/admin/parts', { method: 'POST', body: payload }),
  updatePart: (id, payload) => request(`/api/admin/parts/${id}`, { method: 'PUT', body: payload }),
  deletePart: (id) => request(`/api/admin/parts/${id}`, { method: 'DELETE' }),

  getPurchaseInvoices: () => request('/api/admin/purchase-invoices'),
  createPurchaseInvoice: (payload) => request('/api/admin/purchase-invoices', { method: 'POST', body: payload }),

  getDailyReport: (date) => request(`/api/admin/reports/daily?date=${encodeURIComponent(date)}`),
  getMonthlyReport: (year, month) => request(`/api/admin/reports/monthly?year=${year}&month=${month}`),
  getYearlyReport: (year) => request(`/api/admin/reports/yearly?year=${year}`),
  getLowStockReport: () => request('/api/admin/reports/low-stock'),
  getOverdueCreditsReport: () => request('/api/admin/reports/overdue-credits'),

  getAdminNotifications: (take = 100) => request(`/api/admin/notifications?take=${take}`),
  runLowStockNotifications: () => request('/api/admin/notifications/run-low-stock', { method: 'POST' }),
  runOverdueCreditNotifications: () => request('/api/admin/notifications/run-overdue-credits', { method: 'POST' }),
  markAllNotificationsRead: () => request('/api/admin/notifications/mark-all-read', { method: 'POST' }),
};
