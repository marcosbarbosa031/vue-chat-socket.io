var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path')
var serveStatic = require('serve-static')

app.use(serveStatic(path.join(__dirname, 'dist')));

var users = [];

io.on('connection', function (socket) {
  socket.on('joinMain', user => {
    if ((!users.some(u => u.userId === user.userId)) && user.username !== '') {
      console.log(`${user.username} joined the chat`);
      socket.join('chatroom');

      socket.broadcast.to('chatroom').emit('chatMessage', {
        message: `${user.username} joined the chat`,
        server: true
      });

      users.push(user);

      io.to('chatroom').emit('updateUsers', users);
      
      users.forEach(u => {
        console.log('Users: ', u.username, '   Id: ', u.userId);
      })
    }
  });

  socket.on('joinPrivate', (user, sessionId) => {
    socket.join(sessionId);

    socket.broadcast.to(sessionId).emit('chatMessage', {
      message: `${user.username} joined the chat`,
      server: true
    });
  });

  socket.on('chatMessage', msg => {
    console.log(`${msg.username}: `, msg.message);
    io.to('chatroom').emit('chatMessage', msg);
  });

  // socket.on('disconnect', reason => {
  //   console.log(`User disconnected. Motive: ${reason}`);
  //   io.emit('userDisconnected');
  // })

  socket.on('leave', user => {
    console.log(`${user.username} left the chat.`);
    users.splice(users.indexOf(u => u.userId === user.userId), 1);
    socket.broadcast.to('chatroom').emit('userDisconnected', {
      user: user,
      message: `${user.username} left the chat.`,
      server: true
    });
    socket.leave('chatroom');
  })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
