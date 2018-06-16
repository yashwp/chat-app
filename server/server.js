const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validate');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room reqired');
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUsers(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUsers(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome brooo!!!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });
    
    socket.on('createMessage', (msg, callback) => {

        var user = users.getUser(socket.id);
        if (user && isRealString(msg.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }
        callback();
    });

    socket.on('createLocationMessage', (position) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, position.lat, position.lng));
        }
    });

    socket.on('disconnect', () => {
        console.log('disconnected from client');
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUsersList', users.getUsers(user.room))
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} left`));
        }
    });

});

server.listen(port, () => {
    console.log('Server is running on port ' + port);
});