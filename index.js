// Navigation Logic
const sections = document.querySelectorAll('section');
const buttons = document.querySelectorAll('nav button');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        sections.forEach(section => section.classList.remove('active'));
        const target = button.id.replace('-btn', '');
        document.getElementById(target).classList.add('active');
    });
});

// Tic-Tac-Toe Logic
let ticTacToeState = Array(9).fill('');
let currentPlayer = 'X';
const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
const result = document.getElementById('tic-tac-toe-result');

function renderBoard() {
    ticTacToeBoard.innerHTML = ticTacToeState.map(
        (cell, index) => `<div data-index="${index}">${cell}</div>`
    ).join('');
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
            ticTacToeState[a] &&
            ticTacToeState[a] === ticTacToeState[b] &&
            ticTacToeState[a] === ticTacToeState[c]
        ) {
            return ticTacToeState[a];
        }
    }
    return ticTacToeState.includes('') ? null : 'Draw';
}

ticTacToeBoard.addEventListener('click', (e) => {
    const index = e.target.dataset.index;
    if (!ticTacToeState[index]) {
        ticTacToeState[index] = currentPlayer;
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const winner = checkWin();
        if (winner) {
            result.textContent = winner === 'Draw' ? 'It\'s a Draw!' : `${winner} Wins!`;
            ticTacToeBoard.style.pointerEvents = 'none';
        }
        renderBoard();
    }
});

document.getElementById('tic-tac-toe-reset').addEventListener('click', () => {
    ticTacToeState = Array(9).fill('');
    currentPlayer = 'X';
    result.textContent = '';
    ticTacToeBoard.style.pointerEvents = 'auto';
    renderBoard();
});

renderBoard();


const snakeCanvas = document.getElementById('snake-canvas');
const ctx = snakeCanvas.getContext('2d');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');

const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
let direction = 'RIGHT';
let food = { x: 80, y: 80 };
let score = 0;
let gameInterval;
let isPaused = false;
let gameStarted = false;

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, gridSize, gridSize);

    // Update score
    document.getElementById('snake-score').textContent = `Score: ${score}`;
}

function moveSnake() {
    const head = {...snake[0] };

    if (direction === 'RIGHT') head.x += gridSize;
    if (direction === 'LEFT') head.x -= gridSize;
    if (direction === 'UP') head.y -= gridSize;
    if (direction === 'DOWN') head.y += gridSize;

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop();
    }

    // Check for collisions
    if (
        head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert('Game Over!');
        resetGame();
    }
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
    };
}

function handleKeyPress(e) {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function togglePause() {
    if (isPaused) {
        isPaused = false;
        pauseButton.textContent = "Pause Game";
        gameInterval = setInterval(() => {
            if (!isPaused) {
                moveSnake();
                draw();
            }
        }, 100); // Resume the game loop
    } else {
        isPaused = true;
        pauseButton.textContent = "Resume Game";
        clearInterval(gameInterval); // Pause the game loop
    }
}

function resetGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    isPaused = false;
    pauseButton.textContent = "Pause Game";
    pauseButton.disabled = true;
    startButton.disabled = false;

    // Reset snake position and direction
    snake = [{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }];
    direction = 'RIGHT';

    // Reset food and score
    food = { x: 80, y: 80 };
    score = 0;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Redraw initial state
    draw();
    document.getElementById('snake-score').textContent = `Score: ${score}`;
}

function startGame() {
    if (!gameStarted) {
        document.addEventListener('keydown', handleKeyPress);
        gameInterval = setInterval(() => {
            if (!isPaused) {
                moveSnake();
                draw();
            }
        }, 100); // Start the game loop
        gameStarted = true;
        pauseButton.disabled = false;
        startButton.disabled = true;
    }
}

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);