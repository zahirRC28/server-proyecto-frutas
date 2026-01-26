const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const port = process.env.PORT || 3005;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://frontfrutas.vercel.app'],
        credentials: true
    }
});

require('./socket/socket')(io);

server.listen(port, () => {
    console.log(`🚀 Servidor + Socket activo en puerto ${port}`);
});
