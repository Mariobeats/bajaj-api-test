import { useMemo, useState } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import StatsStrip from '../components/StatsStrip.jsx';
import TicketCard from '../components/TicketCard.jsx';
import TicketForm from '../components/TicketForm.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { statuses, statusLabels } from '../utils/tickets.js';

export default function TicketBoard() {
  const [filters, setFilters] = useState({ status: '', priority: '', breached: false });
  const stableFilters = useMemo(() => filters, [filters]);
  const {
    groupedTickets,
    stats,
    loading,
    saving,
    error,
    addTicket,
    moveTicket,
    removeTicket,
    reload
  } = useTickets(stableFilters);

  return (
    <main className="min-h-screen bg-panel">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-normal">DeskFlow</h1>
            <p className="mt-1 text-sm text-muted">Ticket operations board</p>
          </div>
          <button
            type="button"
            onClick={reload}
            className="border border-line bg-white px-4 py-2 text-sm font-semibold hover:bg-panel"
          >
            Refresh
          </button>
        </header>

        <StatsStrip stats={stats} />

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="flex flex-col gap-4">
            <TicketForm onSubmit={addTicket} saving={saving} />
          </aside>

          <section className="flex min-w-0 flex-col gap-4">
            <FilterBar filters={filters} onChange={setFilters} />

            {error ? (
              <div className="border border-red-200 bg-red-50 p-3 text-sm text-danger">{error}</div>
            ) : null}

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statuses.map((status) => (
                  <div key={status} className="h-64 animate-pulse border border-line bg-white" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {statuses.map((status) => {
                  const tickets = groupedTickets[status] || [];
                  return (
                    <section key={status} className="min-h-80 border border-line bg-[#f9fbfd]">
                      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-3 py-3">
                        <h2 className="text-sm font-semibold">{statusLabels[status]}</h2>
                        <span className="bg-panel px-2 py-1 text-xs font-semibold">{tickets.length}</span>
                      </div>
                      <div className="grid gap-3 p-3">
                        {tickets.length > 0 ? (
                          tickets.map((ticket) => (
                            <TicketCard
                              key={ticket._id}
                              ticket={ticket}
                              onMove={moveTicket}
                              onDelete={removeTicket}
                            />
                          ))
                        ) : (
                          <div className="border border-dashed border-line bg-white p-4 text-sm text-muted">
                            No tickets
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
