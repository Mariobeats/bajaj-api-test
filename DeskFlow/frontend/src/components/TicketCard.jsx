import { Trash2 } from 'lucide-react';
import { allowedActions, formatAge, priorityStyles } from '../utils/tickets.js';

export default function TicketCard({ ticket, onMove, onDelete }) {
  return (
    <article className="border border-line bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-5">{ticket.subject}</h3>
        <span className={`shrink-0 border px-2 py-1 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
          {ticket.priority}
        </span>
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-muted">{ticket.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{ticket.customerEmail}</span>
        <span aria-hidden="true">/</span>
        <span>Age {formatAge(ticket.ageMinutes)}</span>
      </div>

      <div
        className={`mt-3 border px-2 py-1 text-xs font-semibold ${
          ticket.slaBreached
            ? 'border-red-200 bg-red-50 text-danger'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}
      >
        {ticket.slaBreached ? 'SLA breached' : 'SLA on track'}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {allowedActions[ticket.status].map((action) => (
          <button
            key={action.status}
            type="button"
            className="border border-ink px-3 py-2 text-xs font-semibold hover:bg-ink hover:text-white"
            onClick={() => onMove(ticket._id, action.status)}
          >
            {action.label}
          </button>
        ))}
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center border border-line p-2 text-muted hover:border-danger hover:text-danger"
          onClick={() => onDelete(ticket._id)}
          aria-label={`Delete ${ticket.subject}`}
          title="Delete ticket"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
