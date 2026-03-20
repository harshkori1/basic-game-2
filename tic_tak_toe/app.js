// Select elements
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let modeSelect = document.querySelector("#mode");
let modeContainer = document.querySelector(".mode-container");
let gameArea = document.querySelector(".container");

let turnO = true;
let count = 0;
let isComputerMode = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Reset Game
const resetGame = () => {
  turnO = true;
  count = 0;
  enableBoxes();
  msgContainer.classList.add("hide");
  gameArea.classList.remove("hide");
  modeContainer.classList.remove("hide");
};

// Player move
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turnO) {
      box.innerText = "O";
      turnO = false;
    } else {
      box.innerText = "X";
      turnO = true;
    }

    box.disabled = true;
    count++;

    let isWinner = checkWinner();

    if (count === 9 && !isWinner) gameDraw();

    if (isComputerMode && !turnO && !isWinner && count < 9) {
      setTimeout(computerMove, 600);
    }
  });
});

// --- MEDIUM COMPUTER LOGIC ---
const computerMove = () => {
  let available = [];
  boxes.forEach((box, i) => {
    if (box.innerText === "") available.push(i);
  });
  if (available.length === 0) return;

  // Add some randomness (70% smart, 30% random)
  let smartMoveChance = Math.random();

  // 70% of the time, play smart
  if (smartMoveChance < 0.7) {
    // Try to win
    for (let pattern of winPatterns) {
      let [a, b, c] = pattern;
      let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
      if (values.filter(v => v === "X").length === 2 && values.includes("")) {
        let moveIndex = pattern[values.indexOf("")];
        makeMove(moveIndex);
        return;
      }
    }

    // Try to block
    for (let pattern of winPatterns) {
      let [a, b, c] = pattern;
      let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
      if (values.filter(v => v === "O").length === 2 && values.includes("")) {
        let moveIndex = pattern[values.indexOf("")];
        makeMove(moveIndex);
        return;
      }
    }

    // Prefer center
    if (boxes[4].innerText === "") {
      makeMove(4);
      return;
    }

    // Prefer corners
    let corners = [0, 2, 6, 8].filter(i => boxes[i].innerText === "");
    if (corners.length > 0) {
      makeMove(corners[Math.floor(Math.random() * corners.length)]);
      return;
    }
  }

  // 30% of the time, play randomly
  let randomIndex = available[Math.floor(Math.random() * available.length)];
  makeMove(randomIndex);
};

// Helper: computer makes a move
const makeMove = (index) => {
  boxes[index].innerText = "X";
  boxes[index].disabled = true;
  count++;
  let isWinner = checkWinner();
  if (count === 9 && !isWinner) gameDraw();
  turnO = true;
};

// Draw
const gameDraw = () => {
  msg.innerText = "It's a Draw!";
  endGame();
};

// Disable / Enable boxes
const disableBoxes = () => {
  for (let box of boxes) box.disabled = true;
};
const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

// Show Winner
const showWinner = (winner) => {
  msg.innerText = `Winner is ${winner}! 🎉`;
  endGame();
};

// End Game
const endGame = () => {
  disableBoxes();
  gameArea.classList.add("hide");
  modeContainer.classList.add("hide");
  msgContainer.classList.remove("hide");
};

// Check winner
const checkWinner = () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;
    let pos1 = boxes[a].innerText;
    let pos2 = boxes[b].innerText;
    let pos3 = boxes[c].innerText;

    if (pos1 && pos1 === pos2 && pos2 === pos3) {
      showWinner(pos1);
      return true;
    }
  }
  return false;
};

// Event Listeners
newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

if (modeSelect) {
  modeSelect.addEventListener("change", (e) => {
    isComputerMode = e.target.value === "computer";
    resetGame();
  });
}
