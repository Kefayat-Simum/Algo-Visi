export const generateSelectionSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;
  const sorted = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapping: [],
        sorted: [...sorted]
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      let temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted]
      });
    }

    sorted.push(i);
  }

  sorted.push(n - 1);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k)
  });

  return steps;
};