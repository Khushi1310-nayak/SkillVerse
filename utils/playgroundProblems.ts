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
      id: 'js-1',
      title: '1. Array Filter & Transformation',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement `filterAndDouble(arr)` that filters out numbers <= 0 and returns a new array with all positive numbers doubled.',
      constraints: ['arr length 1-100', 'Integers -1000 to 1000'],
      sampleInputs: [{ input: '[1, -2, 3, 0, 4]', output: '[2, 6, 8]' }],
      starterCode: `function filterAndDouble(arr) {\n  // TODO: Filter numbers > 0 and double them\n  \n}\n\nconsole.log(filterAndDouble([1, -2, 3, 0, 4]));`,
      solutionHint: 'Use arr.filter(x => x > 0).map(x => x * 2)'
    },
    {
      id: 'js-2',
      title: '2. Object Deep Property Lookup',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Implement `getNestedValue(obj, path)` that extracts a value from a nested object using a dot path (e.g. "user.profile.name").',
      constraints: ['path is dot-separated string'],
      sampleInputs: [{ input: 'obj = { user: { name: "Alice" } }, "user.name"', output: '"Alice"' }],
      starterCode: `function getNestedValue(obj, path) {\n  // TODO: Split path and reduce object\n  \n}\n\nconsole.log(getNestedValue({ user: { name: "Alice" } }, "user.name"));`,
      solutionHint: 'Split path by "." and use Array.prototype.reduce()'
    },
    {
      id: 'js-3',
      title: '3. Debounce Function Implementation',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Create a custom `debounce(fn, delay)` wrapper function that delays execution until typing stops.',
      constraints: ['delay > 0 ms'],
      sampleInputs: [{ input: 'debounce(logFunc, 200)', output: 'Executes once after 200ms delay' }],
      starterCode: `function debounce(fn, delay) {\n  let timer = null;\n  return function(...args) {\n    // TODO: Reset timer\n    \n  };\n}\n\nconst fn = debounce(msg => console.log(msg), 100);\nfn("Search...");`,
      solutionHint: 'Clear timer with clearTimeout and reassign timer = setTimeout(...)'
    },
    {
      id: 'js-4',
      title: '4. Custom Promise.all Polyfill',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement `myPromiseAll(promises)` which resolves with array of results when all promises resolve.',
      constraints: ['Return a new Promise', 'Maintain array ordering'],
      sampleInputs: [{ input: '[Promise.resolve(10), Promise.resolve(20)]', output: '[10, 20]' }],
      starterCode: `function myPromiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = [];\n    let count = 0;\n    // TODO: Iterate promises and collect results\n    \n  });\n}\n\nmyPromiseAll([Promise.resolve(10), Promise.resolve(20)]).then(console.log);`,
      solutionHint: 'Track completed count and set results[i] = val'
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
