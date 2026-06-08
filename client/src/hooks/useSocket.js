import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_ORIGIN } from '../api/api';

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || API_ORIGIN, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket.IO connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket.IO disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected };
}

export function useSocketEvents(socket, events) {
  useEffect(() => {
    if (!socket) return;

    Object.entries(events).forEach(([event, callback]) => {
      socket.on(event, callback);
    });

    return () => {
      Object.entries(events).forEach(([event]) => {
        socket.off(event);
      });
    };
  }, [socket, events]);
}
