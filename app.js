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

io.sockets.on('connection', function(socket){

    console.log(`(${getTime()})유저 접속 됨`);

    socket.on('send', function(data){
        console.log(`(${getTime()}) [${data.user}] : ${data.msg}`);
    
        io.sockets.emit("update", {userName:data.user, msg:data.msg});
    });

    socket.on("newUser", function(data){
        console.log(`(${getTime()}) ${data.user} 접속!`);
        userPlus(socket.id, data.user);
        console.log(`현재 users : ${JSON.stringify(users)}`);
        io.sockets.emit("newUserNotice", {newUser:data.user});
    });

    socket.on("JoiningUser", function(data){
        console.log(`접속 중 : ${data}`);
    });

    socket.on('disconnect', function(){
        io.sockets.emit("userChk");
        const deletedUser = userDelete(socket.id);
        console.log(`(${getTime()})접속 종료 : [${deletedUser}](${socket.id})`);
        io.sockets.emit("deleteNotice", {outUser:deletedUser});
    });

    /***** 그리기 통신 *****/
    socket.on('other_userDraw', function(data){
        const x = data.x;
        const y = data.y;
        const color = data.color;
        const penWidth = data.penWidth;
        socket.broadcast.emit("other_getDraw", {x:x, y:y, color:color, penWidth:penWidth});
    });

    socket.on('other_userReadyDraw', function(data){
        const x = data.x;
        const y = data.y;
        socket.broadcast.emit("other_getReadyDraw", {x:x, y:y});
    });

    socket.on('other_canvasClean', function(){
        socket.broadcast.emit("other_doCanvasClean");
    });
    
    socket.on('other_userFill', function(data){
        socket.broadcast.emit("other_doUserFill", {color:data.color});
    });

    socket.on('turnRequire', function(data){
        const usernm = users.filter(user => user.userId == data.id);
        const id = usernm[0].userId;
        const nm = usernm[0].userNm;
        console.log(`turn require : ${nm}(${id})`);
        io.sockets.emit("responseTurn", {id:id,name:nm});
    });

});

let fileCount; 
app.get('/', function(request, response){
    fs.readdir("public/images", (err, files) => {
        fileCount = Math.floor(Math.random() * files.length);
        htmlTemplete.login(response, fileCount);
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
    console.log(fileCount);
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
}

// 나간 유저 삭제
function userDelete(userId){

    let whoDeleted;

    for(var i=0;i<users.length;i++){
        if(users[i].userId == userId){
            whoDeleted = users[i].userNm;
            users.splice(i, 1);
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