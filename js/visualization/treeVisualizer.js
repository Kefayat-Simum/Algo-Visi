// ==========================================================================
// Standalone Binary Search Tree Visualizer (Zero External CORS Dependencies)
// Runs directly on file:/// and http:// in all modern browsers
// ==========================================================================

(() => {
  class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.x = 0;
      this.y = 0;
    }
  }

  class BST {
    constructor() {
      this.root = null;
    }

    insert(value) {
      const newNode = new TreeNode(value);
      if (!this.root) {
        this.root = newNode;
        return true;
      }

      let current = this.root;
      while (true) {
        if (value === current.value) return false; // Avoid duplicates
        if (value < current.value) {
          if (!current.left) {
            current.left = newNode;
            return true;
          }
          current = current.left;
        } else {
          if (!current.right) {
            current.right = newNode;
            return true;
          }
          current = current.right;
        }
      }
    }

    getInOrderTraversal() {
      const result = [];
      function traverse(node) {
        if (node) {
          traverse(node.left);
          result.push(node.value);
          traverse(node.right);
        }
      }
      traverse(this.root);
      return result;
    }

    clear() {
      this.root = null;
    }
  }

  function parseSingleInteger(inputVal) {
    const num = Number(inputVal);
    if (isNaN(num) || String(inputVal).trim() === '') {
      return { isValid: false, error: 'Please enter a valid number.' };
    }
    return { isValid: true, data: num };
  }

  const treeSvg = document.getElementById('tree-svg');
  const nodeInput = document.getElementById('node-input');
  const insertBtn = document.getElementById('insert-btn');
  const clearBtn = document.getElementById('clear-btn');
  const inorderBtn = document.getElementById('inorder-btn');
  const traversalOutput = document.getElementById('traversal-output');

  const bst = new BST();

  function drawTree() {
    if (!treeSvg) return;
    treeSvg.innerHTML = '';
    if (!bst.root) return;

    const svgWidth = treeSvg.clientWidth || 800;

    function assignCoordinates(node, depth = 0, leftBound = 0, rightBound = svgWidth) {
      if (!node) return;
      node.x = (leftBound + rightBound) / 2;
      node.y = depth * 60 + 40;

      assignCoordinates(node.left, depth + 1, leftBound, node.x);
      assignCoordinates(node.right, depth + 1, node.x, rightBound);
    }

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

  if (insertBtn) {
    insertBtn.addEventListener('click', () => {
      const val = parseSingleInteger(nodeInput.value);
      if (!val.isValid) return alert(val.error);

      const inserted = bst.insert(val.data);
      if (!inserted) alert('Value already exists in BST!');

      drawTree();
      nodeInput.value = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      bst.clear();
      drawTree();
      if (traversalOutput) traversalOutput.textContent = 'None';
    });
  }

  if (inorderBtn) {
    inorderBtn.addEventListener('click', () => {
      const res = bst.getInOrderTraversal();
      if (traversalOutput) {
        traversalOutput.textContent = res.length > 0 ? res.join(' ➔ ') : 'Tree is empty';
      }
    });
  }

  // Insert initial nodes
  [50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v));
  drawTree();
})();