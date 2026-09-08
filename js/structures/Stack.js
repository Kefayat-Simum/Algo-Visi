export class Stack {
  constructor(maxSize = 6) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(element) {
    if (this.isFull()) return { success: false, message: 'Stack Overflow!' };
    this.items.push(element);
    return { success: true, items: [...this.items] };
  }

  pop() {
    if (this.isEmpty()) return { success: false, message: 'Stack Underflow!' };
    const popped = this.items.pop();
    return { success: true, popped, items: [...this.items] };
  }

  isEmpty() { return this.items.length === 0; }
  isFull() { return this.items.length >= this.maxSize; }
  clear() { this.items = []; }
}