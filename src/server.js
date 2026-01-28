const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { setIO } = require('./socket/io');
const port = process.env.PORT || 3005;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'https://cultitech.vercel.app'],
        credentials: true
    }
});

setIO(io);
require('./socket/socket')(io);

server.listen(port, () => {
    console.log(`🚀 Servidor + Socket activo en puerto ${port}`);
});
