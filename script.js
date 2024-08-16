const gameArea = document.getElementById('gameArea');
const car = document.getElementById('car');
const scoreElement = document.getElementById('score');
const leftArrow = document.getElementById('leftArrow');
const rightArrow = document.getElementById('rightArrow');
let carPosition = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
let gameInterval;
let obstacleInterval;
let obstacles = [];
let gameOver = false;
let score = 0;  

// Cargar sonidos
const crashSound = new Audio('assets/crash.mp3');
const bgMusic = new Audio('assets/bg-music.mp3');
bgMusic.loop = true;

// Iniciar música de fondo
bgMusic.play();

// Event listeners para las flechas
leftArrow.addEventListener('mousedown', () => moveCar(-20));
rightArrow.addEventListener('mousedown', () => moveCar(20));

// Event listeners para teclas
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        moveCar(-20);
    } else if (e.key === 'ArrowRight') {
        moveCar(20);
    }
});

function moveCar(distance) {
    if (!gameOver) {
        carPosition += distance;
        if (carPosition < 0) carPosition = 0;
        if (carPosition > gameArea.offsetWidth - car.offsetWidth) carPosition = gameArea.offsetWidth - car.offsetWidth;
        car.style.left = `${carPosition}px`;
    }
}

function createObstacle() {
    const obstacle = document.createElement('img');
    obstacle.src = 'assets/stone.png';
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 50))}px`;
    obstacle.style.top = `0px`;
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        let obstacleTop = parseInt(obstacle.style.top);
        obstacleTop += 5;
        obstacle.style.top = `${obstacleTop}px`;

        if (obstacleTop > gameArea.offsetHeight) {
            gameArea.removeChild(obstacle);
            obstacles.splice(index, 1);
            updateScore();
        }

        // Detección de colisiones
        if (
            obstacleTop + obstacle.offsetHeight > car.offsetTop &&
            obstacleTop < car.offsetTop + car.offsetHeight &&
            obstacle.offsetLeft < car.offsetLeft + car.offsetWidth &&
            obstacle.offsetLeft + obstacle.offsetWidth > car.offsetLeft
        ) {
            endGame();
        }
    });
}

function updateScore() {
    score += 10;
    scoreElement.textContent = `Puntuación: ${score}`;
}

function startGame() {
    gameInterval = setInterval(moveObstacles, 20);
    obstacleInterval = setInterval(createObstacle, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    gameOver = true;
    bgMusic.pause();
    crashSound.play();
    alert(`¡Juego terminado! Puntuación final: ${score}`);
    resetGame();
}

function resetGame() {
    obstacles.forEach(obstacle => gameArea.removeChild(obstacle));
    obstacles = [];
    score = 0;
    scoreElement.textContent = `Puntuación: ${score}`;
    carPosition = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.left = `${carPosition}px`;
    gameOver = false;
    bgMusic.play();
    startGame();
}

startGame();
