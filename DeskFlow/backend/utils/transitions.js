import { ALLOWED_TRANSITIONS } from './constants.js';

export function canTransition(from, to) {
  if (from === to) return true;
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function transitionMessage(from, to) {
  return `Invalid status transition from ${from} to ${to}. Allowed transitions: ${ALLOWED_TRANSITIONS[from]?.join(', ') || 'none'}.`;
}
