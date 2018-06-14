var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

    // socket.emit('createMessage', {
    //     from: 'yash@gmail.com',
    //     text: 'New msg created',
    // });
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(msg) {
    console.log('New Message', msg);
});