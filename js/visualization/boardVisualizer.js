import { generateNQueensSteps } from '../algorithms/nQueens.js';
import { AnimationController } from './animationController.js';

const boardElement = document.getElementById('board');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed-slider');
const statusOutput = document.getElementById('status-output');

const controller = new AnimationController();

function renderBoardState(step) {
  const { board, status, cellState } = step;
  boardElement.innerHTML = '';
  statusOutput.textContent = status;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.createElement('div');
      const isDark = (r + c) % 2 === 1;
      cell.className = `cell ${isDark ? 'dark' : 'light'}`;

      if (board[r][c] === 1) {
        cell.textContent = '👑';
        cell.classList.add('queen');
      }

      if (cellState.row === r && cellState.col === c) {
        if (cellState.type === 'testing') cell.classList.add('testing');
        if (cellState.type === 'conflict') cell.classList.add('conflict');
      }

      boardElement.appendChild(cell);
    }
  }
}

function resetVisualizer() {
  controller.reset();
  renderBoardState({
    board: Array.from({ length: 4 }, () => Array(4).fill(0)),
    status: 'Ready to start',
    cellState: { row: -1, col: -1, type: '' }
  });
}

playBtn.addEventListener('click', () => {
  if (!controller.isPlaying && controller.steps.length === 0) {
    const steps = generateNQueensSteps(4);
    controller.setSteps(steps);
  }
  controller.play(renderBoardState);
});

pauseBtn.addEventListener('click', () => { controller.pause(); });
resetBtn.addEventListener('click', resetVisualizer);
speedSlider.addEventListener('input', (e) => { controller.setSpeed(Number(e.target.value)); });

resetVisualizer();