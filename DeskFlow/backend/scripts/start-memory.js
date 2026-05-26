import { MongoMemoryServer } from 'mongodb-memory-server';

const mongoServer = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongoServer.getUri();
process.env.PORT = process.env.PORT || '5000';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

console.log('Using in-memory MongoDB for local development');

await import('../server.js');

process.on('SIGINT', async () => {
  await mongoServer.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoServer.stop();
  process.exit(0);
});
