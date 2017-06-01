function drawCell(cell, n, context) {
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

function applyRegToCell(reg, cell, context, colour) {
  var n = context.canvas.width;
  if(Math.pow(2, cell.length) >= n) {
    return;
  }
  // if the regex checks out
  if(reg.test(cell)) {
    //color = '#' + getColourValue(Math.round(255/cell.length)) + '0000';
    context.fillStyle = colour;
    drawCell(cell, n, context);
  } else {
    for(var i=1; i<=4; ++i) {
      applyRegToCell(reg, cell + i.toString(), context, colour);
    }
  }
}

function getContext() {
  var canvas = document.getElementById("regex_canvas");
  return canvas.getContext("2d");
}

function draw(regex_str, drawing_ctx, colour, bg_colour) {
  var ctx = getContext();
  var size = ctx.canvas.width;
  var pow2size = drawing_ctx.canvas.width;

  // Draw background
  drawing_ctx.fillStyle = bg_colour;
  drawing_ctx.fillRect(0, 0, pow2size, pow2size);
  document.body.style.backgroundColor = colour;

  var regex = new RegExp(regex_str);

  // Draw to power of 2 sized canvas
  applyRegToCell(regex, '', drawing_ctx, colour);

  // Draw that canvas to actual screen
  ctx.drawImage(drawing_ctx.canvas, 0, 0, size, size);
}


function main() {
  var regexes = ["1", "21", "42", "[13][24][13]", "12|13|14", "[13][24]", "13|31|24|42", "13|31|24|42", "13|31", "4[^4][^4]2", "1[124]|2[14]|4[12]|31", "[13][24]|[24][13]", "12", "12|21", "12|21|34|43", "[34]+2"]
  var regex_str = regexes[Math.floor(Math.random()*regexes.length)];

  var ctx = getContext();
  var size = Math.min(window.innerWidth, window.innerHeight) - 50;
  ctx.canvas.width = size;
  ctx.canvas.height = size;
  ctx.canvas.style.width = size.toString() + "px";
  ctx.canvas.style.height = size.toString() + "px";

  var drawing_canvas = document.createElement('canvas');
  var drawing_ctx = drawing_canvas.getContext("2d");
  var pow2size = Math.pow(2, Math.ceil(Math.log2(size)));
  drawing_canvas.width = pow2size;
  drawing_canvas.height = pow2size;

  var colour = "#53828d";
  var bg_colour = "#a19a9a";

  draw(regex_str, drawing_ctx, colour, bg_colour);

  QuickSettings.useExtStyleSheet();
  var settings = QuickSettings.create(5, 5, "Settings ('s' to hide)");
  settings.addText("Regex", regex_str, function(txt) {regex_str = txt; draw(regex_str, drawing_ctx, colour, bg_colour)});
  settings.addColor("BG Colour", colour, function(c) {colour = c; draw(regex_str, drawing_ctx, colour, bg_colour)});
  settings.addColor("Colour", bg_colour, function(c) {bg_colour = c; draw(regex_str, drawing_ctx, colour, bg_colour)});
  settings.setKey("s");
}

main();
