// ==========================================================================
// Standalone Searching Visualizer (Zero External CORS Dependencies)
// Runs directly on file:/// and http:// in all modern browsers
// ==========================================================================

(() => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const COMPLEXITY_DATA = {
    linearSearch: { name: 'Linear Search', timeBest: 'O(1)', timeWorst: 'O(n)', space: 'O(1)' },
    binarySearch: { name: 'Binary Search', timeBest: 'O(1)', timeWorst: 'O(log n)', space: 'O(1)' }
  };

  function parseSingleInteger(inputVal) {
    const num = Number(inputVal);
    if (isNaN(num) || String(inputVal).trim() === '') {
      return { isValid: false, error: 'Please enter a valid integer target.' };
    }
    return { isValid: true, data: num };
  }

  function generateRandomArray(length = 12, min = 10, max = 95) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  }

  function generateLinearSearchSteps(array, target) {
    const steps = [];
    const arr = [...array];
    let foundIndex = -1;

    for (let i = 0; i < arr.length; i++) {
      steps.push({ array: [...arr], checking: [i], found: -1, range: [] });
      if (arr[i] === target) {
        foundIndex = i;
        steps.push({ array: [...arr], checking: [], found: i, range: [] });
        break;
      }
    }
    if (foundIndex === -1) {
      steps.push({ array: [...arr], checking: [], found: -2, range: [] });
    }
    return steps;
  }

  function generateBinarySearchSteps(array, target) {
    const steps = [];
    const arr = [...array].sort((a, b) => a - b);
    let low = 0;
    let high = arr.length - 1;
    let foundIndex = -1;

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      steps.push({ array: [...arr], checking: [mid], found: -1, range: [low, high] });

      if (arr[mid] === target) {
        foundIndex = mid;
        steps.push({ array: [...arr], checking: [], found: mid, range: [] });
        break;
      } else if (arr[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    if (foundIndex === -1) {
      steps.push({ array: [...arr], checking: [], found: -2, range: [] });
    }
    return steps;
  }

  class AnimationController {
    constructor() {
      this.isPlaying = false;
      this.isPaused = false;
      this.speed = 500;
      this.currentStep = 0;
      this.steps = [];
      this.sessionId = 0;
    }

    setSteps(steps) {
      this.sessionId++;
      this.steps = steps;
      this.currentStep = 0;
      this.isPlaying = false;
      this.isPaused = false;
    }

    setSpeed(speedVal) {
      this.speed = Math.max(20, 1020 - speedVal);
    }

    async play(renderCallback) {
      if (this.isPlaying) return;
      if (this.currentStep >= this.steps.length) {
        this.currentStep = 0;
      }

      this.isPlaying = true;
      this.isPaused = false;
      const session = ++this.sessionId;

      while (
        this.currentStep < this.steps.length &&
        this.isPlaying &&
        !this.isPaused &&
        session === this.sessionId
      ) {
        if (renderCallback) renderCallback(this.steps[this.currentStep]);
        this.currentStep++;
        if (this.currentStep >= this.steps.length) break;
        await delay(this.speed);
        if (session !== this.sessionId || !this.isPlaying || this.isPaused) return;
      }
      if (session === this.sessionId) this.isPlaying = false;
    }

    pause() {
      this.sessionId++;
      this.isPaused = true;
      this.isPlaying = false;
    }

    reset() {
      this.sessionId++;
      this.isPlaying = false;
      this.isPaused = false;
      this.currentStep = 0;
      this.steps = [];
    }
  }

  // DOM Elements
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
      if (algoName) algoName.textContent = data.name;
      if (timeBest) timeBest.textContent = data.timeBest;
      if (timeWorst) timeWorst.textContent = data.timeWorst;
      if (spaceComp) spaceComp.textContent = data.space;
    }
  }

  function renderArrayState(step) {
    const { array, checking, found, range } = step;
    if (!arrayContainer) return;
    arrayContainer.innerHTML = '';

    array.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'array-bar';
      bar.style.height = `${value * 3}px`;
      bar.textContent = value;

      if (range.length === 2 && (index < range[0] || index > range[1])) {
        bar.style.opacity = '0.25';
      }

      if (checking.includes(index)) bar.classList.add('compare');
      if (index === found) bar.classList.add('sorted');

      arrayContainer.appendChild(bar);
    });
  }

  function resetArray() {
    controller.reset();
    currentArray = generateRandomArray(12, 10, 90);
    if (algoSelect && algoSelect.value === 'binarySearch') {
      currentArray.sort((a, b) => a - b);
    }
    // Set a default target so user can click Start right away!
    if (targetInput && !targetInput.value) {
      targetInput.value = currentArray[Math.floor(Math.random() * currentArray.length)];
    }
    renderArrayState({ array: currentArray, checking: [], found: -1, range: [] });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', resetArray);
  }

  if (algoSelect) {
    algoSelect.addEventListener('change', (e) => {
      updateComplexityPanel(e.target.value);
      resetArray();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      const validation = parseSingleInteger(targetInput.value);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      if (!controller.isPlaying && (controller.steps.length === 0 || controller.currentStep >= controller.steps.length)) {
        const target = validation.data;
        const steps = (algoSelect && algoSelect.value === 'linearSearch')
          ? generateLinearSearchSteps(currentArray, target)
          : generateBinarySearchSteps(currentArray, target);
        controller.setSteps(steps);
      }
      controller.play(renderArrayState);
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      controller.pause();
    });
  }

  // Initial Load
  resetArray();
  updateComplexityPanel('linearSearch');
})();