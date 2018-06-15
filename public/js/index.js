var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(msg) {
    var formattedTime = moment(msg.createdAT).format('h:mm a');
    var li = $('<li></li>');
    li.text(`${msg.from} ${formattedTime}: ${msg.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', function(msg) {
    var formattedTime = moment(msg.createdAT).format('h:mm a');
    var li = $('<li></li>');
    var a = $('<a target="_blank">Live location</a>');
    li.text(`${msg.from} ${formattedTime}: `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

$(document).ready(function() {
    $('#message-form').on('submit', function(e) {
        e.preventDefault();

        var messageTextbox = $('[name=message]');
        socket.emit('createMessage', {
            from: 'User',
            text: messageTextbox.val()
        }, function(){
            messageTextbox.val('');
        });
    });


    var locationBtn = $('#share-loc');
    locationBtn.on('click', function() {
        if (!navigator.geolocation) {
            return alert('Use a good browser');
        }
        locationBtn.attr('disabled', 'disabled').text('Sending location...');
        navigator.geolocation.getCurrentPosition(function(pos) {
            locationBtn.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        }, function() {
            locationBtn.removeAttr('disabled').text('Send location');
            alert('Unable to fetch location')
        });
    });
});