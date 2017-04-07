$(() => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var down = false;
  var positions = [];
  var socket = io();
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'black';
  // ctx.lineJoin = 'round';
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
      sender(positions,ctx.strokeStyle);
    }
  });
  $('button').on('click', (event) => {
    var color = event.target.id.replace('b', '').toLowerCase();
    ctx.strokeStyle = color;
  });
  socket.on('draw', (arr, color) => {
    receiver(arr, color);
  });


  function sender(arr, color) {
    socket.emit('draw', arr, color);
  }

  function receiver(arr, color) {
    var place = ctx.strokeStyle;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(arr[arr.length - 2][0], arr[arr.length - 2][1]);
    ctx.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]);
    ctx.stroke();
    ctx.strokeStyle = place;
  }
});
