let difficulty; //number of tiles per axis, hard coded for now, will ultimately be determined by user selection
let myImage;
let randomImgNum = 0;
let tileWidth;
let tileHeight;
let tilesArr = []; //array of objects containing position of x and position of y
let shuffledArr = [];
let selectedTile;
let moves = -100;
let gridImage;
let shuffledImg;
let shuffleButton;
let imageArr;
let firstLoad = true;

window.onload = function() {
  gridImage = document.getElementById("original-img");
  shuffledImg = document.getElementById("play-area");
  shuffleButton = document.getElementById("start");
  instructions();
  randomImgGenerator();
  showHideBtn();

  document.onkeydown = function(e) {
    if (gridImage.style.display === "none") {
      executeMove(e.keyCode);
    }
  };

  document.getElementById("normal").onclick = function() {
    difficulty = 3;
    resetGame();
    createImg();
  };
  document.getElementById("hard").onclick = function() {
    difficulty = 4;
    resetGame();
    createImg();
  };
  document.getElementById("insane").onclick = function() {
    difficulty = 5;
    resetGame();
    createImg();
  };
  document.getElementById("start").onclick = function() {
    toggleCanvas();
  };
  document.getElementById("reset").onclick = function() {
    shuffleButton.value = "Start";
    gridImage.style.display = "inline";
    shuffledImg.style.display = "none";
    window.onload();
  };
};

function executeMove(keyCode) {
  if (keyCode === 37 || keyCode === 39 || keyCode === 38 || keyCode === 40) {
    countMoves();
  }
  switch (keyCode) {
    case 37:
      if (selectedTile % difficulty === 0) {
        swapArr(shuffledArr, selectedTile, selectedTile + (difficulty - 1));
        selectedTile = selectedTile + (difficulty - 1);
        drawGameCanvas();
      } else {
        swapArr(shuffledArr, selectedTile, selectedTile - 1); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile - 1;
        drawGameCanvas();
      }
      break;
    case 39:
      if ((selectedTile + 1) % difficulty === 0) {
        swapArr(shuffledArr, selectedTile, selectedTile - (difficulty - 1));
        selectedTile = selectedTile - (difficulty - 1);
        drawGameCanvas();
      } else {
        swapArr(shuffledArr, selectedTile, selectedTile + 1); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile + 1;
        drawGameCanvas();
      }
      break;
    case 38:
      if (selectedTile - difficulty < 0) {
        swapArr(
          shuffledArr,
          selectedTile,
          selectedTile + difficulty * (difficulty - 1)
        );
        selectedTile = selectedTile + difficulty * (difficulty - 1);
        drawGameCanvas();
      } else {
        swapArr(shuffledArr, selectedTile, selectedTile - difficulty); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile - difficulty;
        drawGameCanvas();
      }
      break;
    case 40:
      if (selectedTile + difficulty >= difficulty * difficulty) {
        swapArr(
          shuffledArr,
          selectedTile,
          selectedTile - difficulty * (difficulty - 1)
        );
        selectedTile = selectedTile - difficulty * (difficulty - 1);
        drawGameCanvas();
      } else {
        swapArr(shuffledArr, selectedTile, selectedTile + difficulty); //calling the function that swaps the index of the selected tile
        selectedTile = selectedTile + difficulty;
        drawGameCanvas();
      }
      break;
  }
}

function createImg() {
  myImage = new Image();
  myImage.src = imageArr[randomImgNum]; //will create an array of image src to select at random in future
  myImage.onload = function() {
    //setting the size of the tile by dividing the width or height by the total number of tiles in that axis.
    tileWidth = Math.floor(myImage.width / difficulty);
    tileHeight = Math.floor(myImage.height / difficulty);
    //calls function to draw the initial canvas
    drawCanvas();
    //calls function to draw the test canvas that is created using the tilesArr.
    drawGameCanvas();
  };
}

function drawCanvas() {
  let canvas = document.getElementById("original-img");
  let ctx = canvas.getContext("2d");
  let currentX = 0;
  let currentY = 0;
  let whiteX = tileWidth * (difficulty - 1);
  let whiteY = tileHeight * (difficulty - 1);

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
      //   console.log("CURRENT X", currentX);
      //   console.log("CURRENT Y", currentY);
      //moving along the x axis
      currentX += tileWidth;
      //this if statement ends the increase of the x axis and moves the loop into the next y axis pos.
      if (currentX === difficulty * tileWidth) {
        currentX = 0;
        currentY += tileHeight;
      }
    }
  }
  //shuffledArr = shuffle(shuffledArr);

  ctx.beginPath();
  ctx.rect(whiteX, whiteY, tileWidth, tileHeight);
  ctx.fillStyle = "#ad343e";
  ctx.fill();
  ctx.strokeRect(whiteX, whiteY, tileWidth, tileHeight);

  shuffleMove();
  // console.log(tilesArr); //for testing
}

function drawGameCanvas() {
  let canvas = document.getElementById("play-area");
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
  // console.log("selected tile: ", selectedTile);
  ctx.beginPath();
  ctx.rect(
    tilesArr[selectedTile].positionX,
    tilesArr[selectedTile].positionY,
    tileWidth,
    tileHeight
  );
  ctx.fillStyle = "#ad343e";
  ctx.fill();
  ctx.strokeRect(
    tilesArr[selectedTile].positionX,
    tilesArr[selectedTile].positionY,
    tileWidth,
    tileHeight
  );
  if (checkWinTest() === true && moves > 0) {
    console.log("you win");
  }
  // console.log(shuffledArr); //for testing
}

function swapArr(arr, index1, index2) {
  let newArr = arr;
  let tempVal = newArr[index2];
  arr[index2] = arr[index1];
  arr[index1] = tempVal;
  return newArr;
}

function shuffleMove() {
  for (let i = 0; i < 100; i++) {
    x = Math.floor(Math.random() * 4) + 37;
    window.executeMove(x);
  }
}

function checkWinTest() {
  let win = false;
  let winCounter = 0;

  for (i = 0; i < tilesArr.length; i++) {
    if (
      tilesArr[i].positionX === shuffledArr[i].positionX &&
      tilesArr[i].positionY === shuffledArr[i].positionY
    ) {
      winCounter++;
    }
  }
  if (winCounter === tilesArr.length) {
    win = true;
  }
  return win;
}

function countMoves() {
  x = document.getElementById("moves");
  moves++;
  x.innerText = moves;
  //   console.log(moves);
}

function resetGame() {
  moves = -100;
  tilesArr = [];
  shuffledArr = [];
  selectedTile = difficulty * difficulty - 1;
  showHideBtn();
}

function toggleCanvas() {
  if (gridImage.style.display === "none") {
    gridImage.style.display = "inline";
    shuffledImg.style.display = "none";
    shuffleButton.value = "Continue";
  } else {
    gridImage.style.display = "none";
    shuffledImg.style.display = "inline";
    shuffleButton.value = "Show Original";
  }
}

function showHideBtn() {
  if (document.getElementById("in-game-btn").style.display === "none") {
    document.getElementById("mode").style.display = "none";
    document.getElementById("in-game-btn").style.display = "block";
  } else {
    document.getElementById("mode").style.display = "block";
    document.getElementById("in-game-btn").style.display = "none";
  }
}

function randomImgGenerator() {
  imageArr = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Raigad_Fort_%28nature%29.jpg/800px-Raigad_Fort_%28nature%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Czo%C5%82o_Turbacza.jpg/800px-Czo%C5%82o_Turbacza.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/c/c6/BBGJapaneseHillPondGarden.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/2012-04-27_07-19-41-nature.jpg/800px-2012-04-27_07-19-41-nature.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/KHARKHARA_DAM_WATERFALL_01.jpg/800px-KHARKHARA_DAM_WATERFALL_01.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Iguana_de_Venezuela.jpg/800px-Iguana_de_Venezuela.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Australia_July_2008_%282687557669%29.jpg/800px-Australia_July_2008_%282687557669%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/0/0f/Natural-heritage-bhutan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Cachoeira_no_Rio_Sucuri%C3%BA_-_Costa_Rica-MS_02.jpg/800px-Cachoeira_no_Rio_Sucuri%C3%BA_-_Costa_Rica-MS_02.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Crete_Senesi_Sunset_-_Saltafabbro%2C_Asciano%2C_Siena%2C_Italy_-_July_4%2C_2010_02.jpg/800px-Crete_Senesi_Sunset_-_Saltafabbro%2C_Asciano%2C_Siena%2C_Italy_-_July_4%2C_2010_02.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/8/89/Moneglia_%28GE%29%2C_Italy.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/%D8%B9%D8%B2%D8%A8%D9%87_%D9%81%D8%B1%D8%AD%D8%A7%D8%AA-%D9%88%D8%A7%D8%AF%D9%8A_%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D9%86%D8%8C_Faiyum_Governorate%2C_Egypt_-_panoramio.jpg/800px-%D8%B9%D8%B2%D8%A8%D9%87_%D9%81%D8%B1%D8%AD%D8%A7%D8%AA-%D9%88%D8%A7%D8%AF%D9%8A_%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D9%86%D8%8C_Faiyum_Governorate%2C_Egypt_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Aare_-_Brugg_IMG_6745.jpg/800px-Aare_-_Brugg_IMG_6745.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Beach_pier_Holbox_island_Mexico_Strand_Pier_%2820179671845%29.jpg/800px-Beach_pier_Holbox_island_Mexico_Strand_Pier_%2820179671845%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Nationalparc_Sian_Ka%C2%B4an_Tulum_%2821201025028%29.jpg/800px-Nationalparc_Sian_Ka%C2%B4an_Tulum_%2821201025028%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pleasing_Fungus_Beetle_%2814379850456%29.jpg/800px-Pleasing_Fungus_Beetle_%2814379850456%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/b/b9/Culebra_Ciega_-_panoramio.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Planten_un_Blomen_im_Fr%C3%BChling.jpg/800px-Planten_un_Blomen_im_Fr%C3%BChling.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Bloody-nosed_beetle_-_Tatzenk%C3%A4fer_%28Chrysomelidae_Trimarcha_tenebricosa%29_%286979054918%29.jpg/800px-Bloody-nosed_beetle_-_Tatzenk%C3%A4fer_%28Chrysomelidae_Trimarcha_tenebricosa%29_%286979054918%29.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Squirrel_detail_Peacocks_Met_27.250.1.jpg/800px-Squirrel_detail_Peacocks_Met_27.250.1.jpg"
  ];
  randomImgNum = Math.floor(Math.random() * imageArr.length);
}

function instructions() {
  if (firstLoad === true) {
    let ctx = document.getElementById("original-img").getContext("2d");
    ctx.font = "22px Helvetica";

    ctx.textAlign = "center";
    ctx.fillText("Welcome to Tile Slide.", 399, 50);
    ctx.textAlign = "center";
    ctx.fillText("Choose your desired difficulty.", 399, 100);
    ctx.textAlign = "center";
    ctx.fillText('Click "Start" to shuffle the board and begin.', 399, 150);
    ctx.textAlign = "center";
    ctx.fillText(
      "Use the arrows keys to swap the colored tile with the adjacent tiles.",
      399,
      200
    );
    ctx.textAlign = "center";
    ctx.fillText(
      'You will need to "Think Outside of the Box" to win.',
      399,
      250
    );
    ctx.textAlign = "center";
    ctx.fillText(
      "Seriously though, you can't win without moving the tile out of the grid.",
      399,
      300
    );
    ctx.textAlign = "center";
    ctx.fillText("Like it's probably impossible to win without it.", 399, 350);
    ctx.textAlign = "center";
    ctx.fillText(
      'Use "Show Original/Continue" to swap between the original and shuffled image.',
      399,
      400
    );
    ctx.textAlign = "center";
    ctx.fillText(
      '"Restart Game" will restart the game with a new image.',
      399,
      450
    );
    ctx.textAlign = "center";
    ctx.fillText("When the time expires you've lost the game.", 399, 500);
    ctx.textAlign = "center";
    ctx.fillText(
      "Don't overestimate your abilities. This game can get pretty damn hard...",
      399,
      550
    );
    ctx.strokeStyle = "#ad343e";
    ctx.lineWidth = 4;
    ctx.strokeRect(152, 180, 122, 26);

    firstLoad = false;
  }
}
