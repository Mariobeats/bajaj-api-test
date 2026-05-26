import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

export const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'DeskFlow API',
    status: 'ok',
    routes: ['/health', '/tickets', '/tickets/stats']
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/tickets', ticketRoutes);
app.use('/api/tickets', ticketRoutes);
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`DeskFlow API listening on port ${port}`);
      });
    })
    .catch((err) => {
      console.error('Database connection failed', err);
      process.exit(1);
    });
}
