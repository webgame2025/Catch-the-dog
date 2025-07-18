// script_menu.js
const startBtn = document.getElementById('startBtn');
const playerNameInput = document.getElementById('playerName');
const difficulty = document.getElementById('difficulty');
const gameType = document.getElementById('gameType');
const highScoreList = document.getElementById('highScoreList');
const darkModeBtn = document.getElementById('darkModeBtn');

function getHighScores() {
  return JSON.parse(localStorage.getItem('highScores') || '[]');
}
function updateHighScoreDisplay() {
  const scores = getHighScores();
  highScoreList.innerHTML = '';
  scores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.name}: ${s.score}`;
    highScoreList.appendChild(li);
  });
}
function toggleDarkMode() {
  document.body.classList.toggle('dark');
}
startBtn.addEventListener('click', () => {
  localStorage.setItem('playerName', playerNameInput.value || 'Anonymous');
  localStorage.setItem('difficulty', difficulty.value);
  localStorage.setItem('gameType', gameType.value);
  window.location.href = 'game.html';
});
darkModeBtn.addEventListener('click', toggleDarkMode);
updateHighScoreDisplay();
