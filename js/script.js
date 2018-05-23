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
let ticker;
let timer;
let secShown;
let minShown;
let timeElapsed = 0;

window.onload = function () {
  document.getElementById("time").innerText = timeDisplay(0, 0);
  gridImage = document.getElementById("original-img");
  shuffledImg = document.getElementById("play-area");
  shuffleButton = document.getElementById("start");
  instructions();
  randomImgGenerator();
  showHideBtn();

  document.onkeydown = function (e) {
    if (gridImage.style.display === "none" && document.getElementById("popup").style.display !== "block") {
      executeMove(e.keyCode);
    }
  };

  document.getElementById("normal").onclick = function () {
    difficulty = 3;
    resetGame();
    createImg();
    ticker = 60 * 5;
  };
  document.getElementById("hard").onclick = function () {
    difficulty = 4;
    resetGame();
    createImg();
    ticker = 60 * 15;
  };
  document.getElementById("insane").onclick = function () {
    difficulty = 5;
    resetGame();
    createImg();
    ticker = 60 * 30;
  };
  document.getElementById("start").onclick = function () {
    if (shuffleButton.value === "Start") {
      runTheClock();
    }
    toggleCanvas();
  };
  document.getElementById("reset").onclick = function () {
    document.getElementById("time").innerText = timeDisplay(0, 0);
    stopTimer();
    playAgain();
  };
  document.getElementById("winBtn").onclick = function () {
    playAgain();
    togglePopUp();
  };
  document.getElementById("loseBtn").onclick = function () {
    playAgain();
    togglePopUp();
  };
};

function createImg() {
  myImage = new Image();
  myImage.src = imageArr[randomImgNum]; //will create an array of image src to select at random in future
  myImage.onload = function () {
    //setting the size of the tile by dividing the width or height by the total number of tiles in that axis.
    tileWidth = Math.floor(myImage.width / difficulty);
    tileHeight = Math.floor(myImage.height / difficulty);
    //calls function to draw the initial canvas
    originalCanvas();
    //calls function to draw the test canvas that is created using the tilesArr.
    shuffledCanvas();
  };
}

function originalCanvas() {
  document.getElementById("original-img").style.border = "#000000 5px solid";

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
}

function shuffledCanvas() {
  document.getElementById("play-area").style.border = "#000000 5px solid";

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
    victoryPopUp();
  }
}

function executeMove(keyCode) {
  if (keyCode === 37 || keyCode === 39 || keyCode === 38 || keyCode === 40) {
    countMoves();
    if (document.getElementById("sound-check").checked === true) {
      document.getElementById("slideSound").play();
    }
  }
  switch (keyCode) {
    case 37:
      moveLeft();
      break;
    case 39:
      moveRight();
      break;
    case 38:
      moveUp();
      break;
    case 40:
      moveDown();
      break;
  }
}

function moveLeft() {
  if (selectedTile % difficulty === 0) {
    swapArr(shuffledArr, selectedTile, selectedTile + (difficulty - 1));
    selectedTile = selectedTile + (difficulty - 1);
    shuffledCanvas();
  } else {
    swapArr(shuffledArr, selectedTile, selectedTile - 1); //calling the function that swaps the index of the selected tile
    selectedTile = selectedTile - 1;
    shuffledCanvas();
  }
}

function moveRight() {
  if ((selectedTile + 1) % difficulty === 0) {
    swapArr(shuffledArr, selectedTile, selectedTile - (difficulty - 1));
    selectedTile = selectedTile - (difficulty - 1);
    shuffledCanvas();
  } else {
    swapArr(shuffledArr, selectedTile, selectedTile + 1); //calling the function that swaps the index of the selected tile
    selectedTile = selectedTile + 1;
    shuffledCanvas();
  }
}

function moveUp() {
  if (selectedTile - difficulty < 0) {
    swapArr(
      shuffledArr,
      selectedTile,
      selectedTile + difficulty * (difficulty - 1)
    );
    selectedTile = selectedTile + difficulty * (difficulty - 1);
    shuffledCanvas();
  } else {
    swapArr(shuffledArr, selectedTile, selectedTile - difficulty); //calling the function that swaps the index of the selected tile
    selectedTile = selectedTile - difficulty;
    shuffledCanvas();
  }
}

function moveDown() {
  if (selectedTile + difficulty >= difficulty * difficulty) {
    swapArr(
      shuffledArr,
      selectedTile,
      selectedTile - difficulty * (difficulty - 1)
    );
    selectedTile = selectedTile - difficulty * (difficulty - 1);
    shuffledCanvas();
  } else {
    swapArr(shuffledArr, selectedTile, selectedTile + difficulty); //calling the function that swaps the index of the selected tile
    selectedTile = selectedTile + difficulty;
    shuffledCanvas();
  }
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


function playAgain() {
  shuffleButton.value = "Start";
  gridImage.style.display = "inline";
  shuffledImg.style.display = "none";
  window.onload();
}

function togglePopUp() {
  if (document.getElementById("overlay").style.display === "block") {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
  } else {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
  }
}

function victoryPopUp() {
  document.getElementById("win").style.display = "block";
  document.getElementById("lose").style.display = "none";
  stopTimer();
  timeCompleted();
  document.getElementById("end-moves").innerText = moves;
  document.getElementById("winSound").play();
  setTimeout(function () {
    togglePopUp();
  }, 750);
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
}

function resetGame() {
  moves = -100;
  tilesArr = [];
  shuffledArr = [];
  selectedTile = difficulty * difficulty - 1;
  showHideBtn();
  shuffleButton.style.display = "inline-block";
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
    ctx.fillText(
      "Use the arrows keys to swap the colored tile with the adjacent tiles.",
      399,
      150
    );
    ctx.textAlign = "center";
    ctx.fillText(
      "You will need to move the tile outside of the grid to win.",
      399,
      200
    );
    ctx.textAlign = "center";
    ctx.fillText(
      'Use "Show Original/Continue" to swap between the original and shuffled image.',
      399,
      250
    );
    ctx.textAlign = "center";
    ctx.fillText("If the time expires you've lost the game.", 399, 300);
    ctx.textAlign = "center";
    ctx.fillText("Good luck!", 399, 350);

    firstLoad = false;
  }
}

function timeUp() {
  document.getElementById("lose").style.display = "block";
  document.getElementById("win").style.display = "none";
  document.getElementById("loseSound").play();
  setTimeout(function () {
    togglePopUp();
  }, 750);
}


function runTheClock() {
  timer = setInterval(myticker, 1000);
}

function myticker() {
  let secShown;
  let minShown;
  timeElapsed++;
  ticker--;
  minShown = Math.floor(ticker / 60);
  secShown = (minShown * 60)
  if (ticker >= 60) {
    secShown = ticker - (minShown * 60);
  } else {
    secShown = ticker;
  }
  document.getElementById("time").innerText = timeDisplay(minShown, secShown);
  if (ticker === 0) {
    timeUp();
    stopTimer();
  }
}

function stopTimer() {
  clearInterval(timer);
}

function timeDisplay(min, sec) {
  min = min.toString();
  sec = sec.toString();
  if (min.length < 2) {
    min = "0" + min;
  }
  if (sec.length < 2) {
    sec = "0" + sec;
  }
  return min + ":" + sec;
}

function timeCompleted() {
  let secShown;
  let minShown;
  minShown = Math.floor(timeElapsed / 60);
  secShown = (timeElapsed * 60)
  if (timeElapsed >= 60) {
    secShown = timeElapsed - (minShown * 60);
  } else {
    secShown = timeElapsed;
  }
  document.getElementById("end-time").innerText = timeDisplay(minShown, secShown);
}