
class Cell {
  
  constructor(x, y){
    this.state = false;
    this.x = x;
    this.y = y;
  }

  die(){
    this.state = false;
  }

  revive(){
    this.state = true;
  }

}

class Game {

  constructor(canvasSize, gridSize){
    if (canvasSize % gridSize != 0){
      throw "gridSize must be a multiple of canvasSize";
    }
    // set up canvas and environment variables
    this.canvas = document.createElement("canvas");
    this.canvas.style = "border: 1px solid black";
    document.getElementById("body").appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.gridSize = gridSize;
    this.cellSize = canvasSize / gridSize;

    // start button
   this.startButton = document.createElement("input");
    this.startButton.type = "submit";
    this.startButton.value = "Start";
    this.startButton.onclick = () => this.start();
    document.getElementById("body").appendChild(this.startButton);

    // next button
    this.nextButton = document.createElement("input");
    this.nextButton.type = "submit";
    this.nextButton.value = "Next";
    this.nextButton.onclick = () => this.update();
    document.getElementById("body").appendChild(this.nextButton);

    // speed slider
    this.speedSlider = document.createElement("input");
    this.speedSlider.type = "range";
    this.speedSlider.min = "20";
    this.speedSlider.max = "2000";
    this.speedSlider.value = "1000";
    this.speedSlider.style = "direction: rtl"
    document.getElementById("body").appendChild(this.speedSlider);

    
    // initialise cells array
    this.cells = [];
    var x = 0;
    var y = 0;
    for (var i = 0; i < gridSize * gridSize; i++){
      this.cells[i] = new Cell(x, y);
      x += this.cellSize;
      if (x >= this.canvas.width){
        x = 0;
        y += this.cellSize;
      }

    }

    // set up event listeners
    this.mouseX = 0;
    this.mouseY = 0;
    document.onmousemove = (event) => {
      this.mouseX = event.pageX - this.canvas.offsetLeft;
      this.mouseY = event.pageY - this.canvas.offsetTop;
    }
    document.addEventListener("click", () => this.toggleCell());

    this.update();
    this.stop();
  }

  start(){
    this.nextButton.disabled = true;
    this.startButton.value = "Stop";
    this.startButton.onclick = () => this.stop();
    // set update interval
    this.updateInterval = setInterval(() => this.update(), this.speedSlider.value);
  }

  stop(){
    this.nextButton.disabled = false;
    this.startButton.value = "Start";
    this.startButton.onclick = () => this.start();
    // clear update interval
    clearInterval(this.updateInterval);
  }

  toggleCell(){
    for (var i = 0; i < this.cells.length; i++){
      if (this.mouseX > this.cells[i].x && this.mouseX < this.cells[i].x + this.cellSize && this.mouseY > this.cells[i].y && this.mouseY < this.cells[i].y + this.cellSize){
        this.cells[i].state = !this.cells[i].state;
      }
    }
    this.drawCells();
    this.drawGrid();
  }

  cellNextState(i){

    var neighbourPositions = [
      i - 1, // left
      i + 1, // right
      i - this.gridSize, // up
      i + this.gridSize, //down
      i - this.gridSize - 1, // up left
      i - this.gridSize + 1, // up right
      i + this.gridSize - 1, // down left
      i + this.gridSize + 1, // down right
    ];
   
    var neighbourCount = 0;

    for (var j = 0; j < neighbourPositions.length; j++){
      var n = neighbourPositions[j];
      if (n >= 0 && n < this.cells.length){
        if (this.cells[n].state){
          neighbourCount++;
        }
      }
    }

    if (this.cells[i].state){
      // one or no neighbours dies of loneliness
      if (neighbourCount <= 1){
        return false;
      // four or more neighbours dies of overpopulation
      } else if (neighbourCount >= 4){
        return false;
      } else {
        return true
      }
    } else {
      // cells with exactly three neighbours are revived
      if (neighbourCount === 3){
        return true;
      } else {
        return false;
      }
    }
  }

  clearCanvas(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = "#5b5b5b";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawCells(){
    this.context.fillStyle = "#FFFF00"
    for (var i = 0; i < this.cells.length; i++){
      if (this.cells[i].state){
        this.context.fillRect(this.cells[i].x, this.cells[i].y, this.cellSize, this.cellSize);
      }
    }
  }

  drawGrid(){
    this.context.lineWidth = 1;
    this.context.fillStyle = "#000";
    for (var rowPos = this.cellSize; rowPos < this.canvas.width; rowPos += this.cellSize){
      this.context.moveTo(rowPos, 0);
      this.context.lineTo(rowPos, this.canvas.width);
      this.context.stroke();
    }
    for (var colPos = this.cellSize; colPos < this.canvas.height; colPos += this.cellSize){
      this.context.moveTo(0, colPos);
      this.context.lineTo(this.canvas.width, colPos);
      this.context.stroke();
    }
  }

  update(){
    this.clearCanvas();
    // get array of new cell states
    var newCellStates = [];
    for (var i = 0; i < this.cells.length; i++){
      newCellStates[i] = this.cellNextState(i);
    }
    for (var i = 0; i < this.cells.length; i++){
      this.cells[i].state = newCellStates[i];
    }
    this.drawCells();
    this.drawGrid();
  }

}


console.log("Conway's Game of Life")
game = new Game(500, 25);
 
