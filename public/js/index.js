var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');
});

socket.on('disconnect', function() {
    console.log('disconnected from server');
});

socket.on('newMessage', function(msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#msg-template').html();
    Mustache.parse(template);   // optional, speeds up future uses
    var html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
});

socket.on('newLocationMessage', function(msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var html = $('#location-msg-template').html();
    Mustache.parse(html);   // optional, speeds up future uses
    var html = Mustache.render(html, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
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