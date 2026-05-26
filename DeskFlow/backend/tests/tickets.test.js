import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';

let mongoServer;
let app;
let Ticket;

const validTicket = {
  subject: 'Printer not working',
  description: 'The finance team printer is jammed again.',
  customerEmail: 'customer@example.com',
  priority: 'high'
};

before(async () => {
  process.env.NODE_ENV = 'test';
  ({ app } = await import('../server.js'));
  ({ default: Ticket } = await import('../models/Ticket.js'));
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Ticket.deleteMany({});
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('ticket API', () => {
  it('creates a ticket with derived fields', async () => {
    const res = await request(app).post('/tickets').send(validTicket).expect(201);

    assert.equal(res.body.subject, validTicket.subject);
    assert.equal(res.body.status, 'open');
    assert.equal(typeof res.body.ageMinutes, 'number');
    assert.equal(res.body.slaBreached, false);
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/tickets')
      .send({ ...validTicket, customerEmail: 'not-email' })
      .expect(400);

    assert.match(res.body.errors.customerEmail, /valid/);
  });

  it('rejects invalid priority', async () => {
    const res = await request(app)
      .post('/tickets')
      .send({ ...validTicket, priority: 'critical' })
      .expect(400);

    assert.match(res.body.errors.priority, /Priority/);
  });

  it('rejects invalid status', async () => {
    const res = await request(app)
      .post('/tickets')
      .send({ ...validTicket, status: 'waiting' })
      .expect(400);

    assert.match(res.body.errors.status, /Status/);
  });

  it('rejects invalid transition', async () => {
    const create = await request(app).post('/tickets').send(validTicket).expect(201);
    const res = await request(app)
      .patch(`/tickets/${create.body._id}`)
      .send({ status: 'resolved' })
      .expect(400);

    assert.match(res.body.message, /Invalid status transition/);
  });

  it('calculates SLA breach for unresolved and resolved tickets', async () => {
    const oldOpen = await Ticket.create({
      ...validTicket,
      priority: 'urgent',
      createdAt: new Date(Date.now() - 90 * 60000),
      updatedAt: new Date(Date.now() - 90 * 60000)
    });

    const resolved = await Ticket.create({
      ...validTicket,
      subject: 'Resolved slow ticket',
      priority: 'urgent',
      status: 'resolved',
      createdAt: new Date(Date.now() - 120 * 60000),
      updatedAt: new Date(Date.now() - 10 * 60000),
      resolvedAt: new Date(Date.now() - 10 * 60000)
    });

    const res = await request(app).get('/tickets?breached=true').expect(200);
    const ids = res.body.map((ticket) => ticket._id);

    assert.equal(res.body.length, 2);
    assert.ok(ids.includes(oldOpen.id));
    assert.ok(ids.includes(resolved.id));
  });

  it('applies combined filters', async () => {
    await Ticket.create({
      ...validTicket,
      priority: 'urgent',
      status: 'open',
      createdAt: new Date(Date.now() - 90 * 60000)
    });
    await Ticket.create({
      ...validTicket,
      subject: 'Low priority',
      priority: 'low',
      status: 'open'
    });
    await Ticket.create({
      ...validTicket,
      subject: 'Resolved urgent',
      priority: 'urgent',
      status: 'resolved',
      resolvedAt: new Date()
    });

    const res = await request(app)
      .get('/tickets?status=open&priority=urgent&breached=true')
      .expect(200);

    assert.equal(res.body.length, 1);
    assert.equal(res.body[0].priority, 'urgent');
    assert.equal(res.body[0].status, 'open');
    assert.equal(res.body[0].slaBreached, true);
  });

  it('returns stats', async () => {
    await Ticket.create({
      ...validTicket,
      priority: 'urgent',
      status: 'open',
      createdAt: new Date(Date.now() - 90 * 60000)
    });
    await Ticket.create({
      ...validTicket,
      subject: 'Done',
      priority: 'low',
      status: 'closed',
      resolvedAt: new Date()
    });

    const res = await request(app).get('/tickets/stats').expect(200);

    assert.equal(res.body.statusCounts.open, 1);
    assert.equal(res.body.statusCounts.closed, 1);
    assert.equal(res.body.priorityCounts.urgent, 1);
    assert.equal(res.body.priorityCounts.low, 1);
    assert.equal(res.body.breachedCount, 1);
  });
});
