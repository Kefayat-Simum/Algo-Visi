import { BST } from '../structures/BST.js';
import { parseSingleInteger } from '../utils/validation.js';

const treeSvg = document.getElementById('tree-svg');
const nodeInput = document.getElementById('node-input');
const insertBtn = document.getElementById('insert-btn');
const clearBtn = document.getElementById('clear-btn');
const inorderBtn = document.getElementById('inorder-btn');
const traversalOutput = document.getElementById('traversal-output');

const bst = new BST();

function drawTree() {
  treeSvg.innerHTML = '';
  if (!bst.root) return;

  const svgWidth = treeSvg.clientWidth || 800;
  const nodeRadius = 20;

  // Calculate coordinates hierarchically
  function assignCoordinates(node, depth = 0, leftBound = 0, rightBound = svgWidth) {
    if (!node) return;
    node.x = (leftBound + rightBound) / 2;
    node.y = depth * 60 + 40;

    assignCoordinates(node.left, depth + 1, leftBound, node.x);
    assignCoordinates(node.right, depth + 1, node.x, rightBound);
  }

  // Render edges and nodes to SVG
  function render(node) {
    if (!node) return;

    if (node.left) {
      drawLine(node.x, node.y, node.left.x, node.left.y);
      render(node.left);
    }
    if (node.right) {
      drawLine(node.x, node.y, node.right.x, node.right.y);
      render(node.right);
    }

    drawNode(node.x, node.y, node.value);
  }

  assignCoordinates(bst.root);
  render(bst.root);
}

function drawLine(x1, y1, x2, y2) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('class', 'tree-line');
  treeSvg.appendChild(line);
}

function drawNode(x, y, value) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', 20);
  circle.setAttribute('class', 'tree-node');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('class', 'tree-text');
  text.textContent = value;

  g.appendChild(circle);
  g.appendChild(text);
  treeSvg.appendChild(g);
}

insertBtn.addEventListener('click', () => {
  const val = parseSingleInteger(nodeInput.value);
  if (!val.isValid) return alert(val.error);

  const inserted = bst.insert(val.data);
  if (!inserted) alert('Value already exists in BST!');
  
  drawTree();
  nodeInput.value = '';
});

clearBtn.addEventListener('click', () => {
  bst.clear();
  drawTree();
  traversalOutput.textContent = 'None';
});

inorderBtn.addEventListener('click', () => {
  const res = bst.getInOrderTraversal();
  traversalOutput.textContent = res.length > 0 ? res.join(' ➔ ') : 'Tree is empty';
});