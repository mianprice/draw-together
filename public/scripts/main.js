$(() => {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var w = $(window).outerWidth();
  var h = $(window).outerHeight();
  canvas.width = w;
  canvas.height = h;
  var down = false;
  var positions = [];
  var socket = io();
  var cursor = "brush";
  ctx.lineCap = 'round';
  ctx.lineWidth = $('#custom-width').val();
  ctx.strokeStyle = $('#custom-color').val();
  $(window).on('mousedown', (event) => {
    down = true;
    positions.push([event.offsetX, event.offsetY]);
  });
  $(window).on('mouseup', (event) => {
    down = false;
    positions = [];
  });
  $(window).on('mousemove', (event) => {
    if (down) {
      positions.push([event.offsetX, event.offsetY])
      ctx.beginPath();
      ctx.moveTo(positions[positions.length - 2][0], positions[positions.length - 2][1]);
      ctx.lineTo(positions[positions.length - 1][0], positions[positions.length - 1][1]);
      ctx.stroke();
      sender(positions,ctx.strokeStyle,ctx.lineWidth);
    }
  });
  $('#custom-color').on('change', (event) => {
    if (cursor === "brush") {
      ctx.strokeStyle = $('#custom-color').val();
    }
  });
  $('#custom-width').on('change', (event) => {
    ctx.lineWidth = $('#custom-width').val();
  });
  $('#cursor-type i').on('click', (event) => {
    cursor = event.target.id;
    $('.current').removeClass('current');
    $(event.target).addClass('current');
    if (cursor === "eraser") {
      ctx.strokeStyle = $('canvas').css('background-color');
    } else {
      ctx.strokeStyle = $('#custom-color').val();
    }
  });
  socket.on('draw', (arr, color, width) => {
    receiver(arr, color, width);
  });
  socket.on('take_img', () => {
    var img_obj = ctx.getImageData(0,0,$('#canvas').width(),$('#canvas').height());
    snapshot(img_obj);
  });
  socket.on('init', (imgObj) => {
    ctx.putImageData(imgObj);
  });

  function snapshot(imgObj) {
    socket.emit('snap', imgObj, Date.now());
  }

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
