import express from 'express';
import {
  createTicket,
  deleteTicket,
  getStats,
  getTickets,
  updateTicket
} from '../controllers/ticketController.js';

const router = express.Router();

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/stats', getStats);
router.patch('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;
