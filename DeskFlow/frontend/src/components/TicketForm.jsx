import { useState } from 'react';
import { Plus } from 'lucide-react';
import { priorities } from '../utils/tickets.js';

const initialForm = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: 'medium'
};

export default function TicketForm({ onSubmit, saving }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function validate() {
    const nextErrors = {};
    if (form.subject.trim().length < 3) nextErrors.subject = 'Subject must be at least 3 characters.';
    if (form.description.trim().length < 5) nextErrors.description = 'Description must be at least 5 characters.';
    if (!/^\S+@\S+\.\S+$/.test(form.customerEmail)) nextErrors.customerEmail = 'Enter a valid email.';
    if (!priorities.includes(form.priority)) nextErrors.priority = 'Choose a valid priority.';
    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = await onSubmit(form);
    if (result.ok) {
      setForm(initialForm);
      setErrors({});
      return;
    }

    setErrors(result.errors || {});
    setMessage(result.message || 'Ticket could not be created.');
  }

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  return (
    <form className="border border-line bg-white p-4" onSubmit={handleSubmit} noValidate>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">Create Ticket</h2>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Saving' : 'Create'}
        </button>
      </div>

      {message ? <div className="mb-3 border border-red-200 bg-red-50 p-2 text-sm text-danger">{message}</div> : null}

      <div className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium">
          Subject
          <input
            className="border border-line px-3 py-2"
            value={form.subject}
            onChange={(event) => update('subject', event.target.value)}
          />
          {errors.subject ? <span className="text-xs text-danger">{errors.subject}</span> : null}
        </label>

        <label className="grid gap-1 text-sm font-medium">
          Description
          <textarea
            className="min-h-24 resize-y border border-line px-3 py-2"
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
          />
          {errors.description ? <span className="text-xs text-danger">{errors.description}</span> : null}
        </label>

        <label className="grid gap-1 text-sm font-medium">
          Customer Email
          <input
            className="border border-line px-3 py-2"
            type="email"
            value={form.customerEmail}
            onChange={(event) => update('customerEmail', event.target.value)}
          />
          {errors.customerEmail ? <span className="text-xs text-danger">{errors.customerEmail}</span> : null}
        </label>

        <label className="grid gap-1 text-sm font-medium">
          Priority
          <select
            className="border border-line bg-white px-3 py-2"
            value={form.priority}
            onChange={(event) => update('priority', event.target.value)}
          >
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {errors.priority ? <span className="text-xs text-danger">{errors.priority}</span> : null}
        </label>
      </div>
    </form>
  );
}
