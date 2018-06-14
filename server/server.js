const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });
    
    socket.on('createMessage', (msg) => {
        console.log('New message from client', msg);
    });

    socket.emit('newMessage', {
        from: 'demp@gmail.com',
        text: 'My first socket app',
        createdAt: new Date().getTime() 
    });
});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});