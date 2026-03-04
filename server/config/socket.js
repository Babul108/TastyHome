const { Server } = require('socket.io');

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-order-room', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`Socket ${socket.id} joined order room: order-${orderId}`);
    });

    socket.on('location-update', ({ orderId, location }) => {
      io.to(`order-${orderId}`).emit('delivery-location', location);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { setupSocket, getIO };
