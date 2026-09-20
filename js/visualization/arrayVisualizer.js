// ==========================================================================
// Standalone Sorting Visualizer (Zero External CORS Dependencies)
// Runs directly on file:/// and http:// in all modern browsers
// ==========================================================================

(() => {
  // Utility: Pause Delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Big-O Complexity Data
  const COMPLEXITY_DATA = {
    quickSort: { name: 'Quick Sort (Lomuto)', timeBest: 'O(n log n)', timeWorst: 'O(n²)', space: 'O(log n)' },
    bubbleSort: { name: 'Bubble Sort', timeBest: 'O(n)', timeWorst: 'O(n²)', space: 'O(1)' },
    selectionSort: { name: 'Selection Sort', timeBest: 'O(n²)', timeWorst: 'O(n²)', space: 'O(1)' },
    insertionSort: { name: 'Insertion Sort', timeBest: 'O(n)', timeWorst: 'O(n²)', space: 'O(1)' },
    mergeSort: { name: 'Merge Sort', timeBest: 'O(n log n)', timeWorst: 'O(n log n)', space: 'O(n)' }
  };

  // C Code Snippets
  const CODE_SNIPPETS = {
    quickSort: {
      filename: 'quick_sort.c',
      title: 'QUICK SORT',
      subtitle: 'LOMUTO PARTITION',
      lines: [
        { num: 1, text: '<span class="kw">void</span> <span class="fn">quick_sort</span>(<span class="type">int</span> a[], <span class="type">int</span> lo, <span class="type">int</span> hi)' },
        { num: 2, text: '{' },
        { num: 3, text: '  <span class="kw">if</span> (lo &gt;= hi) <span class="kw">return</span>;' },
        { num: 4, text: '  <span class="type">int</span> p = a[hi], i = lo;   <span class="cm">// the pivot</span>' },
        { num: 5, text: '  <span class="kw">for</span> (<span class="type">int</span> j = lo; j &lt; hi; j++)' },
        { num: 6, text: '  {' },
        { num: 7, text: '    <span class="kw">if</span> (a[j] &lt; p) {' },
        { num: 8, text: '      <span class="fn">swap</span>(&amp;a[i], &amp;a[j]);' },
        { num: 9, text: '      i++;' },
        { num: 10, text: '    }' },
        { num: 11, text: '  }' },
        { num: 12, text: '  <span class="fn">swap</span>(&amp;a[i], &amp;a[hi]);' },
        { num: 13, text: '  <span class="fn">quick_sort</span>(a, lo, i - 1);' },
        { num: 14, text: '  <span class="fn">quick_sort</span>(a, i + 1, hi);' },
        { num: 15, text: '}' }
      ]
    },
    bubbleSort: {
      filename: 'bubble_sort.c',
      title: 'BUBBLE SORT',
      subtitle: 'ADJACENT COMPARISON',
      lines: [
        { num: 1, text: '<span class="kw">void</span> <span class="fn">bubble_sort</span>(<span class="type">int</span> a[], <span class="type">int</span> n)' },
        { num: 2, text: '{' },
        { num: 3, text: '  <span class="kw">for</span> (<span class="type">int</span> i = 0; i &lt; n - 1; i++) {' },
        { num: 4, text: '    <span class="kw">for</span> (<span class="type">int</span> j = 0; j &lt; n - i - 1; j++) {' },
        { num: 5, text: '      <span class="kw">if</span> (a[j] &gt; a[j + 1]) {' },
        { num: 6, text: '        <span class="fn">swap</span>(&amp;a[j], &amp;a[j + 1]);' },
        { num: 7, text: '      }' },
        { num: 8, text: '    }' },
        { num: 9, text: '  }' },
        { num: 10, text: '}' }
      ]
    },
    selectionSort: {
      filename: 'selection_sort.c',
      title: 'SELECTION SORT',
      subtitle: 'MINIMUM SELECTION',
      lines: [
        { num: 1, text: '<span class="kw">void</span> <span class="fn">selection_sort</span>(<span class="type">int</span> a[], <span class="type">int</span> n)' },
        { num: 2, text: '{' },
        { num: 3, text: '  <span class="kw">for</span> (<span class="type">int</span> i = 0; i &lt; n - 1; i++) {' },
        { num: 4, text: '    <span class="type">int</span> min_idx = i;' },
        { num: 5, text: '    <span class="kw">for</span> (<span class="type">int</span> j = i + 1; j &lt; n; j++) {' },
        { num: 6, text: '      <span class="kw">if</span> (a[j] &lt; a[min_idx])' },
        { num: 7, text: '        min_idx = j;' },
        { num: 8, text: '    }' },
        { num: 9, text: '    <span class="kw">if</span> (min_idx != i)' },
        { num: 10, text: '      <span class="fn">swap</span>(&amp;a[i], &amp;a[min_idx]);' },
        { num: 11, text: '  }' },
        { num: 12, text: '}' }
      ]
    },
    insertionSort: {
      filename: 'insertion_sort.c',
      title: 'INSERTION SORT',
      subtitle: 'DIRECT INSERTION',
      lines: [
        { num: 1, text: '<span class="kw">void</span> <span class="fn">insertion_sort</span>(<span class="type">int</span> a[], <span class="type">int</span> n)' },
        { num: 2, text: '{' },
        { num: 3, text: '  <span class="kw">for</span> (<span class="type">int</span> i = 1; i &lt; n; i++) {' },
        { num: 4, text: '    <span class="type">int</span> key = a[i], j = i - 1;' },
        { num: 5, text: '    <span class="kw">while</span> (j &gt;= 0 &amp;&amp; a[j] &gt; key) {' },
        { num: 6, text: '      a[j + 1] = a[j];' },
        { num: 7, text: '      j--;' },
        { num: 8, text: '    }' },
        { num: 9, text: '    a[j + 1] = key;' },
        { num: 10, text: '  }' },
        { num: 11, text: '}' }
      ]
    },
    mergeSort: {
      filename: 'merge_sort.c',
      title: 'MERGE SORT',
      subtitle: 'DIVIDE AND CONQUER',
      lines: [
        { num: 1, text: '<span class="kw">void</span> <span class="fn">merge_sort</span>(<span class="type">int</span> a[], <span class="type">int</span> lo, <span class="type">int</span> hi)' },
        { num: 2, text: '{' },
        { num: 3, text: '  <span class="kw">if</span> (lo &gt;= hi) <span class="kw">return</span>;' },
        { num: 4, text: '  <span class="type">int</span> mid = lo + (hi - lo) / 2;' },
        { num: 5, text: '  <span class="fn">merge_sort</span>(a, lo, mid);' },
        { num: 6, text: '  <span class="fn">merge_sort</span>(a, mid + 1, hi);' },
        { num: 7, text: '  <span class="fn">merge</span>(a, lo, mid, hi);' },
        { num: 8, text: '}' }
      ]
    }
  };

  // Algorithm Step Generators
  function generateQuickSortSteps(array) {
    const steps = [];
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;
    const sorted = new Set();

    function record(codeLine, comparing, swapping, pivotIndex, pointers, craneTarget, status) {
      steps.push({
        array: [...arr],
        comparing: [...comparing],
        swapping: [...swapping],
        sorted: Array.from(sorted),
        pivotIndex,
        pointers: { ...pointers },
        craneTarget: craneTarget >= 0 ? craneTarget : (comparing[0] ?? swapping[0] ?? 0),
        comparisons,
        swaps,
        codeLine,
        status
      });
    }

    function partition(lo, hi) {
      const pivot = arr[hi];
      let i = lo;
      record(4, [], [], hi, { p: hi, i: lo }, hi, `Selected pivot: ${pivot} at index [${hi}]`);

      for (let j = lo; j < hi; j++) {
        comparisons++;
        record(5, [j], [], hi, { p: hi, i, j }, j, `Comparing arr[${j}] (${arr[j]}) with pivot ${pivot}`);
        record(7, [j, hi], [], hi, { p: hi, i, j }, j, `Is ${arr[j]} < ${pivot}? ${arr[j] < pivot ? 'Yes' : 'No'}`);

        if (arr[j] < pivot) {
          if (i !== j) {
            swaps++;
            const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
            record(8, [], [i, j], hi, { p: hi, i, j }, i, `Swapping arr[${i}] and arr[${j}]`);
          }
          i++;
          record(9, [], [], hi, { p: hi, i, j }, i, `Incremented i to ${i}`);
        }
      }

      if (i !== hi) {
        swaps++;
        const t = arr[i]; arr[i] = arr[hi]; arr[hi] = t;
        record(12, [], [i, hi], i, { p: i, i }, i, `Placing pivot ${arr[i]} into position [${i}]`);
      }
      sorted.add(i);
      record(12, [], [], -1, {}, i, `Pivot ${arr[i]} is now in sorted position`);
      return i;
    }

    function sort(lo, hi) {
      if (lo > hi) return;
      if (lo === hi) {
        sorted.add(lo);
        record(3, [], [], -1, {}, lo, `Element at [${lo}] sorted`);
        return;
      }
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    }

    sort(0, arr.length - 1);
    for (let k = 0; k < arr.length; k++) sorted.add(k);
    record(15, [], [], -1, {}, 0, 'Array fully sorted with Quick Sort');
    return steps;
  }

  function generateBubbleSortSteps(array) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sorted = [];

    function record(codeLine, comparing, swapping, pointers, craneTarget, status) {
      steps.push({
        array: [...arr],
        comparing: [...comparing],
        swapping: [...swapping],
        sorted: [...sorted],
        pointers: { ...pointers },
        craneTarget: craneTarget >= 0 ? craneTarget : (comparing[0] ?? swapping[0] ?? 0),
        comparisons,
        swaps,
        codeLine,
        status
      });
    }

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        comparisons++;
        record(4, [j, j + 1], [], { j, 'j+1': j + 1 }, j, `Comparing arr[${j}] (${arr[j]}) with arr[${j + 1}] (${arr[j + 1]})`);
        if (arr[j] > arr[j + 1]) {
          swaps++;
          const t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;
          record(6, [], [j, j + 1], { j, 'j+1': j + 1 }, j + 1, `Swapping arr[${j}] and arr[${j + 1}]`);
        }
      }
      sorted.unshift(n - 1 - i);
    }
    sorted.unshift(0);
    record(10, [], [], {}, 0, 'Array fully sorted with Bubble Sort');
    return steps;
  }

  function generateSelectionSortSteps(array) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    const sorted = [];

    function record(codeLine, comparing, swapping, pointers, craneTarget, status) {
      steps.push({
        array: [...arr],
        comparing: [...comparing],
        swapping: [...swapping],
        sorted: [...sorted],
        pointers: { ...pointers },
        craneTarget: craneTarget >= 0 ? craneTarget : (comparing[0] ?? swapping[0] ?? 0),
        comparisons,
        swaps,
        codeLine,
        status
      });
    }

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      record(4, [i], [], { i, min: minIdx }, i, `Initial min_idx = ${i}`);

      for (let j = i + 1; j < n; j++) {
        comparisons++;
        record(6, [j, minIdx], [], { i, j, min: minIdx }, j, `Comparing arr[${j}] with minimum arr[${minIdx}]`);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          record(7, [minIdx], [], { i, j, min: minIdx }, minIdx, `New minimum at [${minIdx}] (${arr[minIdx]})`);
        }
      }

      if (minIdx !== i) {
        swaps++;
        const t = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = t;
        record(10, [], [i, minIdx], { i, min: minIdx }, i, `Swapping minimum into position [${i}]`);
      }
      sorted.push(i);
    }
    sorted.push(n - 1);
    record(12, [], [], {}, 0, 'Array fully sorted with Selection Sort');
    return steps;
  }

  function generateInsertionSortSteps(array) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;

    function record(codeLine, comparing, swapping, pointers, craneTarget, status, sorted = []) {
      steps.push({
        array: [...arr],
        comparing: [...comparing],
        swapping: [...swapping],
        sorted: [...sorted],
        pointers: { ...pointers },
        craneTarget: craneTarget >= 0 ? craneTarget : (comparing[0] ?? swapping[0] ?? 0),
        comparisons,
        swaps,
        codeLine,
        status
      });
    }

    record(3, [], [], {}, 0, 'First element is considered sorted', [0]);

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      record(4, [i], [], { i, key: i }, i, `Taking key arr[${i}] = ${key}`, Array.from({ length: i }, (_, k) => k));

      while (j >= 0) {
        comparisons++;
        record(5, [j, i], [], { i, j }, j, `Comparing arr[${j}] with key ${key}`, Array.from({ length: i }, (_, k) => k));
        if (arr[j] > key) {
          swaps++;
          arr[j + 1] = arr[j];
          record(6, [], [j + 1], { i, j: j + 1 }, j + 1, `Shifting arr[${j}] right`, Array.from({ length: i }, (_, k) => k));
          j--;
        } else {
          break;
        }
      }
      arr[j + 1] = key;
      record(9, [], [j + 1], { inserted: j + 1 }, j + 1, `Inserted key ${key} at index [${j + 1}]`, Array.from({ length: i + 1 }, (_, k) => k));
    }
    record(11, [], [], {}, 0, 'Array fully sorted with Insertion Sort', Array.from({ length: n }, (_, k) => k));
    return steps;
  }

  function generateMergeSortSteps(array) {
    const steps = [];
    const arr = [...array];
    let comparisons = 0;
    let swaps = 0;
    const sorted = new Set();

    function record(codeLine, comparing, swapping, pointers, craneTarget, status) {
      steps.push({
        array: [...arr],
        comparing: [...comparing],
        swapping: [...swapping],
        sorted: Array.from(sorted),
        pointers: { ...pointers },
        craneTarget: craneTarget >= 0 ? craneTarget : (comparing[0] ?? swapping[0] ?? 0),
        comparisons,
        swaps,
        codeLine,
        status
      });
    }

    function merge(lo, mid, hi) {
      const left = arr.slice(lo, mid + 1);
      const right = arr.slice(mid + 1, hi + 1);
      let i = 0, j = 0, k = lo;

      while (i < left.length && j < right.length) {
        comparisons++;
        record(7, [lo + i, mid + 1 + j], [], { k }, k, `Comparing ${left[i]} with ${right[j]}`);
        if (left[i] <= right[j]) {
          swaps++;
          arr[k] = left[i];
          record(7, [], [k], { k }, k, `Placed ${left[i]} at [${k}]`);
          i++;
        } else {
          swaps++;
          arr[k] = right[j];
          record(7, [], [k], { k }, k, `Placed ${right[j]} at [${k}]`);
          j++;
        }
        k++;
      }
      while (i < left.length) {
        arr[k] = left[i];
        record(7, [], [k], { k }, k, `Placed remaining ${left[i]} at [${k}]`);
        i++; k++;
      }
      while (j < right.length) {
        arr[k] = right[j];
        record(7, [], [k], { k }, k, `Placed remaining ${right[j]} at [${k}]`);
        j++; k++;
      }
    }

    function sort(lo, hi) {
      if (lo >= hi) return;
      const mid = Math.floor(lo + (hi - lo) / 2);
      record(4, [], [], { lo, mid, hi }, mid, `Divided at midpoint ${mid}`);
      sort(lo, mid);
      sort(mid + 1, hi);
      merge(lo, mid, hi);
    }

    sort(0, arr.length - 1);
    for (let k = 0; k < arr.length; k++) sorted.add(k);
    record(8, [], [], {}, 0, 'Array fully sorted with Merge Sort');
    return steps;
  }

  // Animation Engine
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
        if (renderCallback) {
          renderCallback(this.steps[this.currentStep]);
        }
        this.currentStep++;

        if (this.currentStep >= this.steps.length) break;

        await delay(this.speed);

        if (session !== this.sessionId || !this.isPlaying || this.isPaused) return;
      }

      if (session === this.sessionId) {
        this.isPlaying = false;
      }
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
  const canvasArea = document.getElementById('canvas-area');
  const roboticCrane = document.getElementById('robotic-crane');
  const arrayStage = document.getElementById('array-stage');
  const algoHeading = document.getElementById('algo-heading');
  const algoSubheading = document.getElementById('algo-subheading');
  const compareCount = document.getElementById('compare-count');
  const swapCount = document.getElementById('swap-count');
  const statusText = document.getElementById('status-text');
  const algoSelect = document.getElementById('algo-select');
  const generateBtn = document.getElementById('generate-btn');
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const speedSlider = document.getElementById('speed-slider');
  const codeTabTitle = document.getElementById('code-tab-title');
  const codeBody = document.getElementById('code-body');
  const algoName = document.getElementById('algo-name');
  const timeBest = document.getElementById('time-best');
  const timeWorst = document.getElementById('time-worst');
  const spaceComp = document.getElementById('space-comp');

  // Reference dataset
  const REFERENCE_DATASET = [2, 5, 8, 1, 7, 3, 6, 4];
  const controller = new AnimationController();
  let currentArray = [...REFERENCE_DATASET];

  function generateRandomUnsortedArray(length = 8) {
    const set = new Set();
    while (set.size < length) {
      set.add(Math.floor(Math.random() * 85) + 12);
    }
    const arr = Array.from(set);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    // Guarantee unsorted
    let sorted = true;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) { sorted = false; break; }
    }
    if (sorted && arr.length > 1) {
      const t = arr[0]; arr[0] = arr[1]; arr[1] = t;
    }
    return arr;
  }

  function setupCodeEditor(algo) {
    const snippet = CODE_SNIPPETS[algo] || CODE_SNIPPETS.quickSort;
    if (algoHeading) algoHeading.textContent = snippet.title;
    if (algoSubheading) algoSubheading.textContent = snippet.subtitle;
    if (codeTabTitle) codeTabTitle.textContent = snippet.filename;

    if (codeBody) {
      codeBody.innerHTML = '';
      snippet.lines.forEach((line) => {
        const row = document.createElement('div');
        row.className = 'code-row';
        row.dataset.line = line.num;
        row.innerHTML = `
          <div class="line-num">${line.num}</div>
          <div class="line-text">${line.text}</div>
        `;
        codeBody.appendChild(row);
      });
    }
  }

  function updateComplexity(algo) {
    const data = COMPLEXITY_DATA[algo];
    if (data) {
      if (algoName) algoName.textContent = data.name;
      if (timeBest) timeBest.textContent = data.timeBest;
      if (timeWorst) timeWorst.textContent = data.timeWorst;
      if (spaceComp) spaceComp.textContent = data.space;
    }
  }

  function highlightCodeLine(lineNum) {
    if (!codeBody) return;
    const rows = codeBody.querySelectorAll('.code-row');
    rows.forEach((row) => {
      if (Number(row.dataset.line) === lineNum) {
        row.classList.add('active-line');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        row.classList.remove('active-line');
      }
    });
  }

  function updateCranePosition(targetIndex, isCompare, isSwap) {
    if (!roboticCrane || !arrayStage) return;
    const cards = arrayStage.children;
    if (!cards || cards.length === 0) return;

    const validIndex = Math.max(0, Math.min(targetIndex, cards.length - 1));
    const card = cards[validIndex];
    if (!card) return;

    const canvasRect = canvasArea.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const craneWidth = 70;

    if (cardRect.width === 0) {
      requestAnimationFrame(() => updateCranePosition(targetIndex, isCompare, isSwap));
      return;
    }

    const cardCenter = cardRect.left - canvasRect.left + cardRect.width / 2;
    const targetX = cardCenter - craneWidth / 2;
    roboticCrane.style.transform = `translateX(${targetX}px)`;

    roboticCrane.classList.remove('active-compare', 'active-swap');
    if (isSwap) roboticCrane.classList.add('active-swap');
    else if (isCompare) roboticCrane.classList.add('active-compare');
  }

  function renderStep(step) {
    if (!step) return;

    const {
      array,
      comparing = [],
      swapping = [],
      sorted = [],
      pivotIndex = -1,
      pointers = {},
      craneTarget = 0,
      comparisons = 0,
      swaps = 0,
      codeLine = 1,
      status = ''
    } = step;

    if (compareCount) compareCount.textContent = comparisons;
    if (swapCount) swapCount.textContent = swaps;
    if (statusText && status) statusText.textContent = status;

    highlightCodeLine(codeLine);

    if (!arrayStage) return;

    // Create cards if needed
    if (arrayStage.children.length !== array.length) {
      arrayStage.innerHTML = '';
      array.forEach(() => {
        const card = document.createElement('div');
        card.className = 'array-card';
        const valSpan = document.createElement('span');
        valSpan.className = 'card-val';
        const pointerSpan = document.createElement('span');
        pointerSpan.className = 'card-pointer';
        card.appendChild(valSpan);
        card.appendChild(pointerSpan);
        arrayStage.appendChild(card);
      });
    }

    const maxVal = Math.max(...array, 10);

    array.forEach((val, idx) => {
      const card = arrayStage.children[idx];
      if (!card) return;

      const heightPx = Math.round((val / maxVal) * 110 + 45);
      card.style.height = `${heightPx}px`;

      const valSpan = card.querySelector('.card-val');
      if (valSpan) valSpan.textContent = val;

      card.className = 'array-card';
      if (idx === pivotIndex) card.classList.add('pivot');
      else if (swapping.includes(idx)) card.classList.add('swap');
      else if (comparing.includes(idx)) card.classList.add('compare');
      else if (sorted.includes(idx)) card.classList.add('sorted');

      const pointerSpan = card.querySelector('.card-pointer');
      if (pointerSpan) {
        pointerSpan.className = 'card-pointer';
        const active = [];
        for (const [key, pIdx] of Object.entries(pointers)) {
          if (pIdx === idx) active.push(key);
        }
        if (active.length > 0) {
          pointerSpan.textContent = active.join(', ');
          if (active.includes('p')) pointerSpan.classList.add('pointer-p');
          else if (active.includes('i')) pointerSpan.classList.add('pointer-i');
          else if (active.includes('j')) pointerSpan.classList.add('pointer-j');
        } else {
          pointerSpan.textContent = '';
        }
      }
    });

    const isComp = comparing.includes(craneTarget);
    const isSwp = swapping.includes(craneTarget);
    updateCranePosition(craneTarget, isComp, isSwp);
  }

  function getSteps(algo, arr) {
    switch (algo) {
      case 'quickSort': return generateQuickSortSteps(arr);
      case 'bubbleSort': return generateBubbleSortSteps(arr);
      case 'selectionSort': return generateSelectionSortSteps(arr);
      case 'insertionSort': return generateInsertionSortSteps(arr);
      case 'mergeSort': return generateMergeSortSteps(arr);
      default: return generateQuickSortSteps(arr);
    }
  }

  function resetArray(customDataset = null) {
    controller.reset();

    if (customDataset && Array.isArray(customDataset)) {
      currentArray = [...customDataset];
    } else {
      currentArray = generateRandomUnsortedArray(8);
    }

    if (compareCount) compareCount.textContent = '0';
    if (swapCount) swapCount.textContent = '0';
    if (statusText) statusText.textContent = 'Ready to start sorting';

    const defaultStep = {
      array: currentArray,
      comparing: [],
      swapping: [],
      sorted: [],
      pivotIndex: algoSelect.value === 'quickSort' ? currentArray.length - 1 : -1,
      pointers: algoSelect.value === 'quickSort' ? { p: currentArray.length - 1 } : {},
      craneTarget: algoSelect.value === 'quickSort' ? currentArray.length - 1 : 0,
      comparisons: 0,
      swaps: 0,
      codeLine: 1,
      status: 'Ready to start sorting'
    };

    renderStep(defaultStep);
  }

  // Bind Buttons
  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      resetArray();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!controller.isPlaying) {
        if (controller.steps.length === 0 || controller.currentStep >= controller.steps.length) {
          const steps = getSteps(algoSelect.value, currentArray);
          controller.setSteps(steps);
        }
        controller.play(renderStep);
      }
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      controller.pause();
      if (statusText) statusText.textContent = 'Paused';
    });
  }

  if (algoSelect) {
    algoSelect.addEventListener('change', (e) => {
      updateComplexity(e.target.value);
      setupCodeEditor(e.target.value);
      resetArray();
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      controller.setSpeed(Number(e.target.value));
    });
  }

  window.addEventListener('resize', () => {
    if (controller.steps.length > 0 && controller.currentStep < controller.steps.length) {
      const step = controller.steps[controller.currentStep];
      if (step) updateCranePosition(step.craneTarget);
    } else {
      updateCranePosition(algoSelect.value === 'quickSort' ? currentArray.length - 1 : 0);
    }
  });

  // Initialize Page
  setupCodeEditor('quickSort');
  updateComplexity('quickSort');
  resetArray(REFERENCE_DATASET);
})();