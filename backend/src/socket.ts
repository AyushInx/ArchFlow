import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'archflow-dev-secret-change-in-production';

export function setupSocketIO(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Auth Middleware for sockets
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('JOIN_PROJECT', ({ projectId, user }) => {
      socket.join(projectId);
      socket.data.projectId = projectId;
      socket.data.user = user;
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    socket.on('LEAVE_PROJECT', ({ projectId }) => {
      socket.leave(projectId);
      delete socket.data.projectId;
    });

    socket.on('NODE_MOVED', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('NODE_MOVED', data);
    });

    socket.on('NODE_ADDED', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('NODE_ADDED', data);
    });

    socket.on('NODE_DELETED', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('NODE_DELETED', data);
    });

    socket.on('EDGE_ADDED', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('EDGE_ADDED', data);
    });

    socket.on('EDGE_DELETED', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('EDGE_DELETED', data);
    });

    socket.on('PRESENCE_UPDATE', (data) => {
      const { projectId } = socket.data;
      if (projectId) socket.to(projectId).emit('PRESENCE_UPDATE', { ...data, socketId: socket.id });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      if (socket.data.projectId) {
         socket.to(socket.data.projectId).emit('USER_LEFT', { socketId: socket.id });
      }
    });
  });

  return io;
}
