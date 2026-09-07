import { generateRandomArray } from '../utils/helpers.js';
import { parseSingleInteger } from '../utils/validation.js';
import { COMPLEXITY_DATA } from '../utils/complexity.js';
import { generateLinearSearchSteps } from '../algorithms/linearSearch.js';
import { generateBinarySearchSteps } from '../algorithms/binarySearch.js';
import { AnimationController } from './animationController.js';

const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const algoSelect = document.getElementById('algo-select');
const targetInput = document.getElementById('target-input');

const algoName = document.getElementById('algo-name');
const timeBest = document.getElementById('time-best');
const timeWorst = document.getElementById('time-worst');
const spaceComp = document.getElementById('space-comp');

const controller = new AnimationController();
let currentArray = [];

function updateComplexityPanel(selectedAlgo) {
  const data = COMPLEXITY_DATA[selectedAlgo];
  if (data) {
    algoName.textContent = data.name;
    timeBest.textContent = data.timeBest;
    timeWorst.textContent = data.timeWorst;
    spaceComp.textContent = data.space;
  }
}

function renderArrayState(step) {
  const { array, checking, found, range } = step;
  arrayContainer.innerHTML = '';

  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'array-bar';
    bar.style.height = `${value * 3}px`;
    bar.textContent = value;

    if (range.length === 2 && (index < range[0] || index > range[1])) {
      bar.style.opacity = '0.3'; // Dim elements outside search window
    }

    if (checking.includes(index)) bar.classList.add('compare');
    if (index === found) bar.classList.add('sorted'); // Highlight found element green

    arrayContainer.appendChild(bar);
  });
}

function resetArray() {
  controller.reset();
  currentArray = generateRandomArray(12, 10, 90);
  if (algoSelect.value === 'binarySearch') {
    currentArray.sort((a, b) => a - b);
  }
  renderArrayState({ array: currentArray, checking: [], found: -1, range: [] });
}

generateBtn.addEventListener('click', resetArray);

algoSelect.addEventListener('change', (e) => {
  updateComplexityPanel(e.target.value);
  resetArray();
});

playBtn.addEventListener('click', () => {
  const validation = parseSingleInteger(targetInput.value);
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }

  if (!controller.isPlaying && controller.steps.length === 0) {
    const target = validation.data;
    const steps = algoSelect.value === 'linearSearch' 
      ? generateLinearSearchSteps(currentArray, target)
      : generateBinarySearchSteps(currentArray, target);
    controller.setSteps(steps);
  }
  controller.play(renderArrayState);
});

pauseBtn.addEventListener('click', () => { controller.pause(); });

resetArray();
updateComplexityPanel('linearSearch');