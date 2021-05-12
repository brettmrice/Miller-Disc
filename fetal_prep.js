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
let complete;

function setup() {
  mdCanvas = createCanvas(windowWidth, windowHeight);
  mdCanvas.style("visibility", "visible");
  wW = windowWidth;
  wH = windowHeight;
  complete = loadSound('complete.mp3');

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
  numCells_display = 'Begin Counting...';
  textScale = 1;
  textAlign(CENTER, CENTER)
}

function draw() {
  background(255);
  updateMethod(methodTrack);
  updateTextScale();
  textAlign(CENTER, CENTER);
  fill(0);
  text(P_to_N_display, wW/2, wH*0.25/2);
  translate(xStart, yStart);
  stroke(0);
  line(0, -1, wW, -1);
  noStroke();

  cellCounter = 0;
  for(rowCount = 0; rowCount < 12; rowCount++) {
    for(colCount = 0; colCount < 10; colCount++) {
      if(cellCounter < numCells) {
        fill(cellDiffColor[cellCounter]);
      } else {
        fill(255);
        noStroke();
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
  if(numCells === 0) {
    fill(0);
    textSize(wH*0.05*textScale);
    instructions(defineNegative, wH*0.1/2);
    instructions(definePositive, wH*0.3/2);
    noFill();
    strokeWeight(2);
    stroke(cellColor_methodP);
    fill(cellColor_methodP);
    sizeFactor = min(xSize, ySize);
    rect(wW/2 - sizeFactor*3, wH*0.4/2,
         sizeFactor*6, sizeFactor*6);
    stroke(cellColor_methodN);
    fill(cellColor_methodN);
    rect(wW/2 - sizeFactor*3 + sizeFactor*6*2/3,
         wH*0.4/2 + sizeFactor*6*2/3,
         sizeFactor*6*1/3, sizeFactor*6*1/3);
    strokeWeight(1);
  }
  stroke(0);
  line(0, (ySize*12)+1, wW, (ySize*12)+1);
  noStroke();

  fill(0);
  textSize(wH*0.07*textScale);
  text(numCells_display, wW/2, wH*0.6);
  textSize(wH*0.04*textScale);
  text('"R"=Reset     "D"=Delete     "S"= Switch', wW/2, wH*0.68);

  translate(-xStart, -yStart);
  if(numCells >= 112) {
    noFill();
    stroke('rgb(0,255,0)');
    strokeWeight(30);
    rect(0, 0, wW, wH);
    noStroke();
    strokeWeight(1);
    complete.play();
  } else {
    noFill();
    stroke(0);
    strokeWeight(30);
    rect(0, 0, wW, wH);
    noStroke();
    strokeWeight(1);
  }
  noLoop();
}

function keyTyped() {
  if (key === '2') {
    cellColor = cellColor_methodN; //'rgb(255,182,193)';
    cell = "N";
    RBCs_N += 1;
    updateCounter(cellColor, cell);
    updateProgress();
  } else if (key === '3') {
    cellColor = cellColor_methodP; //'rgb(216, 0, 0)';
    cell = "P";
    RBCs_P += 1;
    updateCounter(cellColor, cell);
    updateProgress();
  }

  if (key === 'D' | key === 'd') {
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

  if (key === 'r' | key === 'R' |
      (countReset === 'Y' & numCells === 0)) {
    cellDiffID = [];
    cellDiffColor = [];
    RBCs_N = 0;
    RBCs_P = 0;
    numCells = cellDiffID.length;
    P_to_N_display = P_to_N_display_methodBegin;
    numCells_display = 'Begin Counting...';
  }

  if (key === 's' | key === 'S') {
    if(methodTrack === 3) {
      methodTrack = 1;
    } else {
      methodTrack += 1;
    }
    updateMethod();
    //switchMethod();
  }

  // uncomment to prevent any default behavior
  // return false;
  loop();
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

function updateProgress() {
  P_to_N = round(RBCs_P/(RBCs_N*9)*100, 1);
  P_to_N_display = P_to_N_display_method + P_to_N.toFixed(1) + "%";
  numCells_display = "Cells Counted = " + numCells;
}

function instructions(defineInstructions, textHeight) {
  dI = subset(defineInstructions, 0, 3);
  dIfill = defineInstructions[3];
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
  strokeWeight(2);
  text(" " + dI[1], textStart + tW1, textHeight);
  fill(0);
  strokeWeight(1);
  text(" " + dI[2], textStart + tW2, textHeight);
  textAlign(CENTER, CENTER);
}
