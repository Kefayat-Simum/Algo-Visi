// ==========================================================================
// Standalone Graph Traversal Visualizer (BFS & DFS)
// Runs directly on file:/// and http:// in all modern browsers
// ==========================================================================

(() => {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  class Graph {
    constructor() {
      this.adjacencyList = {};
      this.nodes = {};
    }

    addNode(id, x, y) {
      if (!this.adjacencyList[id]) {
        this.adjacencyList[id] = [];
        this.nodes[id] = { id, x, y };
      }
    }

    addEdge(u, v) {
      if (this.adjacencyList[u] && this.adjacencyList[v]) {
        this.adjacencyList[u].push(v);
        this.adjacencyList[v].push(u);
      }
    }

    getBFSOrder(startNode) {
      const visited = new Set();
      const queue = [startNode];
      const steps = [];

      visited.add(startNode);

      while (queue.length > 0) {
        const node = queue.shift();
        steps.push(node);

        for (const neighbor of this.adjacencyList[node]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      return steps;
    }

    getDFSOrder(startNode) {
      const visited = new Set();
      const steps = [];

      const dfs = (node) => {
        visited.add(node);
        steps.push(node);

        for (const neighbor of this.adjacencyList[node]) {
          if (!visited.has(neighbor)) {
            dfs(neighbor);
          }
        }
      };

      dfs(startNode);
      return steps;
    }
  }

  class AnimationController {
    constructor() {
      this.isPlaying = false;
      this.isPaused = false;
      this.speed = 600;
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

    async play(renderCallback) {
      if (this.isPlaying) return;
      if (this.currentStep >= this.steps.length) this.currentStep = 0;

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

  const graphSvg = document.getElementById('graph-svg');
  const algoSelect = document.getElementById('algo-select');
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-graph-btn');
  const pathOutput = document.getElementById('path-output');

  const controller = new AnimationController();
  let graph = new Graph();

  function setupSampleGraph() {
    graph = new Graph();
    graph.addNode('A', 150, 100);
    graph.addNode('B', 300, 80);
    graph.addNode('C', 450, 100);
    graph.addNode('D', 200, 260);
    graph.addNode('E', 400, 260);

    graph.addEdge('A', 'B');
    graph.addEdge('A', 'D');
    graph.addEdge('B', 'C');
    graph.addEdge('B', 'E');
    graph.addEdge('D', 'E');
    graph.addEdge('C', 'E');
  }

  function renderGraph(visitedNodes = []) {
    if (!graphSvg) return;
    graphSvg.innerHTML = '';

    // Render Edges
    const drawnEdges = new Set();
    for (const node in graph.adjacencyList) {
      const u = graph.nodes[node];
      for (const neighbor of graph.adjacencyList[node]) {
        const v = graph.nodes[neighbor];
        const edgeKey = [u.id, v.id].sort().join('-');

        if (!drawnEdges.has(edgeKey)) {
          drawnEdges.add(edgeKey);
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', u.x);
          line.setAttribute('y1', u.y);
          line.setAttribute('x2', v.x);
          line.setAttribute('y2', v.y);
          line.setAttribute('class', 'graph-edge');
          graphSvg.appendChild(line);
        }
      }
    }

    // Render Nodes
    for (const id in graph.nodes) {
      const { x, y } = graph.nodes[id];
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 22);
      circle.setAttribute('class', `graph-node ${visitedNodes.includes(id) ? 'visited' : ''}`);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.setAttribute('class', 'graph-text');
      text.textContent = id;

      g.appendChild(circle);
      g.appendChild(text);
      graphSvg.appendChild(g);
    }
  }

  function resetVisualizer() {
    controller.reset();
    setupSampleGraph();
    renderGraph();
    if (pathOutput) pathOutput.textContent = 'None';
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!controller.isPlaying && (controller.steps.length === 0 || controller.currentStep >= controller.steps.length)) {
        const order = (algoSelect && algoSelect.value === 'bfs') ? graph.getBFSOrder('A') : graph.getDFSOrder('A');
        const steps = order.map((_, index) => order.slice(0, index + 1));
        controller.setSteps(steps);
      }

      controller.play((visitedNodes) => {
        renderGraph(visitedNodes);
        if (pathOutput) pathOutput.textContent = visitedNodes.join(' ➔ ');
      });
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      controller.pause();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', resetVisualizer);
  }

  resetVisualizer();
})();