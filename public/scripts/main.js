$(() => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var down = false;
  var positions = [];
  var socket = io();
  ctx.lineWidth = 5;
  $(window).on('mousedown', (event) => {
    down = true;
    positions.push([event.clientX, event.clientY]);
  });
  $(window).on('mouseup', (event) => {
    down = false;
    positions = [];
  });
  $('canvas').on('mousemove', (event) => {
    if (down) {
      positions.push([event.clientX, event.clientY])
      ctx.beginPath();
      ctx.moveTo(positions[positions.length - 2][0], positions[positions.length - 2][1]);
      ctx.lineTo(positions[positions.length - 1][0], positions[positions.length - 1][1]);
      ctx.stroke();
      sender(positions);
    }
  });
  socket.on('draw', (arr) => {
    receiver(arr);
  });


  function sender(arr) {
    socket.emit('draw', positions);
  }

  function receiver(arr) {
    ctx.beginPath();
    ctx.moveTo(arr[arr.length - 2][0], arr[arr.length - 2][1]);
    ctx.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]);
    ctx.stroke();
  }
});
