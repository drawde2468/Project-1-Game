let difficulty; //number of tiles per axis, hard coded for now, will ultimately be determined by user selection
let myImage;
let imageArr = ["http://gdargaud.net/Photo/800/20051224_0255_MtCookRoad.jpg"];
let randomImgNum = 0;
let tileWidth;
let tileHeight;
let tilesArr = []; //array of objects containing position of x and position of y
let shuffledArr = [];
let selectedTile;

window.onload = function () {
    document.getElementById("easy").onclick = function () {
        tilesArr = [];
        shuffledArr = [];
        difficulty = 3;
        selectedTile = difficulty * difficulty - 1;
        createImg();
    };
    document.getElementById("med").onclick = function () {
        tilesArr = [];
        shuffledArr = [];
        difficulty = 4;
        selectedTile = difficulty * difficulty - 1;
        createImg();
    };
    document.getElementById("hard").onclick = function () {
        tilesArr = [];
        shuffledArr = [];
        difficulty = 5;
        selectedTile = difficulty * difficulty - 1;
        createImg();
    };
};

document.onkeydown = function (e) {
    if (e.keyCode === 37) { //left 37
        swapArr(shuffledArr, selectedTile, selectedTile - 1); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile - 1;
        drawCanvasTest();
    } else if (e.keyCode === 39) { //right 39
        swapArr(shuffledArr, selectedTile, selectedTile + 1); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile + 1;
        drawCanvasTest();
    } else if (e.keyCode === 38) { //up 38
        swapArr(shuffledArr, selectedTile, selectedTile - difficulty); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile - difficulty;
        drawCanvasTest();
    } else if (e.keyCode === 40) { //down 40
        swapArr(shuffledArr, selectedTile, selectedTile + difficulty); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile + difficulty;
        drawCanvasTest();
    }
}

function createImg() {
    myImage = new Image();
    myImage.src = imageArr[randomImgNum]; //will create an array of image src to select at random in future
    myImage.onload = function () {
        //setting the size of the tile by dividing the width or height by the total number of tiles in that axis.
        tileWidth = Math.floor(myImage.width / difficulty);
        tileHeight = Math.floor(myImage.height / difficulty);
        //calls function to draw the initial canvas
        drawCanvas();
        //calls function to draw the test canvas that is created using the tilesArr.
        drawCanvasTest();
    };
}

function drawCanvas() {
    let canvas = document.getElementById("game-area");
    let ctx = canvas.getContext("2d");
    let currentX = 0;
    let currentY = 0;

    //this for loop is drawing the tiles on the y axis
    for (i = 0; i < difficulty; i++) {
        ctx.drawImage(
            myImage,
            currentX,
            currentY,
            tileWidth,
            tileHeight,
            currentX,
            currentY,
            tileWidth,
            tileHeight
        );
        //this for loop is drawing the x axis tiles
        for (j = 0; j < difficulty; j++) {
            ctx.drawImage(
                myImage,
                currentX,
                currentY,
                tileWidth,
                tileHeight,
                currentX,
                currentY,
                tileWidth,
                tileHeight
            );
            //pushes the position into the tilesArr
            tilesArr.push({
                positionX: currentX,
                positionY: currentY
            });
            shuffledArr.push({
                positionX: currentX,
                positionY: currentY
            });

            //draws stroke line around tiles
            ctx.strokeRect(currentX, currentY, tileWidth, tileHeight);
            console.log("CURRENT X", currentX);
            console.log("CURRENT Y", currentY);
            //moving along the x axis
            currentX += tileWidth;
            //this if statement ends the increase of the x axis and moves the loop into the next y axis pos.
            if (currentX === difficulty * tileWidth) {
                currentX = 0;
                currentY += tileHeight;
            }
        }
    }
    shuffledArr = shuffle(shuffledArr);
    console.log(tilesArr); //for testing
}

function drawCanvasTest() {
    let canvas = document.getElementById("game-test");
    let ctx = canvas.getContext("2d");


    for (i = 0; i < difficulty * difficulty; i++) {
        ctx.drawImage(
            myImage,
            shuffledArr[i].positionX,
            shuffledArr[i].positionY,
            tileWidth,
            tileHeight,
            tilesArr[i].positionX,
            tilesArr[i].positionY,
            tileWidth,
            tileHeight
        );
        ctx.strokeRect(
            tilesArr[i].positionX,
            tilesArr[i].positionY,
            tileWidth,
            tileHeight
        );
    }
    console.log("selected tile: ", selectedTile);
    ctx.beginPath();
    ctx.rect(tilesArr[selectedTile].positionX, tilesArr[selectedTile].positionY, tileWidth, tileHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.strokeRect(
        tilesArr[selectedTile].positionX,
        tilesArr[selectedTile].positionY,
        tileWidth,
        tileHeight
    );

    console.log(shuffledArr); //for testing
}

function shuffle(array) {
    let m = array.length,
        t,
        i;
    // While there remain elements to shuffle…
    while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function swapArr(arr, index1, index2) {
    let newArr = arr;
    let tempVal = newArr[index2];
    arr[index2] = arr[index1];
    arr[index1] = tempVal;
    return newArr;
}