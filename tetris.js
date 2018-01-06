// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d'); 

context.scale(20,20);

function arenaSweep() {
  outer: for (let y = arena.length - 1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] === 0) { //check if rows are fully populated
        continue outer;
      }
    }

    const row = arena.splice(y, 1)[0].fill(0); // takes arena row out at index y, fills it with empty row
    arena.unshift(row); //adds row to top of arena
    ++y;
  }
}


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

// types: O, I, S, Z, L, J, T
function createPiece(type) {
  if (type === 'T') {
    return [
             [0, 0, 0],
             [1, 1, 1],
             [0, 1, 0]
           ];
  } else if (type === 'O') {
    return [
             [2, 2],
             [2, 2]
           ];
  } else if (type === 'L') {
    return [
             [0, 3, 0],
             [0, 3, 0],
             [0, 3, 3]
           ];
  } else if (type === 'J') {
    return [
             [0, 4, 0],
             [0, 4, 0],
             [4, 4, 0]
           ];
  } else if (type === 'I') {
    return [
             [0, 5, 0, 0],
             [0, 5, 0, 0],
             [0, 5, 0, 0],
             [0, 5, 0, 0]
           ];
  } else if (type === 'S') {
    return [
             [0, 6, 6],
             [6, 6, 0],
             [0, 0, 0]
           ];
  } else if (type === 'Z') {
    return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
           ];
  }
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
        context.fillStyle = colors[value];
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
    playerReset();
    arenaSweep();
  }
  dropCounter = 0;
}

function playerMove(direction) {
  player.position.x += direction;
  if (collide(arena, player)) {
    player.position.x -= direction;
  }
}

function playerReset() {
  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]); //flooring numbers using bitwise 
  player.position.y = 0; //drop from top
  player.position.x = (arena[0].length / 2 | 0) - 
                      (player.matrix[0].length / 2 | 0); // drop from middle
  if (collide(arena, player)) { //if collides right after we get a new piece, that means we've reached the top and game is over
    arena.forEach(row => row.fill(0));
  }
}

function playerRotate(direction) {
  const pos = player.position.x;
  let offset = 1;
  rotate(player.matrix, direction);
  while (collide(arena, player)) { // we can still rotate on the wall, so after we rotate, we have to check collision again
    player.position.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -direction);
      player.position.x = pos;
      return;
    }
  }
}

function rotate(matrix, direction) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
          matrix[x][y],
          matrix[y][x],
      ] = [
          matrix[y][x],
          matrix[x][y],
      ];
    }
  }
  if (direction > 0) {
      matrix.forEach(row => row.reverse());
  } else {
      matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000; // every one sec drop the piece by one step

let lastTime = 0;
function update(time = 0) { 
  const deltaTime = time - lastTime;

  
  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop();
  }

  lastTime = time;

  draw();
  requestAnimationFrame(update)
}

const colors = [
  null,
  'red',
  'blue',
  'violet',
  'purple',
  'orange',
  'pink'
]

const arena = createMatrix(12, 20);
console.log(arena);
console.table(arena);

const player = {
  position: {x: 5, y: 5},
  matrix: createPiece('T')
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

