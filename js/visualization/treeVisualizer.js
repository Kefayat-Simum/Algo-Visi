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

    // Left -> Root -> Right (gives the values in sorted order for a BST)
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

    // Root -> Left -> Right (visits a node BEFORE its children)
    getPreOrderTraversal() {
      const result = [];
      function traverse(node) {
        if (node) {
          result.push(node.value);
          traverse(node.left);
          traverse(node.right);
        }
      }
      traverse(this.root);
      return result;
    }

    // Left -> Right -> Root (visits a node AFTER its children)
    getPostOrderTraversal() {
      const result = [];
      function traverse(node) {
        if (node) {
          traverse(node.left);
          traverse(node.right);
          result.push(node.value);
        }
      }
      traverse(this.root);
      return result;
    }

    clear() {
      this.root = null;
    }
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const TRAVERSALS = {
    inorder: { label: 'In-Order (Left ➔ Root ➔ Right):', run: (t) => t.getInOrderTraversal() },
    preorder: { label: 'Pre-Order (Root ➔ Left ➔ Right):', run: (t) => t.getPreOrderTraversal() },
    postorder: { label: 'Post-Order (Left ➔ Right ➔ Root):', run: (t) => t.getPostOrderTraversal() }
  };

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
  const preorderBtn = document.getElementById('preorder-btn');
  const postorderBtn = document.getElementById('postorder-btn');
  const traversalOutput = document.getElementById('traversal-output');
  const traversalLabel = document.getElementById('traversal-label');

  const bst = new BST();
  let animationId = 0;   // bumped to cancel a running traversal animation
  let animating = false; // true while a traversal animation is in progress

  function drawTree(visited = [], current = null) {
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

      drawNode(
        node.x, node.y, node.value,
        node.value === current ? 'current' : visited.includes(node.value) ? 'visited' : ''
      );
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

  function drawNode(x, y, value, state = '') {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', 20);
    circle.setAttribute('class', state ? `tree-node ${state}` : 'tree-node');

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.setAttribute('class', 'tree-text');
    text.textContent = value;

    g.appendChild(circle);
    g.appendChild(text);
    treeSvg.appendChild(g);
  }

  // Stops any running traversal animation.
  function cancelAnimation() {
    animationId++;
    animating = false;
  }

  async function runTraversal(type) {
    const { label, run } = TRAVERSALS[type];
    const order = run(bst);
    const id = ++animationId;

    if (traversalLabel) traversalLabel.textContent = label;
    if (order.length === 0) {
      drawTree();
      if (traversalOutput) traversalOutput.textContent = 'Tree is empty';
      return;
    }

    animating = true;
    for (let i = 0; i < order.length; i++) {
      drawTree(order.slice(0, i), order[i]);
      if (traversalOutput) traversalOutput.textContent = order.slice(0, i + 1).join(' ➔ ');
      await delay(700);
      if (id !== animationId) return; // a newer action took over
    }
    drawTree(order); // finished: every node green, none "current"
    animating = false;
  }

  if (insertBtn) {
    insertBtn.addEventListener('click', () => {
      const val = parseSingleInteger(nodeInput.value);
      if (!val.isValid) return alert(val.error);

      const wasAnimating = animating;
      cancelAnimation();
      const inserted = bst.insert(val.data);
      if (!inserted) alert('Value already exists in BST!');

      drawTree(); // a changed tree invalidates the old traversal highlighting
      if (wasAnimating && traversalOutput) {
        traversalOutput.textContent = 'None';
        if (traversalLabel) traversalLabel.textContent = 'Traversal Result:';
      }
      nodeInput.value = '';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cancelAnimation();
      bst.clear();
      drawTree();
      if (traversalOutput) traversalOutput.textContent = 'None';
      if (traversalLabel) traversalLabel.textContent = 'Traversal Result:';
    });
  }

  if (inorderBtn) inorderBtn.addEventListener('click', () => runTraversal('inorder'));
  if (preorderBtn) preorderBtn.addEventListener('click', () => runTraversal('preorder'));
  if (postorderBtn) postorderBtn.addEventListener('click', () => runTraversal('postorder'));

  // Insert initial nodes
  [50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v));
  drawTree();
})();