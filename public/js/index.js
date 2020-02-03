var socket = io();

let myName = "";

let chatInputer; // 글 입력 상자
let chatBoard; // 채팅 보드
let sender; // 전송버튼
let opacont; // 채팅창 투명도 설정

// 창이 로드되고 난 뒤 호출되는 이벤트
window.addEventListener("DOMContentLoaded", function(){

    chatInputer = document.getElementById("chatInputer");
    chatBoard = document.querySelector("#chatBoard");
    sender = document.getElementById("sender");
    opacont = document.getElementById("opacont");
    opacont.defaultValue = 1;

    sender.addEventListener("click", function(){
        send();
    });

    chatInputer.addEventListener("keypress", function(event){
        if(event.keyCode == 13){    
            sender.click();
        }
    });

    opacont.addEventListener("input", function(){
        setOpa();
    });
    
});


/***************************** Socket.io *****************************/
socket.on('connect', function(){
    setName();
});

socket.on('update', function(data){

    let leftOrRight = "";
    if(data.userName == myName){
        leftOrRight = `rightChat`;
    }
    else{
        leftOrRight = `leftChat`;
    }
    drawChat(leftOrRight, data.userName, data.msg);
});

socket.on('userChk', function(data){

    socket.emit('JoiningUser',`${myName}`);
});
/*****************************           *****************************/

// 메시지 보내기
function send(){

    if(chatInputer.value == ""){
        alert("내용을 입력해주세요.");
        return;
    }

    var message = chatInputer.value;
    chatInputer.value = "";

    socket.emit('send', {user:myName, msg:message});
}

// 접속시 내 이름 세팅
function setName(){
    myName = document.getElementById("yourName").innerText;
    socket.emit("newUser", {user:myName});
}

// 채팅 그리기
function drawChat(leftOrRight, name, msg){

    const chatBox = document.createElement("div");
    chatBox.classList.add('chatBox');
    chatBox.classList.add(leftOrRight);

    const profileDiv = document.createElement("div"); // 프로필
    profileDiv.className = "profile";
    profileDiv.innerText = name;

    const msgDiv = document.createElement("div"); // 메시지
    let bubbleClass = "";
    if(leftOrRight == "rightChat"){
        bubbleClass = "mybubble"
    }
    else if(leftOrRight == "leftChat"){
        bubbleClass = "otherbubble"
    }
    msgDiv.className =  'bubble';
    msgDiv.classList.add(bubbleClass);
    msgDiv.innerText = msg;

    chatBox.appendChild(profileDiv);
    chatBox.appendChild(msgDiv);
    chatBoard.appendChild(chatBox);

    chatBoard.scrollTop = chatBoard.scrollHeight;
}

// 각 객체들 투명도 설정
function setOpa(){
    chatBoard.style.opacity = opacont.value;
    document.getElementById("chatInput").style.opacity = opacont.value;
    document.getElementById("yourName").style.opacity = opacont.value;
}
