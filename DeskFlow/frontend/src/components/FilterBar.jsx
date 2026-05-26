import { RotateCcw } from 'lucide-react';
import { priorities, statuses, statusLabels } from '../utils/tickets.js';

export default function FilterBar({ filters, onChange }) {
  function setFilter(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <section className="flex flex-col gap-3 border border-line bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-center">
        <label className="grid gap-1 text-sm font-medium">
          Status
          <select
            className="border border-line bg-white px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) => setFilter('status', event.target.value)}
          >
            <option value="">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-sm font-medium">
          Priority
          <select
            className="border border-line bg-white px-3 py-2 text-sm"
            value={filters.priority}
            onChange={(event) => setFilter('priority', event.target.value)}
          >
            <option value="">All priorities</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 self-end border border-line px-3 py-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={filters.breached}
            onChange={(event) => setFilter('breached', event.target.checked)}
          />
          SLA breached only
        </label>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 border border-line px-3 py-2 text-sm font-medium hover:bg-panel"
        onClick={() => onChange({ status: '', priority: '', breached: false })}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Reset
      </button>
    </section>
  );
}
