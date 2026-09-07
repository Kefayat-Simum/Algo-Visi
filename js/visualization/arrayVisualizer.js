import { generateRandomArray } from '../utils/helpers.js';
import { generateBubbleSortSteps } from '../algorithms/bubbleSort.js';
import { AnimationController } from './animationController.js';

const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const speedSlider = document.getElementById('speed-slider');

const controller = new AnimationController();
let currentArray = [];

// Render array bars to DOM
function renderArrayState(step) {
  const { array, comparing, swapping, sorted } = step;
  arrayContainer.innerHTML = '';

  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${value * 3}px`;
    bar.textContent = value;

    if (comparing.includes(index)) bar.classList.add('compare');
    if (swapping.includes(index)) bar.classList.add('swap');
    if (sorted.includes(index)) bar.classList.add('sorted');

    arrayContainer.appendChild(bar);
  });
}

// Generate new random data set
function resetArray() {
  controller.reset();
  currentArray = generateRandomArray(12, 15, 90);
  renderArrayState({
    array: currentArray,
    comparing: [],
    swapping: [],
    sorted: []
  });
}

// Event Listeners
generateBtn.addEventListener('click', resetArray);

playBtn.addEventListener('click', () => {
  if (!controller.isPlaying && controller.steps.length === 0) {
    const steps = generateBubbleSortSteps(currentArray);
    controller.setSteps(steps);
  }
  controller.play(renderArrayState);
});

pauseBtn.addEventListener('click', () => {
  controller.pause();
});

speedSlider.addEventListener('input', (e) => {
  controller.setSpeed(Number(e.target.value));
});

// Initial Setup
resetArray();