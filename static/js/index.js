var socket = io()

socket.io('connect', function(){
    var input = document.getElementById('test');
    input.value = "접속 됨";
});

function send(){
    var message = document.getElementById('test').value;

    document.getElementById('test').value = "";

    socket.emit('send', {msg:message});
}