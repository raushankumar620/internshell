import { io } from 'socket.io-client';

// Get the API URL from environment or use default
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

let socketInstance = null;

// Function to initialize socket connection
export const initSocket = (userId, userRole = null) => {
  if (socketInstance) {
    return socketInstance;
  }

  // Check if we're in production environment
  const isProduction = import.meta.env.PROD || 
                      import.meta.env.MODE === 'production' || 
                      window.location.hostname !== 'localhost';

  // Disable socket in production to avoid connection errors for now
  if (isProduction) {
    console.log('🔌 Socket disabled in production environment');
    return null;
  }

  // Socket configuration with better error handling for development
  const socketConfig = {
    transports: ['websocket', 'polling'],
    withCredentials: true,
    timeout: 10000, // 10 second timeout
    forceNew: false,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 3,
    reconnectionDelay: 1000
  };

  // Create socket connection
  socketInstance = io(SOCKET_URL, socketConfig);

  // Authenticate user
  if (userId) {
    socketInstance.emit('user-auth', { userId });
    
    // Backward compatibility: authenticate as employer if role is employer
    if (userRole === 'employer') {
      socketInstance.emit('employer-auth', { employerId: userId });
    }
  }

  // Handle connection events
  socketInstance.on('connect', () => {
    console.log('🔌 Socket connected:', socketInstance.id);
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  socketInstance.on('connect_error', (error) => {
    // Only log errors in development to avoid console spam
    if (!import.meta.env.PROD) {
      console.error('🔌 Socket connection error:', error);
    }
  });

  socketInstance.on('reconnect', (attemptNumber) => {
    console.log('🔌 Socket reconnected after', attemptNumber, 'attempts');
  });

  socketInstance.on('reconnect_error', (error) => {
    if (!import.meta.env.PROD) {
      console.error('🔌 Socket reconnection error:', error);
    }
  });

  return socketInstance;
};

// Function to get socket instance
export const getSocket = () => {
  return socketInstance;
};

// Safe socket emit function that handles disconnected states
export const safeSocketEmit = (event, data) => {
  if (socketInstance && socketInstance.connected) {
    socketInstance.emit(event, data);
  } else {
    if (!import.meta.env.PROD) {
      console.warn('🔌 Socket not connected, skipping emit:', event);
    }
  }
};

// Function to disconnect socket
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default {
  initSocket,
  getSocket,
  disconnectSocket
};