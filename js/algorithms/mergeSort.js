export const generateMergeSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  function merge(mainArray, startIdx, middleIdx, endIdx, auxArray) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
      steps.push({
        array: [...mainArray],
        comparing: [i, j],
        swapping: [],
        sorted: []
      });

      if (auxArray[i] <= auxArray[j]) {
        mainArray[k] = auxArray[i];
        steps.push({
          array: [...mainArray],
          comparing: [],
          swapping: [k],
          sorted: []
        });
        i++;
      } else {
        mainArray[k] = auxArray[j];
        steps.push({
          array: [...mainArray],
          comparing: [],
          swapping: [k],
          sorted: []
        });
        j++;
      }
      k++;
    }

    while (i <= middleIdx) {
      mainArray[k] = auxArray[i];
      steps.push({
        array: [...mainArray],
        comparing: [i],
        swapping: [k],
        sorted: []
      });
      i++;
      k++;
    }

    while (j <= endIdx) {
      mainArray[k] = auxArray[j];
      steps.push({
        array: [...mainArray],
        comparing: [j],
        swapping: [k],
        sorted: []
      });
      j++;
      k++;
    }
  }

  function mergeSortHelper(mainArray, startIdx, endIdx, auxArray) {
    if (startIdx === endIdx) return;
    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    mergeSortHelper(auxArray, startIdx, middleIdx, mainArray);
    mergeSortHelper(auxArray, middleIdx + 1, endIdx, mainArray);
    merge(mainArray, startIdx, middleIdx, endIdx, auxArray);
  }

  const auxArray = [...arr];
  mergeSortHelper(arr, 0, arr.length - 1, auxArray);

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k)
  });

  return steps;
};