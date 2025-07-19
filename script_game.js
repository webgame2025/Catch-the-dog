let score = 0;
let timeLeft = 60;
let isPaused = false;
let gameTimer, popInterval;
let holes = [];
let popSpeed = 500;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const pauseBtn = document.getElementById('pauseBtn');
const replayBtn = document.getElementById('replayBtn');
const backBtn = document.getElementById('backToMenuBtn');
const gameArea = document.getElementById('gameArea');

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

function updateTimer() {
  if (isPaused) return;
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  if (timeLeft <= 0) {
    clearInterval(gameTimer);
    clearInterval(popInterval);
    alert(`Time's up! ${localStorage.getItem('playerName') || 'Player'} scored: ${score}`);
    saveHighScore(localStorage.getItem('playerName') || 'Anonymous', score);
    replayBtn.style.display = 'inline-block';
  }
}

function setDifficulty() {
  const difficulty = localStorage.getItem('difficulty');
  if (difficulty === 'easy') { timeLeft = 70; popSpeed = 650; }
  else if (difficulty === 'medium') { timeLeft = 60; popSpeed = 500; }
  else if (difficulty === 'hard') { timeLeft = 45; popSpeed = 350; }
}

function startGame() {
  score = 0;
  isPaused = false;
  setDifficulty();
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  createHoles();
  gameTimer = setInterval(updateTimer, 1000);
  popInterval = setInterval(randomPop, popSpeed);
}

pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

replayBtn.addEventListener('click', () => {
  clearInterval(gameTimer);
  clearInterval(popInterval);
  startGame();
});

backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark');
  }
  startGame();
});
