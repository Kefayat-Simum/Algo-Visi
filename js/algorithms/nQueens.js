export const generateNQueensSteps = (n = 4) => {
  const steps = [];
  const board = Array.from({ length: n }, () => Array(n).fill(0));

  function isSafe(b, row, col) {
    for (let i = 0; i < row; i++) {
      if (b[i][col] === 1) return false;
    }
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (b[i][j] === 1) return false;
    }
    for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
      if (b[i][j] === 1) return false;
    }
    return true;
  }

  function solve(row) {
    if (row >= n) {
      steps.push({
        board: board.map((r) => [...r]),
        status: 'Solution found!',
        cellState: { row: -1, col: -1, type: 'solved' }
      });
      return true;
    }

    for (let col = 0; col < n; col++) {
      steps.push({
        board: board.map((r) => [...r]),
        status: `Testing Queen at Row ${row}, Col ${col}`,
        cellState: { row, col, type: 'testing' }
      });

      if (isSafe(board, row, col)) {
        board[row][col] = 1;
        steps.push({
          board: board.map((r) => [...r]),
          status: `Placed Queen at Row ${row}, Col ${col}`,
          cellState: { row, col, type: 'queen' }
        });

        if (solve(row + 1)) return true;

        // Backtrack
        board[row][col] = 0;
        steps.push({
          board: board.map((r) => [...r]),
          status: `Backtracking from Row ${row}, Col ${col}`,
          cellState: { row, col, type: 'conflict' }
        });
      } else {
        steps.push({
          board: board.map((r) => [...r]),
          status: `Conflict at Row ${row}, Col ${col}!`,
          cellState: { row, col, type: 'conflict' }
        });
      }
    }
    return false;
  }

  solve(0);
  return steps;
};