export type VisualizerKind = 'array' | 'string' | 'linked-list' | 'binary-tree' | 'graph';

export interface ArrayVisualState {
  values: Array<string | number | null>;
  activeIndices: number[];
  compareIndices?: number[];
}

export interface StringVisualState {
  value: string;
  activeIndices: number[];
  compareIndices?: number[];
}

export interface LinkedListNodeVisualState {
  id: string;
  value: string | number;
  next: string | null;
  active: boolean;
  head?: boolean;
}

export interface LinkedListVisualState {
  nodes: LinkedListNodeVisualState[];
  headId: string | null;
  activeNodeIds: string[];
}

export interface TreeNodeVisualState {
  id: string;
  value: string | number;
  left?: string | null;
  right?: string | null;
  active: boolean;
  visited?: boolean;
}

export interface BinaryTreeVisualState {
  nodes: TreeNodeVisualState[];
  rootId: string | null;
  activeNodeIds: string[];
}

export interface GraphNodeVisualState {
  id: string;
  label: string;
  x: number;
  y: number;
  active: boolean;
  visited?: boolean;
}

export interface GraphEdgeVisualState {
  from: string;
  to: string;
  active: boolean;
  weight?: number | string;
}

export interface GraphVisualState {
  nodes: GraphNodeVisualState[];
  edges: GraphEdgeVisualState[];
  activeNodeIds: string[];
  activeEdgeIds?: string[];
}

export interface VisualizerSnapshot {
  id: number;
  label: string;
  kind: VisualizerKind;
  variables: Record<string, string>;
  activeIndices: number[];
  activePointers: string[];
  arrays?: ArrayVisualState[];
  strings?: StringVisualState[];
  linkedList?: LinkedListVisualState;
  tree?: BinaryTreeVisualState;
  graph?: GraphVisualState;
  notes?: string[];
}

export interface VisualizerParseResult {
  snapshots: VisualizerSnapshot[];
  unsupportedReason?: string;
}

/**
 * Universal array extractor supporting JS, Python, Java, C++, and pseudocode
 */
const parseArraySource = (code: string): Array<number | string> | null => {
  // 1. Priority: Extract array passed into function calls, e.g. twoSum(new int[]{2, 7, 11, 15}, 9) or twoSum([2, 7, 11, 15], 9)
  const fnArgMatch = code.match(/\w+\s*\(\s*(?:new\s+[\w\[\]]+\s*)?[\[\{]([0-9\s,.-]+)[\]\}]/);
  if (fnArgMatch && fnArgMatch[1].trim()) {
    const items = fnArgMatch[1].split(',').map(s => s.trim()).filter(Boolean).map(s => Number.isFinite(Number(s)) ? Number(s) : s);
    if (items.length > 1) return items;
  }

  // 2. Priority: Named array declaration e.g. int[] nums = {2, 7, 11, 15} or nums = [2, 7, 11, 15]
  const namedMatches = code.matchAll(/(?:let|const|var|int\[\]|vector<[\w\s]+>|auto)?\s*(?:nums|arr|data|items|list|values|array)\s*[:=]\s*(?:new\s+[\w\[\]]+\s*)?[\[\{]([0-9\s,.-]+)[\]\}]/gi);
  for (const m of namedMatches) {
    const raw = m[1].trim();
    if (raw) {
      const items = raw.split(',').map(s => s.trim()).filter(Boolean).map(s => Number.isFinite(Number(s)) ? Number(s) : s);
      if (items.length > 1) return items;
    }
  }

  // 3. Fallback: Collect all candidates and choose the most comprehensive one (length >= 3)
  const candidates: Array<Array<number | string>> = [];

  const braceMatches = code.matchAll(/(?:\{|new\s+int\[\]\s*\{)([0-9\s,.-]+)\}/g);
  for (const m of braceMatches) {
    const raw = m[1].trim();
    if (raw) {
      const items = raw.split(',').map(s => s.trim()).filter(Boolean).map(s => Number.isFinite(Number(s)) ? Number(s) : s);
      if (items.length > 0) candidates.push(items);
    }
  }

  const bracketMatches = code.matchAll(/\[([0-9\s,.-]+)\]/g);
  for (const m of bracketMatches) {
    const raw = m[1].trim();
    if (raw) {
      const items = raw.split(',').map(s => s.trim()).filter(Boolean).map(s => Number.isFinite(Number(s)) ? Number(s) : s);
      if (items.length > 0) candidates.push(items);
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.length - a.length);
    return candidates[0];
  }

  return null;
};

/**
 * Universal target extractor for Two Sum / Search algorithms
 */
const parseTargetNumber = (code: string): number => {
  // 1. Match twoSum(..., 9) or search(..., 9)
  const fnCallTargetMatch = code.match(/\w+\s*\(\s*(?:new\s+[\w\[\]]+\s*)?[\[\{][\s0-9,.-]+[\]\}]\s*,\s*([0-9]+)\s*\)/);
  if (fnCallTargetMatch) return Number(fnCallTargetMatch[1]);

  // 2. Match explicit target variable: target = 9 or int target = 9
  const explicitTargetMatch = code.match(/\b(?:target|t|sum|val)\s*[:=]\s*([0-9]+)\b/i);
  if (explicitTargetMatch) return Number(explicitTargetMatch[1]);

  return 9;
};

/**
 * Universal string extractor supporting JS, Python, Java, C++
 */
const parseStringSource = (code: string): string | null => {
  const match = code.match(/(?:let|const|var|String|string|str|text)\s+([A-Za-z_]\w*)?\s*[:=]\s*["'`]([^"'`\n]{2,})["'`]/);
  if (match && match[2]) return match[2];
  
  const rawStringMatch = code.match(/["']([A-Za-z0-9_\s]{3,})["']/);
  if (rawStringMatch && rawStringMatch[1]) return rawStringMatch[1];

  return null;
};

/**
 * Generates dynamic, step-by-step Two Sum algorithm visualization
 */
function buildTwoSumSnapshots(nums: Array<number | string>, target: number = 9): VisualizerSnapshot[] {
  const numArr = nums.map(n => typeof n === 'number' ? n : Number(n) || 0);
  const snapshots: VisualizerSnapshot[] = [];
  const mapState: Record<number, number> = {};

  // Initial Step
  snapshots.push({
    id: 0,
    label: `Initialize Two Sum (Target: ${target})`,
    kind: 'array',
    variables: {
      target: String(target),
      array: JSON.stringify(numArr),
      hashMap: '{}'
    },
    activeIndices: [],
    activePointers: ['start'],
    arrays: [{ values: numArr, activeIndices: [], compareIndices: [] }],
    notes: [
      `Target sum is ${target}.`,
      'Initialize an empty Hash Map to store seen numbers and their indices.'
    ]
  });

  let foundPair = false;
  for (let i = 0; i < numArr.length; i++) {
    const val = numArr[i];
    const complement = target - val;
    const hasComplement = complement in mapState;

    if (hasComplement) {
      const complementIndex = mapState[complement];
      // Step: Complement Found!
      snapshots.push({
        id: snapshots.length,
        label: `Match Found! ${complement} + ${val} = ${target}`,
        kind: 'array',
        variables: {
          index: String(i),
          currentValue: String(val),
          complement: `${target} - ${val} = ${complement}`,
          resultIndices: `[${complementIndex}, ${i}]`,
          hashMap: JSON.stringify(mapState)
        },
        activeIndices: [complementIndex, i],
        activePointers: ['match-1', 'match-2'],
        arrays: [{
          values: numArr,
          activeIndices: [complementIndex, i],
          compareIndices: [complementIndex, i]
        }],
        notes: [
          `Complement ${complement} found in Hash Map at index ${complementIndex}!`,
          `Solution pair: indices [${complementIndex}, ${i}].`
        ]
      });
      foundPair = true;
      break;
    } else {
      // Step: Inspect & Store
      snapshots.push({
        id: snapshots.length,
        label: `Inspect Index ${i} (Value: ${val})`,
        kind: 'array',
        variables: {
          index: String(i),
          currentValue: String(val),
          neededComplement: `${target} - ${val} = ${complement}`,
          inHashMap: 'false',
          hashMap: JSON.stringify(mapState)
        },
        activeIndices: [i],
        activePointers: ['pointer-i'],
        arrays: [{
          values: numArr,
          activeIndices: [i],
          compareIndices: []
        }],
        notes: [
          `Current element is ${val} at index ${i}.`,
          `Needed complement is ${complement}. Not yet in map, adding {${val}: ${i}}.`
        ]
      });
      mapState[val] = i;
    }
  }

  if (!foundPair) {
    snapshots.push({
      id: snapshots.length,
      label: 'Completed pass (No pair found)',
      kind: 'array',
      variables: {
        result: '[]',
        hashMap: JSON.stringify(mapState)
      },
      activeIndices: [],
      activePointers: ['done'],
      arrays: [{ values: numArr, activeIndices: [], compareIndices: [] }],
      notes: ['Scanned entire array. No two elements summed up to the target.']
    });
  }

  return snapshots;
}

/**
 * Generates dynamic Two-Pointer / Reversal / Palindrome steps
 */
function buildTwoPointerSnapshots(values: Array<string | number>): VisualizerSnapshot[] {
  const snapshots: VisualizerSnapshot[] = [];
  const current = [...values];
  let left = 0;
  let right = current.length - 1;

  snapshots.push({
    id: 0,
    label: 'Initial Two-Pointer Bounds',
    kind: 'array',
    variables: {
      left: String(left),
      right: String(right),
      values: JSON.stringify(current)
    },
    activeIndices: [left, right],
    activePointers: ['left', 'right'],
    arrays: [{ values: [...current], activeIndices: [left, right], compareIndices: [left, right] }],
    notes: ['Place left pointer at index 0 and right pointer at index ' + right + '.']
  });

  while (left < right) {
    const temp = current[left];
    current[left] = current[right];
    current[right] = temp;

    snapshots.push({
      id: snapshots.length,
      label: `Swap elements at index ${left} and ${right}`,
      kind: 'array',
      variables: {
        left: String(left),
        right: String(right),
        swapped: `${temp} <-> ${current[left]}`,
        currentArray: JSON.stringify(current)
      },
      activeIndices: [left, right],
      activePointers: ['left', 'right'],
      arrays: [{ values: [...current], activeIndices: [left, right], compareIndices: [left, right] }],
      notes: [
        `Swapped element ${temp} with ${current[left]}.`,
        'Move left pointer rightwards (+1) and right pointer leftwards (-1).'
      ]
    });

    left++;
    right--;
  }

  snapshots.push({
    id: snapshots.length,
    label: 'Pointers meet — Operation Complete',
    kind: 'array',
    variables: {
      finalResult: JSON.stringify(current)
    },
    activeIndices: [],
    activePointers: ['done'],
    arrays: [{ values: [...current], activeIndices: [], compareIndices: [] }],
    notes: ['Two pointers have converged. Final array processed in O(n/2) time.']
  });

  return snapshots;
}

/**
 * Generates sequential array scan steps
 */
function buildArrayScanSnapshots(values: Array<string | number>): VisualizerSnapshot[] {
  const snapshots: VisualizerSnapshot[] = [];

  snapshots.push({
    id: 0,
    label: 'Array Initial State',
    kind: 'array',
    variables: { length: String(values.length), array: JSON.stringify(values) },
    activeIndices: [0],
    activePointers: ['i = 0'],
    arrays: [{ values, activeIndices: [0], compareIndices: [] }],
    notes: ['Starting linear scan from index 0.']
  });

  for (let i = 0; i < values.length; i++) {
    snapshots.push({
      id: snapshots.length,
      label: `Process Element ${i + 1}/${values.length} (Index: ${i})`,
      kind: 'array',
      variables: {
        currentIndex: String(i),
        value: String(values[i]),
        status: 'evaluating'
      },
      activeIndices: [i],
      activePointers: [`i = ${i}`],
      arrays: [{ values, activeIndices: [i], compareIndices: [i] }],
      notes: [`Inspecting element ${values[i]} at index ${i}.`]
    });
  }

  snapshots.push({
    id: snapshots.length,
    label: 'Array Scan Complete',
    kind: 'array',
    variables: { totalProcessed: String(values.length) },
    activeIndices: [],
    activePointers: ['done'],
    arrays: [{ values, activeIndices: [], compareIndices: [] }],
    notes: ['All elements processed in linear O(n) time.']
  });

  return snapshots;
}

/**
 * Generates String manipulation steps
 */
function buildStringSnapshots(text: string): VisualizerSnapshot[] {
  const chars = text.split('');
  const snapshots: VisualizerSnapshot[] = [];

  snapshots.push({
    id: 0,
    label: `Initial String: "${text}"`,
    kind: 'string',
    variables: { string: text, length: String(text.length) },
    activeIndices: [0],
    activePointers: ['start'],
    strings: [{ value: text, activeIndices: [0], compareIndices: [0] }],
    notes: ['Inspecting string from start to end.']
  });

  let left = 0;
  let right = chars.length - 1;
  while (left <= right) {
    snapshots.push({
      id: snapshots.length,
      label: `Inspect "${chars[left]}" (idx ${left}) & "${chars[right]}" (idx ${right})`,
      kind: 'string',
      variables: {
        leftChar: chars[left],
        rightChar: chars[right],
        isMatch: String(chars[left] === chars[right])
      },
      activeIndices: [left, right],
      activePointers: ['left', 'right'],
      strings: [{ value: text, activeIndices: [left, right], compareIndices: [left, right] }],
      notes: [`Comparing character '${chars[left]}' with '${chars[right]}'.`]
    });
    left++;
    right--;
  }

  return snapshots;
}

/**
 * Generates Linked List steps
 */
function buildLinkedListSnapshots(values: Array<string | number>): VisualizerSnapshot[] {
  const nodes = values.map((val, idx) => ({
    id: `node-${idx + 1}`,
    value: val,
    next: idx < values.length - 1 ? `node-${idx + 2}` : null,
    active: idx === 0,
    head: idx === 0
  }));

  const snapshots: VisualizerSnapshot[] = [];

  for (let i = 0; i < nodes.length; i++) {
    snapshots.push({
      id: snapshots.length,
      label: i === 0 ? 'Head Node Pointer' : `Traverse to Node ${i + 1}`,
      kind: 'linked-list',
      variables: {
        currentNode: nodes[i].id,
        nodeValue: String(nodes[i].value),
        nextPointer: nodes[i].next || 'null'
      },
      activeIndices: [i],
      activePointers: [i === 0 ? 'head' : 'curr'],
      linkedList: {
        nodes: nodes.map((n, idx) => ({ ...n, active: idx === i })),
        headId: nodes[0]?.id || null,
        activeNodeIds: [nodes[i].id]
      },
      notes: [
        `Pointer is at ${nodes[i].id} with value ${nodes[i].value}.`,
        nodes[i].next ? `Next address points to ${nodes[i].next}.` : 'End of linked list reached (tail.next = null).'
      ]
    });
  }

  return snapshots;
}

/**
 * Generates Binary Tree steps
 */
function buildBinaryTreeSnapshots(): VisualizerSnapshot[] {
  const nodes = [
    { id: 'node-1', value: 1, left: 'node-2', right: 'node-3', active: true, visited: false },
    { id: 'node-2', value: 2, left: 'node-4', right: 'node-5', active: false, visited: false },
    { id: 'node-3', value: 3, left: null, right: null, active: false, visited: false },
    { id: 'node-4', value: 4, left: null, right: null, active: false, visited: false },
    { id: 'node-5', value: 5, left: null, right: null, active: false, visited: false },
  ];

  return [
    {
      id: 0,
      label: 'Root Node (Depth 0)',
      kind: 'binary-tree',
      variables: { current: '1 (Root)', traversal: 'DFS Preorder' },
      activeIndices: [0],
      activePointers: ['root'],
      tree: { nodes, rootId: 'node-1', activeNodeIds: ['node-1'] },
      notes: ['Visiting root node (value = 1).']
    },
    {
      id: 1,
      label: 'Traverse Left Subtree (Node 2)',
      kind: 'binary-tree',
      variables: { current: '2', parent: '1', branch: 'Left' },
      activeIndices: [1],
      activePointers: ['left-branch'],
      tree: {
        nodes: nodes.map(n => ({ ...n, active: n.id === 'node-2', visited: n.id === 'node-1' })),
        rootId: 'node-1',
        activeNodeIds: ['node-2']
      },
      notes: ['Descend left child of node 1.']
    },
    {
      id: 2,
      label: 'Traverse Leftmost Leaf (Node 4)',
      kind: 'binary-tree',
      variables: { current: '4', parent: '2', leaf: 'true' },
      activeIndices: [2],
      activePointers: ['leaf'],
      tree: {
        nodes: nodes.map(n => ({ ...n, active: n.id === 'node-4', visited: ['node-1', 'node-2'].includes(n.id) })),
        rootId: 'node-1',
        activeNodeIds: ['node-4']
      },
      notes: ['Node 4 has no left or right children (leaf reached).']
    },
    {
      id: 3,
      label: 'Traverse Right Child (Node 3)',
      kind: 'binary-tree',
      variables: { current: '3', parent: '1', branch: 'Right' },
      activeIndices: [3],
      activePointers: ['right-branch'],
      tree: {
        nodes: nodes.map(n => ({ ...n, active: n.id === 'node-3', visited: ['node-1', 'node-2', 'node-4', 'node-5'].includes(n.id) })),
        rootId: 'node-1',
        activeNodeIds: ['node-3']
      },
      notes: ['Complete root right subtree traversal.']
    }
  ];
}

/**
 * Generates Graph BFS/DFS steps
 */
function buildGraphSnapshots(): VisualizerSnapshot[] {
  const nodes = [
    { id: 'A', label: 'A', x: 50, y: 50, active: true, visited: false },
    { id: 'B', label: 'B', x: 180, y: 30, active: false, visited: false },
    { id: 'C', label: 'C', x: 180, y: 120, active: false, visited: false },
    { id: 'D', label: 'D', x: 290, y: 75, active: false, visited: false },
  ];

  const edges = [
    { from: 'A', to: 'B', active: true },
    { from: 'A', to: 'C', active: true },
    { from: 'B', to: 'D', active: false },
    { from: 'C', to: 'D', active: false },
  ];

  return [
    {
      id: 0,
      label: 'Start Graph Search at Node A',
      kind: 'graph',
      variables: { current: 'A', queue: '["A"]', visited: '["A"]' },
      activeIndices: [0],
      activePointers: ['start'],
      graph: { nodes, edges, activeNodeIds: ['A'] },
      notes: ['Enqueue start node A and mark as visited.']
    },
    {
      id: 1,
      label: 'Explore Adjacent Neighbors of A (B, C)',
      kind: 'graph',
      variables: { current: 'A', neighbors: '["B", "C"]', queue: '["B", "C"]' },
      activeIndices: [1, 2],
      activePointers: ['neighbors'],
      graph: {
        nodes: nodes.map(n => ({ ...n, active: ['B', 'C'].includes(n.id), visited: n.id === 'A' })),
        edges: edges.map(e => ({ ...e, active: e.from === 'A' })),
        activeNodeIds: ['B', 'C']
      },
      notes: ['Discovered nodes B and C via outgoing directed edges.']
    },
    {
      id: 2,
      label: 'Reach Destination Node D',
      kind: 'graph',
      variables: { current: 'D', queue: '[]', visited: '["A", "B", "C", "D"]' },
      activeIndices: [3],
      activePointers: ['target'],
      graph: {
        nodes: nodes.map(n => ({ ...n, active: n.id === 'D', visited: true })),
        edges: edges.map(e => ({ ...e, active: true })),
        activeNodeIds: ['D']
      },
      notes: ['All reachable graph nodes discovered. Traversal complete!']
    }
  ];
}

/**
 * Master parser parsing any user code into visual snapshots
 */
export const parseVisualizerState = (code: string): VisualizerParseResult => {
  const normalized = code.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return {
      snapshots: [],
      unsupportedReason: 'Paste or write code to activate interactive visualizer walkthrough.',
    };
  }

  const lower = normalized.toLowerCase();

  // 1. Two Sum / Complement Hash Map
  if (lower.includes('twosum') || lower.includes('two_sum') || lower.includes('complement')) {
    const arr = parseArraySource(code) || [2, 7, 11, 15];
    const target = parseTargetNumber(code);
    return { snapshots: buildTwoSumSnapshots(arr, target) };
  }

  // 2. Binary Tree
  if (/(binary tree|treenode|left|right|root\s*[:=]|\.left|\.right)/i.test(lower)) {
    return { snapshots: buildBinaryTreeSnapshots() };
  }

  // 3. Graph
  if (/(graph|adjacency|bfs|dfs|dijkstra|topological|edges)/i.test(lower)) {
    return { snapshots: buildGraphSnapshots() };
  }

  // 4. Linked List
  if (/(linked list|listnode|head\.|next\s*[:=]|\.next)/i.test(lower)) {
    const arr = parseArraySource(code) || [10, 20, 30, 40];
    return { snapshots: buildLinkedListSnapshots(arr) };
  }

  // 5. Two Pointers / Reverse / Palindrome
  if (/(reverse|palindrome|swap|two.*pointer|left.*right)/i.test(lower)) {
    const arr = parseArraySource(code);
    if (arr) {
      return { snapshots: buildTwoPointerSnapshots(arr) };
    }
    const str = parseStringSource(code) || 'racecar';
    return { snapshots: buildStringSnapshots(str) };
  }

  // 6. Generic Array / List
  const arraySource = parseArraySource(code);
  if (arraySource) {
    return { snapshots: buildArrayScanSnapshots(arraySource) };
  }

  // 7. Generic String
  const stringSource = parseStringSource(code);
  if (stringSource) {
    return { snapshots: buildStringSnapshots(stringSource) };
  }

  // Fallback array walkthrough
  return {
    snapshots: buildArrayScanSnapshots([10, 20, 30, 40, 50]),
    unsupportedReason: undefined
  };
};
