let difficulty = 3;
let myImage;
let tileWidth;
let tileHeight;
let tilesArr = [];

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
    drawCanvasTest();
  };
}

function drawCanvas() {
  let canvas = document.getElementById("game-area");
  let ctx = canvas.getContext("2d");
  let currentX = 0;
  let currentY = 0;

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
      tilesArr.push({ positionX: currentX, positionY: currentY });

      ctx.strokeRect(currentX, currentY, tileWidth, tileHeight);
      console.log("CURRENT X", currentX);
      console.log("CURRENT Y", currentY);
      currentX += tileWidth;

      if (currentX === difficulty * tileWidth) {
        currentX = 0;
        currentY += tileHeight;
      }
    }
  }
  console.log(tilesArr);
}

function drawCanvasTest() {
  let canvas = document.getElementById("game-test");
  let ctx = canvas.getContext("2d");

  for (i = 0; i < difficulty * difficulty; i++) {
    ctx.drawImage(
      myImage,
      tilesArr[i].positionX,
      tilesArr[i].positionY,
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
  console.log(tilesArr);
}
