// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d'); 

context.scale(20,20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
];

function collide(arena, player) {
  const m = player.matrix;
  const p = player.position;
  for (let y = 0; y < m.length; y++) { // row
    for (let x = 0; x < m[y].length; x++) { //col
      if (m[y][x] !== 0 &&
          (arena[y + p.y] && 
          arena[y + p.y][x + p.x]) !== 0) { // arena row exists and no collision
          return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0))
  }
  return matrix;
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawMatrix(arena, {x: 0, y: 0})
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

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.position.y][x + player.position.x] = value;
      }
    })
  })
}

function playerDrop() {
  player.position.y++;
  if (collide(arena, player)) { //touching ground or another piece
    console.log('hit bottom or another piece');
    player.position.y--;
    merge(arena, player);
    player.position.y = 0; //when piece hits bottom, start from top again
  }
  dropCounter = 0;
}

function playerMove(direction) {
  player.position.x += direction;
  if (collide(arena, player)) {
    player.position.x -= direction;
  }
}

function playerRotate(direction) {
  rotate(player.matrix, direction);
}

function rotate(matrix, direction) {
  for (let y = 0; y < matrix.length; y++) {
    for (x = 0; x < y; x++) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ]
    }
    if (direction > 0) {
      matrix.forEach(row => row.reverse());
    } else {
      matrix.reverse();
    }

  }
}

let dropCounter = 0;
let dropInterval = 1000; // every one sec drop the piece by one step

let lastTime = 0;
function update(time = 0) { 
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }
  draw();
  requestAnimationFrame(update)
}

const arena = createMatrix(12, 20);
console.log(arena);
console.table(arena);

const player = {
  position: {x: 5, y: 5},
  matrix: matrix
}

// q and w for rotate
document.addEventListener('keydown', event => {
  if (event.keyCode === 37) { //left
    playerMove(-1);
    // player.position.x--;
  } else if (event.keyCode === 39) { //right
    playerMove(1);
    // player.position.x++;
  } else if (event.keyCode === 40) { //down
    playerDrop();
  } else if (event.keyCode === 81) { //rotate left
    playerRotate(-1);
  } else if (event.keyCode === 87) { //rotate right
    playerRotate(1);
  } 
});



update();

