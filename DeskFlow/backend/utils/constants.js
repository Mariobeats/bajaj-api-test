export const PRIORITIES = ['urgent', 'high', 'medium', 'low'];
export const STATUSES = ['open', 'in_progress', 'resolved', 'closed'];

export const SLA_TARGET_MINUTES = {
  urgent: 60,
  high: 240,
  medium: 1440,
  low: 4320
};

export const ALLOWED_TRANSITIONS = {
  open: ['in_progress'],
  in_progress: ['resolved', 'open'],
  resolved: ['closed', 'in_progress'],
  closed: ['resolved']
};
