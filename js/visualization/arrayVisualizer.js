import { generateRandomArray } from '../utils/helpers.js';
import { COMPLEXITY_DATA } from '../utils/complexity.js';
import { generateBubbleSortSteps } from '../algorithms/bubbleSort.js';
import { generateSelectionSortSteps } from '../algorithms/selectionSort.js';
import { generateInsertionSortSteps } from '../algorithms/insertionSort.js';
import { generateMergeSortSteps } from '../algorithms/mergeSort.js';
import { generateQuickSortSteps } from '../algorithms/quickSort.js';
import { AnimationController } from './animationController.js';

const arrayContainer = document.getElementById('array-container');
const generateBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const speedSlider = document.getElementById('speed-slider');
const algoSelect = document.getElementById('algo-select');

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

function getStepsForSelectedAlgorithm(selectedAlgo, arr) {
  switch (selectedAlgo) {
    case 'bubbleSort': return generateBubbleSortSteps(arr);
    case 'selectionSort': return generateSelectionSortSteps(arr);
    case 'insertionSort': return generateInsertionSortSteps(arr);
    case 'mergeSort': return generateMergeSortSteps(arr);
    case 'quickSort': return generateQuickSortSteps(arr);
    default: return generateBubbleSortSteps(arr);
  }
}

generateBtn.addEventListener('click', resetArray);

algoSelect.addEventListener('change', (e) => {
  updateComplexityPanel(e.target.value);
  resetArray();
});

playBtn.addEventListener('click', () => {
  if (!controller.isPlaying && controller.steps.length === 0) {
    const steps = getStepsForSelectedAlgorithm(algoSelect.value, currentArray);
    controller.setSteps(steps);
  }
  controller.play(renderArrayState);
});

pauseBtn.addEventListener('click', () => { controller.pause(); });
speedSlider.addEventListener('input', (e) => { controller.setSpeed(Number(e.target.value)); });

resetArray();
updateComplexityPanel('bubbleSort');