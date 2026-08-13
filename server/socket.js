let io;

module.exports = {
    init: (httpServer) => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: [
                    "https://sangam-plumbing.vercel.app",
                    "http://localhost:5173",
                    "http://localhost:3000"
                ],
                methods: ["GET", "POST", "PUT"],
                credentials: true
            }
        });
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
