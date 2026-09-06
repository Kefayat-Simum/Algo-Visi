// Delay helper for step-by-step visualizer pauses
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate an array of random numbers within a specified range
export const generateRandomArray = (length = 10, min = 10, max = 100) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
};

// Swap two elements in an array
export const swap = (arr, i, j) => {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
};

// Create a DOM element with classes and content
export const createElement = (tag, className = '', textContent = '') => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
};