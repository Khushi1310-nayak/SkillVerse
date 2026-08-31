import { MicroChallenge } from '../types';
import { getDayHash } from './dailyQuizGenerator';

export const MICRO_CHALLENGES: MicroChallenge[] = [
  {
    id: 'mc-js-01',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is the output of the following JavaScript code snippet?',
    codeSnippet: `console.log(typeof (function() {})());`,
    language: 'javascript',
    options: ['"undefined"', '"function"', '"object"', 'Throws TypeError'],
    correctAnswer: 0,
    explanation: 'The immediately invoked function expression (IIFE) does not have an explicit return statement, so it returns `undefined`. `typeof undefined` evaluates to the string `"undefined"`.',
    xpReward: 25,
  },
  {
    id: 'mc-py-01',
    topic: 'Python',
    type: 'output-prediction',
    question: 'What will be printed by the following Python code?',
    codeSnippet: `a = [1, 2, 3]
b = a
b.append(4)
print(len(a))`,
    language: 'python',
    options: ['3', '4', 'TypeError', 'None'],
    correctAnswer: 1,
    explanation: 'In Python, lists are mutable objects. `b = a` assigns a reference to the same list in memory. Appending 4 via `b` modifies the underlying list, so `len(a)` is 4.',
    xpReward: 25,
  },
  {
    id: 'mc-react-01',
    topic: 'React',
    type: 'multiple-choice',
    question: 'When should a cleanup function returned by `useEffect` execute?',
    options: [
      'Only when the component mounts',
      'Before the component unmounts and before re-running the effect on dependency change',
      'After every DOM paint regardless of dependencies',
      'Only when an uncaught error occurs in the child tree'
    ],
    correctAnswer: 1,
    explanation: 'React runs the cleanup function before the component unmounts and before re-running the effect on subsequent renders if any dependency changes.',
    xpReward: 25,
  },
  {
    id: 'mc-dsa-01',
    topic: 'DSA',
    type: 'multiple-choice',
    question: 'What is the worst-case time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black) with N nodes?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctAnswer: 1,
    explanation: 'A balanced BST guarantees height O(log N). Therefore, searching, insertion, and deletion all take O(log N) worst-case time.',
    xpReward: 25,
  },
  {
    id: 'mc-ts-01',
    topic: 'TypeScript',
    type: 'multiple-choice',
    question: 'What is the primary difference between `unknown` and `any` in TypeScript?',
    options: [
      '`unknown` is type-safe because operations on it require explicit type checking or narrowing first',
      '`any` enables strict null checks whereas `unknown` disables them',
      '`unknown` can only hold primitive values (string, number, boolean)',
      '`unknown` and `any` are identical aliases with different names'
    ],
    correctAnswer: 0,
    explanation: '`unknown` is the type-safe counterpart of `any`. You cannot access properties or call methods on an `unknown` value without first narrowing its type via typeof, instanceof, or type guards.',
    xpReward: 25,
  },
  {
    id: 'mc-js-02',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is logged to the console when this asynchronous code runs?',
    codeSnippet: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    language: 'javascript',
    options: ['A, D, C, B', 'A, B, C, D', 'A, D, B, C', 'C, A, D, B'],
    correctAnswer: 0,
    explanation: 'Synchronous tasks execute first (A, D). Microtasks from Promise callbacks run immediately after synchronous execution (C). Macrotasks from setTimeout run in the next event loop tick (B).',
    xpReward: 25,
  },
  {
    id: 'mc-css-01',
    topic: 'CSS',
    type: 'multiple-choice',
    question: 'With `box-sizing: border-box`, what components are included in an element\'s declared width and height?',
    options: [
      'Content, Padding, and Border',
      'Content and Margin only',
      'Content, Padding, Border, and Margin',
      'Content only'
    ],
    correctAnswer: 0,
    explanation: 'Under `box-sizing: border-box`, declared width/height includes the content area, padding, and border. Margin remains outside the box dimensions.',
    xpReward: 25,
  },
  {
    id: 'mc-py-02',
    topic: 'Python',
    type: 'output-prediction',
    question: 'What is the output of this list comprehension?',
    codeSnippet: `nums = [x * 2 for x in range(5) if x % 2 == 1]
print(nums)`,
    language: 'python',
    options: ['[2, 6]', '[0, 2, 4, 6, 8]', '[2, 4, 6]', '[1, 3]'],
    correctAnswer: 0,
    explanation: '`range(5)` generates 0, 1, 2, 3, 4. The condition `x % 2 == 1` filters for odd numbers (1, 3). Multiplying each by 2 yields `[2, 6]`.',
    xpReward: 25,
  },
  {
    id: 'mc-sql-01',
    topic: 'SQL',
    type: 'multiple-choice',
    question: 'Which clause in SQL is used to filter aggregated grouped data (e.g. results from `COUNT()`, `SUM()`)?',
    options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP FILTER'],
    correctAnswer: 0,
    explanation: '`WHERE` filters individual rows before aggregation, while `HAVING` filters groups and aggregated results after the `GROUP BY` clause is evaluated.',
    xpReward: 25,
  },
  {
    id: 'mc-js-03',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What does the following expression evaluate to?',
    codeSnippet: `console.log([1, 2, 3] + [4, 5, 6]);`,
    language: 'javascript',
    options: ['"1,2,34,5,6"', '[1, 2, 3, 4, 5, 6]', 'NaN', 'Throws TypeError'],
    correctAnswer: 0,
    explanation: 'The binary `+` operator converts non-primitive operands to strings. `[1,2,3].toString()` becomes `"1,2,3"` and `[4,5,6].toString()` becomes `"4,5,6"`. Concatenating them produces `"1,2,34,5,6"`.',
    xpReward: 25,
  },
  {
    id: 'mc-dsa-02',
    topic: 'DSA',
    type: 'multiple-choice',
    question: 'What is the average time complexity of finding a key in a well-distributed Hash Table?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
    correctAnswer: 0,
    explanation: 'With a uniform hash function and low load factor, hash table lookups take O(1) average constant time.',
    xpReward: 25,
  },
  {
    id: 'mc-react-02',
    topic: 'React',
    type: 'multiple-choice',
    question: 'Why should you avoid using array indices as `key` props when list items can be reordered or filtered?',
    options: [
      'It can cause subtle UI glitches and state corruption across reordered child components',
      'React throws a compile-time fatal error if numbers are used as keys',
      'It increases bundle size significantly',
      'Array indices disable Virtual DOM diffing completely'
    ],
    correctAnswer: 0,
    explanation: 'Using indices as keys pairs component instances to position rather than identity. When items are inserted, deleted, or reordered, internal component state can map to the wrong item.',
    xpReward: 25,
  },
  {
    id: 'mc-ts-02',
    topic: 'TypeScript',
    type: 'output-prediction',
    question: 'What type does the TypeScript utility `Partial<T>` produce?',
    codeSnippet: `interface User {
  id: string;
  name: string;
}
type PartialUser = Partial<User>;`,
    language: 'typescript',
    options: [
      'A type with all properties of User set to optional (?.)',
      'A type with all properties of User set to readonly',
      'A union of all property keys in User',
      'A type that removes the id property'
    ],
    correctAnswer: 0,
    explanation: '`Partial<T>` constructs a type with all properties of `T` set to optional (`{ [P in keyof T]?: T[P] }`).',
    xpReward: 25,
  },
  {
    id: 'mc-js-04',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is the value of `result`?',
    codeSnippet: `const numbers = [10, 20, 30];
const result = numbers.reduce((acc, curr) => acc + curr, 5);
console.log(result);`,
    language: 'javascript',
    options: ['65', '60', '50', '35'],
    correctAnswer: 0,
    explanation: 'The second argument to `reduce` is the initial accumulator value (5). 5 + 10 + 20 + 30 = 65.',
    xpReward: 25,
  },
  {
    id: 'mc-py-03',
    topic: 'Python',
    type: 'output-prediction',
    question: 'What is printed by this dictionary code?',
    codeSnippet: `data = {"a": 1, "b": 2}
print(data.get("c", 99))`,
    language: 'python',
    options: ['99', 'KeyError', 'None', '0'],
    correctAnswer: 0,
    explanation: '`dict.get(key, default)` returns the specified default value (`99`) if the key is not present in the dictionary without raising a `KeyError`.',
    xpReward: 25,
  },
  {
    id: 'mc-dsa-03',
    topic: 'DSA',
    type: 'multiple-choice',
    question: 'Which sorting algorithm has the best guaranteed worst-case time complexity of O(N log N)?',
    options: ['Merge Sort', 'Quick Sort', 'Bubble Sort', 'Insertion Sort'],
    correctAnswer: 0,
    explanation: 'Merge Sort consistently divides the array in half and merges sorted sub-arrays, guaranteeing O(N log N) in best, average, and worst cases (unlike Quick Sort which degrades to O(N^2) in worst case).',
    xpReward: 25,
  },
  {
    id: 'mc-js-05',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is logged by the following code?',
    codeSnippet: `const obj = {
  count: 10,
  getCount: () => {
    return this.count;
  }
};
console.log(obj.getCount());`,
    language: 'javascript',
    options: ['undefined', '10', 'Throws ReferenceError', 'null'],
    correctAnswer: 0,
    explanation: 'Arrow functions do not have their own `this` binding; they retain the `this` value of the enclosing lexical scope (in this case, the module/window scope where `count` is not defined).',
    xpReward: 25,
  },
  {
    id: 'mc-css-02',
    topic: 'CSS',
    type: 'multiple-choice',
    question: 'In CSS Flexbox, what is the default value of `flex-shrink` on flex items?',
    options: ['1', '0', 'auto', 'none'],
    correctAnswer: 0,
    explanation: 'By default, flex items have `flex-shrink: 1`, allowing them to shrink to prevent overflowing the flex container along the main axis.',
    xpReward: 25,
  },
  {
    id: 'mc-sql-02',
    topic: 'SQL',
    type: 'multiple-choice',
    question: 'What is the result of a `LEFT JOIN` between table A and table B?',
    options: [
      'All rows from A, plus matching rows from B (NULLs for non-matching B rows)',
      'Only rows where there is a match in both table A and table B',
      'All rows from B, plus matching rows from A',
      'The Cartesian product of all rows in A and B'
    ],
    correctAnswer: 0,
    explanation: 'A `LEFT JOIN` returns all rows from the left table (A), regardless of whether there is a match in the right table (B). If no match exists, NULL values are filled for table B columns.',
    xpReward: 25,
  },
  {
    id: 'mc-ts-03',
    topic: 'TypeScript',
    type: 'multiple-choice',
    question: 'Which keyword creates a type containing only the keys of a given type `T`?',
    options: ['keyof T', 'typeof T', 'keys T', 'propertyof T'],
    correctAnswer: 0,
    explanation: 'The `keyof` type operator takes an object type and produces a string or numeric literal union of its keys.',
    xpReward: 25,
  },
  {
    id: 'mc-react-03',
    topic: 'React',
    type: 'multiple-choice',
    question: 'What hook should be used to cache expensive calculation results across component re-renders?',
    options: ['useMemo', 'useCallback', 'useRef', 'useEffect'],
    correctAnswer: 0,
    explanation: '`useMemo` caches the calculated value of a function between re-renders until one of its dependencies changes. `useCallback` caches the function definition itself.',
    xpReward: 25,
  },
  {
    id: 'mc-js-06',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is the output of this Set and Array combination?',
    codeSnippet: `const list = [1, 2, 2, 3, 4, 4, 5];
const unique = [...new Set(list)];
console.log(unique.length);`,
    language: 'javascript',
    options: ['5', '7', '4', 'undefined'],
    correctAnswer: 0,
    explanation: 'Passing an array to `new Set()` filters out duplicate elements (leaving 1, 2, 3, 4, 5). Spreading it back into an array produces an array of length 5.',
    xpReward: 25,
  },
  {
    id: 'mc-py-04',
    topic: 'Python',
    type: 'output-prediction',
    question: 'What is the output of slicing `string[::-1]` in Python?',
    codeSnippet: `word = "SkillVerse"
print(word[::-1])`,
    language: 'python',
    options: ['"esreVllikS"', '"SkillVerse"', '"Skill"', '"esreV"'],
    correctAnswer: 0,
    explanation: 'The slice `[::-1]` with step `-1` reverses the string from end to beginning.',
    xpReward: 25,
  },
  {
    id: 'mc-dsa-04',
    topic: 'DSA',
    type: 'multiple-choice',
    question: 'In Dijkstra\'s shortest path algorithm, what data structure is most commonly used to achieve O((V + E) log V) complexity?',
    options: ['Min-Priority Queue (Binary Heap)', 'Stack', 'Linked List', 'Disjoint Set (Union-Find)'],
    correctAnswer: 0,
    explanation: 'A Min-Priority Queue enables extracting the unvisited vertex with the minimum tentative distance in O(log V) time.',
    xpReward: 25,
  },
  {
    id: 'mc-js-07',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is printed to the console?',
    codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };
a[b] = 123;
a[c] = 456;
console.log(a[b]);`,
    language: 'javascript',
    options: ['456', '123', 'undefined', 'Throws TypeError'],
    correctAnswer: 0,
    explanation: 'Plain object keys in standard JS objects are converted to strings: `b.toString()` is `"[object Object]"` and `c.toString()` is `"[object Object]"`. `a[c] = 456` overwrites `a["[object Object]"]`, so `a[b]` evaluates to 456.',
    xpReward: 25,
  },
  {
    id: 'mc-react-04',
    topic: 'React',
    type: 'multiple-choice',
    question: 'What happens when you update a React `ref` object created with `useRef()`?',
    options: [
      'The `.current` value updates without triggering a component re-render',
      'The component triggers a synchronous DOM re-render immediately',
      'React queues an asynchronous reconciliation cycle',
      'The ref value resets on the next render unless stored in state'
    ],
    correctAnswer: 0,
    explanation: 'Mutating `ref.current` does not trigger a re-render. Refs are intended for storing mutable values that persist across renders without affecting the visual layout.',
    xpReward: 25,
  },
  {
    id: 'mc-ts-04',
    topic: 'TypeScript',
    type: 'multiple-choice',
    question: 'What does the `Omit<T, K>` utility type do?',
    options: [
      'Constructs a type with all properties of T except keys in K',
      'Selects only the properties listed in K from type T',
      'Makes all properties in K optional',
      'Removes null and undefined from type T'
    ],
    correctAnswer: 0,
    explanation: '`Omit<T, K>` constructs a type by picking all properties from `T` and then removing keys specified in union `K`.',
    xpReward: 25,
  },
  {
    id: 'mc-css-03',
    topic: 'CSS',
    type: 'multiple-choice',
    question: 'Which CSS selector has the highest specificity weight?',
    options: [
      'An ID selector (`#header`)',
      'A class selector with two classes (`.nav.active`)',
      'Three element selectors combined (`div ul li`)',
      'A universal pseudo-class (`:hover`)'
    ],
    correctAnswer: 0,
    explanation: 'An ID selector has a specificity weight of (0, 1, 0, 0) / 100, which overrides any combination of class selectors (0, 0, 1, 0) or element selectors (0, 0, 0, 1).',
    xpReward: 25,
  },
  {
    id: 'mc-js-08',
    topic: 'JavaScript',
    type: 'output-prediction',
    question: 'What is the output of the nullish coalescing operator `??` here?',
    codeSnippet: `const val1 = 0 ?? 'fallback';
const val2 = false ?? 'fallback';
const val3 = null ?? 'fallback';
console.log(val1, val2, val3);`,
    language: 'javascript',
    options: [
      '0 false fallback',
      'fallback fallback fallback',
      '0 false null',
      'fallback false fallback'
    ],
    correctAnswer: 0,
    explanation: 'The nullish coalescing operator (`??`) only falls back if the left-hand operand is `null` or `undefined`. Falsy values like `0`, `""`, and `false` are valid and retained.',
    xpReward: 25,
  },
  {
    id: 'mc-dsa-05',
    topic: 'DSA',
    type: 'multiple-choice',
    question: 'What data structure is used in Breadth-First Search (BFS) graph traversal?',
    options: ['Queue (FIFO)', 'Stack (LIFO)', 'Heap', 'Binary Tree'],
    correctAnswer: 0,
    explanation: 'BFS explores neighbors level-by-level using a First-In, First-Out (FIFO) Queue.',
    xpReward: 25,
  }
];

/**
 * Retrieves the deterministic micro-challenge for a specific calendar day.
 */
export function getDailyMicroChallenge(date: Date = new Date()): MicroChallenge {
  const dayHash = getDayHash(date);
  const index = Math.abs(dayHash) % MICRO_CHALLENGES.length;
  return MICRO_CHALLENGES[index];
}
