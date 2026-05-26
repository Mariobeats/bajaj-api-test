import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTicket,
  deleteTicket,
  fetchStats,
  fetchTickets,
  updateTicket
} from '../services/api.js';

function getApiError(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.';
}

export function useTickets(filters) {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ticketData, statsData] = await Promise.all([fetchTickets(filters), fetchStats()]);
      setTickets(ticketData);
      setStats(statsData);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const groupedTickets = useMemo(() => {
    return tickets.reduce((acc, ticket) => {
      acc[ticket.status] = [...(acc[ticket.status] || []), ticket];
      return acc;
    }, {});
  }, [tickets]);

  async function addTicket(payload) {
    setSaving(true);
    setError('');
    try {
      const ticket = await createTicket(payload);
      setTickets((current) => [ticket, ...current]);
      setStats(await fetchStats());
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getApiError(err), errors: err.response?.data?.errors || {} };
    } finally {
      setSaving(false);
    }
  }

  async function moveTicket(id, status) {
    setError('');
    try {
      const updated = await updateTicket(id, { status });
      setTickets((current) => current.map((ticket) => (ticket._id === id ? updated : ticket)));
      setStats(await fetchStats());
    } catch (err) {
      setError(getApiError(err));
    }
  }

  async function removeTicket(id) {
    setError('');
    try {
      await deleteTicket(id);
      setTickets((current) => current.filter((ticket) => ticket._id !== id));
      setStats(await fetchStats());
    } catch (err) {
      setError(getApiError(err));
    }
  }

  return {
    tickets,
    groupedTickets,
    stats,
    loading,
    saving,
    error,
    addTicket,
    moveTicket,
    removeTicket,
    reload: load
  };
}
