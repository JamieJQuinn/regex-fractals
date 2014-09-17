/**
 * Created by gurugeek on 14/09/14.
 */

function UserInput(regIn, nIn) {
    this.reg = regIn;
    this.n = nIn;
}

function Pixel() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
}

function getUserInput() {
    var n = window.prompt("How big is the image, in pixels? (Make it a power of 2. Fur die Kinder");
    var regInput = window.prompt("What is the regex expression?");

    return new UserInput(regInput, n);;
}

function dealWithInput(userInput, canvasNode) {
    canvasNode.height = userInput.n;
    canvasNode.width = userInput.n;
}

function generateSquareArray(n) {
    if(n>Math.pow(2, 20)) {
        return;
    }
    var array = new Array(n);
    for(var i=0; i<n; ++i) {
        array[i] = new Array(n);
    }

    return array;
}

function fillArrayWithBlack(n, array) {
    for(var i=0; i<n; i++) {
        for(var j=0; j<n; ++j) {
            array[i][j] = new Pixel();
        }
    }
}

function generateBlackArray (n) {
    var array = generateSquareArray(n);
    return fillArrayWithBlack(n, array);
}

function drawPixel(context, p, x, y) {
    context.strokeStyle = '#' + p.r.toString(16) + p.g.toString(16) + p.b.toString(16);
    context.strokeRect(x, y, 1, 1);
}

function drawArray(context, array) {
    for(var i=0; i<array.length; ++i) {
        for(var j=0; j<array.length; j++) {
            drawPixel(context, array[i], i, j);
        }
    }
}

function drawCell(cell, n, context, color) {
    var width = n/Math.pow(2, cell.length);
    var pt = cellToPt(cell, n);
    context.fillStyle = color;
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

function applyRegToCell(reg, n, cell, context) {
    if(Math.pow(2, cell.length) >= n) {
        return;
    }
    // if the regex checks out
    if(reg.test(cell)) {
        drawCell(cell, n, context, '#ffffff');
        return;
    } else {
        for(var i=1; i<=4; ++i) {
            applyRegToCell(reg, n, cell + i.toString(), context);
        }
    }

}

function main() {
    var element = document.getElementById("regex");
    var context = element.getContext("2d");
    var userInput = getUserInput();
    dealWithInput(userInput, element);
    //var pixelArray = generateBlackArray(userInput.n);

    var patt = new RegExp(userInput.reg);
    context.fillStyle = '#000000';
    context.fillRect(0, 0, userInput.n, userInput.n);
    applyRegToCell(patt, userInput.n, '', context);
    //drawArray(context, pixelArray);
}

main();