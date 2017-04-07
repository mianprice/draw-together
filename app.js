const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req,res,next) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log(`[Socket ID: ${socket.id}] has connected.`);
  socket.on('disconnect', () => {
    console.log(`[Socket ID: ${socket.id}] has disconnected.`);
  });
  socket.on('draw', (arr, color, width) => {
    socket.broadcast.emit('draw', arr, color, width);
  });
});

http.listen(3000, () => {
  console.log('Started up.');
});
