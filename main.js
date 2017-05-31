function drawCell(cell, n, context, color) {
  var width = n/Math.pow(2, cell.length);
  var pt = cellToPt(cell, n);
  context.fillRect(pt[0], pt[1], width, width);
}

function cellToPt(cell, n) {
  var x = 0,
    y = 0;
  for (var i = 0; i < cell.length; ++i) {
    if (cell[i] == '1' || cell[i] == '4') {
      x += n / Math.pow(2, i + 1);
    }
    if (cell[i] == '3' || cell[i] == '4') {
      y += n / Math.pow(2, i + 1);
    }
  }
  return [x, y];
}

function getColourValue(i) {
  var hex = i.toString(16);
  if(hex.length<2) {
    return '0' + hex;
  } else {
    return hex;
  }
}

function applyRegToCell(reg, n, cell, context) {
  if(Math.pow(2, cell.length) >= n) {
    return;
  }
  // if the regex checks out
  if(reg.test(cell)) {
    var color = '#000000';
    //color = '#' + getColourValue(Math.round(255/cell.length)) + '0000';
    context.fillStyle = color;
    drawCell(cell, n, context, color);
  } else {
    for(var i=1; i<=4; ++i) {
      applyRegToCell(reg, n, cell + i.toString(), context);
    }
  }
}

function getContext() {
  var canvas = document.getElementById("regex_canvas");
  return canvas.getContext("2d");
}

function draw(regex_str, ctx) {
  var ctx = getContext();
  var size = ctx.canvas.width;

  // Draw background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  var regex = new RegExp(regex_str);
  applyRegToCell(regex, 1024, '', ctx);
}

var regexes = ["1", "21", "42", "13|31|24|42", "13|31|24|42", "13|31", "4[^4][^4]2", "1[124]|2[14]|4[12]|31", "[13][24]|[24][13]", "12", "12|21", "12|21|34|43", "[34]*2"]
var regex_str = regexes[Math.floor(Math.random()*regexes.length)];

function main() {
  var ctx = getContext();
  var size = Math.min(window.innerWidth, window.innerHeight);
  ctx.canvas.width = size;
  ctx.canvas.height = size;

  ctx.canvas.addEventListener("click", function(e) {
    regex_str = window.prompt("Enter regex", regex_str);
    draw(regex_str);
  })

  draw(regex_str);
}

main();
