var socket = io();

let myName = "";

socket.on('connect', function(){
    setName();
});

socket.on('update', function(data){
    document.querySelector("#chatBoard").append(data);
});

socket.on('userChk', function(data){

    socket.emit('JoiningUser',`${myName}`);
});


// 메시지 보내기
function send(){
    var message = document.getElementById('test').value;

    document.getElementById('test').value = "";

    socket.emit('send', {msg:message});
}

// 접속시 내 이름 세팅
function setName(){
    myName = document.getElementById("yourName").innerText;
    socket.emit("newUser", {user:myName});
}
