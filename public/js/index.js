var socket = io();
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); // 접속기기가 모바일이면 true, 아니면 false

let myName = ""; // 접속유저가 입력한 이름 저장
let chatInputer; // 글 입력 상자
let chatBoard; // 채팅 보드
let sender; // 전송버튼
let opacont; // 채팅창 투명도 설정

window.addEventListener("DOMContentLoaded", function(){

    chatInputer = document.getElementById("chatInputer");
    chatBoard = document.getElementById("chatBoard");
    sender = document.getElementById("sender");
    opacont = document.getElementById("opacont");
    opacont.defaultValue = 1;

    /**************** 채팅관련 ****************/
    sender.addEventListener("click", function(){ // 메시지 보내기 이벤트
        send();
    });

    chatInputer.addEventListener("keypress", function(event){ // 엔터키로 메시지 보내기 이벤트
        if(event.keyCode == 13){    
            sender.click();
        }
    });

    opacont.addEventListener("input", function(){ // 채팅창 투명도 설정 이벤트
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

socket.on('deleteNotice', function(data){
    const outUser = data.outUser;
    drawChat("centerChat", data.outUser, "님이 나갔습니다.");
});

socket.on('newUserNotice', function(data){
    const newUser = data.newUser;
    drawChat("centerChat", newUser, "님이 들어왔습니다.");
});

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
    else if(leftOrRight == "centerChat"){
        makeNoticeChat(name, msg);
        return;
    }

    msgDiv.className = 'bubble';
    msgDiv.classList.add(bubbleClass);
    msgDiv.innerText = msg;

    chatBox.appendChild(profileDiv);
    chatBox.appendChild(msgDiv);
    chatBoard.appendChild(chatBox);

    chatBoard.scrollTop = chatBoard.scrollHeight;
}

// 공지사항 뿌리기
function makeNoticeChat(name, msg){
    const noticeChat = document.createElement("div");
    noticeChat.classList.add("noticeChat");
    noticeChat.innerText = `${name} ${msg}`;
    chatBoard.appendChild(noticeChat);
}

// 채팅 관련 각 객체들 투명도 설정
function setOpa(){
    chatBoard.style.opacity = opacont.value;
    document.getElementById("chatInput").style.opacity = opacont.value;
    document.getElementById("NameTitle").style.opacity = opacont.value;
}