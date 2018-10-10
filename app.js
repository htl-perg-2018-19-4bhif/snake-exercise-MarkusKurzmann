var ansi = require('ansi');
var keypress = require('keypress');

cursor = ansi(process.stdout)

process.stdout.write('\x1Bc');
process.stdout.write('\x1B[?25l');

width = 40;
height = 20;
speed = 1;

curPosX = 10;
curPosY = 10;
dirX = 0;
dirY = 1;
points = 1;

applePosX = 15;
applePosY = 15;

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
 
// listen for the "keypress" event
process.stdin.on('keypress', inputHandler);
 
process.stdin.setRawMode(true);
process.stdin.resume();

//draw the field
drawMatrix(1,1,width);
cursor.bg.grey();
lineHorizontal(1, 1, width);
lineHorizontal(1, height, width);
lineVertical(1, 1, height);
lineVertical(width, 1, height);
cursor.bg.reset();

//start the game
drawApple();
game();


//---Functions---//

function game(){
    cursor.goto(width + 5, 1).write('Points: '+points);
    deletePoint(curPosX, curPosY);
    curPosX = curPosX + dirX;
    curPosY = curPosY + dirY;

    if(curPosX < 2 || curPosX > width-1 || curPosY < 2 || curPosY > height-1){
        stopGame();
    }
    if(curPosX == applePosX && curPosY == applePosY){
        points += 1;
        speed += 1;
        drawApple();
    }
    cursor.bg.green();
    drawPoint(curPosX,curPosY);
    cursor.bg.reset();
    setTimeout(game, 1000 / speed);
}

function drawPoint(column, row){
    cursor.goto(column, row).write(' ')
}

function deletePoint(column, row){
    cursor.bg.blue();
    cursor.goto(column, row).write(' ')
    cursor.bg.reset();
}

function drawApple() {
    applePosX = Math.ceil(Math.random() * (width - 3)) + 2;
    applePosY = Math.ceil(Math.random() * (height - 4)) + 2;

    cursor.bg.hex('#660000');
    drawPoint(applePosX, applePosY);
    cursor.bg.reset();
}

function lineHorizontal(column, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(column + i, row).write(' ');
    }
}

function lineVertical(column, row, length) {
    for (var i = 0; i < length; i++) {
        cursor.goto(column, row + i).write(' ');
    }
}

function drawMatrix(column, row, fieldLength){
    cursor.bg.blue();
    for(var i = 0; i < fieldLength; i++){
        for(var j = 0; j < fieldLength*2.5; j++){
            cursor.goto(i,j).write(' ');
        }
    }
}

function stopGame(){
    cursor.reset();
    cursor.bg.reset();
    process.stdout.write('\x1B[?25h');
    cursor.bg.black();
    cursor.goto(15, 15).write("Game Over!");
    cursor.bg.reset();
}

function exitGame(){
    process.exit();
}

function inputHandler(chunk,key) {
    if (key.name == 'q') {
        exitGame();
    } else if (key.name == 'right') {
        dirX = 1;
        dirY = 0;
    } else if (key.name == 'left') {
        dirX = -1;
        dirY = 0;
    } else if (key.name == 'up') {
        dirY = -1;
        dirX = 0;
    } else if (key.name == 'down') {
        dirY = 1;
        dirX = 0;
    }
}