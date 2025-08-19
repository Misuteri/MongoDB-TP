// app.js: Configure l'application Express, les middlewares globaux et monte les routes
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './modules/routes/index.js';
import { notFoundHandler, errorHandler } from './modules/middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;


