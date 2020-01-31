
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
          <h3 id='yourName'>${name}</h3>
          <div id="chatBoard"></div>
          <div id="main">
              <input type="text" id="test">
              <button onclick="send()">전송</button>
          </div>
      </body>
      </html>
      `;
      response.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      response.end(`${templete}`);
    },
    login:function(response, _list){
        var list = _list;
        var templete = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>오늘 점심 정하고 참가해주세요</title>
            <link rel="stylesheet" href="../css/login.css">
            <script src="http://192.168.10.27:3002/socket.io/socket.io.js"></script>
            <script src="../js/login.js"></script>
        </head>
        <body>
            <div class="homeDiv">
                <h5>참여중인 유저..</h5>
                <ul>
                ${list}
                </ul>
                <h2>이름 입력만 하고 참가!</h2>
                <form action="/startChat" method="POST" accept-charset="utf-8">            
                    <input type="text" name="userName"><br>
                    <input id="joinBtn" type="submit" value="들어간다!">
                </form>
            </div>
        </body>
</html>
        `;
    }
  }