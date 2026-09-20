// ==========================================================================
// Standalone Linear Structures Visualizer (Stack & Queue)
// Runs directly on file:/// and http:// in all modern browsers
// ==========================================================================

(() => {
  class Stack {
    constructor(maxSize = 6) {
      this.items = [];
      this.maxSize = maxSize;
    }
    push(element) {
      if (this.isFull()) return { success: false, message: 'Stack Overflow! (Max capacity reached)' };
      this.items.push(element);
      return { success: true, items: [...this.items] };
    }
    pop() {
      if (this.isEmpty()) return { success: false, message: 'Stack Underflow! (Stack is empty)' };
      const popped = this.items.pop();
      return { success: true, popped, items: [...this.items] };
    }
    isEmpty() { return this.items.length === 0; }
    isFull() { return this.items.length >= this.maxSize; }
    clear() { this.items = []; }
  }

  class Queue {
    constructor(maxSize = 6) {
      this.items = [];
      this.maxSize = maxSize;
    }
    enqueue(element) {
      if (this.isFull()) return { success: false, message: 'Queue Overflow! (Max capacity reached)' };
      this.items.push(element);
      return { success: true, items: [...this.items] };
    }
    dequeue() {
      if (this.isEmpty()) return { success: false, message: 'Queue Underflow! (Queue is empty)' };
      const dequeued = this.items.shift();
      return { success: true, dequeued, items: [...this.items] };
    }
    isEmpty() { return this.items.length === 0; }
    isFull() { return this.items.length >= this.maxSize; }
    clear() { this.items = []; }
  }

  function parseSingleInteger(inputVal) {
    const num = Number(inputVal);
    if (isNaN(num) || String(inputVal).trim() === '') {
      return { isValid: false, error: 'Please enter a valid number.' };
    }
    return { isValid: true, data: num };
  }

  const displayArea = document.getElementById('display-area');
  const structSelect = document.getElementById('struct-select');
  const nodeInput = document.getElementById('node-input');
  const pushBtn = document.getElementById('push-btn');
  const popBtn = document.getElementById('pop-btn');
  const clearBtn = document.getElementById('clear-btn');

  let stack = new Stack();
  let queue = new Queue();

  function renderState(items, type) {
    if (!displayArea) return;
    displayArea.innerHTML = '';
    displayArea.className = type === 'stack' ? 'stack-display' : 'queue-display';

    items.forEach((val) => {
      const node = document.createElement('div');
      node.className = 'struct-node';
      node.textContent = val;
      displayArea.appendChild(node);
    });
  }

  if (structSelect) {
    structSelect.addEventListener('change', (e) => {
      const type = e.target.value;
      if (type === 'stack') {
        if (pushBtn) pushBtn.textContent = 'PUSH';
        if (popBtn) popBtn.textContent = 'POP';
        renderState(stack.items, 'stack');
      } else {
        if (pushBtn) pushBtn.textContent = 'Enqueue';
        if (popBtn) popBtn.textContent = 'Dequeue';
        renderState(queue.items, 'queue');
      }
    });
  }

  if (pushBtn) {
    pushBtn.addEventListener('click', () => {
      const val = parseSingleInteger(nodeInput.value);
      if (!val.isValid) return alert(val.error);

      const type = structSelect.value;
      const result = type === 'stack' ? stack.push(val.data) : queue.enqueue(val.data);

      if (!result.success) return alert(result.message);
      renderState(result.items, type);
      nodeInput.value = '';
    });
  }

  if (popBtn) {
    popBtn.addEventListener('click', () => {
      const type = structSelect.value;
      const result = type === 'stack' ? stack.pop() : queue.dequeue();

      if (!result.success) return alert(result.message);
      renderState(result.items, type);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const type = structSelect.value;
      if (type === 'stack') stack.clear();
      else queue.clear();
      renderState([], type);
    });
  }

  // Initial Render
  renderState([], 'stack');
})();