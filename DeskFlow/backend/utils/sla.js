import { SLA_TARGET_MINUTES } from './constants.js';

export function getAgeMinutes(ticket, now = new Date()) {
  const createdAt = new Date(ticket.createdAt);
  const end = ticket.resolvedAt ? new Date(ticket.resolvedAt) : now;
  return Math.max(0, Math.floor((end.getTime() - createdAt.getTime()) / 60000));
}

export function isSlaBreached(ticket, now = new Date()) {
  const target = SLA_TARGET_MINUTES[ticket.priority];
  if (!target) return false;
  return getAgeMinutes(ticket, now) > target;
}

export function withDerivedFields(ticket, now = new Date()) {
  const plain = typeof ticket.toObject === 'function'
    ? ticket.toObject({ versionKey: false })
    : { ...ticket };

  return {
    ...plain,
    ageMinutes: getAgeMinutes(plain, now),
    slaBreached: isSlaBreached(plain, now)
  };
}
