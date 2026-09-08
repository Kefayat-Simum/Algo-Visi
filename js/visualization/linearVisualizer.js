import { Stack } from '../structures/Stack.js';
import { Queue } from '../structures/Queue.js';
import { parseSingleInteger } from '../utils/validation.js';

const displayArea = document.getElementById('display-area');
const structSelect = document.getElementById('struct-select');
const nodeInput = document.getElementById('node-input');
const pushBtn = document.getElementById('push-btn');
const popBtn = document.getElementById('pop-btn');
const clearBtn = document.getElementById('clear-btn');

let stack = new Stack();
let queue = new Queue();

function renderState(items, type) {
  displayArea.innerHTML = '';
  displayArea.className = type === 'stack' ? 'stack-display' : 'queue-display';

  items.forEach((val) => {
    const node = document.createElement('div');
    node.className = 'struct-node';
    node.textContent = val;
    displayArea.appendChild(node);
  });
}

structSelect.addEventListener('change', (e) => {
  const type = e.target.value;
  if (type === 'stack') {
    pushBtn.textContent = 'PUSH';
    popBtn.textContent = 'POP';
    renderState(stack.items, 'stack');
  } else {
    pushBtn.textContent = 'Enqueue';
    popBtn.textContent = 'Dequeue';
    renderState(queue.items, 'queue');
  }
});

pushBtn.addEventListener('click', () => {
  const val = parseSingleInteger(nodeInput.value);
  if (!val.isValid) return alert(val.error);

  const type = structSelect.value;
  const result = type === 'stack' ? stack.push(val.data) : queue.enqueue(val.data);

  if (!result.success) return alert(result.message);
  renderState(result.items, type);
  nodeInput.value = '';
});

popBtn.addEventListener('click', () => {
  const type = structSelect.value;
  const result = type === 'stack' ? stack.pop() : queue.dequeue();

  if (!result.success) return alert(result.message);
  renderState(result.items, type);
});

clearBtn.addEventListener('click', () => {
  const type = structSelect.value;
  if (type === 'stack') stack.clear();
  else queue.clear();
  renderState([], type);
});

// Initial Render
renderState([], 'stack');