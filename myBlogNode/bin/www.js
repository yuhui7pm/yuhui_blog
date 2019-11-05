const http = require('http');
const PORT = 8002;
const serverHandler = require('../app');
const server = http.createServer(serverHandler);//该函数用来创建一个HTTP服务器，并将 requestListener 作为 request 事件的监听函数。
server.listen(PORT);//监听8002端口。