var socket = io();
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); // 접속기기가 모바일이면 true, 아니면 false

let myName = ""; // 접속유저가 입력한 이름 저장
let chatInputer; // 글 입력 상자
let chatBoard; // 채팅 보드
let sender; // 전송버튼
let opacont; // 채팅창 투명도 설정
let userlist; // 채팅참여중인 유저 목록div
let usersBtn; // 채팅참여유저 보기 위한 버튼

window.addEventListener("DOMContentLoaded", function(){

    chatInputer = document.getElementById("chatInputer");
    chatBoard = document.getElementById("chatBoard");
    sender = document.getElementById("sender");
    opacont = document.getElementById("opacont");
    opacont.defaultValue = 1;
    userlist = document.getElementById("userlist");
    usersBtn = document.getElementById("usersBtn");

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

    usersBtn.addEventListener("mouseenter", showUserList);
    usersBtn.addEventListener("mouseout", hideUserList);
});

/***************************** Socket.io *****************************/
// 접속시 이름 셋팅
socket.on('connect', function(){
    setName();
});

// 채팅을 받아온다
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

// 누군가 나갔을 때 서버에서는 접속중인 유저를 체크하고, 서버에 나를 알린다.
socket.on('userChk', function(data){
    socket.emit('JoiningUser',`${myName}`);
});

// 나간 유저 알림을 받는다.
socket.on('deleteNotice', function(data){
    const outUser = data.outUser;
    drawChat("centerChat", data.outUser, "님이 나갔습니다.");
    getCurrentUser(data.roomInfo.users);
});

// 새로운 유저가 들어왔다는 알림을 받는다.
socket.on('newUserNotice', function(data){
    const newUser = data.newUser;
    setDrawingUser(data.roomInfo.users);
    drawChat("centerChat", newUser, "님이 들어왔습니다.");
    getCurrentUser(data.roomInfo.users);
});

// 참여중인 유저를 유저리스트에 그리는 함수
function getCurrentUser(arrayData){
    const title = "<span id='userListTitle'>참여중인 유저</span>"
    userlist.innerHTML = title;
    arrayData.forEach(user => {
            const userDiv = document.createElement("div");
            userDiv.classList.add("userList_user");
            userDiv.innerText = user;
            userlist.appendChild(userDiv);
    });
}

// 메시지 보내기 함수
function send(){

    if(chatInputer.value == ""){
        alert("내용을 입력해주세요.");
        return;
    }

    var message = chatInputer.value;
    chatInputer.value = "";

    socket.emit('send', {user:myName, msg:message});
}

// 내 이름 세팅 함수
function setName(){
    myName = document.getElementById("yourName").innerText;
    socket.emit("newUser", {user:myName});
}

// 채팅 그리기 함수
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

// 공지사항 뿌리기 함수(접속,종료 알림)
function makeNoticeChat(name, msg){
    const noticeChat = document.createElement("div");
    noticeChat.classList.add("noticeChat");
    noticeChat.innerText = `${name} ${msg}`;
    chatBoard.appendChild(noticeChat);
}

// 채팅 관련 각 객체들 투명도 설정 함수
function setOpa(){
    chatBoard.style.opacity = opacont.value;
    document.getElementById("chatInput").style.opacity = opacont.value;
    document.getElementById("NameTitle").style.opacity = opacont.value;
    document.getElementById("mainCanvasDiv").style.opacity = opacont.value;
}

// 유저목록 보이기 함수
function showUserList(){
    userlist.style.display = "block";
}

// 유저목록 숨기기 함수
function hideUserList(){
    userlist.style.display = "none";
}