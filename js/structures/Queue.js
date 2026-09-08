export class Queue {
  constructor(maxSize = 6) {
    this.items = [];
    this.maxSize = maxSize;
  }

  enqueue(element) {
    if (this.isFull()) return { success: false, message: 'Queue Full!' };
    this.items.push(element);
    return { success: true, items: [...this.items] };
  }

  dequeue() {
    if (this.isEmpty()) return { success: false, message: 'Queue Empty!' };
    const dequeued = this.items.shift();
    return { success: true, dequeued, items: [...this.items] };
  }

  isEmpty() { return this.items.length === 0; }
  isFull() { return this.items.length >= this.maxSize; }
  clear() { this.items = []; }
}