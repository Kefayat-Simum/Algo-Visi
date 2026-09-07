export const generateLinearSearchSteps = (array, target) => {
  const steps = [];
  const arr = [...array];
  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      array: [...arr],
      checking: [i],
      found: -1,
      range: []
    });

    if (arr[i] === target) {
      foundIndex = i;
      steps.push({
        array: [...arr],
        checking: [],
        found: i,
        range: []
      });
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      array: [...arr],
      checking: [],
      found: -2, // -2 indicates not found
      range: []
    });
  }

  return steps;
};