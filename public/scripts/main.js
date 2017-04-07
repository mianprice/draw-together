$(() => {
  $("#custom-color").spectrum({
    color: "#000"
  });
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var down = false;
  var positions = [];
  var socket = io();
  ctx.lineWidth = 1;
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
      sender(positions,ctx.strokeStyle,ctx.lineWidth);
    }
  });
  $('#custom-color').on('change', (event) => {
    ctx.strokeStyle = $('#custom-color').spectrum("get").toHexString();
  });
  $('#custom-width').on('change', (event) => {
    ctx.lineWidth = $('#custom-width').val();
  });
  socket.on('draw', (arr, color, width) => {
    receiver(arr, color, width);
  });


  function sender(arr, color, width) {
    socket.emit('draw', arr, color, width);
  }

  function receiver(arr, color, width) {
    var widthPlace = ctx.lineWidth;
    var colorPlace = ctx.strokeStyle;
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(arr[arr.length - 2][0], arr[arr.length - 2][1]);
    ctx.lineTo(arr[arr.length - 1][0], arr[arr.length - 1][1]);
    ctx.stroke();
    ctx.strokeStyle = colorPlace;
    ctx.lineWidth = widthPlace;
  }
});
