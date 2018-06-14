var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(msg) {
    var li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(msg) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">Live location</a>');
    li.text(`${msg.from}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

$(document).ready(function() {
    $('#message-form').on('submit', function(e) {
        e.preventDefault();

        socket.emit('createMessage', {
            from: 'User',
            text: $('[name=message]').val()
        }, function(data){
            console.log('Got it!', data);
        });
        $('[name=message]').val('');
    });


    var locationBtn = $('#share-loc');
    locationBtn.on('click', function() {
        if (!navigator.geolocation) {
            return alert('Use a good browser');
        }

        navigator.geolocation.getCurrentPosition(function(pos){
            socket.emit('createLocationMessage', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            })
        }, function(){
            alert('Unable to fetch location')
        });
    });
});