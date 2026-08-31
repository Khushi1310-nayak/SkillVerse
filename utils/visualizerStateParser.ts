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

const arrayValuePattern = /(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*\[([\s\S]*?)\]/g;
const stringValuePattern = /(?:const|let|var)\s+([A-Za-z_]\w*)\s*=\s*["'`]([^"'`\n]+)["'`]/g;
const objectValuePattern = /(?:value\s*:\s*)(?:"|')?([^"',}\s]+)(?:"|')?/g;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const toPrimitive = (raw: string): string | number => {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed.replace(/^['"]|['"]$/g, '');
};

const parseLiteralArray = (source: string): Array<string | number> => {
  const cleaned = source
    .replace(/\[[\s\S]*?\]/g, source)
    .trim();

  if (!cleaned) return [];

  return cleaned
    .split(',')
    .map((item) => toPrimitive(item.trim()))
    .filter((item) => item !== '' || typeof item === 'string');
};

const parseArraySource = (code: string): Array<string | number> | null => {
  const match = [...code.matchAll(arrayValuePattern)][0];
  if (!match) return null;
  const rawValues = match[2];
  if (!rawValues.trim()) return null;

  const parsed = rawValues
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      if (item.startsWith('"') || item.startsWith("'")) {
        return item.replace(/^['"]|['"]$/g, '');
      }
      return Number.isFinite(Number(item)) ? Number(item) : item;
    });

  return parsed.length > 0 ? parsed : null;
};

const parseStringSource = (code: string): string | null => {
  const match = [...code.matchAll(stringValuePattern)][0];
  if (!match) return null;
  return match[2] ?? null;
};

const buildArraySnapshots = (values: Array<string | number>, mode: 'scan' | 'reverse' = 'scan'): VisualizerSnapshot[] => {
  const initialValues = [...values];
  const reversedValues = [...values].reverse();
  const finalValues = mode === 'reverse' ? reversedValues : [...values];

  const snapshots: VisualizerSnapshot[] = [
    {
      id: 0,
      label: mode === 'reverse' ? 'Initial array' : 'Initial values',
      kind: 'array',
      variables: {
        data: JSON.stringify(initialValues),
        mode,
      },
      activeIndices: [0],
      activePointers: ['head'],
      arrays: [{ values: initialValues, activeIndices: [0], compareIndices: [0] }],
      notes: [mode === 'reverse' ? 'Start at the head of the array.' : 'Scan the array from left to right.'],
    },
    {
      id: 1,
      label: mode === 'reverse' ? 'Compare outer elements' : 'Inspect current index',
      kind: 'array',
      variables: {
        data: JSON.stringify(initialValues),
        mode,
      },
      activeIndices: mode === 'reverse' ? [0, initialValues.length - 1] : [0, 1],
      activePointers: ['left', 'right'],
      arrays: [{
        values: initialValues,
        activeIndices: mode === 'reverse' ? [0, initialValues.length - 1] : [0, 1],
        compareIndices: mode === 'reverse' ? [0, initialValues.length - 1] : [0, 1],
      }],
      notes: [mode === 'reverse' ? 'Swap the outer pair.' : 'Compare the current value against the next item.'],
    },
    {
      id: 2,
      label: mode === 'reverse' ? 'Array reversed' : 'Final values',
      kind: 'array',
      variables: {
        data: JSON.stringify(finalValues),
        mode,
      },
      activeIndices: [],
      activePointers: ['done'],
      arrays: [{ values: finalValues, activeIndices: [], compareIndices: [] }],
      notes: [mode === 'reverse' ? 'Each swap moves the left and right pointers inward.' : 'The scan is complete.'],
    },
  ];

  return snapshots;
};

const buildStringSnapshots = (value: string): VisualizerSnapshot[] => {
  const chars = value.split('');
  const reversed = [...chars].reverse().join('');

  return [
    {
      id: 0,
      label: 'Initial string',
      kind: 'string',
      variables: {
        text: value,
        length: String(chars.length),
      },
      activeIndices: [0],
      activePointers: ['start'],
      strings: [{ value, activeIndices: [0], compareIndices: [0] }],
      notes: ['Inspect the first character.'],
    },
    {
      id: 1,
      label: 'Compare characters',
      kind: 'string',
      variables: {
        text: value,
        compare: `${chars[0]} vs ${chars[chars.length - 1]}`,
      },
      activeIndices: [0, chars.length - 1],
      activePointers: ['left', 'right'],
      strings: [{ value, activeIndices: [0, chars.length - 1], compareIndices: [0, chars.length - 1] }],
      notes: ['Move inward one character at a time.'],
    },
    {
      id: 2,
      label: 'Final string',
      kind: 'string',
      variables: {
        text: reversed,
        result: reversed,
      },
      activeIndices: [],
      activePointers: ['done'],
      strings: [{ value: reversed, activeIndices: [], compareIndices: [] }],
      notes: ['The string has been fully processed.'],
    },
  ];
};

const buildLinkedListSnapshots = (values: Array<string | number>): VisualizerSnapshot[] => {
  const nodes = values.map((value, index) => ({
    id: `node-${index + 1}`,
    value,
    next: index < values.length - 1 ? `node-${index + 2}` : null,
    active: index === 0,
    head: index === 0,
  }));

  return [
    {
      id: 0,
      label: 'Linked list head',
      kind: 'linked-list',
      variables: {
        head: nodes[0]?.id ?? 'null',
        length: String(nodes.length),
      },
      activeIndices: [0],
      activePointers: ['head'],
      linkedList: {
        nodes,
        headId: nodes[0]?.id ?? null,
        activeNodeIds: [nodes[0]?.id ?? ''],
      },
      notes: ['The head pointer marks the current entry.'],
    },
    {
      id: 1,
      label: 'Traverse next pointers',
      kind: 'linked-list',
      variables: {
        current: nodes[1]?.id ?? 'null',
        next: nodes[1]?.next ?? 'null',
      },
      activeIndices: [1],
      activePointers: ['next'],
      linkedList: {
        nodes: nodes.map((node, index) => ({ ...node, active: index === 1 })),
        headId: nodes[0]?.id ?? null,
        activeNodeIds: [nodes[1]?.id ?? ''],
      },
      notes: ['Follow the next pointer to the next node.'],
    },
    {
      id: 2,
      label: 'List complete',
      kind: 'linked-list',
      variables: {
        head: nodes[0]?.id ?? 'null',
        tail: nodes[nodes.length - 1]?.id ?? 'null',
      },
      activeIndices: [],
      activePointers: ['done'],
      linkedList: {
        nodes: nodes.map((node) => ({ ...node, active: false })),
        headId: nodes[0]?.id ?? null,
        activeNodeIds: [],
      },
      notes: ['All nodes have been traversed.'],
    },
  ];
};

const buildBinaryTreeSnapshots = (): VisualizerSnapshot[] => {
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
      label: 'Binary tree root',
      kind: 'binary-tree',
      variables: {
        root: '1',
        strategy: 'DFS',
      },
      activeIndices: [0],
      activePointers: ['root'],
      tree: {
        nodes,
        rootId: 'node-1',
        activeNodeIds: ['node-1'],
      },
      notes: ['Start at the root node.'],
    },
    {
      id: 1,
      label: 'Visit left subtree',
      kind: 'binary-tree',
      variables: {
        current: '2',
        visited: 'left branch',
      },
      activeIndices: [1],
      activePointers: ['left'],
      tree: {
        nodes: nodes.map((node) => ({ ...node, active: node.id === 'node-2', visited: node.id === 'node-2' })),
        rootId: 'node-1',
        activeNodeIds: ['node-2'],
      },
      notes: ['Descend into the left child.'],
    },
    {
      id: 2,
      label: 'Tree traversal complete',
      kind: 'binary-tree',
      variables: {
        visited: '5 nodes',
        result: 'complete',
      },
      activeIndices: [],
      activePointers: ['done'],
      tree: {
        nodes: nodes.map((node) => ({ ...node, active: false, visited: true })),
        rootId: 'node-1',
        activeNodeIds: [],
      },
      notes: ['Every node has been visited.'],
    },
  ];
};

const buildGraphSnapshots = (): VisualizerSnapshot[] => {
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
      label: 'Graph start',
      kind: 'graph',
      variables: {
        start: 'A',
        frontier: 'A',
      },
      activeIndices: [0],
      activePointers: ['start'],
      graph: {
        nodes,
        edges,
        activeNodeIds: ['A'],
      },
      notes: ['Begin from the starting node.'],
    },
    {
      id: 1,
      label: 'Expand neighbors',
      kind: 'graph',
      variables: {
        current: 'A',
        visited: 'B, C',
      },
      activeIndices: [1, 2],
      activePointers: ['queue'],
      graph: {
        nodes: nodes.map((node) => ({ ...node, active: ['B', 'C'].includes(node.id), visited: ['B', 'C'].includes(node.id) })),
        edges: edges.map((edge) => ({ ...edge, active: edge.from === 'A' })),
        activeNodeIds: ['B', 'C'],
      },
      notes: ['Visit each neighboring node and record it.'],
    },
    {
      id: 2,
      label: 'Graph complete',
      kind: 'graph',
      variables: {
        visited: 'A, B, C, D',
        complete: 'true',
      },
      activeIndices: [],
      activePointers: ['done'],
      graph: {
        nodes: nodes.map((node) => ({ ...node, active: false, visited: true })),
        edges: edges.map((edge) => ({ ...edge, active: false })),
        activeNodeIds: [],
      },
      notes: ['Every node has been processed.'],
    },
  ];
};

export const parseVisualizerState = (code: string): VisualizerParseResult => {
  const normalized = code.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return {
      snapshots: [],
      unsupportedReason: 'Visualizer supports selected algorithm and data structure patterns. Try an array, string, linked list, tree, or graph example.',
    };
  }

  const lower = normalized.toLowerCase();

  if (/(graph|adjacency|bfs|dfs|dijkstra|topological|queue)/i.test(lower)) {
    return { snapshots: buildGraphSnapshots() };
  }

  if (/(binary tree|tree|left|right|root\s*[:=]|TreeNode)/i.test(lower)) {
    return { snapshots: buildBinaryTreeSnapshots() };
  }

  if (/(linked list|ListNode|head\.|next\s*[:=]|next\)|\.next)/i.test(lower)) {
    const arr = parseArraySource(code) ?? [1, 2, 3, 4];
    return { snapshots: buildLinkedListSnapshots(arr) };
  }

  const stringSource = parseStringSource(code);
  if (stringSource && /(string|reverse|string\s*[:=]|palindrome|anagram)/i.test(lower)) {
    return { snapshots: buildStringSnapshots(stringSource) };
  }

  const arraySource = parseArraySource(code);
  if (arraySource) {
    const mode = /(reverse|swap|rotate)/i.test(lower) ? 'reverse' : 'scan';
    return { snapshots: buildArraySnapshots(arraySource, mode) };
  }

  if (/(array|list|index|sort|compare|swap)/i.test(lower)) {
    const fallbackValues = [4, 2, 6, 1, 3];
    return { snapshots: buildArraySnapshots(fallbackValues, /(reverse|swap)/i.test(lower) ? 'reverse' : 'scan') };
  }

  return {
    snapshots: [],
    unsupportedReason: 'Visualizer supports selected algorithm and data structure patterns. Try an array, string, linked list, tree, or graph example.',
  };
};
