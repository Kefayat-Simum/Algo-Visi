export const generateBinarySearchSteps = (array, target) => {
  const steps = [];
  // Binary search requires a sorted array
  const arr = [...array].sort((a, b) => a - b);
  let low = 0;
  let high = arr.length - 1;
  let foundIndex = -1;

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    steps.push({
      array: [...arr],
      checking: [mid],
      found: -1,
      range: [low, high]
    });

    if (arr[mid] === target) {
      foundIndex = mid;
      steps.push({
        array: [...arr],
        checking: [],
        found: mid,
        range: []
      });
      break;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      checking: [],
      found: -2,
      range: []
    });
  }

  return steps;
};