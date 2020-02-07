const companyPath = `<script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script>`; // 회사
const homePath = `<script src="http://192.168.0.6:3002/socket.io/socket.io.js"></script>` // 집

module.exports = {
    html:function(response, _name, fileCount){
        const name = _name;
        var templete = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>오점머</title>
            ${companyPath}
            <script src="../js/main.js"></script>
            <script src="../js/chat.js"></script>
            <script src="../js/canvas.js"></script>
            <script src="../js/todoList.js"></script>
            <link rel="stylesheet" href="../css/main.css">
            <link rel="stylesheet" href="../css/chat.css">
            <link rel="stylesheet" href="../css/canvas.css">
            <link rel="stylesheet" href="../css/todoList.css">
        </head>
        <body>
            <input id='bgInit' type='hidden' value='${fileCount}'>
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
                <br>
                <div id='paletteDiv' class='bottomMenu'>
                    <div class="palette_color" style="background-color:black;"></div>
                    <div class="palette_color" style="background-color:white"></div>
                    <div class="palette_color" style="background-color:#FF3B30"></div><br>
                    <div class="palette_color" style="background-color:#FF9500"></div>
                    <div class="palette_color" style="background-color:#FFCC00"></div>
                    <div class="palette_color" style="background-color:#4CD963"></div><br>
                    <div class="palette_color" style="background-color:#5AC8FA"></div>
                    <div class="palette_color" style="background-color:#0579FF"></div>
                    <div class="palette_color" style="background-color:#5856D6"></div>
                </div>
                <div id='paletteModeDiv' class='bottomMenu'>
                    <input id='drawMode' type='button' value='Draw'>
                    <input id='canvasEraser' class='drawSubMode' type='button' value='Eraser'>
                    <input id='canvasClean' class='drawSubMode' type='button' value='Clean'>
                </div>
                <div id='penWidthDiv' class='bottomMenu'>
                    <div id="currentColor"></div>
                    <input id='penWidth'class='penWidth' type='range' min='1' max='10' step='0.1' orient='vertical'>
                </div>
                <div id='turnInfoDiv' class='bottomMenu'>
                    <div id='turnSet' class='canvas_sideBarEle' disabled='disabled'>그리기 신청!</div>
                    <div id='DrawingUser' class='canvas_sideBarEle'>wait..</div>
                </div>
            </div>
            <div id='Chat'>
            <img src='../icons/users.png' id='usersBtn'>
            <div id='userlist' class='userlist'></div>
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
            ${companyPath}
            <script src="../js/login.js"></script>
            <link rel="stylesheet" href="../css/login.css">
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