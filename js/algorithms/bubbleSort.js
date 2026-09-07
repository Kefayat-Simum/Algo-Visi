export const generateBubbleSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Step: Highlight elements being compared
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
      });

      if (arr[j] > arr[j + 1]) {
        // Swap values
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Step: Highlight elements being swapped
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k)
        });
      }
    }
  }

  // Final Step: All elements marked sorted
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, k) => k)
  });

  return steps;
};