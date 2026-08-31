export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  sampleInputs: { input: string; output: string }[];
  starterCode: string;
  solutionHint: string;
}

export const PLAYGROUND_PROBLEMS: Record<string, PracticeProblem[]> = {
  // --- PROGRAMMING LANGUAGES ---
  'javascript': [
    {
      id: 'js-mod-1',
      title: 'Module 1: Array Filter & Value Doubling Pipeline',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement filterAndDouble(arr) that filters out all numbers <= 0 and returns a new array with the remaining positive numbers doubled in value.',
      constraints: ['Array length: 0 to 1,000', 'Integers between -1,000 and 1,000', 'Do not mutate the original input array', 'Time Complexity: O(n)'],
      sampleInputs: [
        { input: '[1, -2, 3, 0, 4, -5]', output: '[2, 6, 8]' },
        { input: '[-1, -2, -3]', output: '[]' }
      ],
      starterCode: `function filterAndDouble(arr) {\n  // TODO: Filter numbers > 0 and double them\n  \n}\n\nconsole.log(filterAndDouble([1, -2, 3, 0, 4, -5]));`,
      solutionHint: 'Use arr.filter(num => num > 0).map(num => num * 2)'
    },
    {
      id: 'js-mod-2',
      title: 'Module 2: Word Frequency Hash Map',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement countWordFrequencies(sentence) that tokenizes a lowercase string sentence and returns an object mapping each unique word to its total occurrence frequency count.',
      constraints: ['Case-insensitive parsing', 'O(n) linear scan time', 'Return standard key-value object map'],
      sampleInputs: [
        { input: '"the quick brown fox jumps over the lazy dog"', output: '{"the": 2, "quick": 1, "brown": 1, "fox": 1, "jumps": 1, "over": 1, "lazy": 1, "dog": 1}' }
      ],
      starterCode: `function countWordFrequencies(sentence) {\n  const counts = {};\n  // TODO: Tokenize sentence and count word occurrences\n  \n  return counts;\n}\n\nconsole.log(countWordFrequencies("the quick brown fox jumps over the lazy dog"));`,
      solutionHint: 'Split words with sentence.toLowerCase().split(/\\s+/) and iterate with counts[word] = (counts[word] || 0) + 1'
    },
    {
      id: 'js-mod-3',
      title: 'Module 3: Deep Object Path Resolver (Lodash get)',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Implement getNestedValue(obj, path, defaultValue) that safely traverses a nested object using a dot-delimited path (e.g., "user.profile.address.city") and returns defaultValue if any level is null or undefined without throwing TypeError.',
      constraints: ['Supports dot-separated path strings', 'Returns defaultValue if property does not exist', 'Never throw unhandled TypeError'],
      sampleInputs: [
        { input: 'obj = { profile: { address: { city: "San Francisco" } } }, "profile.address.city"', output: '"San Francisco"' },
        { input: 'obj = { profile: {} }, "profile.contact.phone", "No Phone"', output: '"No Phone"' }
      ],
      starterCode: `function getNestedValue(obj, path, defaultValue = undefined) {\n  // TODO: Split path and safely reduce nested properties\n  \n}\n\nconst user = { profile: { address: { city: "San Francisco" } } };\nconsole.log(getNestedValue(user, "profile.address.city", "Unknown"));\nconsole.log(getNestedValue(user, "profile.contact.phone", "No Phone"));`,
      solutionHint: 'Use path.split(".").reduce((acc, key) => (acc != null && acc[key] !== undefined ? acc[key] : undefined), obj) ?? defaultValue'
    },
    {
      id: 'js-mod-4',
      title: 'Module 4: Custom EventEmitter Pub/Sub Engine',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Create an EventEmitter class with subscribe(event, callback) and emit(event, ...args) methods. The subscribe method must return an object containing an unsubscribe() function that removes only that specific listener.',
      constraints: ['Support multiple subscribers per event', 'unsubscribe removes only its specific callback', 'emit passes all arguments to listeners'],
      sampleInputs: [
        { input: 'emitter.subscribe("login", u => ...); emitter.emit("login", "Alex")', output: '"Welcome, Alex!"' }
      ],
      starterCode: `class EventEmitter {\n  constructor() {\n    this.events = new Map();\n  }\n\n  subscribe(event, callback) {\n    // TODO: Register callback and return { unsubscribe } object\n    \n  }\n\n  emit(event, ...args) {\n    // TODO: Invoke all subscribed callbacks with args\n    \n  }\n}\n\nconst emitter = new EventEmitter();\nconst sub = emitter.subscribe("login", (user) => console.log(\`Welcome, \${user}!\`));\nemitter.emit("login", "Alex");\nsub.unsubscribe();\nemitter.emit("login", "Alex"); // (No output)`,
      solutionHint: 'Store listeners in a Map of arrays: const handlers = this.events.get(event) || []; return { unsubscribe: () => this.events.set(event, handlers.filter(cb => cb !== callback)) }'
    },
    {
      id: 'js-mod-5',
      title: 'Module 5: Debounce Function with Leading/Trailing Execution',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Implement a debounce(fn, delay, immediate) higher-order function that limits rate of execution. If immediate is true, trigger on leading edge instead of trailing edge.',
      constraints: ['Preserve function arguments and this context', 'Clear previous timer with clearTimeout', 'Return fresh debounced wrapper function'],
      sampleInputs: [
        { input: 'debounce(searchHandler, 200)', output: 'Executes once after 200ms of inactivity' }
      ],
      starterCode: `function debounce(fn, delay, immediate = false) {\n  let timer = null;\n  return function(...args) {\n    const context = this;\n    // TODO: Implement debounce timer logic with immediate option\n    \n  };\n}\n\nconst logMsg = debounce((text) => console.log("Debounced:", text), 150);\nlogMsg("Query 1");\nlogMsg("Query 2");\nlogMsg("Query 3 (Final)");`,
      solutionHint: 'const callNow = immediate && !timer; clearTimeout(timer); timer = setTimeout(() => { timer = null; if (!immediate) fn.apply(context, args); }, delay); if (callNow) fn.apply(context, args);'
    },
    {
      id: 'js-mod-6',
      title: 'Module 6: Custom Promise.all Polyfill Algorithm',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement myPromiseAll(iterable) that takes an array or iterable of promises/values and returns a single Promise that resolves with an array of results in the exact same index order once all promises resolve, or rejects immediately on the first rejection.',
      constraints: ['Handle non-promise values with Promise.resolve()', 'Maintain exact input index ordering regardless of completion order', 'Reject immediately upon first error', 'Return empty array for empty iterable'],
      sampleInputs: [
        { input: '[Promise.resolve("A"), new Promise(r => setTimeout(() => r("B"), 50)), "C"]', output: '["A", "B", "C"]' }
      ],
      starterCode: `function myPromiseAll(iterable) {\n  return new Promise((resolve, reject) => {\n    const promises = Array.from(iterable);\n    if (promises.length === 0) return resolve([]);\n    const results = new Array(promises.length);\n    let completed = 0;\n\n    // TODO: Iterate promises, resolve each, and fulfill when completed === promises.length\n    \n  });\n}\n\nmyPromiseAll([\n  Promise.resolve("Module 1"),\n  new Promise(res => setTimeout(() => res("Module 2"), 100)),\n  "Module 3 (instant)"\n]).then(res => console.log("Resolved:", res)).catch(console.error);`,
      solutionHint: 'promises.forEach((p, i) => Promise.resolve(p).then(val => { results[i] = val; completed++; if (completed === promises.length) resolve(results); }).catch(reject))'
    },
    {
      id: 'js-mod-7',
      title: 'Module 7: Deep Object Clone with Circular Reference Handling',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement deepClone(obj) that creates a complete recursive deep copy of an object supporting nested objects, arrays, Dates, and circular self-referencing pointers without causing infinite recursion or stack overflow.',
      constraints: ['Do not use JSON.parse(JSON.stringify())', 'Handle circular references safely using WeakMap', 'Preserve Array and Date instance types'],
      sampleInputs: [
        { input: 'const a = { val: 1 }; a.self = a;', output: 'Cloned object where clone.self === clone && clone !== a' }
      ],
      starterCode: `function deepClone(target, hash = new WeakMap()) {\n  // TODO: Handle primitives, Date, Arrays, Objects, and Circular references\n  if (target === null || typeof target !== "object") return target;\n  \n}\n\nconst original = { name: "SkillVerse", tags: ["js", "dev"], date: new Date() };\noriginal.circular = original;\nconst copy = deepClone(original);\nconsole.log("Cloned tags:", copy.tags);\nconsole.log("Is circular reference preserved cleanly?", copy.circular === copy && copy !== original);`,
      solutionHint: 'if (hash.has(target)) return hash.get(target); if (target instanceof Date) return new Date(target); const clone = Array.isArray(target) ? [] : {}; hash.set(target, clone); for (const key of Object.keys(target)) clone[key] = deepClone(target[key], hash); return clone;'
    },
    {
      id: 'js-mod-8',
      title: 'Module 8: Async Task Queue with Concurrency Limit',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement asyncPool(limit, tasks) that accepts an array of asynchronous task factories (functions returning promises) and executes them concurrently with at most limit active tasks running at any given time, returning all results in input order.',
      constraints: ['Never exceed limit active concurrent promises', 'Maintain output result array ordering matching tasks input', 'Time efficiency O(n)'],
      sampleInputs: [
        { input: 'asyncPool(2, [job1, job2, job3, job4])', output: '["Result-1", "Result-2", "Result-3", "Result-4"]' }
      ],
      starterCode: `async function asyncPool(limit, tasks) {\n  const results = [];\n  const executing = new Set();\n  // TODO: Process tasks with maximum "limit" active promises concurrently\n  \n  return results;\n}\n\nconst createJob = (id, ms) => () =>\n  new Promise(res => setTimeout(() => {\n    console.log(\`Done Job \${id} (\${ms}ms)\`);\n    res(\`Result-\${id}\`);\n  }, ms));\n\nconst jobs = [\n  createJob(1, 200),\n  createJob(2, 50),\n  createJob(3, 150),\n  createJob(4, 100)\n];\n\nasyncPool(2, jobs).then(res => console.log("All Completed:", res));`,
      solutionHint: 'for (const task of tasks) { const p = Promise.resolve().then(() => task()).then(r => { executing.delete(p); return r; }); results.push(p); executing.add(p); if (executing.size >= limit) await Promise.race(executing); } return Promise.all(results);'
    }
  ],

  'python': [
    {
      id: 'py-1',
      title: '1. Dictionary Key Value Inversion',
      difficulty: 'Easy',
      category: 'Python',
      description: 'Implement `invert_dict(d)` that swaps keys and values in a dictionary.',
      constraints: ['Keys and values are unique strings/numbers'],
      sampleInputs: [{ input: '{"a": 1, "b": 2}', output: '{1: "a", 2: "b"}' }],
      starterCode: `function invertDict(d) {\n  // TODO: Swap dictionary keys and values\n  const res = {};\n  \n  return res;\n}\n\nconsole.log(invertDict({ a: 1, b: 2 }));`,
      solutionHint: 'Iterate Object.entries(d) and assign res[val] = key'
    },
    {
      id: 'py-2',
      title: '2. List Anagram Grouping',
      difficulty: 'Medium',
      category: 'Python',
      description: 'Group an array of strings into anagram clusters.',
      constraints: ['Strings contain lowercase English letters'],
      sampleInputs: [{ input: '["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }],
      starterCode: `function groupAnagrams(words) {\n  const map = new Map();\n  // TODO: Sort word characters as hash key\n  \n  return Array.from(map.values());\n}\n\nconsole.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));`,
      solutionHint: 'Sort characters of word: word.split("").sort().join("")'
    }
  ],

  'python-programming': [
    {
      id: 'py-1',
      title: '1. Dictionary Key Value Inversion',
      difficulty: 'Easy',
      category: 'Python',
      description: 'Implement `invert_dict(d)` that swaps keys and values in a dictionary.',
      constraints: ['Keys and values are unique strings/numbers'],
      sampleInputs: [{ input: '{"a": 1, "b": 2}', output: '{1: "a", 2: "b"}' }],
      starterCode: `function invertDict(d) {\n  // TODO: Swap dictionary keys and values\n  const res = {};\n  \n  return res;\n}\n\nconsole.log(invertDict({ a: 1, b: 2 }));`,
      solutionHint: 'Iterate Object.entries(d) and assign res[val] = key'
    }
  ],

  'java': [
    {
      id: 'java-1',
      title: '1. Custom String Reverser without Built-ins',
      difficulty: 'Easy',
      category: 'Java',
      description: 'Write `reverseString(str)` without using reverse functions.',
      constraints: ['String length 1-1000'],
      sampleInputs: [{ input: '"hello"', output: '"olleh"' }],
      starterCode: `function reverseString(str) {\n  let res = "";\n  // TODO: Iterate string from end to start\n  \n  return res;\n}\n\nconsole.log(reverseString("hello"));`,
      solutionHint: 'Loop i = str.length - 1 down to 0 and append str[i]'
    }
  ],

  'java-programming': [
    {
      id: 'java-1',
      title: '1. Custom String Reverser without Built-ins',
      difficulty: 'Easy',
      category: 'Java',
      description: 'Write `reverseString(str)` without using reverse functions.',
      constraints: ['String length 1-1000'],
      sampleInputs: [{ input: '"hello"', output: '"olleh"' }],
      starterCode: `function reverseString(str) {\n  let res = "";\n  // TODO: Iterate string from end to start\n  \n  return res;\n}\n\nconsole.log(reverseString("hello"));`,
      solutionHint: 'Loop i = str.length - 1 down to 0 and append str[i]'
    }
  ],

  'cpp': [
    {
      id: 'cpp-1',
      title: '1. Pointer Memory Allocation Counter',
      difficulty: 'Medium',
      category: 'C++',
      description: 'Implement `allocateBlocks(size, blockSize)` calculating total blocks needed.',
      constraints: ['size > 0, blockSize > 0'],
      sampleInputs: [{ input: 'size = 10, blockSize = 3', output: '4' }],
      starterCode: `function allocateBlocks(size, blockSize) {\n  // TODO: Calculate ceil(size / blockSize)\n  \n}\n\nconsole.log(allocateBlocks(10, 3));`,
      solutionHint: 'Use Math.ceil(size / blockSize)'
    }
  ],

  'c++': [
    {
      id: 'cpp-1',
      title: '1. Pointer Memory Allocation Counter',
      difficulty: 'Medium',
      category: 'C++',
      description: 'Implement `allocateBlocks(size, blockSize)` calculating total blocks needed.',
      constraints: ['size > 0, blockSize > 0'],
      sampleInputs: [{ input: 'size = 10, blockSize = 3', output: '4' }],
      starterCode: `function allocateBlocks(size, blockSize) {\n  // TODO: Calculate ceil(size / blockSize)\n  \n}\n\nconsole.log(allocateBlocks(10, 3));`,
      solutionHint: 'Use Math.ceil(size / blockSize)'
    }
  ],

  // --- DATA STRUCTURES & ALGORITHMS ---
  'arrays': [
    {
      id: 'arr-1',
      title: '1. Two Sum Target Index',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers `nums` and a `target`, return indices of two numbers that add up to target.',
      constraints: ['Time complexity O(n)'],
      sampleInputs: [{ input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }],
      starterCode: `function twoSum(nums, target) {\n  const map = new Map();\n  // TODO: Find complement target - nums[i]\n  \n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
      solutionHint: 'const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]'
    },
    {
      id: 'arr-2',
      title: '2. Maximum Subarray Sum (Kadane)',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Find contiguous subarray with largest sum and return sum.',
      constraints: ['O(n) time complexity'],
      sampleInputs: [{ input: '[-2, 1, -3, 4, -1, 2, 1]', output: '6' }],
      starterCode: `function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currSum = nums[0];\n  // TODO: Kadane algorithm loop\n  \n  return maxSum;\n}\n\nconsole.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1]));`,
      solutionHint: 'currSum = Math.max(nums[i], currSum + nums[i]); maxSum = Math.max(maxSum, currSum)'
    }
  ],

  'linked-lists': [
    {
      id: 'll-1',
      title: '1. Reverse Singly Linked List',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: 'Reverse a singly linked list represented as an array of values.',
      constraints: ['Input array length 0-100'],
      sampleInputs: [{ input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }],
      starterCode: `function reverseLinkedList(headArr) {\n  // TODO: Reverse linked list values\n  \n}\n\nconsole.log(reverseLinkedList([1, 2, 3, 4, 5]));`,
      solutionHint: 'Use headArr.reverse() or two pointers'
    }
  ],

  'trees': [
    {
      id: 'tree-1',
      title: '1. Binary Tree Maximum Depth',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Calculate maximum depth of a binary tree represented by node object `{ val, left, right }`.',
      constraints: ['Tree node count 0-1000'],
      sampleInputs: [{ input: 'root = { val: 3, left: { val: 9 }, right: { val: 20 } }', output: '2' }],
      starterCode: `function maxDepth(root) {\n  if (!root) return 0;\n  // TODO: Recursively calculate 1 + Math.max(leftDepth, rightDepth)\n  \n}\n\nconst tree = { val: 3, left: { val: 9 }, right: { val: 20 } };\nconsole.log(maxDepth(tree));`,
      solutionHint: 'return 1 + Math.max(maxDepth(root.left), maxDepth(root.right))'
    }
  ],

  'dynamic-programming': [
    {
      id: 'dp-1',
      title: '1. Fibonacci Nth Term Memoization',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      description: 'Calculate Nth Fibonacci number in O(n) time using memoization or DP table.',
      constraints: ['N between 0 and 50'],
      sampleInputs: [{ input: '10', output: '55' }],
      starterCode: `function fib(n) {\n  const dp = [0, 1];\n  // TODO: Fill DP array up to n\n  \n  return dp[n];\n}\n\nconsole.log(fib(10));`,
      solutionHint: 'for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2]'
    }
  ],

  // --- DESIGN ---
  'ui-design': [
    {
      id: 'ui-1',
      title: '1. WCAG Color Contrast Ratio Calculator',
      difficulty: 'Easy',
      category: 'UI Design',
      description: 'Calculate WCAG contrast ratio (L1 + 0.05) / (L2 + 0.05) and check if >= 4.5:1 AA standard.',
      constraints: ['l1, l2 between 0 and 1'],
      sampleInputs: [{ input: 'l1 = 1.0, l2 = 0.0', output: '{ ratio: "21.00", meetsAA: true }' }],
      starterCode: `function calculateContrastRatio(l1, l2) {\n  const lighter = Math.max(l1, l2);\n  const darker = Math.min(l1, l2);\n  // TODO: Calculate ratio\n  \n}\n\nconsole.log(calculateContrastRatio(1.0, 0.0));`,
      solutionHint: 'ratio = (lighter + 0.05) / (darker + 0.05); return { ratio: ratio.toFixed(2), meetsAA: ratio >= 4.5 }'
    }
  ]
};

// Universal Fallback Generator for all 30 Course Topics x 8 Module Problem Slots
export function getGenericPlaygroundProblem(courseId: string, moduleIndex: number, dayHash: number): PracticeProblem {
  const topicTitle = courseId.replace(/-/g, ' ').toUpperCase();
  const modNum = moduleIndex + 1;

  const templates = [
    {
      title: `${modNum}. ${topicTitle} Core Data Processor`,
      difficulty: 'Easy' as const,
      description: `Implement a foundational ${topicTitle} processing algorithm for Module ${modNum}. Filter invalid values and format final output array correctly.`,
      constraints: ['Time Complexity: O(n)', 'Handle null & empty inputs'],
      sampleInputs: [{ input: 'data = [10, 20, 30]', output: '[20, 40, 60]' }],
      starterCode: `function process${modNum}(data) {\n  // TODO: Implement ${topicTitle} Module ${modNum} processing logic\n  return data.map(x => x * 2);\n}\n\nconsole.log(process${modNum}([10, 20, 30]));`,
      solutionHint: 'Use data.filter(Boolean).map(x => x * 2)'
    },
    {
      title: `${modNum}. ${topicTitle} Frequency Lookup Map`,
      difficulty: 'Medium' as const,
      description: `Build an efficient hash frequency map for ${topicTitle} elements in Module ${modNum}.`,
      constraints: ['Space Complexity: O(n)', 'O(1) lookup speed'],
      sampleInputs: [{ input: 'items = ["a", "b", "a"]', output: '{"a": 2, "b": 1}' }],
      starterCode: `function countFrequency(items) {\n  const map = {};\n  // TODO: Count occurrences of each item in map\n  \n  return map;\n}\n\nconsole.log(countFrequency(["a", "b", "a"]));`,
      solutionHint: 'Loop items: map[item] = (map[item] || 0) + 1'
    },
    {
      title: `${modNum}. ${topicTitle} Optimization & Boundary Validation`,
      difficulty: 'Hard' as const,
      description: `Optimize ${topicTitle} execution for large datasets while validating boundary constraints.`,
      constraints: ['Optimized linear pass', 'Handle negative integers'],
      sampleInputs: [{ input: 'nums = [5, 1, 9, 3]', output: '9' }],
      starterCode: `function findMaxOptimal(nums) {\n  let max = nums[0];\n  // TODO: Single pass max search\n  \n  return max;\n}\n\nconsole.log(findMaxOptimal([5, 1, 9, 3]));`,
      solutionHint: 'Iterate nums: if (nums[i] > max) max = nums[i]'
    }
  ];

  const selected = templates[(dayHash + moduleIndex) % templates.length];
  return {
    id: `${courseId}-${modNum}`,
    title: selected.title,
    difficulty: selected.difficulty,
    category: topicTitle,
    description: selected.description,
    constraints: selected.constraints,
    sampleInputs: selected.sampleInputs,
    starterCode: selected.starterCode,
    solutionHint: selected.solutionHint
  };
}
