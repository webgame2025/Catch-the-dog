const startBtn = document.getElementById('startBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const highScoreList = document.getElementById('highScoreList');

// Audio elements
const bgMusic = document.getElementById('bgMusic');
const clickSound = document.getElementById('clickSound');

let bgMusicStarted = false;

// Play background music after first user interaction
function playBgMusicOnce() {
  if (!bgMusicStarted) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(e => console.log('Background music play blocked:', e));
    bgMusicStarted = true;
  }
}

// Play click sound
function playClickSound() {
  clickSound.currentTime = 0;
  clickSound.play();
}

startBtn.addEventListener('click', () => {
  playClickSound();
  playBgMusicOnce();

  const playerName = document.getElementById('playerName').value || 'Anonymous';
  const gameType = document.getElementById('gameType').value;
  const difficulty = document.getElementById('difficulty').value;

  localStorage.setItem('playerName', playerName);
  localStorage.setItem('gameType', gameType);
  localStorage.setItem('difficulty', difficulty);

  window.location.href = 'game.html';
});

darkModeBtn.addEventListener('click', () => {
  playClickSound();
  playBgMusicOnce();

  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'on' : 'off');
});

function updateHighScoreDisplay() {
  const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
  highScoreList.innerHTML = '';
  scores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name}: ${s.score}`;
    highScoreList.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark');
  }
  updateHighScoreDisplay();
});

// Play background music on first user click anywhere (to satisfy autoplay restrictions)
window.addEventListener('click', playBgMusicOnce, { once: true });
