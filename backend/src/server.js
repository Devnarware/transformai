import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes.js';
import { errorHandler } from './middleware.js';
import { seed } from './seed.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use('/api', routes);
app.use((q, r) => r.status(404).json({ error: 'Not found' }));
app.use(errorHandler);
await seed();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TransformAI backend listening on ${port}`));
