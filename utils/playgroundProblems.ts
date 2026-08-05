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
  'javascript': [
    {
      id: 'js-1',
      title: '1. Array Filter & Transformation',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement a function `filterAndDouble(arr)` that takes an array of numbers, filters out numbers less than or equal to 0, and returns a new array with all positive numbers doubled.',
      constraints: ['arr length between 1 and 100', 'Elements are integers between -1000 and 1000'],
      sampleInputs: [
        { input: '[1, -2, 3, 0, 4]', output: '[2, 6, 8]' },
        { input: '[-5, -1]', output: '[]' }
      ],
      starterCode: `function filterAndDouble(arr) {
  // TODO: Filter numbers > 0 and double them
  
}

// Test call:
console.log(filterAndDouble([1, -2, 3, 0, 4]));`,
      solutionHint: 'Use arr.filter(x => x > 0).map(x => x * 2)'
    },
    {
      id: 'js-2',
      title: '2. Object Deep Property Lookup',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Implement `getNestedValue(obj, path)` that extracts a value from a deeply nested object given a dot-separated string path (e.g. "user.profile.name"). Return undefined if path does not exist.',
      constraints: ['path is a string like "a.b.c"', 'obj is a valid JS object'],
      sampleInputs: [
        { input: 'obj = { user: { profile: { name: "Alice" } } }, "user.profile.name"', output: '"Alice"' },
        { input: 'obj = { a: 1 }, "a.b.c"', output: 'undefined' }
      ],
      starterCode: `function getNestedValue(obj, path) {
  // TODO: Split path and reduce object
  
}

const data = { user: { profile: { name: "Alice" } } };
console.log(getNestedValue(data, "user.profile.name"));`,
      solutionHint: 'Split path by "." and use Array.prototype.reduce()'
    },
    {
      id: 'js-3',
      title: '3. Debounce Function Implementation',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Create a custom `debounce(fn, delay)` wrapper function that ensures `fn` is called only after `delay` milliseconds have elapsed since the last invocation.',
      constraints: ['delay > 0', 'fn receives original arguments'],
      sampleInputs: [
        { input: 'debounce(logFunc, 300)', output: 'Executes once after typing stops' }
      ],
      starterCode: `function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    // TODO: Clear existing timer and schedule fn call
    
  };
}

const debouncedLog = debounce((msg) => console.log("Fired:", msg), 200);
debouncedLog("Search 1");
debouncedLog("Search 2");`,
      solutionHint: 'Clear timer with clearTimeout(timer) and reassign timer = setTimeout(...)'
    },
    {
      id: 'js-4',
      title: '4. Custom Promise.all Polyfill',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement `myPromiseAll(promises)` which takes an array of promises and resolves with an array of their results once all resolve, or rejects immediately when any promise fails.',
      constraints: ['Return a new Promise', 'Maintain correct array ordering of resolved values'],
      sampleInputs: [
        { input: '[Promise.resolve(1), Promise.resolve(2)]', output: '[1, 2]' }
      ],
      starterCode: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    // TODO: Iterate promises, resolve each, and call resolve(results) when completed === promises.length
    
  });
}

myPromiseAll([Promise.resolve(10), Promise.resolve(20)]).then(console.log);`,
      solutionHint: 'Track completed counter and set results[index] = val'
    },
    {
      id: 'js-5',
      title: '5. Event Emitter Pattern',
      difficulty: 'Medium',
      category: 'JavaScript',
      description: 'Implement an `EventEmitter` class with `on(event, listener)` and `emit(event, ...args)` methods.',
      constraints: ['Support multiple listeners per event key'],
      sampleInputs: [
        { input: 'emitter.on("click", fn); emitter.emit("click", "data")', output: 'fn("data") invoked' }
      ],
      starterCode: `class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    // TODO: Register listener
    
  }

  emit(event, ...args) {
    // TODO: Trigger all registered listeners with args
    
  }
}

const em = new EventEmitter();
em.on("login", user => console.log("User logged in:", user));
em.emit("login", "Khushi");`,
      solutionHint: 'Store listeners in this.events[event] = this.events[event] || []'
    },
    {
      id: 'js-6',
      title: '6. Flatten Nested Array',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement `flattenArray(arr)` that recursively flattens an arbitrarily nested array into a single 1D array.',
      constraints: ['Do not use built-in Array.prototype.flat()'],
      sampleInputs: [
        { input: '[1, [2, [3, 4], 5]]', output: '[1, 2, 3, 4, 5]' }
      ],
      starterCode: `function flattenArray(arr) {
  // TODO: Recursively flatten array without using .flat()
  
}

console.log(flattenArray([1, [2, [3, 4], 5]]));`,
      solutionHint: 'Use reduce or loop with Array.isArray(item) ? flattenArray(item) : item'
    },
    {
      id: 'js-7',
      title: '7. LRU Cache Storage',
      difficulty: 'Hard',
      category: 'JavaScript',
      description: 'Implement a `SimpleLRU` class with `get(key)` and `put(key, value)` with fixed capacity `N`.',
      constraints: ['Evict least recently used key when size exceeds capacity'],
      sampleInputs: [
        { input: 'lru = new SimpleLRU(2); lru.put(1,1); lru.put(2,2); lru.get(1); lru.put(3,3)', output: 'Key 2 evicted' }
      ],
      starterCode: `class SimpleLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    // TODO: Get value and refresh recency key position
    
  }

  put(key, value) {
    // TODO: Insert key and evict oldest if size > capacity
    
  }
}

const lru = new SimpleLRU(2);
lru.put('a', 100);
lru.put('b', 200);
console.log(lru.get('a'));`,
      solutionHint: 'JS Map maintains insertion order. Delete and re-set key to move to end.'
    },
    {
      id: 'js-8',
      title: '8. Memoize Expensive Function',
      difficulty: 'Easy',
      category: 'JavaScript',
      description: 'Implement `memoize(fn)` that caches results of function calls based on JSON stringified arguments.',
      constraints: ['Return cached value if arguments match previous call'],
      sampleInputs: [
        { input: 'memoizedAdd(2, 3); memoizedAdd(2, 3)', output: 'Second call returns cached 5 immediately' }
      ],
      starterCode: `function memoize(fn) {
  const cache = {};
  return function(...args) {
    // TODO: Check cache before invoking fn
    
  };
}

const fastAdd = memoize((a, b) => {
  console.log("Computing...");
  return a + b;
});

console.log(fastAdd(3, 4));
console.log(fastAdd(3, 4));`,
      solutionHint: 'const key = JSON.stringify(args); if (key in cache) return cache[key]'
    }
  ],

  'arrays': [
    {
      id: 'arr-1',
      title: '1. Two Sum Target Index',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers `nums` and a `target`, return indices of the two numbers such that they add up to target in O(n) time.',
      constraints: ['Exactly one valid solution exists', 'Time complexity must be O(n)'],
      sampleInputs: [
        { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }
      ],
      starterCode: `function twoSum(nums, target) {
  const map = new Map();
  // TODO: Iterate nums and find complement target - num
  
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      solutionHint: 'const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]'
    },
    {
      id: 'arr-2',
      title: '2. Maximum Subarray Sum (Kadane)',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Find the contiguous subarray with the largest sum and return its sum in O(n) time.',
      constraints: ['Array contains negative and positive numbers'],
      sampleInputs: [
        { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6 (Subarray [4, -1, 2, 1])' }
      ],
      starterCode: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  // TODO: Implement Kadane\'s algorithm loop
  
  return maxSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
      solutionHint: 'currentSum = Math.max(nums[i], currentSum + nums[i]); maxSum = Math.max(maxSum, currentSum)'
    },
    {
      id: 'arr-3',
      title: '3. Rotate Matrix 90 Degrees',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Given an n x n 2D matrix, rotate the matrix by 90 degrees clockwise in-place.',
      constraints: ['Rotate matrix in-place without allocating another 2D matrix'],
      sampleInputs: [
        { input: '[[1,2],[3,4]]', output: '[[3,1],[4,2]]' }
      ],
      starterCode: `function rotateMatrix(matrix) {
  const n = matrix.length;
  // TODO: Step 1: Transpose matrix (swap i,j with j,i)
  // TODO: Step 2: Reverse each row
  
  return matrix;
}

console.log(rotateMatrix([[1, 2], [3, 4]]));`,
      solutionHint: 'Transpose with matrix[i][j] = matrix[j][i], then matrix[i].reverse()'
    },
    {
      id: 'arr-4',
      title: '4. Product of Array Except Self',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Return an array `output` such that `output[i]` is equal to the product of all elements of `nums` except `nums[i]` in O(n) without division.',
      constraints: ['Do not use division operator', 'Time complexity O(n)'],
      sampleInputs: [
        { input: '[1, 2, 3, 4]', output: '[24, 12, 8, 6]' }
      ],
      starterCode: `function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  // TODO: Calculate prefix products and suffix products
  
  return res;
}

console.log(productExceptSelf([1, 2, 3, 4]));`,
      solutionHint: 'Pass 1: prefix products left-to-right. Pass 2: suffix products right-to-left.'
    },
    {
      id: 'arr-5',
      title: '5. Merge Interval Ranges',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Given an array of intervals where `intervals[i] = [start, end]`, merge all overlapping intervals.',
      constraints: ['Intervals may not be pre-sorted'],
      sampleInputs: [
        { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
      ],
      starterCode: `function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  // TODO: Sort intervals by start time
  // TODO: Merge overlapping intervals
  
}

console.log(mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));`,
      solutionHint: 'Sort intervals by i[0]. If lastMerged[1] >= curr[0], lastMerged[1] = Math.max(lastMerged[1], curr[1])'
    },
    {
      id: 'arr-6',
      title: '6. Move Zeroes to End',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Move all 0s in an array to the end while maintaining the relative order of non-zero elements in-place.',
      constraints: ['Must modify array in-place'],
      sampleInputs: [
        { input: '[0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' }
      ],
      starterCode: `function moveZeroes(nums) {
  let insertPos = 0;
  // TODO: Copy non-zero elements forward and fill remaining with 0
  
  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));`,
      solutionHint: 'Loop nums: if (nums[i] !== 0) nums[insertPos++] = nums[i]. Then fill insertPos..end with 0.'
    },
    {
      id: 'arr-7',
      title: '7. Container With Most Water',
      difficulty: 'Hard',
      category: 'Arrays',
      description: 'Given `n` non-negative integers representing vertical lines, find two lines that together with the x-axis form a container holding maximum water.',
      constraints: ['Time complexity O(n)', 'Two-pointer approach'],
      sampleInputs: [
        { input: '[1,8,6,2,5,4,8,3,7]', output: '49' }
      ],
      starterCode: `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxW = 0;
  // TODO: Two-pointer shrink based on smaller line height
  
  return maxW;
}

console.log(maxArea([1,8,6,2,5,4,8,3,7]));`,
      solutionHint: 'area = (right - left) * Math.min(height[left], height[right]). Move shorter pointer inward.'
    },
    {
      id: 'arr-8',
      title: '8. Subarray Sum Equals K',
      difficulty: 'Hard',
      category: 'Arrays',
      description: 'Find total number of continuous subarrays whose sum equals to `k` in O(n) time using Prefix Sums.',
      constraints: ['Time complexity O(n)'],
      sampleInputs: [
        { input: 'nums = [1, 1, 1], k = 2', output: '2' }
      ],
      starterCode: `function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let sum = 0, count = 0;
  // TODO: Prefix sum hashing loop
  
  return count;
}

console.log(subarraySum([1, 1, 1], 2));`,
      solutionHint: 'sum += num; if (map.has(sum - k)) count += map.get(sum - k); map.set(sum, (map.get(sum)||0) + 1)'
    }
  ],

  'ui-design': [
    {
      id: 'ui-1',
      title: '1. WCAG Color Contrast Ratio Calculator',
      difficulty: 'Easy',
      category: 'UI Design',
      description: 'Implement `calculateContrastRatio(luminance1, luminance2)` that returns the contrast ratio formatted to 2 decimal places and verifies if it meets WCAG AA standard (4.5:1).',
      constraints: ['Ratio formula: (L1 + 0.05) / (L2 + 0.05) where L1 is lighter'],
      sampleInputs: [
        { input: 'L1 = 1.0 (white), L2 = 0.0 (black)', output: '{ ratio: "21.00", meetsAA: true }' }
      ],
      starterCode: `function calculateContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  // TODO: Calculate WCAG ratio and return result object
  
}

console.log(calculateContrastRatio(1.0, 0.0));`,
      solutionHint: 'ratio = (lighter + 0.05) / (darker + 0.05); return { ratio: ratio.toFixed(2), meetsAA: ratio >= 4.5 }'
    },
    {
      id: 'ui-2',
      title: '2. Responsive Breakpoint Utility Generator',
      difficulty: 'Easy',
      category: 'UI Design',
      description: 'Write `getBreakpoint(width)` that returns screen category: "mobile" (<640px), "tablet" (640px-1024px), "desktop" (1024px-1536px), or "ultrawide" (>1536px).',
      constraints: ['width > 0'],
      sampleInputs: [
        { input: '768', output: '"tablet"' },
        { input: '1440', output: '"desktop"' }
      ],
      starterCode: `function getBreakpoint(width) {
  // TODO: Return breakpoint name string
  
}

console.log(getBreakpoint(768));
console.log(getBreakpoint(375));`,
      solutionHint: 'Use if conditions for < 640, < 1024, < 1536, else ultrawide'
    },
    {
      id: 'ui-3',
      title: '3. Design System Spacing Token Scaler',
      difficulty: 'Easy',
      category: 'UI Design',
      description: 'Implement `generateSpacingTokens(baseUnit, steps)` that generates a 8-pt grid system spacing map (e.g. { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }).',
      constraints: ['baseUnit = 8'],
      sampleInputs: [
        { input: 'baseUnit = 8', output: '{ xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }' }
      ],
      starterCode: `function generateSpacingTokens(baseUnit = 8) {
  // TODO: Return spacing scale object
  
}

console.log(generateSpacingTokens());`,
      solutionHint: 'return { xs: baseUnit/2, sm: baseUnit, md: baseUnit*2, lg: baseUnit*3, xl: baseUnit*4, xxl: baseUnit*6 }'
    },
    {
      id: 'ui-4',
      title: '4. Fitts Law Target Acquisition Time',
      difficulty: 'Medium',
      category: 'UI Design',
      description: 'Calculate acquisition time T using Fitts\'s Law formula: T = a + b * log2(2 * D / W) where D is distance and W is target width.',
      constraints: ['D > 0, W > 0'],
      sampleInputs: [
        { input: 'D = 200, W = 50, a = 50, b = 150', output: '450ms' }
      ],
      starterCode: `function fittsLawTime(distance, width, a = 50, b = 150) {
  // TODO: Calculate T = a + b * Math.log2(2 * distance / width)
  
}

console.log(fittsLawTime(200, 50));`,
      solutionHint: 'const index = Math.log2((2 * distance) / width); return Math.round(a + b * index) + "ms"'
    },
    {
      id: 'ui-5',
      title: '5. Typography Clamp Generator',
      difficulty: 'Medium',
      category: 'UI Design',
      description: 'Write `clampTypography(minPx, maxPx, minVw, maxVw)` returning CSS `clamp(min, preferred, max)` string for fluid typography.',
      constraints: ['1rem = 16px'],
      sampleInputs: [
        { input: '16, 32, 320, 1200', output: '"clamp(1rem, 0.54rem + 1.82vw, 2rem)"' }
      ],
      starterCode: `function clampTypography(minPx, maxPx, minVw = 320, maxVw = 1200) {
  // TODO: Generate CSS clamp string
  
}

console.log(clampTypography(16, 32));`,
      solutionHint: 'Convert px to rem and calculate slope: ((maxPx - minPx) / (maxVw - minVw)) * 100'
    },
    {
      id: 'ui-6',
      title: '6. Glassmorphism CSS Generator',
      difficulty: 'Easy',
      category: 'UI Design',
      description: 'Write `generateGlassStyles(opacity, blurPx)` returning a CSS inline style object for frosted glass card UI.',
      constraints: ['opacity between 0 and 1'],
      sampleInputs: [
        { input: '0.15, 12', output: '{ background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.2)" }' }
      ],
      starterCode: `function generateGlassStyles(opacity = 0.1, blurPx = 10) {
  // TODO: Return style object for glassmorphism
  
}

console.log(generateGlassStyles(0.15, 12));`,
      solutionHint: 'return { background: `rgba(255, 255, 255, ${opacity})`, backdropFilter: `blur(${blurPx}px)`, border: "1px solid rgba(255, 255, 255, 0.2)" }'
    },
    {
      id: 'ui-7',
      title: '7. Color Palette HSL Shading Generator',
      difficulty: 'Medium',
      category: 'UI Design',
      description: 'Implement `generateColorShades(h, s, l)` that returns a 50-900 Tailwind-style color shade palette map based on lightness adjustments.',
      constraints: ['h: 0-360, s: 0-100, l: 0-100'],
      sampleInputs: [
        { input: 'h=220, s=90, l=50 (Primary Blue)', output: '{ 100: "hsl(220, 90%, 90%)", 500: "hsl(220, 90%, 50%)", 900: "hsl(220, 90%, 10%)" }' }
      ],
      starterCode: `function generateColorShades(h, s, l) {
  // TODO: Generate HSL palette map for 100, 300, 500, 700, 900
  
}

console.log(generateColorShades(220, 90, 50));`,
      solutionHint: 'Map lightnesses: { 100: 90, 300: 70, 500: l, 700: 30, 900: 10 }'
    },
    {
      id: 'ui-8',
      title: '8. UI Motion Spring Curve Estimator',
      difficulty: 'Hard',
      category: 'UI Design',
      description: 'Create `simulateSpring(stiffness, damping, mass)` estimating settling duration (ms) for spring micro-animations.',
      constraints: ['stiffness > 0, damping > 0'],
      sampleInputs: [
        { input: 'stiffness=170, damping=26, mass=1', output: '{ duration: 320, bounce: "subtle" }' }
      ],
      starterCode: `function simulateSpring(stiffness = 170, damping = 26, mass = 1) {
  // TODO: Estimate settling duration ms and return spring metadata
  
}

console.log(simulateSpring());`,
      solutionHint: 'const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass)); return { duration: Math.round(500 * (1/dampingRatio)), bounce: dampingRatio < 1 ? "bouncy" : "smooth" }'
    }
  ]
};

// Fallback dynamic problem generator for any of the 30 course topics
export function getGenericPlaygroundProblem(courseId: string, moduleIndex: number, dayHash: number): PracticeProblem {
  const topicTitle = courseId.replace(/-/g, ' ').toUpperCase();
  const modNum = moduleIndex + 1;

  const templates = [
    {
      title: `${modNum}. ${topicTitle} Core Implementation Challenge`,
      difficulty: 'Easy' as const,
      description: `Implement a foundational ${topicTitle} module solution for Challenge #${modNum}. Complete the missing logic inside the function signature to process input data correctly.`,
      constraints: ['Process input efficiently', 'Handle null/empty edge cases'],
      sampleInputs: [{ input: 'data = [10, 20, 30]', output: '60' }],
      starterCode: `function solve${modNum}(data) {
  // TODO: Implement ${topicTitle} Module ${modNum} logic here
  
}

console.log(solve${modNum}([10, 20, 30]));`,
      solutionHint: 'Iterate over data array and aggregate result'
    },
    {
      title: `${modNum}. ${topicTitle} Optimization & Boundary Validation`,
      difficulty: 'Medium' as const,
      description: `Optimize the execution of ${topicTitle} Module ${modNum} algorithm to satisfy performance requirements while validating boundary conditions.`,
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [{ input: 'items = ["a", "b", "c"]', output: '{"a":1,"b":1,"c":1}' }],
      starterCode: `function processModule${modNum}(items) {
  // TODO: Build optimized lookup map for ${topicTitle}
  
}

console.log(processModule${modNum}(["a", "b", "c"]));`,
      solutionHint: 'Use Map or object key-value accumulator loop'
    }
  ];

  const template = templates[(dayHash + moduleIndex) % templates.length];
  return {
    id: `${courseId}-${modNum}`,
    title: template.title,
    difficulty: template.difficulty,
    category: topicTitle,
    description: template.description,
    constraints: template.constraints,
    sampleInputs: template.sampleInputs,
    starterCode: template.starterCode,
    solutionHint: template.solutionHint
  };
}
