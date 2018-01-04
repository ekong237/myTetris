// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d'); 

context.scale(20,20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(player.matrix, player.position);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'blue';
        context.fillRect(x + offset.x, 
                         y + offset.y, 
                         1, 1);
      }
    })
  });
}

let dropCounter = 0;
let dropInterval = 1000; // every one sec drop the piece by one step

let lastTime = 0;
function update(time = 0) { 
  const deltaTime = time - lastTime;
  lastTime = time;
  console.log('lasttime', lastTime);
  dropCounter += deltaTime;
  console.log('dropcounter:', dropCounter);
  if (dropCounter > dropInterval) {
    player.position.y++;
    dropCounter = 0;
  }
  draw();
  requestAnimationFrame(update)
}

const player = {
  position: {x: 5, y: 5},
  matrix: matrix
}

update();

