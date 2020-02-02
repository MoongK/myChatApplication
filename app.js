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

let users = new Array();
io.sockets.on('connection', function(socket){

    console.log(`(${getTime()})유저 접속 됨`);

    socket.on('send', function(data){
        console.log(`(${getTime()}) 전달된 메시지 : ${data.msg} , 유저 : ${data.user}`);
    
        io.sockets.emit("update", {userName:data.user, msg:data.msg});
    });

    socket.on("newUser", function(data){
        console.log(`(${getTime()}) ${data.user} 접속!`);
        userPlus(socket.id);
        console.log(`현재 users : ${users}`);
    });

    socket.on("JoiningUser", function(data){
        console.log(`접속 중 : ${data}`);
    });


    socket.on('disconnect', function(){
        console.log(`(${getTime()})접속 종료`);
        io.sockets.emit("userChk");
        console.log(`나간 사람 : ${socket.id}`);
        userDelete(socket.id);

    });

});

app.get('/', function(request, response){
    fs.readFile('./public/html/login.html', function(err, data){
        if(err){
            response.send('에러발생');
        }
        else{
            response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
            response.write(data);
            response.end();
        }
    });
});

app.post('/startChat', function(request, response){
    htmlTemplete.html(response, request.body.userName);
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
function userPlus(user){
    users.push(user);
}

// 남은 유저 셋팅
function userDelete(user){
    users.pop(user);
    console.log(users);
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