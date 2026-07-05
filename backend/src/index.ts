import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

import { setupSocketIO } from './socket';
setupSocketIO(httpServer);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin in dev or if there is no origin (e.g. mobile apps, curl requests)
    callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import diagramRoutes from './routes/diagrams';
import commentRoutes from './routes/comments';
import aiRoutes from './routes/ai';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
// We mount diagrams and comments as sub-resources of projects
app.use('/api/projects', diagramRoutes);
app.use('/api/projects', commentRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'archflow-backend',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const start = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`⚡ ArchFlow backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;
