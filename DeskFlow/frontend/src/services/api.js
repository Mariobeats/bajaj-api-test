import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchTickets(filters) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.breached) params.breached = 'true';

  const { data } = await api.get('/tickets', { params });
  return data;
}

export async function fetchStats() {
  const { data } = await api.get('/tickets/stats');
  return data;
}

export async function createTicket(payload) {
  const { data } = await api.post('/tickets', payload);
  return data;
}

export async function updateTicket(id, payload) {
  const { data } = await api.patch(`/tickets/${id}`, payload);
  return data;
}

export async function deleteTicket(id) {
  await api.delete(`/tickets/${id}`);
}
