const express = require('express');
const app = express();
const socket = require('socket.io');
const http = require('http');
const server = http.createServer(app);
// const server = http.Server(app);
const io = socket(server);
const fs = require('fs');

app.use('/css', express.static('./static/css'));
app.use('/js', express.static('.static/js'));

io.sockets.on('connection', function(socket){

    console.log(`(${getTime()})유저 접속 됨`);

    socket.on('send', function(data){
        console.log(`(${getTime()}) 전달된 메시지 : ${data.msg}`);
    
        io.sockets.emit("update", data.msg);
        // socket.emit('update', data.msg);
    });

    socket.on("newUser", function(data){
        console.log(`(${getTime()}) ${data} 접속!`);
    });


    socket.on('disconnect', function(){
        console.log(`(${getTime()})접속 종료`);
    });
});

app.get('/', function(request, response){
    fs.readFile('./static/html/index.html', function(err, data){
        if(err){
            response.send('에러발생');
        }
        else{
            response.writeHead(200, {'Content-Type':'text/html'});
            response.write(data);
            response.end();
            /* response.send(data); */
        }
    });
});

server.listen("3002", function(){
    console.log(`(${getTime()}) 서버 실행 중...`);
});

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