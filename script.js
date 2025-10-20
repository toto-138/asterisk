let drawPool = [];
let drawnNumbers = [];
let autoInterval = null;

const bingoCardDiv = document.getElementById("bingoCard");
const drawnList = document.getElementById("drawnList");
const info = document.getElementById("info");

document.getElementById("newGame").addEventListener("click", newGame);
document.getElementById("drawNumber").addEventListener("click", drawNumber);
document.getElementById("autoPlay").addEventListener("click", toggleAutoPlay);

let bingoCard = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateCard() {
  const cols = [
    shuffle(Array.from({ length: 15 }, (_, i) => i + 1)).slice(0, 5),
    shuffle(Array.from({ length: 15 }, (_, i) => i + 16)).slice(0, 5),
    shuffle(Array.from({ length: 15 }, (_, i) => i + 31)).slice(0, 5),
    shuffle(Array.from({ length: 15 }, (_, i) => i + 46)).slice(0, 5),
    shuffle(Array.from({ length: 15 }, (_, i) => i + 61)).slice(0, 5),
  ];
  cols[2][2] = "FREE";
  const grid = [];
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      row.push({ value: cols[c][r], marked: cols[c][r] === "FREE" });
    }
    grid.push(row);
  }
  return grid;
}

function renderCard() {
  bingoCardDiv.innerHTML = "";
  const letters = ["B", "I", "N", "G", "O"];
  letters.forEach(l => {
    const header = document.createElement("div");
    header.className = "cell";
    header.style.fontWeight = "bold";
    header.style.background = "#f0f0f0";
    header.innerText = l;
    bingoCardDiv.appendChild(header);
  });

  bingoCard.forEach((row, r) => {
    row.forEach((cell, c) => {
      const div = document.createElement("div");
      div.className = "cell" + (cell.marked ? " marked" : "") + (cell.value === "FREE" ? " free" : "");
      div.innerText = cell.value;
      div.addEventListener("click", () => markCell(r, c));
      bingoCardDiv.appendChild(div);
    });
  });
}

function markCell(r, c) {
  if (bingoCard[r][c].value === "FREE") return;
  bingoCard[r][c].marked = !bingoCard[r][c].marked;
  renderCard();
  if (checkBingo()) {
    info.textContent = "🎉 BINGO!";
    stopAutoPlay();
  }
}

function newGame() {
  drawPool = shuffle(Array.from({ length: 75 }, (_, i) => i + 1));
  drawnNumbers = [];
  bingoCard = generateCard();
  renderCard();
  renderDrawn();
  info.textContent = "";
  stopAutoPlay();
}

function drawNumber() {
  if (drawPool.length === 0) return;
  const n = drawPool.shift();
  drawnNumbers.unshift(n);
  markDrawn(n);
  renderDrawn();
}

function markDrawn(n) {
  bingoCard.forEach(row =>
    row.forEach(cell => {
      if (cell.value === n) cell.marked = true;
    })
  );
  renderCard();
  if (checkBingo()) {
    info.textContent = "🎉 BINGO!";
    stopAutoPlay();
  }
}

function renderDrawn() {
  drawnList.innerHTML = drawnNumbers.map(n => `<span>${n}</span>`).join("");
}

function checkBingo() {
  // Check rows
  for (let r = 0; r < 5; r++)
    if (bingoCard[r].every(c => c.marked)) return true;
  // Check cols
  for (let c = 0; c < 5; c++)
    if (bingoCard.every(r => r[c].marked)) return true;
  // Diagonals
  if ([0,1,2,3,4].every(i => bingoCard[i][i].marked)) return true;
  if ([0,1,2,3,4].every(i => bingoCard[i][4-i].marked)) return true;
  return false;
}

function toggleAutoPlay() {
  if (autoInterval) stopAutoPlay();
  else startAutoPlay();
}

function startAutoPlay() {
  autoInterval = setInterval(() => {
    if (drawPool.length === 0) stopAutoPlay();
    drawNumber();
  }, 1000);
  info.textContent = "Auto drawing...";
}

function stopAutoPlay() {
  clearInterval(autoInterval);
  autoInterval = null;
}

// Start new game when page loads
newGame();
