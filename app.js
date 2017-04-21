const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var collection = [];

app.use(express.static('public'));

app.get('/', (req,res,next) => {
  res.sendFile('index.html');
});

io.on('connection', (socket) => {
  console.log(`[Socket ID: ${socket.id}] has connected.`);
  collection.forEach((obj) => {
    io.sockets.connected[socket.id].emit(obj.type, obj.draw_coord, obj.brush_color, obj.brush_width);
  });
  socket.on('disconnect', () => {
    console.log(`[Socket ID: ${socket.id}] has disconnected.`);
  });
  socket.on('draw', (arr, color, width) => {
    collection.push({
      "type": 'draw',
      "draw_coord": arr,
      "brush_color": color,
      "brush_width": width
    });
    if (collection.length > 100) {
      collection.shift();
    }
    socket.broadcast.emit('draw', arr, color, width);
  });
});

http.listen(9002, () => {
  console.log('Started up.');
});
