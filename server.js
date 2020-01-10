var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var serveStatic = require('serve-static')

app.use(serveStatic(path.join(__dirname, 'dist')));

var users = [];

io.on('connection', function (socket) {
  socket.on('join', user => {
    if (!users.some(u => u.userId === user.userId)) {
      console.log(`${user.username} joined the chat`)
      socket.broadcast.emit('chatMessage', {
        message: `${user.username} joined the chat`,
        server: true
      });
      users.push(user);
      
      users.forEach(u => {
        console.log('Users: ', u.username, '   Id: ', u.userId);
      })
    }
  });

  socket.on('chatMessage', msg => {
    console.log(`${msg.username}: `, msg.message);
    io.emit('chatMessage', msg);
  });

  // socket.on('disconnect', reason => {
  //   console.log(`User disconnected. Motive: ${reason}`);
  //   io.emit('userDisconnected');
  // })

  socket.on('leave', user => {
    console.log(`${user.username} left the chat.`);
    socket.broadcast.emit('userDisconnected', {
      message: `${user.username} left the chat.`,
      server: true
    })
  })
});

http.listen(4113, function () {
  console.log('listening on *:4113');
});
