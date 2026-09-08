import { Graph } from '../structures/Graph.js';
import { AnimationController } from './animationController.js';

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
  // Sample fixed positions for nodes
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
  pathOutput.textContent = 'None';
}

playBtn.addEventListener('click', () => {
  if (!controller.isPlaying && controller.steps.length === 0) {
    const order = algoSelect.value === 'bfs' ? graph.getBFSOrder('A') : graph.getDFSOrder('A');
    
    // Construct animated steps tracking incrementally visited nodes
    const steps = order.map((_, index) => order.slice(0, index + 1));
    controller.setSteps(steps);
  }

  controller.play((visitedNodes) => {
    renderGraph(visitedNodes);
    pathOutput.textContent = visitedNodes.join(' ➔ ');
  });
});

pauseBtn.addEventListener('click', () => { controller.pause(); });
resetBtn.addEventListener('click', resetVisualizer);

resetVisualizer();