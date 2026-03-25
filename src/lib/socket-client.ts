import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export function initSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

// Event listeners
export function onNurseLocationUpdate(callback: (data: any) => void) {
  if (socket) {
    socket.on('nurse:location:update', callback);
  }
}

export function onPaymentSuccess(callback: (data: any) => void) {
  if (socket) {
    socket.on('payment:succeeded', callback);
  }
}

export function onBookingStatusChange(callback: (data: any) => void) {
  if (socket) {
    socket.on('booking:status:changed', callback);
  }
}

export function onNewJob(callback: (data: any) => void) {
  if (socket) {
    socket.on('job:new', callback);
  }
}

// Emit events
export function broadcastNurseLocation(bookingId: string, lat: number, lng: number) {
  if (socket) {
    socket.emit('nurse:location', { bookingId, lat, lng });
  }
}

export function emitBookingUpdate(bookingId: string, status: string) {
  if (socket) {
    socket.emit('booking:update', { bookingId, status });
  }
}
