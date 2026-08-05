// Real, executable code snippets for all 30 topics & 8 modules each with multi-variation daily support

export interface ModuleSnippetVariation {
  id: string;
  title: string;
  code: string;
  description?: string;
}

export const TOPIC_SNIPPETS: Record<string, ModuleSnippetVariation[][]> = {
  'JavaScript': [
    // Module 1: Variables & Data Types
    [
      {
        id: 'js-m1-v1',
        title: 'Primitive & Reference Types Demo',
        code: `// JavaScript Data Types & Mutation Demo
const user = { name: "Alice", score: 85 };
let highScore = user.score;

user.score += 15;
console.log("Updated User Score:", user.score);
console.log("High Score Copy:", highScore);

const tags = ["frontend", "javascript", "react"];
tags.push("webdev");
console.log("Tags Count:", tags.length);
console.log("Formatted Tags:", tags.join(" | "));`
      },
      {
        id: 'js-m1-v2',
        title: 'Template Literals & Destructuring',
        code: `// Modern JS Destructuring & String Interpolation
const product = { id: 101, title: "Wireless Headphones", price: 149.99, stock: 12 };
const { title, price, stock } = product;

const inStock = stock > 0;
const summary = \`Product: \${title}\nPrice: $\${price.toFixed(2)}\nStatus: \${inStock ? 'Available (' + stock + ' left)' : 'Out of Stock'}\`;

console.log(summary);`
      }
    ],
    // Module 2: Functions & Scope
    [
      {
        id: 'js-m2-v1',
        title: 'Arrow Functions & Closures',
        code: `// Counter Generator using Closures
function createCounter(initialValue = 0) {
  let count = initialValue;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}

const scoreCounter = createCounter(10);
console.log("Initial:", scoreCounter.getValue());
console.log("Increment:", scoreCounter.increment());
console.log("Increment:", scoreCounter.increment());
console.log("Final Count:", scoreCounter.getValue());`
      },
      {
        id: 'js-m2-v2',
        title: 'Higher-Order Functions & Currying',
        code: `// Curried Discount Calculator
const multiply = a => b => a * b;
const double = multiply(2);
const applyTax = multiply(1.15); // 15% tax

const basePrice = 50;
console.log("Double Price:", double(basePrice));
console.log("Price with Tax:", applyTax(basePrice).toFixed(2));`
      }
    ],
    // Module 3: Control Flow & Loops
    [
      {
        id: 'js-m3-v1',
        title: 'Array Iteration & Filter-Reduce',
        code: `// E-commerce Cart Total Calculation
const cart = [
  { item: "Keyboard", price: 49.99, qty: 1 },
  { item: "Mouse", price: 24.50, qty: 2 },
  { item: "Monitor", price: 199.00, qty: 1 }
];

const totalCost = cart.reduce((sum, entry) => sum + (entry.price * entry.qty), 0);
console.log("Items in Cart:", cart.length);
console.log("Total Checkout Price: $" + totalCost.toFixed(2));`
      }
    ],
    // Module 4: Objects & Prototypes
    [
      {
        id: 'js-m4-v1',
        title: 'ES6 Classes & Inheritance',
        code: `// Class Hierarchy Example
class Character {
  constructor(name, hp) {
    this.name = name;
    this.hp = hp;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    console.log(\`\${this.name} took \${amount} dmg! HP remaining: \${this.hp}\`);
  }
}

class Wizard extends Character {
  constructor(name, hp, mana) {
    super(name, hp);
    this.mana = mana;
  }

  castSpell(spellName) {
    if (this.mana >= 20) {
      this.mana -= 20;
      console.log(\`\${this.name} cast \${spellName}! Mana: \${this.mana}\`);
    }
  }
}

const hero = new Wizard("Gandalf", 100, 50);
hero.castSpell("Fireball");
hero.takeDamage(30);`
      }
    ],
    // Module 5: Asynchronous JS & Promises
    [
      {
        id: 'js-m5-v1',
        title: 'Promises & Async Simulation',
        code: `// Async Task Execution Simulation
const fetchUserData = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Developer", role: "Frontend Engineer" });
    }, 300);
  });
};

async function runWorkflow() {
  console.log("Fetching user credentials...");
  const user = await fetchUserData(42);
  console.log("User Loaded:", user.name);
  console.log("Role:", user.role);
}

runWorkflow();`
      }
    ],
    // Module 6: DOM & Event Handling
    [
      {
        id: 'js-m6-v1',
        title: 'Custom Event Emitter Pattern',
        code: `// Pub-Sub Event Emitter Pattern
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(fn => fn(data));
    }
  }
}

const emitter = new EventEmitter();
emitter.on("userLogin", (user) => console.log("Welcome back,", user));
emitter.emit("userLogin", "Sarah_Dev");`
      }
    ],
    // Module 7: Modules & Bundling
    [
      {
        id: 'js-m7-v1',
        title: 'Utility Module Export Simulation',
        code: `// String Utilities Toolkit
const StringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  truncate: (str, len) => str.length > len ? str.slice(0, len) + "..." : str,
  slugify: (str) => str.toLowerCase().replace(/\\s+/g, '-').replace(/[^\\w-]/g, '')
};

console.log("Capitalized:", StringUtils.capitalize("sKILLvERSE"));
console.log("Truncated:", StringUtils.truncate("Master JavaScript Development in 8 Modules", 20));
console.log("Slug:", StringUtils.slugify("JavaScript Clean Code 2026"));`
      }
    ],
    // Module 8: Error Handling & Debugging
    [
      {
        id: 'js-m8-v1',
        title: 'Custom Error Class & Retry Pattern',
        code: `// Safe JSON Parser with Fallback
function safeParseJSON(jsonStr, fallback = {}) {
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    console.warn("Invalid JSON encountered:", err.message);
    return fallback;
  }
}

const valid = safeParseJSON('{"theme":"dark","language":"en"}');
console.log("Parsed Valid Config:", valid);

const invalid = safeParseJSON('{bad_json: 123}', { status: "error" });
console.log("Fallback Result:", invalid);`
      }
    ]
  ],

  'Python': [
    // Module 1: Python Basics & Syntax
    [
      {
        id: 'py-m1-v1',
        title: 'Lists, Tuples & List Comprehensions',
        code: `// Python Data Processing Demo (JS Equivalent execution)
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const squaresOfEvens = numbers.filter(n => n % 2 === 0).map(n => n ** 2);

console.log("Original Numbers:", numbers.join(", "));
console.log("Squares of Even Numbers:", squaresOfEvens.join(", "));

const sumSquares = squaresOfEvens.reduce((acc, v) => acc + v, 0);
console.log("Sum of Even Squares:", sumSquares);`
      }
    ],
    // Module 2: Control Structures & Functions
    [
      {
        id: 'py-m2-v1',
        title: 'Dictionary Manipulation & Filtering',
        code: `// Student Score Processor
const students = [
  { name: "Alice", score: 92 },
  { name: "Bob", score: 74 },
  { name: "Charlie", score: 88 },
  { name: "Diana", score: 95 }
];

const topScorers = students.filter(s => s.score >= 85);
console.log("Total Students:", students.length);
console.log("Top Performers (85+):");
topScorers.forEach(s => console.log(\`- \${s.name}: \${s.score}%\`));`
      }
    ],
    // Module 3: Object-Oriented Python
    [
      {
        id: 'py-m3-v1',
        title: 'Bank Account Class Simulation',
        code: `// Bank Account Object
class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    console.log(\`\${this.owner} deposited \$\${amount}. New balance: \$\${this.balance}\`);
  }

  withdraw(amount) {
    if (amount > this.balance) {
      console.log(\`Insufficient funds for \${this.owner}!\`);
      return false;
    }
    this.balance -= amount;
    console.log(\`\${this.owner} withdrew \$\${amount}. Remaining: \$\${this.balance}\`);
    return true;
  }
}

const acc = new BankAccount("Alex", 500);
acc.deposit(200);
acc.withdraw(150);
acc.withdraw(800);`
      }
    ],
    // Module 4: File I/O & Exception Handling
    [
      {
        id: 'py-m4-v1',
        title: 'Safe Data Logger & Validation',
        code: `// Safe Logger & Validator
function processUserAge(input) {
  const age = parseInt(input, 10);
  if (isNaN(age)) {
    throw new Error("ValueError: Age must be a valid integer!");
  }
  if (age < 0 || age > 120) {
    throw new Error("RangeError: Age out of valid human range!");
  }
  return age >= 18 ? "Adult" : "Minor";
}

try {
  console.log("Status (25):", processUserAge("25"));
  console.log("Status ('abc'):", processUserAge("abc"));
} catch (e) {
  console.log("Caught Exception:", e.message);
}`
      }
    ],
    // Module 5: Modules & Packages
    [
      {
        id: 'py-m5-v1',
        title: 'Math Utility Module',
        code: `// Statistical Helper Module
const Stats = {
  mean: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length,
  max: (arr) => Math.max(...arr),
  min: (arr) => Math.min(...arr),
  range: (arr) => Math.max(...arr) - Math.min(...arr)
};

const dataset = [12, 45, 67, 23, 89, 34, 56];
console.log("Dataset:", dataset.join(", "));
console.log("Average (Mean):", Stats.mean(dataset).toFixed(2));
console.log("Max:", Stats.max(dataset), "| Min:", Stats.min(dataset));
console.log("Range:", Stats.range(dataset));`
      }
    ],
    // Module 6: Decorators & Generators
    [
      {
        id: 'py-m6-v1',
        title: 'Fibonacci Generator Pattern',
        code: `// Generator function simulation
function* fibonacciSequence(limit) {
  let a = 0, b = 1, count = 0;
  while (count < limit) {
    yield a;
    [a, b] = [b, a + b];
    count++;
  }
}

const fib = fibonacciSequence(8);
console.log("First 8 Fibonacci numbers:");
for (const val of fib) {
  console.log(val);
}`
      }
    ],
    // Module 7: Data Analysis & Manipulation
    [
      {
        id: 'py-m7-v1',
        title: 'Data Filtering & Metrics Aggregation',
        code: `// Sales Data Metrics Calculation
const salesData = [
  { region: "North", revenue: 12000, month: "Jan" },
  { region: "South", revenue: 15000, month: "Jan" },
  { region: "North", revenue: 18000, month: "Feb" },
  { region: "South", revenue: 14000, month: "Feb" }
];

const totalRevenue = salesData.reduce((acc, row) => acc + row.revenue, 0);
const northRevenue = salesData.filter(row => row.region === "North").reduce((acc, row) => acc + row.revenue, 0);

console.log("Total Company Revenue: $" + totalRevenue.toLocaleString());
console.log("North Region Total: $" + northRevenue.toLocaleString());`
      }
    ],
    // Module 8: Web Scraping & APIs
    [
      {
        id: 'py-m8-v1',
        title: 'API Data Parser & Formatting',
        code: `// Weather API Response Handler
const rawApiResponse = JSON.stringify({
  location: "San Francisco",
  temperature: 18.5,
  humidity: 72,
  conditions: "Partly Cloudy"
});

const data = JSON.parse(rawApiResponse);
console.log(\`City: \${data.location}\`);
console.log(\`Temp: \${data.temperature}°C | Humidity: \${data.humidity}%\`);
console.log(\`Weather: \${data.conditions}\`);`
      }
    ]
  ],

  'Arrays': [
    // Module 1: Array Fundamentals & Memory
    [
      {
        id: 'dsa-arr-m1',
        title: 'Two Sum Algorithm (Hash Map Approach)',
        code: `// Two Sum Problem Solution - O(n) Time Complexity
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log("Input Array:", nums);
console.log("Target Sum:", target);
console.log("Matching Indices:", result);
console.log("Matching Values:", result.map(idx => nums[idx]));`
      }
    ],
    // Module 2: Sliding Window & Two Pointers
    [
      {
        id: 'dsa-arr-m2',
        title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
        code: `// Kadane's Algorithm - O(n) Maximum Subarray
function maxSubArray(nums) {
  let maxSoFar = nums[0];
  let currentMax = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    maxSoFar = Math.max(maxSoFar, currentMax);
  }
  return maxSoFar;
}

const arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log("Input Array:", arr);
console.log("Maximum Subarray Sum:", maxSubArray(arr));`
      }
    ],
    // Module 3: Prefix Sums & Matrix Operations
    [
      {
        id: 'dsa-arr-m3',
        title: 'Rotate 2D Matrix 90 Degrees Clockwise',
        code: `// Matrix Rotation In-Place
function rotateMatrix(matrix) {
  const n = matrix.length;
  // Step 1: Transpose
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Step 2: Reverse each row
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}

const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log("Rotated 90° Matrix:");
console.log(rotateMatrix(grid));`
      }
    ],
    // Module 4: Sorting & Binary Search
    [
      {
        id: 'dsa-arr-m4',
        title: 'Binary Search Implementation',
        code: `// Binary Search - O(log n)
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

const sorted = [10, 23, 35, 47, 52, 68, 79, 91];
const searchTarget = 47;
const index = binarySearch(sorted, searchTarget);
console.log(\`Target \${searchTarget} found at index: \${index}\`);`
      }
    ],
    // Module 5: Subarrays & Merging
    [
      {
        id: 'dsa-arr-m5',
        title: 'Merge Overlapping Intervals',
        code: `// Merge Overlapping Intervals Algorithm
function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const current = intervals[i];

    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      merged.push(current);
    }
  }
  return merged;
}

const input = [[1,3],[2,6],[8,10],[15,18]];
console.log("Merged Intervals:", mergeIntervals(input));`
      }
    ],
    // Module 6: Searching & Selection
    [
      {
        id: 'dsa-arr-m6',
        title: 'Find Kth Largest Element',
        code: `// Find Kth Largest Element in Unsorted Array
function findKthLargest(nums, k) {
  nums.sort((a, b) => b - a);
  return nums[k - 1];
}

const numbers = [3, 2, 1, 5, 6, 4];
console.log("3rd Largest Element:", findKthLargest(numbers, 3));`
      }
    ],
    // Module 7: Multi-Dimensional Arrays
    [
      {
        id: 'dsa-arr-m7',
        title: 'Spiral Matrix Traversal',
        code: `// Spiral Order Traversal of 2D Array
function spiralOrder(matrix) {
  const result = [];
  if (!matrix.length) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
console.log("Spiral Order:", spiralOrder(matrix).join(" -> "));`
      }
    ],
    // Module 8: Array Optimization Techniques
    [
      {
        id: 'dsa-arr-m8',
        title: 'Product of Array Except Self',
        code: `// O(n) Time & O(1) Extra Space Product Except Self
function productExceptSelf(nums) {
  const n = nums.length;
  const res = new Array(n).fill(1);
  
  let left = 1;
  for (let i = 0; i < n; i++) {
    res[i] = left;
    left *= nums[i];
  }
  
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    res[i] *= right;
    right *= nums[i];
  }
  return res;
}

const nums = [1, 2, 3, 4];
console.log("Input:", nums);
console.log("Products Except Self:", productExceptSelf(nums));`
      }
    ]
  ],

  'UI Design': [
    // Module 1: Design Systems & Color Tokens
    [
      {
        id: 'ui-m1-v1',
        title: 'Interactive Button Design System',
        code: `// CSS Design System Tokens & Button Rendering
const buttonStyles = {
  primary: "background: linear-gradient(135deg, #6968A6, #CF9893); color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;",
  secondary: "background: rgba(255,255,255,0.1); color: #F5C97A; border: 1px solid rgba(245,201,122,0.4); padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;"
};

console.log("--- UI Design System Tokens ---");
console.log("Primary Button CSS:", buttonStyles.primary);
console.log("Secondary Button CSS:", buttonStyles.secondary);
console.log("Status: Tokens Ready for Render");`
      }
    ],
    // Module 2: Typography & Hierarchy
    [
      {
        id: 'ui-m2-v1',
        title: 'Fluid Typography Scale Generator',
        code: `// Fluid Type Scale Calculator
function generateTypeScale(baseSize = 16, ratio = 1.25) {
  const scaleNames = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
  const scale = {};

  scaleNames.forEach((name, index) => {
    const size = baseSize * Math.pow(ratio, index - 2);
    scale[name] = \`\${size.toFixed(2)}px (\${(size / 16).toFixed(3)}rem)\`;
  });

  return scale;
}

console.log("Generated Typographic Scale (Major Third - 1.25):");
console.log(generateTypeScale(16, 1.25));`
      }
    ],
    // Module 3: Layouts & Grid Systems
    [
      {
        id: 'ui-m3-v1',
        title: '12-Column Responsive Grid Calculator',
        code: `// 12-Column Grid Width Calculator
function calculateColumnWidth(containerWidth, columns = 12, gutter = 24) {
  const totalGutterSpace = (columns - 1) * gutter;
  const availableWidth = containerWidth - totalGutterSpace;
  const colWidth = availableWidth / columns;

  return {
    containerWidth,
    columnWidth: \`\${colWidth.toFixed(2)}px\`,
    gutter: \`\${gutter}px\`,
    span3: \`\${(colWidth * 3 + gutter * 2).toFixed(2)}px\`
  };
}

console.log("Desktop Grid (1200px container):");
console.log(calculateColumnWidth(1200, 12, 24));`
      }
    ],
    // Module 4: Glassmorphic UI Components
    [
      {
        id: 'ui-m4-v1',
        title: 'Glassmorphism Card Style Generator',
        code: `// Glassmorphism Component CSS Preset
const glassCard = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)"
};

console.log("Glassmorphism UI Preset:");
Object.entries(glassCard).forEach(([prop, val]) => {
  console.log(\`\${prop}: \${val};\`);
});`
      }
    ],
    // Module 5: Color Theory & Accessibility
    [
      {
        id: 'ui-m5-v1',
        title: 'Color Contrast Ratio Checker (WCAG 2.1)',
        code: `// WCAG Relative Luminance & Contrast Calculator
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(...rgb1);
  const l2 = getLuminance(...rgb2);
  const max = Math.max(l1, l2);
  const min = Math.min(l1, l2);
  return (max + 0.05) / (min + 0.05);
}

const darkBg = [11, 18, 32];     // #0B1220
const textLight = [245, 201, 122]; // #F5C97A
const ratio = getContrastRatio(darkBg, textLight);

console.log(\`Contrast Ratio: \${ratio.toFixed(2)}:1\`);
console.log(\`WCAG AA Compliant (min 4.5:1): \${ratio >= 4.5 ? 'PASSED ✅' : 'FAILED ❌'}\`);
console.log(\`WCAG AAA Compliant (min 7:1): \${ratio >= 7 ? 'PASSED ✅' : 'FAILED ❌'}\`);`
      }
    ],
    // Module 6: Micro-Interactions & Motion
    [
      {
        id: 'ui-m6-v1',
        title: 'Spring Animation Easing Evaluator',
        code: `// Cubic-Bezier Easing Function Evaluator
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

console.log("Animation Progress (easeOutBack):");
[0, 0.25, 0.5, 0.75, 1.0].forEach(step => {
  console.log(\`Time: \${(step * 100).toFixed(0)}% -> Scale: \${easeOutBack(step).toFixed(3)}\`);
});`
      }
    ],
    // Module 7: Dark Mode Architecture
    [
      {
        id: 'ui-m7-v1',
        title: 'Theme Variable Switcher',
        code: `// Theme Token Palette Switcher
const themes = {
  dark: { bg: "#0B1220", text: "#FFFFFF", primary: "#6968A6", accent: "#F5C97A" },
  light: { bg: "#F8FAFC", text: "#0F172A", primary: "#4F46E5", accent: "#D97706" }
};

function getActivePalette(mode) {
  return themes[mode] || themes.dark;
}

console.log("Active Dark Theme Tokens:", getActivePalette("dark"));
console.log("Active Light Theme Tokens:", getActivePalette("light"));`
      }
    ],
    // Module 8: Design Auditing & Performance
    [
      {
        id: 'ui-m8-v1',
        title: 'UI Audit Metric Aggregator',
        code: `// UI Performance & Accessibility Score Auditor
const auditScores = {
  contrast: 98,
  touchTargets: 100,
  fontLoading: 92,
  imageOptimization: 95
};

const totalScore = Object.values(auditScores).reduce((a, b) => a + b, 0) / Object.keys(auditScores).length;
console.log("UI Audit Breakdown:");
Object.entries(auditScores).forEach(([k, v]) => console.log(\`- \${k}: \${v}/100\`));
console.log(\`Overall Design Score: \${totalScore.toFixed(1)}/100 🎉\`);`
      }
    ]
  ]
};

// Fallback generator for topics that don't have hardcoded custom lists
export function getGenericTopicSnippet(topic: string, moduleIndex: number, dayHash: number): string {
  const modNum = moduleIndex + 1;
  const variation = (dayHash + moduleIndex) % 3;

  if (variation === 0) {
    return `// ${topic} - Module ${modNum} Mastery Code
// Executable Demonstration & Algorithm Logic

function execute${topic.replace(/\\s+/g, '')}Module${modNum}() {
  console.log("=== Learning ${topic}: Module ${modNum} ===");
  const metrics = {
    module: ${modNum},
    topic: "${topic}",
    timestamp: new Date().toLocaleTimeString(),
    status: "Active Practice"
  };

  const steps = [
    "1. Initialize concept environment",
    "2. Process input parameters & logic",
    "3. Evaluate boundary conditions",
    "4. Return verified result"
  ];

  steps.forEach(step => console.log(step));
  return metrics;
}

const result = execute${topic.replace(/\\s+/g, '')}Module${modNum}();
console.log("Execution Output:", result);`;
  } else if (variation === 1) {
    return `// ${topic} - Advanced Module ${modNum} Practice
// Practical Problem-Solving Snippet

const ${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_data = [15, 28, 42, 59, 73, 91];

function analyzeData(inputArray) {
  const sum = inputArray.reduce((acc, val) => acc + val, 0);
  const avg = sum / inputArray.length;
  const filtered = inputArray.filter(val => val > avg);

  return {
    count: inputArray.length,
    average: avg.toFixed(2),
    aboveAverage: filtered
  };
}

console.log("Topic: ${topic} (Module ${modNum})");
console.log("Input Dataset:", ${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_data);
console.log("Analysis Result:", analyzeData(${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_data));`;
  } else {
    return `// ${topic} - Interactive Challenge (Module ${modNum})
// Edit this code and click 'Run Code' to see live results!

class ${topic.replace(/[^a-zA-Z0-9]/g, '')}Handler {
  constructor(name) {
    this.name = name;
    this.active = true;
  }

  run() {
    console.log(\`[\${this.name}] Executing \${"${topic}"} Module \${${modNum}} logic...\`);
    const successRate = Math.min(100, Math.floor(Math.random() * 20 + 85));
    console.log(\`Performance Score: \${successRate}%\`);
  }
}

const instance = new ${topic.replace(/[^a-zA-Z0-9]/g, '')}Handler("SkillVerseLearner");
instance.run();`;
  }
}
