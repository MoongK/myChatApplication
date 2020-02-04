/* <script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script> // 회사
<script src="http://192.168.0.6:3002/socket.io/socket.io.js"></script> // 집 */
module.exports = {
    html:function(response, _name, fileCount){
        const name = _name;
        var templete = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>오점머</title>
            <link rel="stylesheet" href="../css/index.css">
            <script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script>
            <script src="../js/index.js"></script>
            <script src="../js/canvas.js"></script>
            <script src="../js/todoList.js"></script>
        </head>
        <body>
            <img class='bgImage' src='../images/${fileCount}.jpg'>
            <h3 id='NameTitle'>Hello <span id='yourName'>${name}</span>!</h3>
            <div id="todoDiv">
                <h1 id='todoTitle'>오늘 할일은..</h1>
                <div id='todoInput'>
                    <input id='todoValue' type='text'>
                    <button id='todoBtn'>추가!</button>
                </div>
                <ul id='todoList'>
                </ul>
            </div>
            <div id="mainCanvasDiv">
                <canvas id='mainCanvas'></canvas>
            </div>
            <div id='Chat'>
                <div id="chatBoard"></div>
                <div id="chatInput">
                    <input type="text" id="chatInputer">
                    <button id='sender'>전송</button>
                </div>
                <div>
                    <input id="opacont" type="range" min="0" max="1" step="0.1"> 
                </div>
            </div>
        </body>
        </html>
        `;
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(`${templete}`);
    },
    login:function(response, fileCount){
        var templete = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>오늘 점심은..?</title>
            <link rel="stylesheet" href="../css/login.css">
            <script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script>
            <script src="../js/login.js"></script>
        </head>
        <body>
        <input id='fileCount' type='hidden' value='${fileCount}'>
            <div class="homeDiv">
                <h1>00:00:00</h1>
                <form id='joinForm' action="/startChat" method="POST" accept-charset="utf-8">            
                    <input id="joinValue" type="text" name="userName" maxlength='8' placeholder='이름을 입력 해주세요.'><br>
                    <input id="joinBtn" type="submit" value="들어간다!">
                </form>
            </div>
        </body>
        </html>
        `;
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'
                                 , 'bgImageCount':fileCount});
        response.end(`${templete}`);
    }
  }