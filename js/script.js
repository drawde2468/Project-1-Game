let difficulty = 3;
let myImage;
let tileWidth;
let tileHeight;
let testTile;
let imgArr = [];

window.onload = function() {
  createImg();
};

function createImg() {
  myImage = new Image();
  myImage.src = "http://gdargaud.net/Photo/800/20051224_0255_MtCookRoad.jpg";
  document.body.appendChild(myImage); //temp for testing
  myImage.onload = function() {
    tileWidth = Math.floor(myImage.width / difficulty);
    tileHeight = Math.floor(myImage.height / difficulty);
    drawCanvas();
  };
}

function drawCanvas() {
  let canvas = document.getElementById("game-area");
  let ctx = canvas.getContext("2d");

  ctx.drawImage(
    myImage,
    0,
    0,
    tileWidth,
    tileHeight,
    0,
    0,
    tileWidth,
    tileHeight
  );
}
