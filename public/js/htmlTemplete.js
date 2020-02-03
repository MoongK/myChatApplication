/* <script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script> // 회사
<script src="http://192.168.0.6:3002/socket.io/socket.io.js"></script> // 집 */
module.exports = {
    html:function(response, _name){
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
        </head>
        <body>
            <h3 id='yourName'>Hello ${name}!</h3>
            <div id="todoList">
                <h1 id='todoTitle'>TodoList..<h1>
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
    login:function(response){
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
            <div class="homeDiv">
                <h2>이름 입력만 하고 참가!</h2>
                <form action="/startChat" method="POST" accept-charset="utf-8">            
                    <input type="text" name="userName"><br>
                    <input id="joinBtn" type="submit" value="들어간다!">
                </form>
            </div>
        </body>
        </html>
        `;
        response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
        response.end(`${templete}`);
    }
  }