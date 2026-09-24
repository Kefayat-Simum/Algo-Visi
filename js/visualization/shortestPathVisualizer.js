// ==========================================================================
// Shortest Path Visualizer — Dijkstra & Bellman-Ford
// Standalone script (no modules, no fetch) so it runs on file:/// and http://
//
// How it works
//   1. buildDijkstra / buildBellmanFord run the algorithm once and record a
//      "frame" (snapshot) for every meaningful step.
//   2. StepController plays those frames back (Start / Pause / Step / Reset).
//   3. render() draws one frame: SVG graph, distance table, counters and
//      the status message.
// Because every frame is a full snapshot, stepping BACKWARDS is free.
// ==========================================================================

(() => {
  'use strict';

  const INF = Infinity;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const NODE_R = 26;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fmt = (d) => (d === INF ? '∞' : String(d));
  const key = (u, v) => `${u}>${v}`;

  // ------------------------------------------------------------------------
  // Graph data: directed + weighted. Edge order below = Bellman-Ford's order.
  // ------------------------------------------------------------------------
  const HEX_LAYOUT = {
    A: { x: 80, y: 210 },
    B: { x: 250, y: 90 },
    C: { x: 250, y: 330 },
    D: { x: 450, y: 90 },
    E: { x: 450, y: 330 },
    F: { x: 620, y: 210 }
  };

  const mkNodes = (layout) => Object.keys(layout).map((id) => ({ id, x: layout[id].x, y: layout[id].y }));
  const mkEdges = (list) => list.map(([from, to, w]) => ({ from, to, w }));

  const PRESETS = {
    // All weights positive: both algorithms agree.
    road: {
      nodes: mkNodes(HEX_LAYOUT),
      edges: mkEdges([
        ['A', 'B', 4], ['A', 'C', 2], ['B', 'C', 1], ['B', 'D', 5], ['C', 'D', 8],
        ['C', 'E', 10], ['D', 'E', 2], ['D', 'F', 6], ['E', 'F', 3]
      ]),
      source: 'A',
      target: 'F'
    },
    // One negative edge (C->B = -3): Dijkstra settles B too early and is WRONG.
    negative: {
      nodes: mkNodes({
        A: { x: 90, y: 210 }, B: { x: 280, y: 90 }, C: { x: 280, y: 330 },
        D: { x: 480, y: 90 }, E: { x: 610, y: 250 }
      }),
      edges: mkEdges([
        ['A', 'B', 2], ['A', 'C', 4], ['C', 'B', -3], ['B', 'D', 1], ['D', 'E', 3], ['C', 'E', 8]
      ]),
      source: 'A',
      target: 'E'
    },
    // Cycle B -> C -> D -> B has total weight 2 - 4 + 1 = -1 (negative cycle).
    cycle: {
      nodes: mkNodes({
        A: { x: 90, y: 210 }, B: { x: 270, y: 110 }, C: { x: 460, y: 110 },
        D: { x: 365, y: 320 }, E: { x: 620, y: 240 }
      }),
      edges: mkEdges([
        ['A', 'B', 3], ['B', 'C', 2], ['C', 'D', -4], ['D', 'B', 1], ['D', 'E', 4]
      ]),
      source: 'A',
      target: 'E'
    }
  };

  const cloneGraph = (p) => ({
    nodes: p.nodes.map((n) => ({ ...n })),
    edges: p.edges.map((e) => ({ ...e }))
  });

  // Random graph on the 6-node hexagon layout. Every node is reachable from A.
  // With negatives allowed we only create "forward" edges (A->B, never B->A),
  // so the graph is a DAG and can never contain a negative cycle by accident.
  function randomGraph(allowNegative) {
    const ids = Object.keys(HEX_LAYOUT);
    const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
    const weight = () => (allowNegative && Math.random() < 0.25 ? -rnd(1, 4) : rnd(1, 9));
    const pairKey = (a, b) => [a, b].sort().join('|');
    const used = new Set();
    const edges = [];
    const addEdge = (a, b) => {
      used.add(pairKey(a, b));
      edges.push({ from: a, to: b, w: weight() });
    };

    for (let i = 1; i < ids.length; i++) addEdge(ids[rnd(0, i - 1)], ids[i]); // spanning tree from A

    let extra = rnd(3, 5);
    let tries = 0;
    while (extra > 0 && tries++ < 80) {
      let a = ids[rnd(0, ids.length - 1)];
      let b = ids[rnd(0, ids.length - 1)];
      if (a === b || used.has(pairKey(a, b))) continue;
      if (allowNegative && a > b) [a, b] = [b, a];
      addEdge(a, b);
      extra--;
    }

    if (allowNegative && !edges.some((e) => e.w < 0)) {
      edges[rnd(0, edges.length - 1)].w = -rnd(1, 4);
    }

    edges.sort((p, q) => p.from.localeCompare(q.from) || p.to.localeCompare(q.to));
    return { nodes: mkNodes(HEX_LAYOUT), edges };
  }

  const hasNegative = (g) => g.edges.some((e) => e.w < 0);
  const outEdges = (g, u) => g.edges.filter((e) => e.from === u);

  function tracePath(prev, source, target, dist) {
    if (dist[target] === INF) return null;
    const path = [target];
    let cur = target;
    let guard = 0;
    while (cur !== source && prev[cur] !== null && guard++ < 100) {
      cur = prev[cur];
      path.push(cur);
    }
    return cur === source ? path.reverse() : null;
  }

  // Plain Bellman-Ford (no recording) — used to check Dijkstra's answer.
  function bellmanFordPlain(g, source) {
    const dist = {};
    g.nodes.forEach((n) => { dist[n.id] = INF; });
    dist[source] = 0;
    for (let i = 1; i < g.nodes.length; i++) {
      let changed = false;
      for (const e of g.edges) {
        if (dist[e.from] !== INF && dist[e.from] + e.w < dist[e.to]) {
          dist[e.to] = dist[e.from] + e.w;
          changed = true;
        }
      }
      if (!changed) break;
    }
    const negativeCycle = g.edges.some((e) => dist[e.from] !== INF && dist[e.from] + e.w < dist[e.to]);
    return { dist, negativeCycle };
  }

  // ------------------------------------------------------------------------
  // Step recording
  // ------------------------------------------------------------------------
  const pqOrder = (a, b) => a.d - b.d || a.id.localeCompare(b.id);

  function createTrace(g, algo, source) {
    const dist = {};
    const prev = {};
    g.nodes.forEach((n) => { dist[n.id] = INF; prev[n.id] = null; });
    dist[source] = 0;

    const t = { dist, prev, settled: [], pq: [], checks: 0, relaxes: 0, steps: [] };
    t.push = (extra) => {
      t.steps.push({
        algo,
        dist: { ...dist },
        prev: { ...prev },
        settled: t.settled.slice(),
        pq: t.pq.slice().sort(pqOrder).map((e) => ({ ...e })),
        checks: t.checks,
        relaxes: t.relaxes,
        current: null,        // node being processed
        edge: null,           // edge being examined
        edgeResult: null,     // 'relax' | 'reject' | 'skip'
        updated: null,        // node whose distance just improved
        message: '',
        tone: '',             // '' | 'good' | 'bad'
        done: false,
        path: null,
        cost: null,
        negativeCycle: false,
        cycle: [],            // edge keys of a detected negative cycle
        ...extra
      });
    };
    return t;
  }

  // ---- Dijkstra -----------------------------------------------------------
  function buildDijkstra(g, source, target) {
    const t = createTrace(g, 'dijkstra', source);
    const { dist, prev } = t;

    t.pq.push({ id: source, d: 0 });
    t.push({
      updated: source, message: `Set <strong>dist[${source}] = 0</strong> and every other node to ∞, then insert ${source} into the priority queue.`
    });

    while (t.pq.length) {
      t.pq.sort(pqOrder);
      const { id: u, d } = t.pq.shift();
      t.settled.push(u);
      t.push({
        current: u, message: `Extract the closest unsettled node: <strong>${u}</strong> (dist ${d}). It is now settled.`
      });

      for (const e of outEdges(g, u)) {
        const v = e.to;
        t.checks++;

        if (t.settled.includes(v)) {
          t.push({
            current: u, edge: e, edgeResult: 'skip', message: `Edge ${u}→${v} (w = ${e.w}): <strong>${v}</strong> is already settled, so it is skipped.`
          });
          continue;
        }

        const cand = dist[u] + e.w;
        if (cand < dist[v]) {
          const old = dist[v];
          dist[v] = cand;
          prev[v] = u;
          t.relaxes++;
          const inQueue = t.pq.find((x) => x.id === v);
          if (inQueue) inQueue.d = cand; else t.pq.push({ id: v, d: cand });
          t.push({
            current: u, edge: e, edgeResult: 'relax', updated: v, message: `Edge ${u}→${v}: ${dist[u]} + ${e.w} = ${cand} &lt; ${fmt(old)} → <strong>relax!</strong> dist[${v}] = ${cand}, prev[${v}] = ${u}.`
          });
        } else {
          t.push({
            current: u, edge: e, edgeResult: 'reject', message: `Edge ${u}→${v}: ${dist[u]} + ${e.w} = ${cand} is not less than ${fmt(dist[v])} → no improvement.`
          });
        }
      }
    }

    // ---- final frame ----
    const path = tracePath(prev, source, target, dist);
    let message = path
      ? `Done. Shortest path ${source} → ${target}: <strong>${path.join(' → ')}</strong> (cost ${dist[target]}).`
      : `Done. <strong>${target}</strong> is unreachable from ${source}.`;
    let tone = path ? 'good' : '';

    if (hasNegative(g)) {
      const truth = bellmanFordPlain(g, source);
      if (truth.negativeCycle) {
        message += ' ⚠ This graph has a negative cycle, so no true shortest path exists — Dijkstra cannot detect that.';
        tone = 'bad';
      } else {
        const wrong = g.nodes.filter((n) => truth.dist[n.id] !== dist[n.id]).map((n) => n.id);
        if (wrong.length) {
          message += ` ⚠ <strong>Incorrect!</strong> True distances differ for ${wrong.join(', ')} `
            + `(dist[${wrong[0]}] should be ${fmt(truth.dist[wrong[0]])}). `
            + `Dijkstra can't handle negative edges — run Bellman-Ford.`;
          tone = 'bad';
        }
      }
    }

    t.push({ done: true, path, cost: path ? dist[target] : INF, message, tone });
    return t.steps;
  }

  // ---- Bellman-Ford -------------------------------------------------------
  function buildBellmanFord(g, source, target) {
    const t = createTrace(g, 'bellmanFord', source);
    const { dist, prev } = t;
    const V = g.nodes.length;

    t.push({
      updated: source, message: `Set <strong>dist[${source}] = 0</strong> and every other node to ∞. Up to ${V - 1} passes (V − 1) will relax every edge.`
    });

    for (let i = 1; i <= V - 1; i++) {
      let changed = false;
      t.push({ message: `<strong>Pass ${i} of ${V - 1}:</strong> try to relax every edge, in order.` });

      for (const e of g.edges) {
        const { from: u, to: v, w } = e;
        t.checks++;

        if (dist[u] === INF) {
          t.push({
            edge: e, edgeResult: 'skip', message: `Edge ${u}→${v}: dist[${u}] is still ∞, so there is nothing to relax from yet.`
          });
          continue;
        }

        const cand = dist[u] + w;
        if (cand < dist[v]) {
          const old = dist[v];
          dist[v] = cand;
          prev[v] = u;
          t.relaxes++;
          changed = true;
          t.push({
            edge: e, edgeResult: 'relax', updated: v, current: u, message: `Edge ${u}→${v}: ${dist[u]} + ${w} = ${cand} &lt; ${fmt(old)} → <strong>relax!</strong> dist[${v}] = ${cand}, prev[${v}] = ${u}.`
          });
        } else {
          t.push({
            edge: e, edgeResult: 'reject', current: u, message: `Edge ${u}→${v}: ${dist[u]} + ${w} = ${cand} is not less than ${fmt(dist[v])} → no improvement.`
          });
        }
      }

      if (!changed) {
        t.push({
          message: `Pass ${i} changed nothing → every distance is final. <strong>Exit early.</strong>`
        });
        break;
      }
    }

    // ---- verification pass: detect negative cycles ----
    const violating = g.edges.find((e) => dist[e.from] !== INF && dist[e.from] + e.w < dist[e.to]);

    if (!violating) {
      t.checks += g.edges.length;
      t.push({
        message: 'Verification pass: no edge can be relaxed any further → <strong>no negative cycle</strong>. Distances are final.'
      });

      const path = tracePath(prev, source, target, dist);
      t.push({
        done: true, path, cost: path ? dist[target] : INF,
        tone: path ? 'good' : '',
        message: path
          ? `Done. Shortest path ${source} → ${target}: <strong>${path.join(' → ')}</strong> (cost ${dist[target]}).`
          : `Done. <strong>${target}</strong> is unreachable from ${source}.`
      });
      return t.steps;
    }

    // A relaxable edge after V-1 passes => negative cycle. Walk prev[] V times
    // to be sure we are standing INSIDE the cycle, then collect it.
    t.checks++;
    const p2 = { ...prev };
    p2[violating.to] = violating.from;
    let x = violating.to;
    for (let k = 0; k < V && x != null; k++) x = p2[x];

    let cycle = [];
    if (x != null) {
      let y = x;
      let guard = 0;
      do { cycle.push(y); y = p2[y]; } while (y != null && y !== x && guard++ < V + 1);
      if (y !== x) cycle = [];
      cycle.reverse();
    }
    if (!cycle.length) cycle = [violating.from, violating.to];
    const cycleKeys = cycle.map((id, i) => key(id, cycle[(i + 1) % cycle.length]));

    t.push({
      edge: violating, edgeResult: 'relax',
      negativeCycle: true, cycle: cycleKeys, done: true, path: null, cost: -INF, tone: 'bad',
      message: `Edge ${violating.from}→${violating.to} can <strong>still</strong> be relaxed after V − 1 passes → `
        + `<strong>negative cycle detected</strong> (${cycle.join(' → ')} → ${cycle[0]}). No shortest path exists.`
    });
    return t.steps;
  }

  // ------------------------------------------------------------------------
  // Playback controller (frames are snapshots, so back/forward both work)
  // ------------------------------------------------------------------------
  class StepController {
    constructor(onRender) {
      this.onRender = onRender;
      this.steps = [];
      this.index = -1;          // -1 = idle (before the first step)
      this.playing = false;
      this.speed = 520;
      this.session = 0;
    }

    get last() { return this.steps.length - 1; }

    setSpeed(sliderValue) { this.speed = Math.max(20, 1020 - Number(sliderValue)); }

    emit() { this.onRender(this.index, this.index >= 0 ? this.steps[this.index] : null); }

    load(steps) {
      this.session++;
      this.playing = false;
      this.steps = steps;
      this.index = -1;
      this.emit();
    }

    show(i) {
      this.index = Math.max(-1, Math.min(i, this.last));
      this.emit();
    }

    next() { if (this.index < this.last) this.show(this.index + 1); }
    prev() { if (this.index > 0) this.show(this.index - 1); }

    reset() {
      this.session++;
      this.playing = false;
      this.show(-1);
    }

    pause() {
      this.session++;
      this.playing = false;
      this.emit();
    }

    async play() {
      if (this.playing || !this.steps.length) return;
      if (this.index < 0 || this.index >= this.last) this.show(0);
      this.playing = true;
      const session = ++this.session;
      this.emit();

      while (this.index < this.last) {
        await delay(this.speed);
        if (session !== this.session) return;
        this.show(this.index + 1);
      }
      this.playing = false;
      this.emit();
    }
  }

  const HEADINGS = {
    dijkstra: { title: 'DIJKSTRA', subtitle: 'GREEDY · PRIORITY QUEUE' },
    bellmanFord: { title: 'BELLMAN-FORD', subtitle: 'EDGE RELAXATION · V−1 PASSES' }
  };

  const INFO = {
    dijkstra: { name: 'Dijkstra', time: 'O((V + E) log V)', space: 'O(V)', negative: 'Not supported' },
    bellmanFord: { name: 'Bellman-Ford', time: 'O(V · E)', space: 'O(V)', negative: 'Supported + cycle detection' }
  };

  // ------------------------------------------------------------------------
  // Weight-label placement: try several spots along each edge (both sides) and
  // keep the first one that stays clear of other labels, nodes and edges.
  // Computed once per graph, so labels never jump between animation steps.
  // ------------------------------------------------------------------------
  function computeLabelPositions(g) {
    const pos = {};
    g.nodes.forEach((n) => { pos[n.id] = n; });
    const segs = g.edges.map((e) => ({ e, a: pos[e.from], b: pos[e.to] }));
    const placed = [];
    const map = new Map();

    const distToSeg = (p, a, b) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
    };

    for (const s of segs) {
      const dx = s.b.x - s.a.x;
      const dy = s.b.y - s.a.y;
      const len = Math.hypot(dx, dy);
      const ux = dx / len;
      const uy = dy / len;
      let best = null;
      let bestScore = -Infinity;

      search:
      for (const t of [0.5, 0.42, 0.58, 0.34, 0.66, 0.28, 0.72]) {
        for (const side of [1, -1]) {
          const p = { x: s.a.x + dx * t - uy * 13 * side, y: s.a.y + dy * t + ux * 13 * side };
          const dLabel = Math.min(Infinity, ...placed.map((q) => Math.hypot(p.x - q.x, p.y - q.y)));
          const dNode = Math.min(...g.nodes.map((n) => Math.hypot(p.x - n.x, p.y - n.y))) - NODE_R;
          const dEdge = Math.min(Infinity, ...segs.filter((o) => o !== s).map((o) => distToSeg(p, o.a, o.b)));
          const score = Math.min(dLabel / 26, dNode / 12, dEdge / 11);
          if (score > bestScore) { bestScore = score; best = p; }
          if (score >= 1) break search;
        }
      }
      placed.push(best);
      map.set(s.e, best);
    }
    return map;
  }

  // ------------------------------------------------------------------------
  // DOM
  // ------------------------------------------------------------------------
  const $ = (id) => document.getElementById(id);
  const els = {
    svg: $('sp-svg'),
    algo: $('algo-select'), preset: $('preset-select'), source: $('source-select'), target: $('target-select'),
    random: $('random-btn'), negToggle: $('neg-toggle'), speed: $('speed-slider'),
    play: $('play-btn'), pause: $('pause-btn'), prev: $('prev-btn'), next: $('next-btn'), reset: $('reset-btn'),
    stepLabel: $('step-label'), checks: $('check-count'), relaxes: $('relax-count'),
    status: $('status-text'), statusBox: $('status-box'), warning: $('neg-warning'),
    tableBody: $('dist-body'),
    heading: $('algo-heading'), subheading: $('algo-subheading'),
    path: $('path-output'), cost: $('cost-output'),
    algoName: $('algo-name'), timeComp: $('time-comp'), spaceComp: $('space-comp'), negSupport: $('neg-support')
  };

  let graph = null;
  let labelPos = new Map();
  let source = 'A';
  let target = 'F';

  const controller = new StepController(render);

  function svgEl(tag, attrs, text) {
    const el = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function idleFrame() {
    const dist = {};
    const prev = {};
    graph.nodes.forEach((n) => { dist[n.id] = INF; prev[n.id] = null; });
    return {
      algo: els.algo.value, dist, prev, settled: [], pq: [], checks: 0, relaxes: 0,
      current: null, edge: null, edgeResult: null, updated: null,
      message: 'Choose an algorithm, source and target, then press <strong>Start</strong> — or step through it one move at a time.',
      tone: '', done: false, path: null, cost: null, negativeCycle: false, cycle: []
    };
  }

  // ---------------- rendering ----------------
  function renderGraph(frame) {
    const svg = els.svg;
    svg.innerHTML = '';
    const pos = {};
    graph.nodes.forEach((n) => { pos[n.id] = n; });

    const treeKeys = new Set();
    for (const v in frame.prev) if (frame.prev[v] !== null) treeKeys.add(key(frame.prev[v], v));
    const pathKeys = new Set();
    if (frame.path) for (let i = 0; i < frame.path.length - 1; i++) pathKeys.add(key(frame.path[i], frame.path[i + 1]));
    const cycleKeys = new Set(frame.cycle);
    const cycleNodes = new Set();
    frame.cycle.forEach((k) => k.split('>').forEach((id) => cycleNodes.add(id)));
    const pathNodes = new Set(frame.path || []);

    const edgeLayer = svgEl('g', {});
    const labelLayer = svgEl('g', {});
    const nodeLayer = svgEl('g', {});

    graph.edges.forEach((e) => {
      const a = pos[e.from];
      const b = pos[e.to];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      const ux = dx / len;
      const uy = dy / len;

      const start = { x: a.x + ux * NODE_R, y: a.y + uy * NODE_R };
      const tip = { x: b.x - ux * (NODE_R + 3), y: b.y - uy * (NODE_R + 3) };
      const base = { x: tip.x - ux * 11, y: tip.y - uy * 11 };
      const px = -uy * 5.5;
      const py = ux * 5.5;

      let state = '';
      if (cycleKeys.has(key(e.from, e.to))) state = 'cycle';
      else if (frame.edge === e) state = frame.edgeResult === 'relax' ? 'relax' : 'check';
      else if (pathKeys.has(key(e.from, e.to))) state = 'path';
      else if (treeKeys.has(key(e.from, e.to))) state = 'tree';

      const g = svgEl('g', { class: `sp-edge ${state}` });
      g.appendChild(svgEl('line', { x1: start.x, y1: start.y, x2: base.x, y2: base.y }));
      g.appendChild(svgEl('polygon', {
        class: 'arrow',
        points: `${tip.x},${tip.y} ${base.x + px},${base.y + py} ${base.x - px},${base.y - py}`
      }));
      edgeLayer.appendChild(g);

      const lp = labelPos.get(e);
      labelLayer.appendChild(svgEl('text', {
        class: `sp-weight${e.w < 0 ? ' neg' : ''}`,
        x: lp.x,
        y: lp.y
      }, String(e.w)));
    });

    graph.nodes.forEach((n) => {
      const cls = ['sp-node'];
      if (frame.settled.includes(n.id)) cls.push('settled');
      if (frame.updated === n.id) cls.push('updated');
      if (frame.current === n.id) cls.push('current');
      if (pathNodes.has(n.id)) cls.push('onpath');
      if (cycleNodes.has(n.id)) cls.push('cyclenode');

      const g = svgEl('g', { class: cls.join(' ') });
      if (n.id === source) g.appendChild(svgEl('circle', { class: 'sp-ring source', cx: n.x, cy: n.y, r: NODE_R + 6 }));
      if (n.id === target) g.appendChild(svgEl('circle', { class: 'sp-ring target', cx: n.x, cy: n.y, r: NODE_R + 6 }));
      g.appendChild(svgEl('circle', { class: 'body', cx: n.x, cy: n.y, r: NODE_R }));
      g.appendChild(svgEl('text', { class: 'sp-id', x: n.x, y: n.y - 6 }, n.id));
      g.appendChild(svgEl('text', { class: 'sp-dist', x: n.x, y: n.y + 11 }, fmt(frame.dist[n.id])));

      const tags = [];
      if (n.id === source) tags.push('START');
      if (n.id === target) tags.push('TARGET');
      if (tags.length) g.appendChild(svgEl('text', { class: 'sp-tag', x: n.x, y: n.y + NODE_R + 20 }, tags.join(' · ')));
      nodeLayer.appendChild(g);
    });

    svg.appendChild(edgeLayer);
    svg.appendChild(labelLayer);
    svg.appendChild(nodeLayer);
  }

  function renderTable(frame) {
    els.tableBody.innerHTML = graph.nodes.map((n) => {
      const cls = [];
      if (frame.current === n.id) cls.push('current');
      if (frame.updated === n.id) cls.push('updated');
      let status;
      if (frame.algo === 'dijkstra') {
        status = frame.settled.includes(n.id) ? 'settled'
          : frame.pq.some((e) => e.id === n.id) ? 'in queue' : 'unvisited';
      } else {
        status = frame.dist[n.id] === INF ? 'unreached' : 'reached';
      }
      return `<tr class="${cls.join(' ')}">`
        + `<td class="c-node">${n.id}</td>`
        + `<td class="c-dist">${fmt(frame.dist[n.id])}</td>`
        + `<td class="c-prev">${frame.prev[n.id] || '—'}</td>`
        + `<td class="c-state">${status}</td></tr>`;
    }).join('');
  }

  function renderResult(frame) {
    if (!frame.done) {
      els.path.textContent = '—';
      els.cost.textContent = '—';
    } else if (frame.negativeCycle) {
      els.path.textContent = 'None — a negative cycle is reachable from the source';
      els.cost.textContent = '−∞';
    } else if (!frame.path) {
      els.path.textContent = `No path from ${source} to ${target}`;
      els.cost.textContent = '∞';
    } else {
      els.path.textContent = frame.path.join(' → ');
      els.cost.textContent = String(frame.cost);
    }
  }

  function syncControls(index) {
    const c = controller;
    els.prev.disabled = index <= 0;
    els.next.disabled = index >= c.last;
    if (c.playing) {
      els.play.textContent = 'Running…';
      els.play.disabled = true;
    } else {
      els.play.disabled = false;
      els.play.textContent = index < 0 ? 'Start' : index >= c.last ? 'Replay' : 'Resume';
    }
    els.pause.disabled = !c.playing;
    els.stepLabel.textContent = index < 0 ? `Ready · ${c.steps.length} steps` : `Step ${index + 1} / ${c.steps.length}`;
  }

  function render(index, stepFrame) {
    const frame = stepFrame || idleFrame();
    renderGraph(frame);
    renderTable(frame);
    renderResult(frame);
    els.checks.textContent = frame.checks;
    els.relaxes.textContent = frame.relaxes;
    els.status.innerHTML = frame.message;
    els.statusBox.className = `action-banner sp-status ${frame.tone}`.trim();
    syncControls(index);
  }

  // ---------------- setup ----------------
  function setupHeader() {
    const algo = els.algo.value;
    els.heading.textContent = HEADINGS[algo].title;
    els.subheading.textContent = HEADINGS[algo].subtitle;

    const info = INFO[algo];
    els.algoName.textContent = info.name;
    els.timeComp.textContent = info.time;
    els.spaceComp.textContent = info.space;
    els.negSupport.textContent = info.negative;
  }

  function updateWarning() {
    const show = els.algo.value === 'dijkstra' && hasNegative(graph);
    els.warning.hidden = !show;
  }

  function populateNodeSelects() {
    const options = graph.nodes.map((n) => `<option value="${n.id}">${n.id}</option>`).join('');
    els.source.innerHTML = options;
    els.target.innerHTML = options;
    els.source.value = source;
    els.target.value = target;
  }

  function rebuild() {
    const steps = els.algo.value === 'bellmanFord'
      ? buildBellmanFord(graph, source, target)
      : buildDijkstra(graph, source, target);
    updateWarning();
    controller.load(steps);
  }

  function loadPreset(name) {
    if (name === 'random') {
      graph = randomGraph(els.negToggle.checked);
      source = 'A';
      target = 'F';
    } else {
      const p = PRESETS[name];
      graph = cloneGraph(p);
      source = p.source;
      target = p.target;
    }
    labelPos = computeLabelPositions(graph);
    els.preset.value = name;
    populateNodeSelects();
    rebuild();
  }

  els.algo.addEventListener('change', () => { setupHeader(); rebuild(); });
  els.preset.addEventListener('change', () => loadPreset(els.preset.value));
  els.random.addEventListener('click', () => loadPreset('random'));
  els.negToggle.addEventListener('change', () => loadPreset('random'));
  els.source.addEventListener('change', () => { source = els.source.value; rebuild(); });
  els.target.addEventListener('change', () => { target = els.target.value; rebuild(); });
  els.speed.addEventListener('input', () => controller.setSpeed(els.speed.value));
  els.play.addEventListener('click', () => controller.play());
  els.pause.addEventListener('click', () => controller.pause());
  els.next.addEventListener('click', () => { controller.pause(); controller.next(); });
  els.prev.addEventListener('click', () => { controller.pause(); controller.prev(); });
  els.reset.addEventListener('click', () => controller.reset());

  // Initial load
  controller.setSpeed(els.speed.value);
  setupHeader();
  loadPreset('road');
})();
