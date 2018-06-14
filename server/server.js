const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('User connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome brooo!!!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user Joined'));

    
    socket.on('createMessage', (msg, callback) => {
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback('This from server');
    });

    socket.on('disconnect', () => {
        console.log('disconnected from client');
    });

});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});