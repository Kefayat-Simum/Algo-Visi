// Validate string input into an array of integers
export const parseInputArray = (inputString) => {
  if (!inputString.trim()) return { isValid: false, error: 'Input cannot be empty.' };

  const parsed = inputString
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => Number(item));

  const hasNaN = parsed.some((num) => isNaN(num));
  if (hasNaN) return { isValid: false, error: 'Please enter valid comma-separated numbers.' };

  if (parsed.length > 20) return { isValid: false, error: 'Maximum allowed elements is 20.' };

  return { isValid: true, data: parsed };
};

// Validate integer input for single values (e.g., search target, stack push)
export const parseSingleInteger = (inputVal) => {
  const num = Number(inputVal);
  if (isNaN(num) || inputVal.trim() === '') {
    return { isValid: false, error: 'Please enter a valid integer.' };
  }
  return { isValid: true, data: num };
};