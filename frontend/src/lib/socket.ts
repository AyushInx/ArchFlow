import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string, projectId: string, user: any) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:5000', {
    auth: { token },
  });

  socket.on('connect', () => {
    socket?.emit('JOIN_PROJECT', { projectId, user });
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
