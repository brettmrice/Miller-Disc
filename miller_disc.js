let cellColor = 255;
let cell = " ";
let arrayLength = 0;
let xPos = [];
let yPos = [];
let cellDiffID = [];
let cellDiffColor = [];
let numCells = 0;
let cellCounter = 0;
let keyPressCounter = 0;
let RBCs_N = 0; // normal/negative RBCs
let RBCs_P = 0; // fetal/postive RBCs
let P_to_N = 0; // percent positive
let countReset = "N";
let methodTrack = 1; // track method used (FP, MR, MD)
let clickBegin = 0;
let completeSound;
let buttonResizeFactor = 1;

/*function preload() {
  completeSound = loadSound('complete.mp3');
}*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  wW = windowWidth;
  wH = windowHeight;
  //completeSound = loadSound('complete.mp3');

  // arrays for positions
  for (let x = 0; x < 10; x++) {
    xPos[x] = x;
  }
  for (let y = 0; y < 11; y++) {
    yPos[y] = y;
  }
  xStart = 0;
  yStart  = wH*0.25;
  xSize = floor((wW)/10);
  ySize = floor((wH*0.5)/12);

  cellDiffID[cellCounter] = "?";
  cellDiffColor[cellCounter] = 255;

  P_to_N_display = "Fetal Prep";
  //numCells_display = 'Begin Counting...';
  numCells_display = '';
  textScale = 1;
  textAlign(CENTER, CENTER)
}

function draw() {
  background(255);
  updateMethod(methodTrack);
  updateTextScale();

  // procedure title
  fill(0);
  //stroke(0);
  strokeWeight(1);
  text(P_to_N_display, wW/2, wH*0.25/2);
  textSize(wH*0.05*textScale);
  text(numCells_display, wW/2, wH*0.2);

  translate(xStart, yStart);
  //sizeFactor = min(xSize, ySize);
  fill(0);
  stroke(1);
  line(0, -1, wW, -1);
  translate(-xStart, -yStart);

  // first view when open
  if(clickBegin === 0) {
    clickBeginDisplay();
  } else {
    updateUI();
    //displayCount();
  }
  if(numCells > 0) {
    displayCount(DisplayCountHeight);
  }

  // complete signal = green border and audio
  drawBorder();

  noLoop();
}

function keyTyped() {
  // 2 = negative
  if (key === '2') {
    negativeCount();
  }
  // 3 = positive
  if (key === '3') {
    positiveCount();
  }
  // delete previous entry
  if (key === 'D' | key === 'd') {
    deleteCount()
  }
  // reset count
  if (key === 'r' | key === 'R' |
      (countReset === 'Y' & numCells === 0)) {
    resetCount();
  }
  // switch procedure - FP to MR to MD
  if (key === 's' | key === 'S') {
    switchMethod();
  }

  // uncomment to prevent any default behavior
  // return false;
  loop();
}

function resetCount() {
  cellDiffID = [];
  cellDiffColor = [];
  RBCs_N = 0;
  RBCs_P = 0;
  numCells = cellDiffID.length;
  P_to_N_display = P_to_N_display_methodBegin;
  numCells_display = 'Begin Counting...';
}

function deleteCount() {
  if(numCells > 0) {
    if(cellDiffID.pop() === "N") {
      RBCs_N -= 1;
    } else {
      RBCs_P -= 1;
    }
    cellDiffColor.pop();
    numCells = cellDiffID.length;
    countReset = "Y";
  }
  updateProgress();
}

function switchMethod() {
  if(methodTrack === 3) {
      methodTrack = 1;
    } else {
      methodTrack += 1;
    }
  updateMethod();
}

function negativeCount() {
  cellColor = cellColor_methodN; //'rgb(255,182,193)';
  cell = "N";
  RBCs_N += 1;
  updateCounter(cellColor, cell);
  updateProgress();
}

function positiveCount() {
  cellColor = cellColor_methodP; //'rgb(216, 0, 0)';
  cell = "P";
  RBCs_P += 1;
  updateCounter(cellColor, cell);
  updateProgress();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  wW = windowWidth;
  wH = windowHeight;
  yStart  = wH*0.25;
  xSize = floor((wW)/10);
  ySize = floor((wH*0.5)/12);
  textWidthTarget = (wW - 60) * 0.8;
}

function displayCount(f_displayCountHeight) {
  translate(xStart, yStart);
  ySize_backup = ySize;
  ySize = f_displayCountHeight;

  noStroke();
  cellCounter = 0;
  for(rowCount = 0; rowCount < updateNumRows; rowCount++) {
    for(colCount = 0; colCount < 10; colCount++) {
      if(cellCounter < numCells) {
        fill(cellDiffColor[cellCounter]);
      } else {
        fill(255);
      }
      rect(xSize * colCount,
           ySize * rowCount,
           xSize, ySize);
      fill(255, 50);
      textSize(min(xSize, ySize));
      if(cellCounter < numCells) {
        text(cellDiffID[cellCounter],
             (xSize * colCount) + xSize/2,
             (ySize * rowCount) + ySize/2);
      } else {
        fill(255);
      }
      cellCounter++;
    }
  }
  translate(-xStart, -yStart);
  ySize = ySize_backup;
}

function updateCounter(color, cell, update = 0) {
  if(keyPressCounter === 0) {
    cellDiffID[keyPressCounter] = cell;
    numCells = cellDiffID.length;
    cellDiffColor[keyPressCounter] = color;
    keyPressCounter++;
  } else {
    cellDiffID.push(cell);
    cellDiffColor.push(color);
    numCells = cellDiffID.length;
  }
  if(update === 1) {
    if(cell === "N") {
      RBCs_N -= 1;
    } else {
      RBCs_P -= 1;
    }
  }
}

function updateTextScale() {
  textSize(wH*0.1*1);
  textWidthTarget = (wW - 60) * 0.9;
  currentTextWidth = textWidth("Manual Retic = 0.0%");
  textScale = 1;
  while((currentTextWidth * textScale) >= textWidthTarget) {
    textScale -= 0.01;
  }
  textSize(wH*0.1*textScale);
}

function updateMethod(methodTrack) {
  // 1=Fetal Prep, 2=Man Retic, 3=Miller Disc
  // Default = 1
  if(methodTrack === 1) { // Fetal Prep
    P_to_N_display_methodBegin = "Fetal Prep";
    P_to_N_display_method = "Fetal Prep = ";
    cellColor_methodN = 'rgb(255,182,193)';
    cellColor_methodP = 'rgb(216, 0, 0)';
    defineNegative = ['Use "2" for', 'Negative',
                      'RBC', cellColor_methodN];
    definePositive = ['Use "3" for', 'Positive',
                      'RBC', cellColor_methodP];
  } else if(methodTrack === 2) { // Manual Retic
    P_to_N_display_methodBegin = "Manual Retic";
    P_to_N_display_method = "Manual Retic = ";
    cellColor_methodN = 'rgb(177,212,224)';
    cellColor_methodP = 'rgb(20,93,160)';
    defineNegative = ['Use "2" for', 'Negative',
                      'RBC', cellColor_methodN];
    definePositive = ['Use "3" for', 'Positive',
                      'RBC', cellColor_methodP];
  } else if(methodTrack === 3) { // Miller Disc
    P_to_N_display_methodBegin = "Miller Disc";
    P_to_N_display_method = "Miller Disc = ";
    cellColor_methodN = 150;
    cellColor_methodP = 0;
    defineNegative = ['Use "2" for', 'Negative',
                      'Particle', cellColor_methodN];
    definePositive = ['Use "3" for', 'Positive',
                      'Particle', cellColor_methodP];
  }
  // update already started count to new selected procedure
  if(numCells > 0) {
    for(s = 0; s < numCells; s++) {
      if(cellDiffID[s] === "P") {
        cellDiffColor[s] = cellColor_methodP;
      } else {
        cellDiffColor[s] = cellColor_methodN;
      }
    }
    updateProgress();
  } else {
    P_to_N_display = P_to_N_display_methodBegin;
  }
}

// display percent, total counted, and complete signal
function updateProgress() {
  // update percent present
  if(RBCs_N === 0) {
    P_to_N = round(RBCs_P/(RBCs_N*9)*100, 1);
    P_to_N_display = P_to_N_display_method + "100%";
  } else {
    P_to_N = round(RBCs_P/(RBCs_N*9)*100, 1);
    P_to_N_display = P_to_N_display_method + P_to_N.toFixed(1) + "%";
  }
  numCells_display = "Cells Counted = " + numCells;
}

// display instructions at beginning
function instructions(defineInstructions, textHeight) {
  dI = subset(defineInstructions, 0, 3);
  dIfill = defineInstructions[3];
  noStroke();
  fill(0);
  textSize(wH*0.05*textScale);
  t1 = subset(dI, 0, 1);
  tW1 = textWidth(t1.join(" "));
  t2 = subset(dI, 0, 2);
  tW2 = textWidth(t2.join(" "));
  t3 = subset(dI, 0, 3);
  tW3 = textWidth(t3.join(" "));
  textStart = (wW/2) - (tW3/2);
  textAlign(LEFT, CENTER);
  text(dI[0], textStart, textHeight);
  fill(dIfill);
  stroke(dIfill);
  strokeWeight(1.5);
  text(" " + dI[1], textStart + tW1, textHeight);
  fill(0);
  noStroke();
  //strokeWeight(1);
  text(" " + dI[2], textStart + tW2, textHeight);
  textAlign(CENTER, CENTER);
}

function mouseClicked() {
  if(clickBegin === 0) {
    clickBegin = 1;
    device = 'mouse';
    device = 'touch';
  } else {
    if(mouseX > resetArea[0] & mouseY > resetArea[1] &
        mouseX < resetArea[2] & mouseY < resetArea[3]) {
        resetCount();
      }
      if(mouseX > deleteArea[0] & mouseY > deleteArea[1] &
        mouseX < deleteArea[2] & mouseY < deleteArea[3]) {
        deleteCount();
      }
      if(mouseX > switchArea[0] & mouseY > switchArea[1] &
        mouseX < switchArea[2] & mouseY < switchArea[3]) {
        switchMethod();
      }
      if(mouseX > positiveArea[0] & mouseY > positiveArea[1] &
        mouseX < positiveArea[2] & mouseY < positiveArea[3]) {
        positiveCount();
      }
      if(mouseX > negativeArea[0] & mouseY > negativeArea[1] &
        mouseX < negativeArea[2] & mouseY < negativeArea[3]) {
        negativeCount();
      }
    if(mouseX > resizeArea[0] & mouseY > resizeArea[1] &
        mouseX < resizeArea[2] & mouseY < resizeArea[3]) {
       //resizeButtons();
       }
  }
  updateUI();
}

function touchStarted() {
  /*var fs = fullscreen();
    if (!fs) {
      fullscreen(true);
    }*/
  console.log('touching');
  if(clickBegin === 0) {
    clickBegin = 1;
    device = 'touch';
  } else {
    if(mouseX > resetArea[0] & mouseY > resetArea[1] &
        mouseX < resetArea[2] & mouseY < resetArea[3]) {
        resetCount();
      }
      if(mouseX > deleteArea[0] & mouseY > deleteArea[1] &
        mouseX < deleteArea[2] & mouseY < deleteArea[3]) {
        deleteCount();
      }
      if(mouseX > switchArea[0] & mouseY > switchArea[1] &
        mouseX < switchArea[2] & mouseY < switchArea[3]) {
        switchMethod();
      }
      if(mouseX > positiveArea[0] & mouseY > positiveArea[1] &
        mouseX < positiveArea[2] & mouseY < positiveArea[3]) {
        positiveCount();
      }
      if(mouseX > negativeArea[0] & mouseY > negativeArea[1] &
        mouseX < negativeArea[2] & mouseY < negativeArea[3]) {
        negativeCount();
      }
  }
  updateUI();
}
/*
document.ontouchmove = function(event) {
    event.preventDefault();
};*/

function updateUI() {
  if(numCells > 120) {
      updateNumRows = ceil(numCells/10);
    } else {
      updateNumRows = 12;
    }
  if(device === 'mouse') {
    mouseEnvironment();
    DisplayCountHeight = (ySize*14)/updateNumRows;
  } else if(device === 'touch') {
    beginYReset = (ySize*12)*buttonResizeFactor;
    beginYResize = beginYReset - ySize;
    touchEnvironment();
    DisplayCountHeight = beginYResize/updateNumRows;//(ySize*11)/updateNumRows;
  }
  numCells_display = 'Begin Counting...';
  loop();
}

// large miller disc at startup
function clickBeginDisplay() {
  translate(xStart, yStart);
  strokeWeight(2);
  // large square
  stroke(cellColor_methodP);
  fill(cellColor_methodP);
  sizeFactor = min(wW*0.75, wH*0.75*0.75);
  rect(wW/2 - sizeFactor/2,
       (wH*0.75 - sizeFactor)/2,
       sizeFactor, sizeFactor);
  // small square
  stroke(cellColor_methodN);
  fill(cellColor_methodN);
  rect((wW/2 - sizeFactor/2) + sizeFactor*2/3,
       ((wH*0.75 - sizeFactor)/2) + sizeFactor*2/3,
       sizeFactor*1/3, sizeFactor*1/3);
  noStroke();
  fill(255);
  textSize(sizeFactor*0.15*textScale);
  beginTextHeight = (wH*0.75 - sizeFactor)/2 + (((wH*0.75 - sizeFactor)/2) + sizeFactor*2/3)/2;
  text('Click to Begin', wW/2, beginTextHeight);//wH*0.75/2);
  translate(-xStart, -yStart);

  // black border
  noFill();
  stroke(0);
  strokeWeight(30);
  rect(0, 0, wW, wH);
  noStroke();
  strokeWeight(1);
}

function mouseEnvironment() {
  translate(xStart, yStart);
  stroke(1);
  line(0, (ySize*14), wW, (ySize*14));

  // display instructions
  if(numCells === 0) {
    fill(0);
    textSize(wH*0.05*textScale);
    instructions(defineNegative, wH*0.12/2);
    instructions(definePositive, wH*0.27/2);
    noFill();
    strokeWeight(2);
    stroke(cellColor_methodP);
    fill(cellColor_methodP);
    sizeFactor = min(xSize, ySize);
    rect(wW/2 - sizeFactor*4, wH*0.4/2,
         sizeFactor*8, sizeFactor*8);
    stroke(cellColor_methodN);
    fill(cellColor_methodN);
    rect(wW/2 - sizeFactor*4 + sizeFactor*8*2/3,
         wH*0.4/2 + sizeFactor*8*2/3,
         sizeFactor*8*1/3, sizeFactor*8*1/3);
    strokeWeight(1);
  }
  translate(-xStart, -yStart);

  fill(0);
  noStroke();
  textSize(wH*0.04*textScale);
  text('"R"eset       "D"elete       "S"witch', wW/2, wH*0.9);
}

function touchEnvironment() {
  heightLeft = wH - (yStart + beginYReset);
  
  // control area
  translate(xStart, yStart);
  stroke(0);
  strokeWeight(5);
  translate(xStart, beginYReset);
  fill(255);
  rect(0, 0, wW, heightLeft);
  // button locations
  fill(200);
  // reset
  // areas = [top left x, top left y, bottom right x, bottom right y]
  resetArea = [xStart + 0, yStart + beginYReset,
               xStart + wW*1/3, yStart + beginYReset + heightLeft*1/3];
  rect(0, 0, wW*1/3, heightLeft*1/3);
  fill(150);
  // delete
  deleteArea = [xStart + wW*1/3, yStart + beginYReset,
                xStart + wW*2/3,
                yStart + beginYReset + heightLeft*1/3];
  rect(wW*1/3, 0, wW*1/3, heightLeft*1/3);
  fill(200);
  // switch
  switchArea = [xStart + wW*2/3, yStart + beginYReset,
                xStart + wW*2/3 + wW*1/3,
                yStart + beginYReset + heightLeft*1/3];
  rect(wW*2/3, 0, wW*1/3, heightLeft*1/3);
  fill(cellColor_methodP);
  // positive
  positiveArea = [xStart, yStart + beginYReset + heightLeft*1/3,
                xStart + wW*1/2,
                yStart + beginYReset + heightLeft];
  rect(0, heightLeft*1/3, wW*1/2, heightLeft);
  fill(cellColor_methodN);
  // negative
  negativeArea = [xStart + wW*1/2, yStart + beginYReset + heightLeft*1/3,
                xStart + wW*1/2 + wW*1/2,
                yStart + beginYReset + heightLeft];
  rect(wW*1/2, heightLeft*1/3, wW*1/2, heightLeft);
  // text descriptions
  translate(wW*1/3*1/2, heightLeft*1/3*1/2);
  noStroke();
  fill(255);
  textSize(wH*0.07*textScale);
  text('Reset', 0, 0);
  text('Delete', wW*1/3, 0);
  text('Switch', wW*2/3, 0);
  translate(-wW*1/3*1/2, -heightLeft*1/3*1/2);
  translate(wW*1/4, (heightLeft*2/3));
  fill(255, 50);
  text('Positive', 0, 0);
  text('Negative', wW*1/2, 0);
  translate(-wW*1/4, -(heightLeft*2/3));
  strokeWeight(1);
  noStroke();
  translate(-xStart, -beginYReset);
  stroke(1);
  line(0, beginYReset, wW, beginYReset);
  translate(-xStart, -yStart);
  noStroke();
  
  
  // pull up resize button
  translate(xStart, yStart + beginYResize);
  //stroke(0, 50);
  strokeWeight(5);
  fill(0, 50);
  // resize
  resizeArea = [xStart, yStart + beginYResize,
                xStart + wW,
                yStart + beginYResize + ySize];
  //fill(0);
  //line(xStart, 0, wW, heightLeft*1/6);
  rect(0, 0, wW, ySize);
  textSize(wH*0.03*textScale);
  noStroke();
  fill(255, 150);
  text(('^' + '\t\t\t').repeat(7) + 
       '\t\t\t' + 
       ('\t\t\t' + '^').repeat(7), 
       wW*1/2, ySize*1/2.5);
  text(('^' + '\t\t\t').repeat(7) + 
       ('\t').repeat(7) + 
       ('\t\t\t' + '^').repeat(7), 
       wW*1/2, ySize*2/3);
  text('Resize', wW*1/2, ySize*1/2);
  noStroke();
  translate(-xStart, -((yStart + beginYResize)));
  drawBorder()
}

function mouseDragged() {
  if(clickBegin > 0 & 
     mouseX > resizeArea[0] & mouseY > resizeArea[1] &
        mouseX < resizeArea[2] & mouseY < resizeArea[3]) {
    //buttonResizeFactor = map(mouseY, 
    //                         beginYReset*.8, beginYReset,
    //                         0.8, 1);
    adjustMax = wH * 2/3; //(resizeArea[3] - resizeArea[1]) * 3;
    if(mouseY > pmouseY) {
      buttonResizeFactor = min(1, buttonResizeFactor += 0.01);
    } else {
      buttonResizeFactor = max(0.7, buttonResizeFactor -= 0.01);
    }
    updateUI();
    console.log('resize' + mouseY);
  }
  return false;
}

function drawBorder() {
  if(numCells >= 112) {
    noFill();
    stroke('rgb(0,255,0)');
    strokeWeight(50);
    rect(0, 0, wW, wH);
    noStroke();
    strokeWeight(1);
    //completeSound.play();
  } else {
    // black border
    noFill();
    stroke(0);
    strokeWeight(30);
    rect(0, 0, wW, wH);
    noStroke();
    strokeWeight(1);
  }
}
