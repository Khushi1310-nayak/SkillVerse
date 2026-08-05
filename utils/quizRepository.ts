// Topic-specific 12-question quiz banks for all 30 courses

export interface RawQuizItem {
  q: string;
  opts: [string, string, string, string];
  correct: string;
}

export const TOPIC_QUIZZES: Record<string, RawQuizItem[]> = {
  'JavaScript': [
    { q: 'Which keyword creates a block-scoped variable that can be reassigned in ES6?', opts: ['let', 'const', 'var', 'global'], correct: 'let' },
    { q: 'What is the output of typeof NaN in JavaScript?', opts: ['number', 'NaN', 'undefined', 'object'], correct: 'number' },
    { q: 'Which method transforms all elements of an array and returns a new array?', opts: ['map()', 'forEach()', 'filter()', 'reduce()'], correct: 'map()' },
    { q: 'What does the strict equality operator (===) compare?', opts: ['Value and Type', 'Value only', 'Reference only', 'Memory address'], correct: 'Value and Type' },
    { q: 'Which mechanism handles asynchronous execution in JavaScript?', opts: ['Event Loop', 'Thread Pool', 'Compiler', 'Garbage Collector'], correct: 'Event Loop' },
    { q: 'What is a closure in JavaScript?', opts: ['A function bundled with references to its surrounding state', 'A method to close browser windows', 'A private class field', 'An object destructor'], correct: 'A function bundled with references to its surrounding state' },
    { q: 'Which Promise method resolves when ANY of the input promises resolves?', opts: ['Promise.any()', 'Promise.all()', 'Promise.race()', 'Promise.settled()'], correct: 'Promise.any()' },
    { q: 'How do you convert a JSON string into a JavaScript object?', opts: ['JSON.parse()', 'JSON.stringify()', 'Object.fromJSON()', 'JSON.convert()'], correct: 'JSON.parse()' },
    { q: 'What is the default value of uninitialized variables in JavaScript?', opts: ['undefined', 'null', '0', 'false'], correct: 'undefined' },
    { q: 'Which Array method removes and returns the last element of an array?', opts: ['pop()', 'push()', 'shift()', 'slice()'], correct: 'pop()' },
    { q: 'What does Event Bubbling mean in the DOM?', opts: ['Events trigger on target and propagate upwards to parents', 'Events propagate downwards to child nodes', 'Events execute asynchronously in web workers', 'Events repeat continuously'], correct: 'Events trigger on target and propagate upwards to parents' },
    { q: 'Which operator is used for optional chaining in modern JS?', opts: ['?.', '??', '||', '?:'], correct: '?.' }
  ],

  'Python': [
    { q: 'How do you define a function in Python?', opts: ['def function_name():', 'function function_name() {', 'func function_name()', 'def: function_name()'], correct: 'def function_name():' },
    { q: 'Which data structure in Python is immutable?', opts: ['Tuple', 'List', 'Dictionary', 'Set'], correct: 'Tuple' },
    { q: 'What is the output of len([1, 2, [3, 4]]) in Python?', opts: ['3', '4', '2', 'Error'], correct: '3' },
    { q: 'Which operator performs integer (floor) division in Python?', opts: ['//', '/', '%', '**'], correct: '//' },
    { q: 'How do you open a file for reading in a safe manner in Python?', opts: ["with open('file.txt', 'r') as f:", "open('file.txt').read()", "file.open('r')", "read('file.txt')"], correct: "with open('file.txt', 'r') as f:" },
    { q: 'What is a list comprehension syntax in Python?', opts: ['[x**2 for x in range(5)]', '{x**2 for x in range(5)}', '(x**2 for x in range(5))', 'list(x**2 for x in range(5))'], correct: '[x**2 for x in range(5)]' },
    { q: 'Which built-in module is used for regular expressions in Python?', opts: ['re', 'regex', 'pattern', 'string.re'], correct: 're' },
    { q: 'What does *args allow in a Python function definition?', opts: ['Variable number of positional arguments', 'Variable number of keyword arguments', 'Pointer dereferencing', 'Required keyword arguments'], correct: 'Variable number of positional arguments' },
    { q: 'What is the purpose of the __init__ method in a Python class?', opts: ['Instance constructor & initializer', 'Class destructor', 'Private method flag', 'Module importer'], correct: 'Instance constructor & initializer' },
    { q: 'Which decorator marks a method as a class method in Python?', opts: ['@classmethod', '@staticmethod', '@property', '@abstractmethod'], correct: '@classmethod' },
    { q: 'How do you handle exceptions in Python?', opts: ['try ... except', 'try ... catch', 'do ... error', 'begin ... rescue'], correct: 'try ... except' },
    { q: 'What does the zip() function do in Python?', opts: ['Aggregates elements from multiple iterables', 'Compresses files into ZIP archive', 'Sorts two lists together', 'Filters duplicate items'], correct: 'Aggregates elements from multiple iterables' }
  ],

  'Arrays': [
    { q: 'What is the time complexity of accessing an element by index in an Array?', opts: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correct: 'O(1)' },
    { q: 'What is the time complexity of inserting an element at the beginning of an Array of size N?', opts: ['O(n)', 'O(1)', 'O(log n)', 'O(n log n)'], correct: 'O(n)' },
    { q: 'Which algorithm finds the maximum subarray sum in O(n) time?', opts: ["Kadane's Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", "Floyd-Warshall"], correct: "Kadane's Algorithm" },
    { q: 'What is the space complexity of Two-Pointer approach on sorted arrays?', opts: ['O(1)', 'O(n)', 'O(n^2)', 'O(log n)'], correct: 'O(1)' },
    { q: 'In Binary Search, what condition must the array satisfy?', opts: ['Array must be sorted', 'Array must have even length', 'Array must contain unique elements', 'Array must be dynamic'], correct: 'Array must be sorted' },
    { q: 'What is a Prefix Sum array used for?', opts: ['Answering range sum queries in O(1) time', 'Sorting array elements', 'Finding maximum element', 'Reversing array'], correct: 'Answering range sum queries in O(1) time' },
    { q: 'How do you find the midpoint in Binary Search to prevent integer overflow?', opts: ['mid = left + Math.floor((right - left) / 2)', 'mid = (left + right) / 2', 'mid = right / 2', 'mid = left * 2'], correct: 'mid = left + Math.floor((right - left) / 2)' },
    { q: 'Which technique solves Sliding Window problems in O(n) time?', opts: ['Maintaining window pointers and dynamic window sum', 'Nested loops for all subarrays', 'Sorting array first', 'Recursion with memoization'], correct: 'Maintaining window pointers and dynamic window sum' },
    { q: 'What is the best average-case time complexity for sorting an Array?', opts: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(1)'], correct: 'O(n log n)' },
    { q: 'In a 2D array matrix[R][C], how is the index calculated for 1D flattening?', opts: ['index = row * C + col', 'index = row + col * R', 'index = row * col', 'index = R + C'], correct: 'index = row * C + col' },
    { q: 'What is the optimal time complexity to merge two sorted arrays of size M and N?', opts: ['O(M + N)', 'O(M * N)', 'O(M log N)', 'O(1)'], correct: 'O(M + N)' },
    { q: 'Which algorithm finds the Dutch National Flag 3-way partition in O(n) time and O(1) space?', opts: ['3-pointer partitioning', 'Merge sort', 'Binary Search', 'Counting Sort'], correct: '3-pointer partitioning' }
  ],

  'UI Design': [
    { q: 'What is the recommended minimum contrast ratio for normal text under WCAG AA standards?', opts: ['4.5:1', '3:1', '7:1', '10:1'], correct: '4.5:1' },
    { q: 'What does the term "Glassmorphism" in UI design emphasize?', opts: ['Translucent frosted-glass backgrounds with subtle borders and shadows', 'Flat monochrome vector icons', 'Heavy 3D skeuomorphic textures', 'High contrast neon glows'], correct: 'Translucent frosted-glass backgrounds with subtle borders and shadows' },
    { q: 'What is the minimum recommended touch target size for mobile UI under Apple iOS guidelines?', opts: ['44 x 44 pt', '20 x 20 pt', '60 x 60 pt', '30 x 30 pt'], correct: '44 x 44 pt' },
    { q: 'Which typography property controls vertical space between lines of text?', opts: ['Line Height (Leading)', 'Letter Spacing (Tracking)', 'Kerning', 'Font Weight'], correct: 'Line Height (Leading)' },
    { q: 'What is the purpose of a Design System in UI/UX development?', opts: ['Maintaining UI consistency across products using reusable tokens and components', 'Replacing frontend developers', 'Writing database schemas', 'Generating marketing copy'], correct: 'Maintaining UI consistency across products using reusable tokens and components' },
    { q: 'Which color model is primarily used for digital screen displays?', opts: ['RGB', 'CMYK', 'PANTONE', 'RYB'], correct: 'RGB' },
    { q: 'What is the F-Shape layout pattern in UX design?', opts: ['The natural scanning pattern of web readers looking left-to-right across the top', 'A grid system with F letters', 'A navigation drawer style', 'An icon arrangement'], correct: 'The natural scanning pattern of web readers looking left-to-right across the top' },
    { q: 'What does Visual Hierarchy achieve in UI layout?', opts: ['Guiding user attention to important elements first through scale, color, and contrast', 'Making all elements equal size', 'Hiding secondary buttons', 'Using bright red background'], correct: 'Guiding user attention to important elements first through scale, color, and contrast' },
    { q: 'What is the purpose of whitespace (negative space) in design?', opts: ['Improving readability, grouping, and reducing cognitive overload', 'Filling empty space with ads', 'Increasing file download size', 'Slowing down scroll speed'], correct: 'Improving readability, grouping, and reducing cognitive overload' },
    { q: 'Which design principle suggests elements close to each other are perceived as related?', opts: ['Law of Proximity', 'Law of Similarity', 'Law of Closure', 'Fitts Law'], correct: 'Law of Proximity' },
    { q: 'What is Fitts\'s Law in UX design?', opts: ['The time to acquire a target is a function of distance to and size of the target', 'Users spend most time on other websites', 'Interfaces must load in under 1 second', 'Dark mode reduces eye strain'], correct: 'The time to acquire a target is a function of distance to and size of the target' },
    { q: 'What is a Micro-interaction in UI design?', opts: ['Subtle visual feedback given to user actions like button hover or toggle switches', 'A small mobile device screen', 'A short survey form', 'A tiny icon file'], correct: 'Subtle visual feedback given to user actions like button hover or toggle switches' }
  ]
};

// Generic fallback quiz generator for any topic without hardcoded custom list
export function getGenericTopicQuiz(topic: string, dayHash: number): RawQuizItem[] {
  const templates = [
    {
      q: `What is the primary core purpose of ${topic} in software development?`,
      opts: [`Building robust, scalable solutions for ${topic}`, 'Managing static assets only', 'Replacing network protocols', 'Formatting plain text files'],
      correct: `Building robust, scalable solutions for ${topic}`
    },
    {
      q: `Which fundamental principle is essential when working with ${topic}?`,
      opts: ['Modularity & Clean Architecture', 'Global Variable Mutation', 'Ignoring Error Handlers', 'Hardcoded Static Offsets'],
      correct: 'Modularity & Clean Architecture'
    },
    {
      q: `What is the standard approach to performance optimization in ${topic}?`,
      opts: ['Minimizing redundant computations & optimizing memory usage', 'Adding arbitrary sleep delays', 'Increasing file size', 'Disabling browser caching'],
      correct: 'Minimizing redundant computations & optimizing memory usage'
    },
    {
      q: `How should edge cases and exceptions be handled in ${topic}?`,
      opts: ['Explicit input validation and boundary condition checks', 'Swallowing errors silently', 'Restarting server on every request', 'Returning 0 for all null values'],
      correct: 'Explicit input validation and boundary condition checks'
    },
    {
      q: `Which tool or paradigm is commonly associated with ${topic} ecosystem?`,
      opts: [`Industry Standard Documentation & Package Utilities for ${topic}`, 'Legacy Floppy Disks', 'Manual Binary Editing', 'Serial Port Drivers'],
      correct: `Industry Standard Documentation & Package Utilities for ${topic}`
    },
    {
      q: `What is the key benefit of applying clean design patterns in ${topic}?`,
      opts: ['Improved maintainability, testability, and team collaboration', 'Slower execution speeds', 'Increased code duplication', 'Harder code debugging'],
      correct: 'Improved maintainability, testability, and team collaboration'
    },
    {
      q: `When scaling applications built with ${topic}, what should be prioritized?`,
      opts: ['Decoupled state management and efficient resource usage', 'Tightly coupling all components', 'Storing passwords in plain text', 'Removing unit tests'],
      correct: 'Decoupled state management and efficient resource usage'
    },
    {
      q: `How does modern ${topic} maintain compatibility across platforms?`,
      opts: ['Using standardized specifications and interoperable APIs', 'Relying on single operating system binaries', 'Using proprietary binary formats', 'Disabling cross-platform builds'],
      correct: 'Using standardized specifications and interoperable APIs'
    },
    {
      q: `What is a common anti-pattern to avoid when developing in ${topic}?`,
      opts: ['Spaghetti code & unhandled side effects', 'Writing comprehensive unit tests', 'Using semantic naming conventions', 'Leveraging reusable modules'],
      correct: 'Spaghetti code & unhandled side effects'
    },
    {
      q: `What is the role of automated testing in ${topic} projects?`,
      opts: ['Ensuring code correctness and preventing regressions', 'Increasing build times intentionally', 'Generating random user data', 'Replacing code reviews'],
      correct: 'Ensuring code correctness and preventing regressions'
    },
    {
      q: `Which metric is critical when evaluating code quality in ${topic}?`,
      opts: ['Readability, maintainability, and execution efficiency', 'Line count alone', 'Number of comments per file', 'File creation timestamp'],
      correct: 'Readability, maintainability, and execution efficiency'
    },
    {
      q: `What is the recommended next step after mastering ${topic} fundamentals?`,
      opts: ['Building real-world portfolio projects and advancing to advanced modules', 'Stopping practice immediately', 'Memorizing syntax rules without coding', 'Deleting workspace repository'],
      correct: 'Building real-world portfolio projects and advancing to advanced modules'
    }
  ];

  // Rotate questions based on dayHash
  return templates.map((item, idx) => {
    const shift = (dayHash + idx) % 4;
    const shiftedOpts = [...item.opts];
    // Rotate options array
    for (let s = 0; s < shift; s++) {
      shiftedOpts.push(shiftedOpts.shift()!);
    }
    return {
      q: item.q,
      opts: shiftedOpts as [string, string, string, string],
      correct: item.correct
    };
  });
}
