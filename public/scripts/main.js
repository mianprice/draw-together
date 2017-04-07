$(() => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var down = false;
  var dc = [];
  var socket = io();
  $('canvas').on('mousedown', (event) => {
    down = true;
    dc = [event.clientX, event.clientY];
  });
  $('canvas').on('mouseup', (event) => {
    down = false;
    dc = [];
  });
  $('canvas').on('mousemove', (event) => {
    if (down) {
      ctx.fillStyle = 'black';
      ctx.fillRect(event.clientX,event.clientY,5,5);
      sender(event.clientX,event.clientY);
    }
  });
  socket.on('draw', (arr) => {
    receiver(arr[0], arr[1]);
  });


  function sender(x,y) {
    socket.emit('draw', [x,y]);
  }

  function receiver(x,y) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x,y,5,5);
  }
});
