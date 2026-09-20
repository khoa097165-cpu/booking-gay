import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';
import talentRoutes from './routes/talents.js';
import bookingRoutes from './routes/bookings.js';
import favoriteRoutes from './routes/favorites.js';
import reportRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import staffRoutes from './routes/staff.js';

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error('MONGODB_URI and JWT_SECRET are required');
}

await connectDB();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = __dirname;

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);

app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));

app.use(
  '/api',
  rateLimit({
    windowMs: 60_000,
    limit: 120,
  }),
);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luna Talent API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/talents', talentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);

// Node/Express serves the frontend too, so Live Server is not required.
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Luna Talent: http://localhost:${PORT}`);
  console.log(`API health:  http://localhost:${PORT}/api/health`);
});
