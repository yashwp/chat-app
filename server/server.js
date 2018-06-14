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

    socket.emit('newMessage',{
        from: 'Admin',
        text: 'Welcome Bro',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New Joinee',
        createdAt: new Date().getTime() 
    });

    
    socket.on('createMessage', (msg) => {
        io.emit('newMessage', {
            from: msg.from,
            text: msg.text,
            createdAt: new Date().getTime() 
        });
    });

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });

});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});