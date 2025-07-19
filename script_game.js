let score = 0;
let timeLeft = 60;
let isPaused = false;
let gameTimer, popInterval;
let holes = [];
let popSpeed = 500;

let isSoundOn = localStorage.getItem('sound') !== 'off';

const catchSound = new Audio('catch.mp3');
const bgMusic = new Audio('bgmusic.mp3');
const clickSound = new Audio('click.mp3');
bgMusic.loop = true;

catchSound.volume = 1;
bgMusic.volume = 2;
clickSound.volume = 1;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const pauseBtn = document.getElementById('pauseBtn');
const replayBtn = document.getElementById('replayBtn');
const backBtn = document.getElementById('backToMenuBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const gameArea = document.getElementById('gameArea');
const gameOverPopup = document.getElementById('gameOverPopup');
const finalScoreSpan = document.getElementById('finalScore');
const restartPopupBtn = document.getElementById('restartBtn');
const menuPopupBtn = document.getElementById('menuBtn');
const startGameBtn = document.getElementById('startGameBtn');

function createHoles() {
  gameArea.innerHTML = '';
  holes = [];
  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.classList.add('hole');

    const cat = document.createElement('div');
    cat.classList.add('cat');
    hole.appendChild(cat);

    cat.addEventListener('click', () => {
      if (!cat.classList.contains('hit')) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        cat.classList.add('hit');
        if (isSoundOn) {
          catchSound.currentTime = 0;
          catchSound.play().catch(() => {});
        }

        const boom = document.createElement('div');
        boom.classList.add('star');
        boom.textContent = '💥';
        cat.appendChild(boom);

        setTimeout(() => {
          cat.classList.remove('hit', 'up');
          boom.remove();
        }, 500);
      }
    });

    gameArea.appendChild(hole);
    holes.push(cat);
  }
}

function randomPop() {
  if (isPaused) return;
  const idx = Math.floor(Math.random() * holes.length);
  const cat = holes[idx];
  if (!cat.classList.contains('up') && !cat.classList.contains('hit')) {
    cat.classList.add('up');
    setTimeout(() => cat.classList.remove('up'), popSpeed - 60);
  }
}

function showGameOverPopup() {
  finalScoreSpan.textContent = score;
  gameOverPopup.classList.remove('hidden');
}

function hideGameOverPopup() {
  gameOverPopup.classList.add('hidden');
}

function updateTimer() {
  if (isPaused) return;
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(gameTimer);
    clearInterval(popInterval);
    bgMusic.pause();
    replayBtn.style.display = 'inline-block';
    showGameOverPopup();
  }
}

function setDifficulty() {
  const difficulty = localStorage.getItem('difficulty');
  if (difficulty === 'easy') {
    timeLeft = 60;
    popSpeed = 650;
  } else if (difficulty === 'medium') {
    timeLeft = 60;
    popSpeed = 500;
  } else if (difficulty === 'hard') {
    timeLeft = 60;
    popSpeed = 350;
  }
}

function startGame() {
  score = 0;
  isPaused = false;
  hideGameOverPopup();
  setDifficulty();
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  createHoles();
  gameTimer = setInterval(updateTimer, 1000);
  popInterval = setInterval(randomPop, popSpeed);
  replayBtn.style.display = 'inline-block';
  startGameBtn.style.display = 'none'; // ✅ Hide Start button after game starts
  if (isSoundOn) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }
}

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
  if (isSoundOn) {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }
  isPaused ? bgMusic.pause() : bgMusic.play().catch(() => {});
});

replayBtn.addEventListener('click', () => {
  clickSound.play().catch(() => {});
  clearInterval(gameTimer);
  clearInterval(popInterval);
  startGame();
});

backBtn.addEventListener('click', () => {
  clickSound.play().catch(() => {});
  bgMusic.pause();
  window.location.href = 'index.html';
});

soundToggleBtn.addEventListener('click', () => {
  isSoundOn = !isSoundOn;
  localStorage.setItem('sound', isSoundOn ? 'on' : 'off');
  soundToggleBtn.textContent = isSoundOn ? '🔊 Sound: On' : '🔇 Sound: Off';
  isSoundOn ? bgMusic.play().catch(() => {}) : bgMusic.pause();
  if (isSoundOn) clickSound.play().catch(() => {});
});

restartPopupBtn.addEventListener('click', () => {
  hideGameOverPopup();
  replayBtn.click();
});

menuPopupBtn.addEventListener('click', () => {
  hideGameOverPopup();
  backBtn.click();
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark');
  }
  soundToggleBtn.textContent = isSoundOn ? '🔊 Sound: On' : '🔇 Sound: Off';
  timerDisplay.textContent = "Click Start to Play";
});

if (startGameBtn) {
  startGameBtn.addEventListener('click', () => {
    clickSound.play().catch(() => {});
    startGame();
  });
  }
