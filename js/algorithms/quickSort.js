export const generateQuickSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  function partition(items, left, right) {
    let pivot = items[Math.floor((right + left) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
      while (items[i] < pivot) {
        steps.push({ array: [...items], comparing: [i], swapping: [], sorted: [] });
        i++;
      }
      while (items[j] > pivot) {
        steps.push({ array: [...items], comparing: [j], swapping: [], sorted: [] });
        j--;
      }
      if (i <= j) {
        steps.push({ array: [...items], comparing: [], swapping: [i, j], sorted: [] });
        let temp = items[i];
        items[i] = items[j];
        items[j] = temp;
        i++;
        j--;
      }
    }
    return i;
  }

  function quickSortHelper(items, left, right) {
    let index;
    if (items.length > 1) {
      index = partition(items, left, right);
      if (left < index - 1) quickSortHelper(items, left, index - 1);
      if (index < right) quickSortHelper(items, index, right);
    }
    return items;
  }

  quickSortHelper(arr, 0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k)
  });

  return steps;
};