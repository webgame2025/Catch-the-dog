const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const pauseBtn = document.getElementById("pauseBtn");
const replayBtn = document.getElementById("replayBtn");

let score = 0;
let timeLeft = 60;
let isPaused = false;
let gameInterval;

function randomPosition() {
  const x = Math.floor(Math.random() * (gameArea.clientWidth - 60));
  const y = Math.floor(Math.random() * (gameArea.clientHeight - 60));
  return { x, y };
}

function spawnCat() {
  if (isPaused || timeLeft <= 0) return;

  const cat = document.createElement("div");
  cat.classList.add("cat");
  const { x, y } = randomPosition();
  cat.style.left = `${x}px`;
  cat.style.top = `${y}px`;

  cat.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    cat.remove();
  });

  gameArea.appendChild(cat);

  setTimeout(() => {
    if (cat.parentNode) cat.remove();
  }, 800);
}

function startGame() {
  score = 0;
  timeLeft = 60;
  isPaused = false;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}`;
  replayBtn.style.display = "none";

  gameInterval = setInterval(() => {
    if (!isPaused && timeLeft > 0) {
      spawnCat();
      timeLeft--;
      timerDisplay.textContent = `Time: ${timeLeft}`;
    }
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      replayBtn.style.display = "inline-block";
    }
  }, 1000);
}

pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "▶️ Resume" : "⏸ Pause";
});

replayBtn.addEventListener("click", () => {
  clearInterval(gameInterval);
  startGame();
});

startGame();
