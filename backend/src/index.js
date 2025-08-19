// index.js: Entrypoint — démarre le serveur HTTP et initialise les connexions (MongoDB)
import { createServer } from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectToMongoDatabase } from './modules/config/database.js';

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  await connectToMongoDatabase();
  const server = createServer(app);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API is running on port ${port}`);
  });
}

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});


