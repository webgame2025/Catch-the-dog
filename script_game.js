let score = 0;
let timeLeft = 60;
let isPaused = false;
let gameTimer, popInterval;
let holes = [];
let popSpeed = 500;

let isSoundOn = localStorage.getItem('sound') !== 'off';

// Sound setup
const catchSound = new Audio('catch.mp3');
const bgMusic = new Audio('bgmusic.mp3');
const clickSound = new Audio('click.mp3');
bgMusic.loop = true;

catchSound.volume = 1;
bgMusic.volume = 1;
clickSound.volume = 1;

// Error logging
catchSound.onerror = () => console.error('❌ Failed to load catch.mp3');
bgMusic.onerror = () => console.error('❌ Failed to load bgmusic.mp3');
clickSound.onerror = () => console.error('❌ Failed to load click.mp3');

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

function getHighScores() {
  return JSON.parse(localStorage.getItem('highScores') || '[]');
}

function saveHighScore(name, score) {
  const scores = getHighScores();
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem('highScores', JSON.stringify(scores.slice(0, 5)));
}

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
          catchSound.play().catch(err => console.warn('Catch sound blocked:', err));
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
  const count = localStorage.getItem('gameType') === 'chaos' ? Math.floor(Math.random() * 4) + 2 : 1;
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * holes.length);
    const cat = holes[idx];
    if (!cat.classList.contains('up') && !cat.classList.contains('hit')) {
      cat.classList.add('up');
      setTimeout(() => cat.classList.remove('up'), popSpeed - 60);
    }
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
    saveHighScore(localStorage.getItem('playerName') || 'Anonymous', score);
    replayBtn.style.display = 'inline-block';
    bgMusic.pause();
    showGameOverPopup();
  }
}

function setDifficulty() {
  const difficulty = localStorage.getItem('difficulty');
  if (difficulty === 'easy') {
    timeLeft = 70;
    popSpeed = 650;
  } else if (difficulty === 'medium') {
    timeLeft = 60;
    popSpeed = 500;
  } else if (difficulty === 'hard') {
    timeLeft = 45;
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

  if (isSoundOn) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(err => console.warn('bgMusic play blocked:', err));
  }
}

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';

  if (isSoundOn) {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.warn('clickSound blocked:', err));
  }

  if (isPaused) {
    bgMusic.pause();
  } else {
    if (isSoundOn) {
      bgMusic.play().catch(err => console.warn('bgMusic resume blocked:', err));
    }
  }
});

replayBtn.addEventListener('click', () => {
  if (isSoundOn) {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.warn('clickSound blocked:', err));
  }

  clearInterval(gameTimer);
  clearInterval(popInterval);
  startGame();
});

backBtn.addEventListener('click', () => {
  if (isSoundOn) {
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.warn('clickSound blocked:', err));
  }

  bgMusic.pause();
  window.location.href = 'index.html';
});

soundToggleBtn.addEventListener('click', () => {
  isSoundOn = !isSoundOn;
  localStorage.setItem('sound', isSoundOn ? 'on' : 'off');
  soundToggleBtn.textContent = isSoundOn ? '🔊 Sound: On' : '🔇 Sound: Off';

  if (!isSoundOn) {
    bgMusic.pause();
  } else {
    bgMusic.play().catch(err => console.warn('bgMusic play blocked:', err));
    clickSound.currentTime = 0;
    clickSound.play().catch(err => console.warn('clickSound blocked:', err));
  }
});

// Popup buttons
restartPopupBtn.addEventListener('click', () => {
  hideGameOverPopup();
  replayBtn.click(); // reuse restart logic
});

menu
