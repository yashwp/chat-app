var socket = io();

function scrollToBottom() {
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var ch = messages.prop('clientHeight');
    var st = messages.prop('scrollTop');
    var sh = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMsgHeight = newMessage.prev().innerHeight();

    if (ch + st + lastMsgHeight + newMessageHeight >= sh) {
        messages.scrollTop(sh);
    }

}

socket.on('connect', function () {
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {

        }
    });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('updateUsersList', function(users) {
    var ol = $('<ol></ol>');

    users.forEach(function (user) {
      ol.append($('<li></li>').text(user));
    });
  
    $('#users').html(ol);
});

socket.on('newMessage', function (msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#msg-template').html();
    Mustache.parse(template); // optional, speeds up future uses
    var html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (msg) {
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var html = $('#location-msg-template').html();
    Mustache.parse(html); // optional, speeds up future uses
    var html = Mustache.render(html, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
});

$(document).ready(function () {
    $('#message-form').on('submit', function (e) {
        e.preventDefault();

        var messageTextbox = $('[name=message]');
        socket.emit('createMessage', {
            text: messageTextbox.val()
        }, function () {
            messageTextbox.val('');
        });
    });


    var locationBtn = $('#share-loc');
    locationBtn.on('click', function () {
        if (!navigator.geolocation) {
            return alert('Use a good browser');
        }
        locationBtn.attr('disabled', 'disabled').text('Sending location...');
        navigator.geolocation.getCurrentPosition(function (pos) {
            locationBtn.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            });
        }, function () {
            locationBtn.removeAttr('disabled').text('Send location');
            alert('Unable to fetch location')
        });
    });
});