// config/database.js: Initialise et exporte la connexion MongoDB via Mongoose
import mongoose from 'mongoose';

function buildMongoUri() {
  const host = process.env.MONGO_HOST || 'mongodb';
  const port = process.env.MONGO_PORT || '27017';
  const db = process.env.MONGO_DB || 'app_db';
  const user = process.env.MONGO_USER || 'root';
  const password = process.env.MONGO_PASSWORD || 'example';
  return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${db}?authSource=admin`;
}

export async function connectToMongoDatabase() {
  const mongoUri = buildMongoUri();
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
}


