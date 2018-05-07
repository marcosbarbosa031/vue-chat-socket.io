var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var serveStatic = require('serve-static')

app.use(serveStatic(path.join(__dirname, 'dist')))

io.on('connection', function (socket) {
  socket.on('chatMessage', function (msg) {
    console.log('message: ' + msg);
    io.emit('chatMessage', msg);
  });
});

http.listen(4113, function () {
  console.log('listening on *:4113');
});