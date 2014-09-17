/**
 * Created by gurugeek on 15/09/14.
 */

function UserInput(regIn, nIn) {
    this.reg = regIn;
    this.n = nIn;
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
        color = '#' + getColourValue(Math.round(255/cell.length)) + '0000';
        console.log((Math.pow(2, cell.length)/n)*255);
        context.fillStyle = color;
        drawCell(cell, n, context, color);
    } else {
        for(var i=1; i<=4; ++i) {
            applyRegToCell(reg, n, cell + i.toString(), context);
        }
    }

}

function main() {
    // Get Canvas context
    var element = document.getElementById("regex");
    var context = element.getContext("2d");

    // Get user in
    var userInput = getUserInput();
    dealWithInput(userInput, element);

    // Make Regex pattern
    var patt = new RegExp(userInput.reg);

    // Draw background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, userInput.n, userInput.n);

    // Start recursion with top level '' cell
    applyRegToCell(patt, userInput.n, '', context);
}

main();