
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
    }
  }