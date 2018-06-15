const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validate');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('User connected');

    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and Room reqired');
        }
        
        socket.join(params.room);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome brooo!!!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });
    
    socket.on('createMessage', (msg, callback) => {
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback();
    });

    socket.on('createLocationMessage', (position) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', position.lat, position.lng));
    });

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });

});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});