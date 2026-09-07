export const generateInsertionSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparing: [i, j],
      swapping: [],
      sorted: Array.from({ length: i }, (_, k) => k)
    });

    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];

      steps.push({
        array: [...arr],
        comparing: [j],
        swapping: [j + 1],
        sorted: []
      });

      j--;
    }

    arr[j + 1] = key;

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [j + 1],
      sorted: []
    });
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k)
  });

  return steps;
};