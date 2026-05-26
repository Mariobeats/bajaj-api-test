import Ticket from '../models/Ticket.js';
import { PRIORITIES, STATUSES } from '../utils/constants.js';
import { canTransition, transitionMessage } from '../utils/transitions.js';
import { isSlaBreached, withDerivedFields } from '../utils/sla.js';

function badRequest(message, errors) {
  const error = new Error(message);
  error.statusCode = 400;
  if (errors) error.errors = errors;
  return error;
}

function buildQuery(query) {
  const filter = {};

  if (query.status) {
    if (!STATUSES.includes(query.status)) {
      throw badRequest('Invalid status filter');
    }
    filter.status = query.status;
  }

  if (query.priority) {
    if (!PRIORITIES.includes(query.priority)) {
      throw badRequest('Invalid priority filter');
    }
    filter.priority = query.priority;
  }

  return filter;
}

function applyBreachedFilter(tickets, breached) {
  if (breached === undefined) return tickets;
  if (!['true', 'false'].includes(breached)) {
    throw badRequest('Breached filter must be true or false');
  }

  const expected = breached === 'true';
  return tickets.filter((ticket) => isSlaBreached(ticket) === expected);
}

export async function createTicket(req, res, next) {
  try {
    const ticket = await Ticket.create({
      subject: req.body.subject,
      description: req.body.description,
      customerEmail: req.body.customerEmail,
      priority: req.body.priority,
      status: req.body.status || 'open'
    });

    res.status(201).json(withDerivedFields(ticket));
  } catch (err) {
    next(err);
  }
}

export async function getTickets(req, res, next) {
  try {
    const query = buildQuery(req.query);
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    const filtered = applyBreachedFilter(tickets, req.query.breached);
    res.json(filtered.map((ticket) => withDerivedFields(ticket)));
  } catch (err) {
    next(err);
  }
}

export async function updateTicket(req, res, next) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const allowedFields = ['subject', 'description', 'customerEmail', 'priority', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] === undefined) continue;

      if (field === 'status' && req.body.status !== ticket.status) {
        if (!STATUSES.includes(req.body.status)) {
          throw badRequest('Invalid status');
        }
        if (!canTransition(ticket.status, req.body.status)) {
          throw badRequest(transitionMessage(ticket.status, req.body.status));
        }

        if (req.body.status === 'resolved' && !ticket.resolvedAt) {
          ticket.resolvedAt = new Date();
        }
        if (ticket.status === 'resolved' && req.body.status === 'in_progress') {
          ticket.resolvedAt = null;
        }
      }

      ticket[field] = req.body[field];
    }

    await ticket.save();
    res.json(withDerivedFields(ticket));
  } catch (err) {
    next(err);
  }
}

export async function deleteTicket(req, res, next) {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const tickets = await Ticket.find();
    const statusCounts = STATUSES.reduce((acc, status) => ({ ...acc, [status]: 0 }), {});
    const priorityCounts = PRIORITIES.reduce((acc, priority) => ({ ...acc, [priority]: 0 }), {});
    let breachedCount = 0;

    for (const ticket of tickets) {
      statusCounts[ticket.status] += 1;
      priorityCounts[ticket.priority] += 1;
      if (ticket.status !== 'resolved' && ticket.status !== 'closed' && isSlaBreached(ticket)) {
        breachedCount += 1;
      }
    }

    res.json({ statusCounts, priorityCounts, breachedCount });
  } catch (err) {
    next(err);
  }
}
