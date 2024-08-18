// app.js
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/chat/:room', (req, res) => {
  const room = req.params.room;
  res.render('chat', { room });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  socket.on('joinRoom', (room) => {
    socket.join(room);
    socket.to(room).emit('message', 'A new user has joined the room');
  });

  socket.on('chatMessage', ({ room, message }) => {
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
