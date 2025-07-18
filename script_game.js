// script_game.js
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const pauseBtn = document.getElementById('pauseBtn');
const replayBtn = document.getElementById('replayBtn');
const gameArea = document.getElementById('gameArea');

let playerName = localStorage.getItem('playerName') || 'Anonymous';
let difficulty = localStorage.getItem('difficulty') || 'medium';
let gameType = localStorage.getItem('gameType') || 'classic';

let score = 0, timeLeft = 60, gameTimer, popInterval, holes = [];
let popSpeed = 400;
let isPaused = false;

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
  const count = gameType === 'chaos' ? Math.floor(Math.random() * 4) + 2 : 1;
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * holes.length);
    const cat = holes[idx];
    if (!cat.classList.contains('up') && !cat.classList.contains('hit')) {
      cat.classList.add('up');
      setTimeout(() => cat.classList.remove('up'), popSpeed - 50);
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
    alert(`Time's up! ${playerName} scored: ${score}`);
    saveHighScore(playerName, score);
    replayBtn.style.display = 'inline-block';
  }
}
function setDifficulty() {
  switch (difficulty) {
    case 'easy': timeLeft = 70; popSpeed = 600; break;
    case 'medium': timeLeft = 60; popSpeed = 400; break;
    case 'hard': timeLeft = 45; popSpeed = 250; break;
  }
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
function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
}
function replayGame() {
  clearInterval(gameTimer);
  clearInterval(popInterval);
  startGame();
}

pauseBtn.addEventListener('click', togglePause);
replayBtn.addEventListener('click', replayGame);
startGame();
