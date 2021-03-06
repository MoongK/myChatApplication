const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socket(server);
const fs = require('fs');
const qs = require('querystring');

const bodyParser = require('body-parser');
const htmlTemplete = require('./public/js/htmlTemplete');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let users = new Array(); // 접속중 유저정보 배열
let usersOnlyName = new Array(); // 유저 이름만 가져오는 배열
let canvasCurrentImage; // 캔버스 마지막 정보를 담아놓는 변수
let drawingNow = false; // 누군가 그리고 있다면 그리기 신청이 불가능하게 하는 변수. true : 그리는중 false : 대기중
let drawingUser = ""; // 현재 그리고 있는 유저 아이디

// 현재 방 정보
let roomInfo = {
    drawUser:"wait..",
    users:""
};

// 유저 접속시 수행
io.sockets.on('connection', function(socket){

    console.log(`(${getTime()})유저 접속 됨`);

    // 유저가 채팅메시지를 보냈을 때 받는 알림
    socket.on('send', function(data){
        const ip = socket.handshake.address;
        console.log(`(${getTime()}) [${data.user} : ${ip}] : ${data.msg}`);
        io.sockets.emit("update", {userName:data.user, msg:data.msg});
    });

    // 새로운 유저가 들어왔음을 받는 알림
    socket.on("newUser", function(data){
        console.log(`(${getTime()}) ${data.user} 접속!`);
        userPlus(socket.id, data.user);
        console.log(`현재 users : ${JSON.stringify(users)}`);
        console.log(`현재 usersOnly : ${JSON.stringify(usersOnlyName)}`);
        roomInfo.users = usersOnlyName;
        io.sockets.emit("newUserNotice", {newUser:data.user, id:socket.id,  roomInfo:roomInfo}); // 모든 유저들에게 새로운 유저가 왔음을 알린다.
        io.to(users[0].userId).emit('getImageURL', {id:socket.id}); // 새로운 유저가 들어왔을 때 첫번째 유저에게 그림정보를 요청한다.
    });

    // 현재 접속중인 유저를 받아온다.
    socket.on("JoiningUser", function(data){
        console.log(`접속 중 : ${data}`);
        console.log(`현재 usersOnly : ${JSON.stringify(usersOnlyName)}`);
    });

    // 유저가 나갔을 때 알림을 받는다.
    socket.on('disconnect', function(){
        io.sockets.emit("userChk");
        const deletedUser = userDelete(socket.id);
        console.log(`(${getTime()})접속 종료 : [${deletedUser}](${socket.id})`);
        roomInfo.users = usersOnlyName;
        io.sockets.emit("deleteNotice", {outUser:deletedUser, roomInfo:roomInfo}); // 나간 유저를 모두에게 알려준다.

        if(socket.id == drawingUser){
            drawingNow = false;
            drawingUser = "";
            io.sockets.emit("responseTurnEnd", {id:socket.id,name:deletedUser});
        }
    });

    /***** 그리기 통신 *****/
    // 캔버스 그리기 요청
    socket.on('other_userDraw', function(data){
        const x = data.x;
        const y = data.y;
        const color = data.color;
        const penWidth = data.penWidth;
        socket.broadcast.emit("other_getDraw", {x:x, y:y, color:color, penWidth:penWidth});
    });

    // 캔버스 그리기 준비 요청(drawPath 초기화를 위해 사용)
    socket.on('other_userReadyDraw', function(data){
        const x = data.x;
        const y = data.y;
        socket.broadcast.emit("other_getReadyDraw", {x:x, y:y});
    });

    // 캔버스 클린 요청
    socket.on('other_canvasClean', function(){
        socket.broadcast.emit("other_doCanvasClean");
    });
    
    // 캔버스 채우기 요청
    socket.on('other_userFill', function(data){
        socket.broadcast.emit("other_doUserFill", {color:data.color});
    });

    // 그리기 신청 요청
    socket.on('turnRequire', function(data){
        if(drawingNow){ // 그리기 신청 거절
            io.to(socket.id).emit("nagativeTurnRequire");
        }
        else{ // 그리기 신청 허용
            
            const userNm = users.filter(user => user.userId == data.id);
            const id = userNm[0].userId;
            
            drawingNow = true;
            drawingUser = id;

            roomInfo.drawUser = `${userNm}'s turn!`;
            console.log(`turn require : ${drawingUser}(${id})(${userNm[0].userNm})`);
            io.sockets.emit("responseTurn", {id:id,name:userNm[0].userNm});
        }
    });

    // 그리기 턴 종료 요청
    socket.on('turnEnd', function(data){
        drawingNow = false;
        drawingUser = "";
        const usernm = users.filter(user => user.userId == data.id);
        const id = usernm[0].userId;
        const nm = usernm[0].userNm;
        roomInfo.drawUser = `wait..`;
        console.log(`turnEnd require : ${nm}(${id})`);
        io.sockets.emit("responseTurnEnd", {id:id,name:nm});
    });

    // 그리고 있는 사람의 현재 그림을 받은 후 새로 들어온 사람에게 그림을 뿌려준다.
    socket.on('imgdata', function(data){
        canvasCurrentImage = data.img;
        io.to(data.id).emit("canvasSync", canvasCurrentImage);
    });
});

let fileCount;
app.get('/', function(request, response){
    fs.readdir("public/bgImages", (err, files) => {
        if(err){
            response.send('에러발생');
        }
        else{
            fileCount = Math.floor(Math.random() * files.length);
            htmlTemplete.login(response, fileCount);
        }
    });
/*     fs.readFile('./public/html/login.html', function(err, data){
        if(err){
            response.send('에러발생');
        }
        else{
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.write(data);
            response.end();
        }
    }); */
});

app.post('/startChat', function(request, response){
    htmlTemplete.html(response, request.body.userName, fileCount);

/*     fs.readFile('./public/html/index.html', function(err, data){
        if(err){
            response.send('에러발생');
        }
        else{
            const userName = request.body.userName;
            who = request.body.userName;
            console.log(`유저 접속 :${userName}`);
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.write(data);
            response.end();
        }
    }); */

});

app.get('/startChat', function(request, response){
    response.redirect("/");
});

server.listen("3002", function(){
    console.log(`(${getTime()}) 서버 실행 중...`);
});

// 새로운 유저 set
function userPlus(userId, userNm){

    const newPerson = {
        userNm:userNm,
        userId:userId
    }

    users.push(newPerson);
    usersOnlyName.push(newPerson.userNm);
}

// 나간 유저 삭제
function userDelete(userId){

    let whoDeleted;

    for(var i=0;i<users.length;i++){
        if(users[i].userId == userId){
            whoDeleted = users[i].userNm;
            users.splice(i, 1);
            usersOnlyName.splice(i, 1);
            break;
        }
    }
    return whoDeleted;
}

// 현재시간 구하기
function getTime(){

    const date = new Date();
    const month = (date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1);
    const day = (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());
    const hours = (date.getHours() < 10 ? "0"+date.getHours() : date.getHours());
    const minutes = (date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes());
    const seconds = (date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds());
    const time = `${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;

    return time;
}