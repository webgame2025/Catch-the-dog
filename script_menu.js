const startBtn = document.getElementById('startBtn');
const darkModeBtn = document.getElementById('darkModeBtn');
const highScoreList = document.getElementById('highScoreList');

startBtn.addEventListener('click', () => {
const playerName = document.getElementById('playerName').value || 'Anonymous';
const gameType = document.getElementById('gameType').value;
const difficulty = document.getElementById('difficulty').value;

localStorage.setItem('playerName', playerName);
localStorage.setItem('gameType', gameType);
localStorage.setItem('difficulty', difficulty);

window.location.href = 'game.html';
});

darkModeBtn.addEventListener('click', () => {
document.body.classList.toggle('dark');
localStorage.setItem('darkMode', document.body.classList.contains('dark') ? 'on' : 'off');
});

function updateHighScoreDisplay() {
const scores = JSON.parse(localStorage.getItem('highScores') || '[]');
highScoreList.innerHTML = '';
scores.forEach(s => {
const li = document.createElement('li');
li.textContent = ${s.name}: ${s.score};
highScoreList.appendChild(li);
});
}

window.addEventListener('DOMContentLoaded', () => {
if (localStorage.getItem('darkMode') === 'on') {
document.body.classList.add('dark');
}
updateHighScoreDisplay();
});

