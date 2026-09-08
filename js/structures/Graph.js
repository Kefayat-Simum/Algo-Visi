export class Graph {
  constructor() {
    this.adjacencyList = {};
    this.nodes = {}; // Stores node visual coordinates
  }

  addNode(id, x, y) {
    if (!this.adjacencyList[id]) {
      this.adjacencyList[id] = [];
      this.nodes[id] = { id, x, y };
    }
  }

  addEdge(u, v) {
    if (this.adjacencyList[u] && this.adjacencyList[v]) {
      this.adjacencyList[u].push(v);
      this.adjacencyList[v].push(u); // Undirected graph
    }
  }

  getBFSOrder(startNode) {
    const visited = new Set();
    const queue = [startNode];
    const steps = [];

    visited.add(startNode);

    while (queue.length > 0) {
      const node = queue.shift();
      steps.push(node);

      for (const neighbor of this.adjacencyList[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return steps;
  }

  getDFSOrder(startNode) {
    const visited = new Set();
    const steps = [];

    const dfs = (node) => {
      visited.add(node);
      steps.push(node);

      for (const neighbor of this.adjacencyList[node]) {
        if (!visited.has(neighbor)) {
          dfs(neighbor);
        }
      }
    };

    dfs(startNode);
    return steps;
  }
}