export const statuses = ['open', 'in_progress', 'resolved', 'closed'];

export const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed'
};

export const priorities = ['urgent', 'high', 'medium', 'low'];

export const priorityStyles = {
  urgent: 'bg-red-100 text-red-800 border-red-200',
  high: 'bg-amber-100 text-amber-800 border-amber-200',
  medium: 'bg-sky-100 text-sky-800 border-sky-200',
  low: 'bg-emerald-100 text-emerald-800 border-emerald-200'
};

export const allowedActions = {
  open: [{ status: 'in_progress', label: 'Move to In Progress' }],
  in_progress: [
    { status: 'open', label: 'Move to Open' },
    { status: 'resolved', label: 'Move to Resolved' }
  ],
  resolved: [
    { status: 'in_progress', label: 'Move to In Progress' },
    { status: 'closed', label: 'Move to Closed' }
  ],
  closed: [{ status: 'resolved', label: 'Move to Resolved' }]
};

export function formatAge(minutes = 0) {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 48) return `${hours}h ${remainingMinutes}m`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h`;
}
