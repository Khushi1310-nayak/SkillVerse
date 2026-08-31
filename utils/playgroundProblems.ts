export interface LanguageVariant {
  starterCode: string;
  solutionHint: string;
}

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
  languageVariants?: {
    javascript?: LanguageVariant;
    python?: LanguageVariant;
    java?: LanguageVariant;
    cpp?: LanguageVariant;
  };
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
      id: 'py-mod-1',
      title: 'Module 1: Dictionary Inversion & Value Mapping',
      difficulty: 'Easy',
      category: 'Python',
      description: 'Implement invert_dict(d) that swaps dictionary keys and values. If multiple keys share the exact same value, group the original keys into a sorted list.',
      constraints: ['Keys are strings, values are hashable numbers or strings', 'Time Complexity: O(n)', 'Return a standard Python dictionary'],
      sampleInputs: [
        { input: '{"a": 1, "b": 2, "c": 1}', output: '{1: ["a", "c"], 2: ["b"]}' },
        { input: '{"x": 10, "y": 20}', output: '{10: ["x"], 20: ["y"]}' }
      ],
      starterCode: `def invert_dict(d: dict) -> dict:\n    result = {}\n    # TODO: Swap keys and values, grouping duplicate values in a list\n    \n    return result\n\n# Test execution:\nprint(invert_dict({"a": 1, "b": 2, "c": 1}))`,
      solutionHint: 'Iterate d.items(). If val in result, result[val].append(key); else result[val] = [key].'
    },
    {
      id: 'py-mod-2',
      title: 'Module 2: List Comprehension Matrix Transpose',
      difficulty: 'Easy',
      category: 'Python',
      description: 'Write transpose_matrix(matrix) using idiomatic Python list comprehensions to swap the rows and columns of an M x N grid.',
      constraints: ['Matrix dimensions: 1x1 to 100x100', 'Do not use external NumPy library', 'Preserve inner integer values'],
      sampleInputs: [
        { input: '[[1, 2, 3], [4, 5, 6]]', output: '[[1, 4], [2, 5], [3, 6]]' },
        { input: '[[1]]', output: '[[1]]' }
      ],
      starterCode: `def transpose_matrix(matrix: list[list[int]]) -> list[list[int]]:\n    # TODO: Transpose matrix using list comprehension or zip\n    \n    pass\n\ngrid = [\n    [1, 2, 3],\n    [4, 5, 6]\n]\nprint("Transposed:", transpose_matrix(grid))`,
      solutionHint: 'Use [list(row) for row in zip(*matrix)] or [[matrix[j][i] for j in range(len(matrix))] for i in range(len(matrix[0]))].'
    },
    {
      id: 'py-mod-3',
      title: 'Module 3: Anagram Grouping with Character Count Hashes',
      difficulty: 'Medium',
      category: 'Python',
      description: 'Implement group_anagrams(words) that groups an array of strings into anagram clusters using character frequency tuples or sorted string keys.',
      constraints: ['Words contain lowercase ASCII letters', 'Time Complexity: O(n * k log k)', 'Return a list of lists of strings'],
      sampleInputs: [
        { input: '["eat", "tea", "tan", "ate", "nat", "bat"]', output: '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]' }
      ],
      starterCode: `from collections import defaultdict\n\ndef group_anagrams(words: list[str]) -> list[list[str]]:\n    anagram_map = defaultdict(list)\n    # TODO: Group words by sorted canonical character signature\n    \n    return list(anagram_map.values())\n\nwords = ["eat", "tea", "tan", "ate", "nat", "bat"]\nprint("Anagram Groups:", group_anagrams(words))`,
      solutionHint: 'Use tuple(sorted(word)) or "".join(sorted(word)) as dictionary keys in defaultdict(list).'
    },
    {
      id: 'py-mod-4',
      title: 'Module 4: Least Recently Used (LRU) Cache',
      difficulty: 'Medium',
      category: 'Python',
      description: 'Design an LRUCache class with get(key) and put(key, value) operations running in O(1) average time complexity. Evict the least recently used key when capacity is exceeded.',
      constraints: ['Capacity >= 1', 'get and put run in O(1) average time', 'Return -1 when key is not found'],
      sampleInputs: [
        { input: 'cache = LRUCache(2); cache.put(1, 100); cache.put(2, 200); cache.get(1); cache.put(3, 300); cache.get(2)', output: 'cache.get(2) returns -1 (evicted)' }
      ],
      starterCode: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key: int) -> int:\n        # TODO: Return value and move key to most recently used\n        \n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        # TODO: Insert/update value and evict oldest if exceeding capacity\n        \n        pass\n\nlru = LRUCache(2)\nlru.put(1, 100)\nlru.put(2, 200)\nprint("Get 1:", lru.get(1))  # 100\nlru.put(3, 300)             # Evicts key 2\nprint("Get 2 (should be -1):", lru.get(2))\nprint("Get 3:", lru.get(3))`,
      solutionHint: 'Use self.cache.move_to_end(key) on access and self.cache.popitem(last=False) when len > capacity.'
    },
    {
      id: 'py-mod-5',
      title: 'Module 5: Retry Decorator with Exponential Backoff',
      difficulty: 'Medium',
      category: 'Python',
      description: 'Create a function decorator @retry(max_attempts=3, backoff_factor=1.5) that catches exceptions and retries the wrapped function with exponential backoff up to max_attempts before raising the final exception.',
      constraints: ['Use functools.wraps to preserve function metadata', 'Forward arbitrary *args and **kwargs', 'Raise original exception if all retries fail'],
      sampleInputs: [
        { input: '@retry(max_attempts=3) def flaky_api()', output: 'Retries on failure up to 3 times before raising exception' }
      ],
      starterCode: `import time\nfrom functools import wraps\n\ndef retry(max_attempts: int = 3, backoff_factor: float = 1.5):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            # TODO: Loop attempts and catch Exception, re-raising on final failure\n            \n            pass\n        return wrapper\n    return decorator\n\nattempts = 0\n@retry(max_attempts=3, backoff_factor=1.0)\ndef simulate_network_call():\n    global attempts\n    attempts += 1\n    if attempts < 3:\n        print(f"Attempt {attempts} failed, retrying...")\n        raise ConnectionError("Network timeout")\n    return "Success on attempt 3!"\n\nprint("Result:", simulate_network_call())`,
      solutionHint: 'Use a try-except block inside a for attempt in range(max_attempts) loop and time.sleep(backoff_factor ** attempt).'
    },
    {
      id: 'py-mod-6',
      title: 'Module 6: Generator Stream & Sliding Window Batches',
      difficulty: 'Hard',
      category: 'Python',
      description: 'Write a generator function fibonacci_stream() that yields Fibonacci numbers indefinitely in O(1) memory, and a consumer chunk_stream(gen, n) that yields tuples of size n from any generator.',
      constraints: ['Memory Complexity: O(1)', 'Yield lazily without materializing entire infinite sequence', 'Handle non-empty iterator streams'],
      sampleInputs: [
        { input: 'take 4 chunks of size 3 from fibonacci_stream()', output: '(0, 1, 1), (2, 3, 5), (8, 13, 21), (34, 55, 89)' }
      ],
      starterCode: `from typing import Generator, Iterator, Tuple\nimport itertools\n\ndef fibonacci_stream() -> Generator[int, None, None]:\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ndef chunk_stream(stream: Iterator[int], chunk_size: int) -> Generator[Tuple[int, ...], None, None]:\n    # TODO: Yield tuples of size 'chunk_size' lazily from stream\n    \n    pass\n\nfib_gen = fibonacci_stream()\nchunker = chunk_stream(fib_gen, 3)\nfor _ in range(4):\n    print("Chunk:", next(chunker))`,
      solutionHint: 'Use tuple(itertools.islice(stream, chunk_size)) in a loop and yield while chunk is non-empty.'
    },
    {
      id: 'py-mod-7',
      title: 'Module 7: Topological Sort Dependency Resolver (Kahn Algorithm)',
      difficulty: 'Hard',
      category: 'Python',
      description: 'Given a dictionary of package dependencies, return a valid build order (topological sort) or raise a ValueError("Cyclic dependency detected") if a cycle exists.',
      constraints: ['Graph vertices: 1 to 500', 'Time Complexity: O(V + E)', 'Detect circular dependency deadlocks'],
      sampleInputs: [
        { input: '{"web": ["api", "ui"], "api": ["db"], "ui": ["common"], "db": ["common"], "common": []}', output: '["common", "db", "ui", "api", "web"]' }
      ],
      starterCode: `from collections import deque, defaultdict\n\ndef resolve_dependencies(graph: dict[str, list[str]]) -> list[str]:\n    in_degree = {u: 0 for u in graph}\n    adj = defaultdict(list)\n    for u, deps in graph.items():\n        for dep in deps:\n            adj[dep].append(u)\n            in_degree[u] += 1\n\n    queue = deque([u for u, deg in in_degree.items() if deg == 0])\n    order = []\n\n    # TODO: Process queue with Kahn's algorithm and return build order\n    \n    return order\n\npackages = {\n    "web": ["api", "ui"],\n    "api": ["database"],\n    "ui": ["common"],\n    "database": ["common"],\n    "common": []\n}\nprint("Build Order:", resolve_dependencies(packages))`,
      solutionHint: 'While queue: node = queue.popleft(); order.append(node); for neighbor in adj[node]: in_degree[neighbor] -= 1; if in_degree[neighbor] == 0: queue.append(neighbor). Raise ValueError if len(order) != len(graph).'
    },
    {
      id: 'py-mod-8',
      title: 'Module 8: Asynchronous Pipeline with asyncio.Semaphore',
      difficulty: 'Hard',
      category: 'Python',
      description: 'Implement an async worker crawl_urls(urls, max_concurrency) using asyncio.Semaphore to bound concurrent async fetches, collecting all processed responses.',
      constraints: ['Never exceed max_concurrency concurrent tasks', 'Handle simulated network latency with asyncio.sleep', 'Return list of result dictionaries'],
      sampleInputs: [
        { input: 'crawl_urls(["url1", "url2", "url3", "url4"], max_concurrency=2)', output: 'Returns all 4 fetched response payloads' }
      ],
      starterCode: `import asyncio\n\nasync def fetch_url(sem: asyncio.Semaphore, url: str) -> dict:\n    async with sem:\n        await asyncio.sleep(0.05)  # Simulate network latency\n        return {"url": url, "status": 200, "data": f"Content of {url}"}\n\nasync def crawl_urls(urls: list[str], max_concurrency: int = 2) -> list[dict]:\n    sem = asyncio.Semaphore(max_concurrency)\n    # TODO: Create tasks and gather results concurrently\n    tasks = [fetch_url(sem, url) for url in urls]\n    return await asyncio.gather(*tasks)\n\nasync def main():\n    targets = [f"https://api.skillverse.com/data/{i}" for i in range(1, 5)]\n    results = await crawl_urls(targets, max_concurrency=2)\n    print(f"Scraped {len(results)} endpoints successfully.")\n    for r in results:\n        print(r)\n\nasyncio.run(main())`,
      solutionHint: 'Use asyncio.Semaphore inside an async context manager and execute with asyncio.gather(*tasks).'
    }
  ],

  'java': [
    {
      id: 'java-mod-1',
      title: 'Module 1: In-Place Two-Pointer String Reversal',
      difficulty: 'Easy',
      category: 'Java',
      description: 'Implement reverseString(char[] s) in Java using a two-pointer approach to reverse a character array in-place with O(1) auxiliary memory.',
      constraints: ['Array length: 1 to 100,000', 'Space Complexity: O(1) in-place', 'Time Complexity: O(n)'],
      sampleInputs: [
        { input: "['h', 'e', 'l', 'l', 'o']", output: "['o', 'l', 'l', 'e', 'h']" }
      ],
      starterCode: `public class Solution {\n    public static void reverseString(char[] s) {\n        int left = 0;\n        int right = s.length - 1;\n        // TODO: Swap characters using two pointers\n        \n    }\n\n    public static void main(String[] args) {\n        char[] word = {'h', 'e', 'l', 'l', 'o'};\n        reverseString(word);\n        System.out.println("Reversed: " + new String(word));\n    }\n}`,
      solutionHint: 'while (left < right) { char temp = s[left]; s[left++] = s[right]; s[right--] = temp; }'
    },
    {
      id: 'java-mod-2',
      title: 'Module 2: First Non-Repeating Character Index',
      difficulty: 'Easy',
      category: 'Java',
      description: 'Implement firstUniqChar(String s) returning the index of the first non-repeating character, or -1 if no unique character exists.',
      constraints: ['String contains lowercase English letters', 'Time Complexity: O(n)', 'Space Complexity: O(1) fixed 26-char frequency table'],
      sampleInputs: [
        { input: '"leetcode"', output: '0' },
        { input: '"loveleetcode"', output: '2' }
      ],
      starterCode: `public class Solution {\n    public static int firstUniqChar(String s) {\n        int[] freq = new int[26];\n        // TODO: Count frequencies and find first index with freq == 1\n        \n        return -1;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("First Unique Index: " + firstUniqChar("loveleetcode")); // Expected: 2\n    }\n}`,
      solutionHint: 'for (char c : s.toCharArray()) freq[c - "a"]++; then iterate s with index i and check freq[s.charAt(i) - "a"] == 1.'
    },
    {
      id: 'java-mod-3',
      title: 'Module 3: MinStack with O(1) Minimum Value Lookup',
      difficulty: 'Medium',
      category: 'Java',
      description: 'Design a MinStack class supporting push, pop, top, and getMin, each executing in O(1) time complexity.',
      constraints: ['Stack operations run in O(1) time', 'Handle positive and negative integers', 'Maintain twin synchronized stack state'],
      sampleInputs: [
        { input: 'push(-2); push(0); push(-3); getMin() -> -3; pop(); top() -> 0; getMin() -> -2', output: 'getMin() returns -2' }
      ],
      starterCode: `import java.util.Stack;\n\npublic class MinStack {\n    private Stack<Integer> stack = new Stack<>();\n    private Stack<Integer> minStack = new Stack<>();\n\n    public void push(int val) {\n        stack.push(val);\n        // TODO: Update minStack with min(val, currentMin)\n        \n    }\n\n    public void pop() {\n        stack.pop();\n        minStack.pop();\n    }\n\n    public int top() {\n        return stack.peek();\n    }\n\n    public int getMin() {\n        return minStack.peek();\n    }\n\n    public static void main(String[] args) {\n        MinStack minStack = new MinStack();\n        minStack.push(-2);\n        minStack.push(0);\n        minStack.push(-3);\n        System.out.println("Min: " + minStack.getMin()); // -3\n        minStack.pop();\n        System.out.println("Top: " + minStack.top()); // 0\n        System.out.println("Min: " + minStack.getMin()); // -2\n    }\n}`,
      solutionHint: 'if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val); else minStack.push(minStack.peek());'
    },
    {
      id: 'java-mod-4',
      title: 'Module 4: Binary Tree Level Order Traversal (BFS)',
      difficulty: 'Medium',
      category: 'Java',
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level) using a Queue.',
      constraints: ['Tree node count: 0 to 2,000', 'Time Complexity: O(n)', 'Space Complexity: O(n) Queue memory'],
      sampleInputs: [
        { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]' }
      ],
      starterCode: `import java.util.*;\n\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\npublic class Solution {\n    public static List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        if (root == null) return result;\n        Queue<TreeNode> queue = new LinkedList<>();\n        queue.offer(root);\n\n        // TODO: Process nodes level by level using queue size\n        \n        return result;\n    }\n\n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(3);\n        root.left = new TreeNode(9);\n        root.right = new TreeNode(20);\n        root.right.left = new TreeNode(15);\n        root.right.right = new TreeNode(7);\n\n        System.out.println("Level Order: " + levelOrder(root));\n    }\n}`,
      solutionHint: 'int size = queue.size(); List<Integer> level = new ArrayList<>(); for (int i = 0; i < size; i++) { TreeNode node = queue.poll(); level.add(node.val); if (node.left != null) queue.offer(node.left); if (node.right != null) queue.offer(node.right); } result.add(level);'
    },
    {
      id: 'java-mod-5',
      title: 'Module 5: Java Streams Grouping & Metric Aggregation',
      difficulty: 'Medium',
      category: 'Java',
      description: 'Given a list of Employee records (id, name, department, salary), use the Java 8 Stream API and Collectors.groupingBy to calculate the average salary per department.',
      constraints: ['Use declarative Java 8 Stream pipelines', 'Return Map<String, Double>', 'Handle empty department lists gracefully'],
      sampleInputs: [
        { input: '[("Eng", 120000), ("Eng", 140000), ("Sales", 90000)]', output: '{"Engineering": 130000.0, "Sales": 90000.0}' }
      ],
      starterCode: `import java.util.*;\nimport java.util.stream.Collectors;\n\nclass Employee {\n    String name;\n    String department;\n    double salary;\n    Employee(String name, String dept, double salary) {\n        this.name = name;\n        this.department = dept;\n        this.salary = salary;\n    }\n    public String getDepartment() { return department; }\n    public double getSalary() { return salary; }\n}\n\npublic class Solution {\n    public static Map<String, Double> averageSalaryByDept(List<Employee> employees) {\n        // TODO: Group by department and collect averagingDouble(Employee::getSalary)\n        \n        return null;\n    }\n\n    public static void main(String[] args) {\n        List<Employee> list = Arrays.asList(\n            new Employee("Alice", "Engineering", 120000),\n            new Employee("Bob", "Engineering", 140000),\n            new Employee("Charlie", "Sales", 90000)\n        );\n        System.out.println("Department Averages: " + averageSalaryByDept(list));\n    }\n}`,
      solutionHint: 'return employees.stream().collect(Collectors.groupingBy(Employee::getDepartment, Collectors.averagingDouble(Employee::getSalary)));'
    },
    {
      id: 'java-mod-6',
      title: 'Module 6: Merge K Sorted Lists with PriorityQueue',
      difficulty: 'Hard',
      category: 'Java',
      description: 'Merge K sorted linked lists into one single sorted linked list in O(N log k) time using a PriorityQueue (Min-Heap).',
      constraints: ['K between 0 and 10,000', 'Total nodes N up to 100,000', 'Time Complexity: O(N log K)'],
      sampleInputs: [
        { input: '[[1, 4, 5], [1, 3, 4], [2, 6]]', output: '1 -> 1 -> 2 -> 3 -> 4 -> 4 -> 5 -> 6' }
      ],
      starterCode: `import java.util.PriorityQueue;\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n}\n\npublic class Solution {\n    public static ListNode mergeKLists(ListNode[] lists) {\n        if (lists == null || lists.length == 0) return null;\n        PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> Integer.compare(a.val, b.val));\n        // TODO: Add all head nodes to pq and reconstruct sorted linked list\n        \n        return null;\n    }\n\n    public static void main(String[] args) {\n        ListNode l1 = new ListNode(1); l1.next = new ListNode(4); l1.next.next = new ListNode(5);\n        ListNode l2 = new ListNode(1); l2.next = new ListNode(3); l2.next.next = new ListNode(4);\n        ListNode l3 = new ListNode(2); l3.next = new ListNode(6);\n\n        ListNode merged = mergeKLists(new ListNode[]{l1, l2, l3});\n        System.out.print("Merged: ");\n        while (merged != null) {\n            System.out.print(merged.val + " -> ");\n            merged = merged.next;\n        }\n        System.out.println("null");\n    }\n}`,
      solutionHint: 'for (ListNode head : lists) if (head != null) pq.offer(head); ListNode dummy = new ListNode(0); ListNode curr = dummy; while (!pq.isEmpty()) { ListNode top = pq.poll(); curr.next = top; curr = curr.next; if (top.next != null) pq.offer(top.next); } return dummy.next;'
    },
    {
      id: 'java-mod-7',
      title: 'Module 7: Thread-Safe Bounded Blocking Queue',
      difficulty: 'Hard',
      category: 'Java',
      description: 'Implement a thread-safe BoundedBlockingQueue<T> with put(item) and take() methods using synchronized monitors or explicit locks with condition variables.',
      constraints: ['Support concurrent producer and consumer threads without race conditions', 'Block on put() when queue is full', 'Block on take() when queue is empty'],
      sampleInputs: [
        { input: 'queue = new BoundedBlockingQueue(2); queue.put(10); queue.put(20); queue.take()', output: '10' }
      ],
      starterCode: `import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class BoundedBlockingQueue<T> {\n    private final Queue<T> queue = new LinkedList<>();\n    private final int capacity;\n\n    public BoundedBlockingQueue(int capacity) {\n        this.capacity = capacity;\n    }\n\n    public synchronized void put(T item) throws InterruptedException {\n        // TODO: Wait while queue.size() == capacity, then offer item and notifyAll()\n        \n    }\n\n    public synchronized T take() throws InterruptedException {\n        // TODO: Wait while queue.isEmpty(), then poll item and notifyAll()\n        \n        return null;\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        BoundedBlockingQueue<Integer> bq = new BoundedBlockingQueue<>(2);\n        bq.put(100);\n        bq.put(200);\n        System.out.println("Took: " + bq.take()); // 100\n        bq.put(300);\n        System.out.println("Took: " + bq.take()); // 200\n    }\n}`,
      solutionHint: 'while (queue.size() == capacity) wait(); queue.offer(item); notifyAll(); and while (queue.isEmpty()) wait(); T val = queue.poll(); notifyAll(); return val;'
    },
    {
      id: 'java-mod-8',
      title: 'Module 8: Word Ladder Shortest Transformation (Bidirectional BFS)',
      difficulty: 'Hard',
      category: 'Java',
      description: 'Given beginWord, endWord, and wordList, find the length of the shortest transformation sequence from beginWord to endWord such that only one letter changes at a time and each transformed word exists in wordList.',
      constraints: ['All words have the same length and lowercase English letters', 'Return 0 if no valid transformation path exists', 'Time Complexity: O(M^2 * N)'],
      sampleInputs: [
        { input: 'begin = "hit", end = "cog", list = ["hot","dot","dog","lot","log","cog"]', output: '5 ("hit" -> "hot" -> "dot" -> "dog" -> "cog")' }
      ],
      starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> dict = new HashSet<>(wordList);\n        if (!dict.contains(endWord)) return 0;\n        Queue<String> queue = new LinkedList<>();\n        queue.offer(beginWord);\n        int level = 1;\n\n        // TODO: Perform BFS transforming one character at a time\n        \n        return 0;\n    }\n\n    public static void main(String[] args) {\n        List<String> dict = Arrays.asList("hot", "dot", "dog", "lot", "log", "cog");\n        System.out.println("Shortest ladder length: " + ladderLength("hit", "cog", dict)); // Expected: 5\n    }\n}`,
      solutionHint: 'while (!queue.isEmpty()) { int size = queue.size(); for (int i = 0; i < size; i++) { String word = queue.poll(); if (word.equals(endWord)) return level; char[] chars = word.toCharArray(); for (int j = 0; j < chars.length; j++) { char orig = chars[j]; for (char c = "a"; c <= "z"; c++) { chars[j] = c; String next = new String(chars); if (dict.remove(next)) queue.offer(next); } chars[j] = orig; } } level++; } return 0;'
    }
  ],

  'c': [
    {
      id: 'c-mod-1',
      title: 'Module 1: Pointer-Based Array Reverse In-Place',
      difficulty: 'Easy',
      category: 'C',
      description: 'Implement void reverse_array(int *arr, int size) in C that reverses an integer array in-place using raw pointer arithmetic with O(1) auxiliary space.',
      constraints: ['Array size: 1 to 10,000', 'Space Complexity: O(1) in-place', 'Do not use VLA (Variable Length Arrays)'],
      sampleInputs: [
        { input: 'arr = [10, 20, 30, 40, 50], size = 5', output: '[50, 40, 30, 20, 10]' }
      ],
      starterCode: `#include <stdio.h>\n\nvoid reverse_array(int *arr, int size) {\n    int *left = arr;\n    int *right = arr + size - 1;\n    // TODO: Swap values using raw pointers until left >= right\n    \n}\n\nint main() {\n    int nums[] = {10, 20, 30, 40, 50};\n    int size = sizeof(nums) / sizeof(nums[0]);\n    reverse_array(nums, size);\n    printf("Reversed: ");\n    for (int i = 0; i < size; i++) printf("%d ", nums[i]);\n    printf("\\n");\n    return 0;\n}`,
      solutionHint: 'while (left < right) { int temp = *left; *left = *right; *right = temp; left++; right--; }'
    },
    {
      id: 'c-mod-2',
      title: 'Module 2: Custom String Concatenation & Null Terminator Safety',
      difficulty: 'Easy',
      category: 'C',
      description: 'Implement char* custom_strcat(char *dest, const char *src) without using <string.h> functions, properly appending src to dest and ensuring proper null termination.',
      constraints: ['Buffer overflow prevention: assume dest has sufficient allocated capacity', 'Time Complexity: O(length(dest) + length(src))'],
      sampleInputs: [
        { input: 'dest = "Hello, ", src = "SkillVerse C!"', output: '"Hello, SkillVerse C!"' }
      ],
      starterCode: `#include <stdio.h>\n\nchar* custom_strcat(char *dest, const char *src) {\n    char *ptr = dest;\n    // TODO: Advance ptr to the end of dest (null character '\\0')\n    \n    // TODO: Copy src into ptr including terminating '\\0'\n    \n    return dest;\n}\n\nint main() {\n    char buffer[100] = "Hello, ";\n    custom_strcat(buffer, "SkillVerse C!");\n    printf("Concatenated: %s\\n", buffer);\n    return 0;\n}`,
      solutionHint: 'while (*ptr) ptr++; while (*src) { *ptr++ = *src++; } *ptr = "\\0"; return dest;'
    },
    {
      id: 'c-mod-3',
      title: 'Module 3: Singly Linked List Node Insertion & Deallocation',
      difficulty: 'Medium',
      category: 'C',
      description: 'Create a singly linked list structure and implement push_front(Node **head, int val) and free_list(Node *head) using dynamic heap memory allocation (malloc/free).',
      constraints: ['Handle memory allocation failure checking if malloc returns NULL', 'Avoid memory leaks by freeing every node'],
      sampleInputs: [
        { input: 'push_front 30, push_front 20, push_front 10', output: '10 -> 20 -> 30 -> NULL' }
      ],
      starterCode: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node {\n    int val;\n    struct Node *next;\n} Node;\n\nvoid push_front(Node **head, int val) {\n    // TODO: Allocate memory with malloc and prepend new node to head\n    \n}\n\nvoid free_list(Node *head) {\n    // TODO: Traverse and safely free all allocated nodes\n    \n}\n\nint main() {\n    Node *head = NULL;\n    push_front(&head, 30);\n    push_front(&head, 20);\n    push_front(&head, 10);\n    for (Node *curr = head; curr; curr = curr->next) printf("%d -> ", curr->val);\n    printf("NULL\\n");\n    free_list(head);\n    return 0;\n}`,
      solutionHint: 'Node *newNode = (Node *)malloc(sizeof(Node)); newNode->val = val; newNode->next = *head; *head = newNode;'
    },
    {
      id: 'c-mod-4',
      title: 'Module 4: Bitwise Operations & Hamming Weight (Set Bits Counter)',
      difficulty: 'Medium',
      category: 'C',
      description: 'Implement int count_set_bits(unsigned int n) using Brian Kernighan bit manipulation algorithm (n & (n - 1)) in O(k) time where k is the number of set 1-bits.',
      constraints: ['Time Complexity: O(number of set bits)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'n = 29 (binary 11101)', output: '4' }
      ],
      starterCode: `#include <stdio.h>\n\nint count_set_bits(unsigned int n) {\n    int count = 0;\n    // TODO: Use Brian Kernighan's bit trick: n = n & (n - 1)\n    \n    return count;\n}\n\nint main() {\n    unsigned int val = 29;\n    printf("Set bits in %u: %d\\n", val, count_set_bits(val));\n    return 0;\n}`,
      solutionHint: 'while (n > 0) { n = n & (n - 1); count++; } return count;'
    },
    {
      id: 'c-mod-5',
      title: 'Module 5: Generic Memory Swap with Void Pointers',
      difficulty: 'Medium',
      category: 'C',
      description: 'Implement void generic_swap(void *a, void *b, size_t size) using raw byte-by-byte memory swapping with char* casting and a dynamic or byte buffer.',
      constraints: ['Must work on any data type (int, double, structs)', 'Avoid undefined behavior'],
      sampleInputs: [
        { input: 'x = 3.1415, y = 2.7182', output: 'x = 2.7182, y = 3.1415' }
      ],
      starterCode: `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nvoid generic_swap(void *a, void *b, size_t size) {\n    char *p1 = (char *)a;\n    char *p2 = (char *)b;\n    // TODO: Swap 'size' bytes between p1 and p2\n    \n}\n\nint main() {\n    double x = 3.1415, y = 2.7182;\n    generic_swap(&x, &y, sizeof(double));\n    printf("Swapped doubles: x = %f, y = %f\\n", x, y);\n    return 0;\n}`,
      solutionHint: 'for (size_t i = 0; i < size; i++) { char temp = p1[i]; p1[i] = p2[i]; p2[i] = temp; }'
    },
    {
      id: 'c-mod-6',
      title: 'Module 6: Circular Ring Buffer with Overwrite Detection',
      difficulty: 'Hard',
      category: 'C',
      description: 'Implement a ring buffer struct RingBuffer with enqueue(rb, val) and dequeue(rb, *out) methods maintaining head/tail indices with modulo arithmetic.',
      constraints: ['Fixed buffer size without dynamic resizing', 'Return false on buffer full / empty'],
      sampleInputs: [
        { input: 'enqueue(100), enqueue(200), dequeue()', output: 'Dequeued: 100' }
      ],
      starterCode: `#include <stdio.h>\n#include <stdbool.h>\n\n#define CAPACITY 4\n\ntypedef struct {\n    int data[CAPACITY];\n    int head;\n    int tail;\n    int size;\n} RingBuffer;\n\nvoid init_buffer(RingBuffer *rb) {\n    rb->head = 0;\n    rb->tail = 0;\n    rb->size = 0;\n}\n\nbool enqueue(RingBuffer *rb, int val) {\n    // TODO: Insert val at tail if not full, advance tail modulo CAPACITY\n    \n    return false;\n}\n\nbool dequeue(RingBuffer *rb, int *out) {\n    // TODO: Extract val from head if not empty, advance head modulo CAPACITY\n    \n    return false;\n}\n\nint main() {\n    RingBuffer rb;\n    init_buffer(&rb);\n    enqueue(&rb, 100); enqueue(&rb, 200); enqueue(&rb, 300); enqueue(&rb, 400);\n    int out;\n    dequeue(&rb, &out); printf("Dequeued: %d\\n", out);\n    enqueue(&rb, 500);\n    while (dequeue(&rb, &out)) printf("Item: %d\\n", out);\n    return 0;\n}`,
      solutionHint: 'if (rb->size == CAPACITY) return false; rb->data[rb->tail] = val; rb->tail = (rb->tail + 1) % CAPACITY; rb->size++; return true;'
    },
    {
      id: 'c-mod-7',
      title: 'Module 7: Fixed-Size Arena Memory Pool Allocator',
      difficulty: 'Hard',
      category: 'C',
      description: 'Implement an Arena allocator struct Arena with arena_alloc(Arena *arena, size_t size) and arena_reset(Arena *arena) that allocates memory contiguously with 8-byte boundary alignment.',
      constraints: ['Align allocations to 8-byte boundaries', 'Return NULL if requested size exceeds remaining capacity'],
      sampleInputs: [
        { input: 'arena_alloc(5 * sizeof(int))', output: 'Contiguous valid pointer block' }
      ],
      starterCode: `#include <stdio.h>\n#include <stdint.h>\n#include <stddef.h>\n\n#define ARENA_SIZE 1024\n\ntypedef struct {\n    uint8_t buffer[ARENA_SIZE];\n    size_t offset;\n} Arena;\n\nvoid arena_init(Arena *a) { a->offset = 0; }\n\nvoid* arena_alloc(Arena *a, size_t size) {\n    // TODO: Align to 8-byte boundary, allocate and update offset\n    \n    return NULL;\n}\n\nvoid arena_reset(Arena *a) { a->offset = 0; }\n\nint main() {\n    Arena arena;\n    arena_init(&arena);\n    int *numbers = (int *)arena_alloc(&arena, 5 * sizeof(int));\n    for (int i = 0; i < 5; i++) numbers[i] = (i + 1) * 10;\n    printf("Arena allocated: %d, %d, %d\\n", numbers[0], numbers[1], numbers[2]);\n    arena_reset(&arena);\n    return 0;\n}`,
      solutionHint: 'size_t aligned_size = (size + 7) & ~7; if (a->offset + aligned_size > ARENA_SIZE) return NULL; void *ptr = &a->buffer[a->offset]; a->offset += aligned_size; return ptr;'
    },
    {
      id: 'c-mod-8',
      title: 'Module 8: Binary Expression Tree Evaluator',
      difficulty: 'Hard',
      category: 'C',
      description: 'Construct a binary expression tree from operators and operands and recursively evaluate the mathematical result supporting operators +, -, *, /.',
      constraints: ['Division by zero handling', 'Time Complexity: O(n) where n is total tree nodes'],
      sampleInputs: [
        { input: 'Tree: (3 + 7) * 4', output: '40' }
      ],
      starterCode: `#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\ntypedef struct ExpNode {\n    char op; // '\\0' if operand\n    int val;\n    struct ExpNode *left;\n    struct ExpNode *right;\n} ExpNode;\n\nint evaluate_tree(ExpNode *root) {\n    if (!root) return 0;\n    if (!root->left && !root->right) return root->val;\n    // TODO: Recursively evaluate left and right subtrees and apply root->op\n    \n    return 0;\n}\n\nint main() {\n    ExpNode n1 = {'\\0', 3, NULL, NULL};\n    ExpNode n2 = {'\\0', 7, NULL, NULL};\n    ExpNode add = {'+', 0, &n1, &n2};\n    ExpNode n3 = {'\\0', 4, NULL, NULL};\n    ExpNode mul = {'*', 0, &add, &n3};\n\n    printf("Evaluated Result: %d\\n", evaluate_tree(&mul)); // Expected: 40\n    return 0;\n}`,
      solutionHint: 'int l = evaluate_tree(root->left); int r = evaluate_tree(root->right); if (root->op == "+") return l + r; if (root->op == "-") return l - r; if (root->op == "*") return l * r; if (root->op == "/") return r != 0 ? l / r : 0;'
    }
  ],

  'cpp': [
    {
      id: 'cpp-mod-1',
      title: 'Module 1: Two Sum with std::unordered_map',
      difficulty: 'Easy',
      category: 'C++',
      description: 'Implement twoSum(const std::vector<int>& nums, int target) using std::unordered_map to find the 2 indices that sum up to target in O(n) time.',
      constraints: ['Time Complexity: O(n)', 'Return empty vector if no pair exists'],
      sampleInputs: [
        { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }
      ],
      starterCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(const std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    // TODO: Find complement target - nums[i] in O(n) time\n    \n    return {};\n}\n\nint main() {\n    std::vector<int> nums = {2, 7, 11, 15};\n    auto res = twoSum(nums, 9);\n    std::cout << "Indices: [" << res[0] << ", " << res[1] << "]\\n";\n    return 0;\n}`,
      solutionHint: 'for (int i = 0; i < nums.size(); i++) { int diff = target - nums[i]; if (seen.count(diff)) return {seen[diff], i}; seen[nums[i]] = i; } return {};'
    },
    {
      id: 'cpp-mod-2',
      title: 'Module 2: RAII Dynamic Array Resource Wrapper',
      difficulty: 'Easy',
      category: 'C++',
      description: 'Build a SimpleVector<T> class following RAII principles with constructor, destructor (freeing dynamic memory), push_back, and operator[].',
      constraints: ['Manage raw heap buffer with new[] and delete[]', 'Double capacity upon buffer overflow'],
      sampleInputs: [
        { input: 'push_back(10), push_back(20), push_back(30)', output: 'Size: 3, Element 2: 30' }
      ],
      starterCode: `#include <iostream>\n#include <algorithm>\n\ntemplate<typename T>\nclass SimpleVector {\nprivate:\n    T* data;\n    size_t size;\n    size_t capacity;\npublic:\n    SimpleVector() : data(new T[2]), size(0), capacity(2) {}\n    ~SimpleVector() { delete[] data; }\n    \n    void push_back(const T& val) {\n        // TODO: Resize buffer if full and append element\n        \n    }\n\n    T& operator[](size_t idx) { return data[idx]; }\n    size_t getSize() const { return size; }\n};\n\nint main() {\n    SimpleVector<int> vec;\n    vec.push_back(10); vec.push_back(20); vec.push_back(30);\n    std::cout << "Vector Size: " << vec.getSize() << ", Element 2: " << vec[2] << "\\n";\n    return 0;\n}`,
      solutionHint: 'if (size == capacity) { capacity *= 2; T* next = new T[capacity]; for (size_t i = 0; i < size; i++) next[i] = data[i]; delete[] data; data = next; } data[size++] = val;'
    },
    {
      id: 'cpp-mod-3',
      title: 'Module 3: Custom UniquePtr Smart Pointer (Rule of 5)',
      difficulty: 'Medium',
      category: 'C++',
      description: 'Implement a lightweight UniquePtr<T> with exclusive ownership semantics, move constructor, move assignment operator, and deleted copy operations.',
      constraints: ['Disable copy constructor and copy assignment', 'Support std::move ownership transfer'],
      sampleInputs: [
        { input: 'UniquePtr<int> p1(new int(42)); UniquePtr<int> p2 = std::move(p1);', output: '*p2 is 42, p1.get() is nullptr' }
      ],
      starterCode: `#include <iostream>\n#include <utility>\n\ntemplate<typename T>\nclass UniquePtr {\nprivate:\n    T* ptr;\npublic:\n    explicit UniquePtr(T* p = nullptr) : ptr(p) {}\n    ~UniquePtr() { delete ptr; }\n\n    UniquePtr(const UniquePtr&) = delete;\n    UniquePtr& operator=(const UniquePtr&) = delete;\n\n    // TODO: Implement move constructor and move assignment operator\n    \n    T& operator*() const { return *ptr; }\n    T* operator->() const { return ptr; }\n    T* get() const { return ptr; }\n};\n\nint main() {\n    UniquePtr<int> p1(new int(42));\n    UniquePtr<int> p2 = std::move(p1);\n    std::cout << "P2 Value: " << *p2 << ", P1 is null: " << (p1.get() == nullptr) << "\\n";\n    return 0;\n}`,
      solutionHint: 'UniquePtr(UniquePtr&& other) noexcept : ptr(other.ptr) { other.ptr = nullptr; } UniquePtr& operator=(UniquePtr&& other) noexcept { if (this != &other) { delete ptr; ptr = other.ptr; other.ptr = nullptr; } return *this; }'
    },
    {
      id: 'cpp-mod-4',
      title: 'Module 4: LRU Cache with STL List & Hash Map',
      difficulty: 'Medium',
      category: 'C++',
      description: 'Design an LRUCache with get(key) and put(key, val) running in O(1) time using std::list and std::unordered_map storing list iterators.',
      constraints: ['get and put both execute in O(1) average time', 'Capacity >= 1'],
      sampleInputs: [
        { input: 'put(1, 100), put(2, 200), get(1), put(3, 300)', output: 'get(2) returns -1' }
      ],
      starterCode: `#include <iostream>\n#include <list>\n#include <unordered_map>\n\nclass LRUCache {\nprivate:\n    int capacity;\n    std::list<std::pair<int, int>> items;\n    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> cache;\npublic:\n    LRUCache(int cap) : capacity(cap) {}\n\n    int get(int key) {\n        // TODO: Move to front of list and return value or -1\n        \n        return -1;\n    }\n\n    void put(int key, int value) {\n        // TODO: Update or insert at front; evict back if size > capacity\n        \n    }\n};\n\nint main() {\n    LRUCache lru(2);\n    lru.put(1, 100); lru.put(2, 200);\n    std::cout << "Get 1: " << lru.get(1) << "\\n";\n    lru.put(3, 300); // evicts key 2\n    std::cout << "Get 2 (should be -1): " << lru.get(2) << "\\n";\n    return 0;\n}`,
      solutionHint: 'if (!cache.count(key)) return -1; items.splice(items.begin(), items, cache[key]); return cache[key]->second;'
    },
    {
      id: 'cpp-mod-5',
      title: 'Module 5: Thread-Safe Concurrent Queue with std::mutex',
      difficulty: 'Medium',
      category: 'C++',
      description: 'Implement a ConcurrentQueue<T> supporting push(item) and pop() using std::mutex, std::unique_lock, and std::condition_variable.',
      constraints: ['Thread-safe across multiple concurrent threads', 'pop() blocks until item is available'],
      sampleInputs: [
        { input: 'push(10), push(20), pop(), pop()', output: 'Popped 10, then 20' }
      ],
      starterCode: `#include <iostream>\n#include <queue>\n#include <mutex>\n#include <condition_variable>\n\ntemplate<typename T>\nclass ConcurrentQueue {\nprivate:\n    std::queue<T> q;\n    mutable std::mutex mtx;\n    std::condition_variable cv;\npublic:\n    void push(T val) {\n        // TODO: Lock mutex, push to queue, and notify_one\n        \n    }\n\n    T pop() {\n        // TODO: Wait until !q.empty(), pop front and return\n        \n        return T();\n    }\n};\n\nint main() {\n    ConcurrentQueue<int> cq;\n    cq.push(10);\n    cq.push(20);\n    std::cout << "Popped: " << cq.pop() << ", Popped: " << cq.pop() << "\\n";\n    return 0;\n}`,
      solutionHint: 'void push(T val) { std::lock_guard<std::mutex> lock(mtx); q.push(val); cv.notify_one(); } T pop() { std::unique_lock<std::mutex> lock(mtx); cv.wait(lock, [this]{ return !q.empty(); }); T val = q.front(); q.pop(); return val; }'
    },
    {
      id: 'cpp-mod-6',
      title: 'Module 6: constexpr Fibonacci & Template Metaprogramming',
      difficulty: 'Hard',
      category: 'C++',
      description: 'Implement a compile-time Fibonacci sequence computation using C++ constexpr functions and template metaprogramming.',
      constraints: ['Evaluated at compile-time when assigned to constexpr variable', 'Handle n = 0, 1 base cases'],
      sampleInputs: [
        { input: 'constexpr_fib(10)', output: '55' }
      ],
      starterCode: `#include <iostream>\n\nconstexpr unsigned long long constexpr_fib(int n) {\n    // TODO: Compile-time constexpr Fibonacci computation\n    if (n <= 0) return 0;\n    if (n == 1) return 1;\n    unsigned long long a = 0, b = 1;\n    for (int i = 2; i <= n; i++) {\n        unsigned long long c = a + b;\n        a = b;\n        b = c;\n    }\n    return b;\n}\n\nint main() {\n    constexpr unsigned long long fib10 = constexpr_fib(10);\n    std::cout << "Compile-Time Fib(10): " << fib10 << "\\n";\n    return 0;\n}`,
      solutionHint: 'Use iterative constexpr loop or compile-time recursive template struct Fib<N> { static constexpr int value = Fib<N-1>::value + Fib<N-2>::value; };'
    },
    {
      id: 'cpp-mod-7',
      title: 'Module 7: Trie Prefix Tree with Word Search and Autocomplete',
      difficulty: 'Hard',
      category: 'C++',
      description: 'Implement a Trie class supporting insert(word), search(word), and startsWith(prefix) using a 26-pointer child array and boolean isEndOfWord flag.',
      constraints: ['Input strings contain lowercase English letters', 'Time Complexity: O(length of word) for all operations'],
      sampleInputs: [
        { input: 'insert("apple"), search("apple"), search("app"), startsWith("app")', output: '1, 0, 1' }
      ],
      starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n\nclass Trie {\nprivate:\n    struct TrieNode {\n        TrieNode* children[26] = {nullptr};\n        bool isEndOfWord = false;\n    };\n    TrieNode* root;\npublic:\n    Trie() : root(new TrieNode()) {}\n\n    void insert(const std::string& word) {\n        // TODO: Traverse and create nodes for characters\n        \n    }\n\n    bool search(const std::string& word) {\n        // TODO: Traverse characters and verify isEndOfWord\n        \n        return false;\n    }\n\n    bool startsWith(const std::string& prefix) {\n        // TODO: Traverse characters and return true if path exists\n        \n        return false;\n    }\n};\n\nint main() {\n    Trie trie;\n    trie.insert("apple");\n    std::cout << "Search apple: " << trie.search("apple") << "\\n";   // 1\n    std::cout << "Search app: " << trie.search("app") << "\\n";       // 0\n    std::cout << "Prefix app: " << trie.startsWith("app") << "\\n";   // 1\n    return 0;\n}`,
      solutionHint: 'TrieNode* curr = root; for (char c : word) { int idx = c - "a"; if (!curr->children[idx]) curr->children[idx] = new TrieNode(); curr = curr->children[idx]; } curr->isEndOfWord = true;'
    },
    {
      id: 'cpp-mod-8',
      title: 'Module 8: Dijkstra Shortest Path Algorithm (Adjacency List)',
      difficulty: 'Hard',
      category: 'C++',
      description: 'Implement dijkstra(n, edges, src) returning the shortest distance from src to all vertices using std::priority_queue with min-heap comparator.',
      constraints: ['Vertices: 1 to 50,000, Edges: 1 to 200,000', 'Time Complexity: O(E log V)'],
      sampleInputs: [
        { input: 'edges = [[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5]], src = 0', output: 'dist = [0, 3, 1, 4]' }
      ],
      starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n#include <climits>\n\nstd::vector<int> dijkstra(int n, const std::vector<std::vector<int>>& edges, int src) {\n    std::vector<std::vector<std::pair<int, int>>> adj(n);\n    for (const auto& e : edges) {\n        adj[e[0]].push_back({e[1], e[2]});\n    }\n    std::vector<int> dist(n, INT_MAX);\n    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;\n\n    // TODO: Initialize dist[src] = 0 and process shortest paths with priority queue\n    \n    return dist;\n}\n\nint main() {\n    std::vector<std::vector<int>> edges = {\n        {0, 1, 4}, {0, 2, 1}, {2, 1, 2}, {1, 3, 1}, {2, 3, 5}\n    };\n    auto d = dijkstra(4, edges, 0);\n    std::cout << "Shortest distances from 0: ";\n    for (int x : d) std::cout << x << " ";\n    std::cout << "\\n";\n    return 0;\n}`,
      solutionHint: 'dist[src] = 0; pq.push({0, src}); while (!pq.empty()) { auto [d, u] = pq.top(); pq.pop(); if (d > dist[u]) continue; for (auto [v, w] : adj[u]) { if (dist[u] + w < dist[v]) { dist[v] = dist[u] + w; pq.push({dist[v], v}); } } } return dist;'
    }
  ],

  'c++': [
    {
      id: 'cpp-mod-1',
      title: 'Module 1: Two Sum with std::unordered_map',
      difficulty: 'Easy',
      category: 'C++',
      description: 'Implement twoSum(const std::vector<int>& nums, int target) using std::unordered_map to find the 2 indices that sum up to target in O(n) time.',
      constraints: ['Time Complexity: O(n)', 'Return empty vector if no pair exists'],
      sampleInputs: [
        { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }
      ],
      starterCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(const std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    // TODO: Find complement target - nums[i] in O(n) time\n    \n    return {};\n}\n\nint main() {\n    std::vector<int> nums = {2, 7, 11, 15};\n    auto res = twoSum(nums, 9);\n    std::cout << "Indices: [" << res[0] << ", " << res[1] << "]\\n";\n    return 0;\n}`,
      solutionHint: 'for (int i = 0; i < nums.size(); i++) { int diff = target - nums[i]; if (seen.count(diff)) return {seen[diff], i}; seen[nums[i]] = i; } return {};'
    }
  ],

  'typescript': [
    {
      id: 'ts-mod-1',
      title: 'Module 1: Discriminated Union Event Processor',
      difficulty: 'Easy',
      category: 'TypeScript',
      description: 'Implement processEvent(event: UserEvent): string with exhaustive switch-case type narrowing across login, logout, and purchase action types.',
      constraints: ['Strict TypeScript discriminated union pattern', 'Compile-time exhaustiveness check'],
      sampleInputs: [
        { input: '{ type: "purchase", userId: "u1", amount: 49.99, item: "Pro Pass" }', output: '"User u1 purchased Pro Pass for $49.99"' }
      ],
      starterCode: `type LoginEvent = { type: 'login'; userId: string; timestamp: number };\ntype LogoutEvent = { type: 'logout'; userId: string };\ntype PurchaseEvent = { type: 'purchase'; userId: string; amount: number; item: string };\n\ntype UserEvent = LoginEvent | LogoutEvent | PurchaseEvent;\n\nfunction processEvent(event: UserEvent): string {\n  // TODO: Exhaustive type narrowing with TypeScript pattern matching\n  switch (event.type) {\n    case 'login':\n      return \`User \${event.userId} logged in at \${event.timestamp}\`;\n    default:\n      return 'Unknown event';\n  }\n}\n\nconsole.log(processEvent({ type: 'purchase', userId: 'user-101', amount: 49.99, item: 'Pro Pass' }));`,
      solutionHint: 'case "purchase": return `User ${event.userId} purchased ${event.item} for $${event.amount}`; case "logout": return `User ${event.userId} logged out`;'
    },
    {
      id: 'ts-mod-2',
      title: 'Module 2: Generic Key-Value Map Builder',
      difficulty: 'Easy',
      category: 'TypeScript',
      description: 'Implement arrayToMap<T, K extends keyof T>(items: T[], keyField: K): Map<T[K], T> producing a strongly typed Map indexed by the specified object property.',
      constraints: ['Preserve generic type inference T and key constraint K extends keyof T', 'Return ES6 Map'],
      sampleInputs: [
        { input: 'users = [{ id: "u1", name: "Alice" }], key = "id"', output: 'Map containing "u1" => user object' }
      ],
      starterCode: `function arrayToMap<T, K extends keyof T>(items: T[], keyField: K): Map<T[K], T> {\n  const map = new Map<T[K], T>();\n  // TODO: Index each item in map by item[keyField]\n  \n  return map;\n}\n\nconst users = [\n  { id: 'u1', name: 'Alice', role: 'admin' },\n  { id: 'u2', name: 'Bob', role: 'engineer' }\n];\nconst userMap = arrayToMap(users, 'id');\nconsole.log('User u1:', userMap.get('u1'));`,
      solutionHint: 'for (const item of items) { map.set(item[keyField], item); } return map;'
    },
    {
      id: 'ts-mod-3',
      title: 'Module 3: Finite State Machine with Type-Safe State Transitions',
      difficulty: 'Medium',
      category: 'TypeScript',
      description: 'Build a generic StateMachine class with transition(event) that enforces valid state transitions according to a typed state machine schema and throws an error on invalid transitions.',
      constraints: ['Enforce strict state transition lookup table', 'Throw descriptive Error on invalid state transition'],
      sampleInputs: [
        { input: 'fsm.transition("FETCH") -> fsm.transition("RESOLVE")', output: '"loading" -> "success"' }
      ],
      starterCode: `type State = 'idle' | 'loading' | 'success' | 'error';\ntype Event = 'FETCH' | 'RESOLVE' | 'REJECT' | 'RETRY';\n\nclass StateMachine {\n  private state: State = 'idle';\n  private transitions: Record<State, Partial<Record<Event, State>>> = {\n    idle: { FETCH: 'loading' },\n    loading: { RESOLVE: 'success', REJECT: 'error' },\n    success: { FETCH: 'loading' },\n    error: { RETRY: 'loading' }\n  };\n\n  transition(event: Event): State {\n    // TODO: Verify valid transition and update state or throw Error\n    \n    return this.state;\n  }\n\n  getState(): State { return this.state; }\n}\n\nconst fsm = new StateMachine();\nconsole.log('Next:', fsm.transition('FETCH'));   // loading\nconsole.log('Next:', fsm.transition('RESOLVE')); // success`,
      solutionHint: 'const nextState = this.transitions[this.state]?.[event]; if (!nextState) throw new Error(`Invalid transition from ${this.state} on ${event}`); this.state = nextState; return this.state;'
    },
    {
      id: 'ts-mod-4',
      title: 'Module 4: Deep Immutability Object Freeze Guard',
      difficulty: 'Medium',
      category: 'TypeScript',
      description: 'Implement deepFreeze<T extends object>(obj: T): Readonly<T> recursively freezing all nested objects and arrays with TypeScript recursive type support.',
      constraints: ['Deeply freeze all nested objects and arrays', 'Return object with Readonly type'],
      sampleInputs: [
        { input: 'deepFreeze({ api: { endpoint: "https://..." } })', output: 'Deeply frozen immutable object' }
      ],
      starterCode: `function deepFreeze<T extends object>(obj: T): Readonly<T> {\n  // TODO: Recursively call Object.freeze on all object properties\n  \n  return Object.freeze(obj);\n}\n\nconst config = { api: { endpoint: 'https://skillverse.com', timeout: 5000 }, tags: ['prod', 'v1'] };\nconst frozen = deepFreeze(config);\nconsole.log('Frozen object endpoint:', frozen.api.endpoint);`,
      solutionHint: 'Object.keys(obj).forEach(prop => { const val = (obj as any)[prop]; if (val && typeof val === "object" && !Object.isFrozen(val)) deepFreeze(val); }); return Object.freeze(obj);'
    },
    {
      id: 'ts-mod-5',
      title: 'Module 5: Type-Safe Strongly-Typed Event Bus',
      difficulty: 'Medium',
      category: 'TypeScript',
      description: 'Design a TypedEventBus<TEventMap> where on and emit strictly enforce payload types matching registered event keys with an unsubscribe callback.',
      constraints: ['Type safe event-to-payload mappings', 'Return unsubscribe cleanup function'],
      sampleInputs: [
        { input: 'bus.on("badge:unlocked", ({ badgeId, xp }) => ...)', output: 'Dispatches typed payload safely' }
      ],
      starterCode: `interface AppEvents {\n  'user:signup': { userId: string; email: string };\n  'badge:unlocked': { badgeId: string; xp: number };\n}\n\nclass TypedEventBus<TMap extends Record<string, any>> {\n  private listeners: { [K in keyof TMap]?: Array<(payload: TMap[K]) => void> } = {};\n\n  on<K extends keyof TMap>(event: K, listener: (payload: TMap[K]) => void): () => void {\n    // TODO: Register listener and return unsubscribe callback\n    \n    return () => {};\n  }\n\n  emit<K extends keyof TMap>(event: K, payload: TMap[K]): void {\n    // TODO: Dispatch payload to listeners\n    \n  }\n}\n\nconst bus = new TypedEventBus<AppEvents>();\nbus.on('badge:unlocked', (data) => console.log(\`Unlocked badge \${data.badgeId} (+\${data.xp} XP)\`));\nbus.emit('badge:unlocked', { badgeId: 'boss-slayer', xp: 500 });`,
      solutionHint: 'on: (this.listeners[event] = this.listeners[event] || []).push(listener); return () => { this.listeners[event] = this.listeners[event]?.filter(l => l !== listener); }; emit: (this.listeners[event] || []).forEach(l => l(payload));'
    },
    {
      id: 'ts-mod-6',
      title: 'Module 6: Type-Safe Nested Property Getter (Lodash Get Polyfill)',
      difficulty: 'Hard',
      category: 'TypeScript',
      description: 'Implement safeGet<T, TFallback>(obj: any, path: string, fallback: TFallback): T | TFallback that parses dot-separated paths with bracketed array indices.',
      constraints: ['Parse array index notation like "skills[0].name"', 'Return default fallback on undefined intermediate keys'],
      sampleInputs: [
        { input: 'safeGet({ user: { skills: [{ name: "TS" }] } }, "user.skills[0].name", "N/A")', output: '"TS"' }
      ],
      starterCode: `function safeGet<T = any, TFallback = undefined>(\n  target: any,\n  path: string,\n  fallback?: TFallback\n): T | TFallback {\n  // TODO: Parse path like "user.profile.skills[0].name" and traverse target\n  \n  return fallback as TFallback;\n}\n\nconst state = { user: { profile: { skills: [{ name: 'TypeScript' }] } } };\nconsole.log('Skill:', safeGet(state, 'user.profile.skills[0].name', 'N/A'));\nconsole.log('Missing:', safeGet(state, 'user.settings.theme', 'dark'));`,
      solutionHint: 'const keys = path.replace(/\\[(\\w+)\\]/g, ".$1").replace(/^\\./, "").split("."); let curr = target; for (const k of keys) { if (curr === null || curr === undefined) return fallback as TFallback; curr = curr[k]; } return (curr !== undefined ? curr : fallback) as T | TFallback;'
    },
    {
      id: 'ts-mod-7',
      title: 'Module 7: Reactive Observable State Store with Selector Subscriptions',
      difficulty: 'Hard',
      category: 'TypeScript',
      description: 'Build createStore<T>(initialState) returning getState(), setState(updater), and select(selector, listener) firing only when the selected slice value changes.',
      constraints: ['Memoize selector output and prevent redundant callbacks', 'Return unsubscribe cleanup function'],
      sampleInputs: [
        { input: 'store.select(s => s.counter, count => ...)', output: 'Fires only when counter changes, ignores unrelated state mutations' }
      ],
      starterCode: `type Listener<T> = (val: T) => void;\n\nfunction createStore<T extends object>(initialState: T) {\n  let state = initialState;\n  const subscribers = new Set<() => void>();\n\n  return {\n    getState: (): T => state,\n    setState: (updater: Partial<T> | ((prev: T) => Partial<T>)): void => {\n      const next = typeof updater === 'function' ? updater(state) : updater;\n      state = { ...state, ...next };\n      subscribers.forEach(fn => fn());\n    },\n    select: <S>(selector: (s: T) => S, callback: (selected: S) => void) => {\n      let prev = selector(state);\n      const check = () => {\n        const current = selector(state);\n        if (current !== prev) {\n          prev = current;\n          callback(current);\n        }\n      };\n      subscribers.add(check);\n      return () => subscribers.delete(check);\n    }\n  };\n}\n\nconst store = createStore({ counter: 0, user: 'Alex' });\nconst unsub = store.select(s => s.counter, count => console.log('Counter changed to:', count));\nstore.setState(s => ({ counter: s.counter + 1 }));\nstore.setState({ user: 'Jordan' }); // Selector won\'t re-trigger\nstore.setState(s => ({ counter: s.counter + 1 }));`,
      solutionHint: 'Maintain a Set of change listener callbacks and check selector equality in subscriber runner.'
    },
    {
      id: 'ts-mod-8',
      title: 'Module 8: Circuit Breaker Fault-Tolerant Async Wrapper',
      difficulty: 'Hard',
      category: 'TypeScript',
      description: 'Implement CircuitBreaker class with states CLOSED, OPEN, and HALF_OPEN, tripping open when failure threshold is reached within resetTimeoutMs window.',
      constraints: ['Auto reset to HALF_OPEN after timeout', 'Fast-fail without executing action when breaker is OPEN'],
      sampleInputs: [
        { input: 'breaker.execute(failingService) x 2 (threshold = 2)', output: 'Throws error immediately without network call on 3rd attempt' }
      ],
      starterCode: `type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';\n\nclass CircuitBreaker {\n  private state: CircuitState = 'CLOSED';\n  private failureCount = 0;\n  private lastFailureTime = 0;\n\n  constructor(\n    private threshold: number = 2,\n    private resetTimeoutMs: number = 500\n  ) {}\n\n  async execute<T>(action: () => Promise<T>): Promise<T> {\n    // TODO: Check OPEN state and timeout; execute action, track failures and trip breaker\n    \n    return action();\n  }\n\n  getState(): CircuitState { return this.state; }\n}\n\nconst breaker = new CircuitBreaker(2, 500);\nconst flakyService = async (succeed: boolean) => {\n  if (!succeed) throw new Error('Service Unavailable');\n  return 'OK Response';\n};\n\nasync function test() {\n  try { await breaker.execute(() => flakyService(false)); } catch (e) {}\n  try { await breaker.execute(() => flakyService(false)); } catch (e) {}\n  console.log('Breaker state after 2 failures:', breaker.getState()); // OPEN\n}\ntest();`,
      solutionHint: 'if (this.state === "OPEN") { if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) this.state = "HALF_OPEN"; else throw new Error("Circuit is OPEN"); } try { const res = await action(); this.state = "CLOSED"; this.failureCount = 0; return res; } catch (err) { this.failureCount++; this.lastFailureTime = Date.now(); if (this.failureCount >= this.threshold) this.state = "OPEN"; throw err; }'
    }
  ],

  'go': [
    {
      id: 'go-mod-1',
      title: 'Module 1: Slice Deduplication with Seen Map',
      difficulty: 'Easy',
      category: 'Go',
      description: 'Implement Deduplicate(nums []int) []int that removes duplicate integers from a Go slice while preserving original order in O(n) time using a map[int]bool.',
      constraints: ['Time Complexity: O(n)', 'Preserve initial appearance order', 'Return allocated slice'],
      sampleInputs: [
        { input: '[4, 2, 4, 3, 2, 1, 5, 3]', output: '[4, 2, 3, 1, 5]' }
      ],
      starterCode: `package main\n\nimport "fmt"\n\nfunc Deduplicate(nums []int) []int {\n    seen := make(map[int]bool)\n    result := make([]int, 0, len(nums))\n    // TODO: Iterate nums, check seen map, and append unique values\n    \n    return result\n}\n\nfunc main() {\n    data := []int{4, 2, 4, 3, 2, 1, 5, 3};\n    fmt.Println("Deduplicated:", Deduplicate(data));\n}`,
      solutionHint: 'for _, n := range nums { if !seen[n] { seen[n] = true; result = append(result, n); } } return result;'
    },
    {
      id: 'go-mod-2',
      title: 'Module 2: Interface Polymorphism & Struct Methods',
      difficulty: 'Easy',
      category: 'Go',
      description: 'Define a Shape interface with Area() float64 and implement it on Rectangle and Circle structs.',
      constraints: ['Strict Go interface contracts', 'Use math.Pi for circle area'],
      sampleInputs: [
        { input: 'Rectangle{10, 5}, Circle{3}', output: 'Total Area = 78.27' }
      ],
      starterCode: `package main\n\nimport (\n    "fmt"\n    "math"\n)\n\ntype Shape interface {\n    Area() float64\n}\n\ntype Rectangle struct {\n    Width, Height float64\n}\n\nfunc (r Rectangle) Area() float64 {\n    // TODO: Return width * height\n    return 0.0\n}\n\ntype Circle struct {\n    Radius float64\n}\n\nfunc (c Circle) Area() float64 {\n    // TODO: Return math.Pi * radius^2\n    return 0.0\n}\n\nfunc PrintTotalArea(shapes []Shape) float64 {\n    total := 0.0\n    for _, s := range shapes {\n        total += s.Area()\n    }\n    return total\n}\n\nfunc main() {\n    shapes := []Shape{\n        Rectangle{Width: 10, Height: 5},\n        Circle{Radius: 3},\n    }\n    fmt.Printf("Total Area: %.2f\\n", PrintTotalArea(shapes))\n}`,
      solutionHint: 'func (r Rectangle) Area() float64 { return r.Width * r.Height } func (c Circle) Area() float64 { return math.Pi * c.Radius * c.Radius }'
    },
    {
      id: 'go-mod-3',
      title: 'Module 3: Fan-Out Concurrency with sync.WaitGroup and Channels',
      difficulty: 'Medium',
      category: 'Go',
      description: 'Implement ProcessBatch(items []int, workerCount int) []int that processes integer items concurrently using worker goroutines, sync.WaitGroup, and buffered channels.',
      constraints: ['Prevent deadlocks and race conditions', 'Close channels properly', 'Collect all results safely'],
      sampleInputs: [
        { input: 'items = [1, 2, 3, 4, 5, 6], workers = 3', output: 'Processed slice with 6 squared values' }
      ],
      starterCode: `package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc ProcessBatch(items []int, workerCount int) []int {\n    jobs := make(chan int, len(items))\n    results := make(chan int, len(items))\n    var wg sync.WaitGroup\n\n    // TODO: Spawn workerCount worker goroutines\n    \n    // TODO: Send all items into jobs and close channel\n    \n    // TODO: Wait for workers and collect results into slice\n    \n    return nil\n}\n\nfunc main() {\n    numbers := []int{1, 2, 3, 4, 5, 6}\n    res := ProcessBatch(numbers, 3)\n    fmt.Println("Processed results count:", len(res))\n}`,
      solutionHint: 'for w := 0; w < workerCount; w++ { wg.Add(1); go func() { defer wg.Done(); for j := range jobs { results <- j * j } }() }; for _, item := range items { jobs <- item }; close(jobs); wg.Wait(); close(results);'
    },
    {
      id: 'go-mod-4',
      title: 'Module 4: Concurrent Cache with sync.RWMutex',
      difficulty: 'Medium',
      category: 'Go',
      description: 'Create a thread-safe ConcurrentCache struct with Get(key string) (string, bool) and Set(key, val string) methods guarded by sync.RWMutex.',
      constraints: ['Use RLock for Get (multiple concurrent readers)', 'Use Lock for Set (exclusive writer)'],
      sampleInputs: [
        { input: 'cache.Set("lang", "Go"); cache.Get("lang")', output: '"Go", true' }
      ],
      starterCode: `package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype ConcurrentCache struct {\n    mu    sync.RWMutex\n    store map[string]string\n}\n\nfunc NewCache() *ConcurrentCache {\n    return &ConcurrentCache{store: make(map[string]string)}\n}\n\nfunc (c *ConcurrentCache) Get(key string) (string, bool) {\n    // TODO: Acquire RLock and return value\n    \n    return "", false\n}\n\nfunc (c *ConcurrentCache) Set(key, val string) {\n    // TODO: Acquire Lock and store value\n    \n}\n\nfunc main() {\n    cache := NewCache()\n    cache.Set("framework", "SkillVerse")\n    val, found := cache.Get("framework")\n    fmt.Printf("Found: %v, Value: %s\\n", found, val)\n}`,
      solutionHint: 'Get: c.mu.RLock(); defer c.mu.RUnlock(); val, ok := c.store[key]; return val, ok. Set: c.mu.Lock(); defer c.mu.Unlock(); c.store[key] = val'
    },
    {
      id: 'go-mod-5',
      title: 'Module 5: Generator Stream Pipeline (Filter & Square)',
      difficulty: 'Medium',
      category: 'Go',
      description: 'Build a composable channel pipeline: GenerateNumbers(nums ...int) <-chan int and SquareStream(in <-chan int) <-chan int.',
      constraints: ['Unbuffered channels for lazy streaming', 'Close channels when producers finish'],
      sampleInputs: [
        { input: 'SquareStream(GenerateNumbers(2, 3, 4))', output: '4, 9, 16' }
      ],
      starterCode: `package main\n\nimport "fmt"\n\nfunc GenerateNumbers(nums ...int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for _, n := range nums {\n            out <- n\n        }\n        close(out)\n    }()\n    return out\n}\n\nfunc SquareStream(in <-chan int) <-chan int {\n    out := make(chan int)\n    // TODO: Read from 'in', square numbers, send to 'out', and close when done\n    \n    return out\n}\n\nfunc main() {\n    stream := SquareStream(GenerateNumbers(2, 3, 4, 5))\n    for val := range stream {\n        fmt.Printf("%d ", val)\n    }\n    fmt.Println()\n}`,
      solutionHint: 'go func() { for n := range in { out <- n * n }; close(out) }(); return out'
    },
    {
      id: 'go-mod-6',
      title: 'Module 6: Context Timeout & Worker Cancellation',
      difficulty: 'Hard',
      category: 'Go',
      description: 'Implement FetchWithTimeout(ctx context.Context, url string, timeout time.Duration) (string, error) using context.WithTimeout and select statement.',
      constraints: ['Return ctx.Err() on cancellation/timeout', 'Never leak worker goroutines'],
      sampleInputs: [
        { input: 'FetchWithTimeout(ctx, "https://api...", 50ms)', output: 'Returns context.DeadlineExceeded error on delay' }
      ],
      starterCode: `package main\n\nimport (\n    "context"\n    "errors"\n    "fmt"\n    "time"\n)\n\nfunc FetchWithTimeout(ctx context.Context, url string, timeout time.Duration) (string, error) {\n    ctx, cancel := context.WithTimeout(ctx, timeout)\n    defer cancel()\n\n    resultChan := make(chan string, 1)\n\n    go func() {\n        // Simulate work\n        time.Sleep(100 * time.Millisecond)\n        resultChan <- "Payload from " + url\n    }()\n\n    // TODO: Select on resultChan and ctx.Done()\n    \n    return "", errors.New("timeout")\n}\n\nfunc main() {\n    ctx := context.Background()\n    res, err := FetchWithTimeout(ctx, "https://api.skillverse.com", 200*time.Millisecond)\n    fmt.Println("Result:", res, "Err:", err)\n}`,
      solutionHint: 'select { case res := <-resultChan: return res, nil; case <-ctx.Done(): return "", ctx.Err() }'
    },
    {
      id: 'go-mod-7',
      title: 'Module 7: Token Bucket Rate Limiter with Ticker',
      difficulty: 'Hard',
      category: 'Go',
      description: 'Design a RateLimiter struct with Allow() bool that refills tokens at a fixed interval using a buffered channel and time.Ticker.',
      constraints: ['Non-blocking Allow() calls', 'Clean shutdown of background ticker goroutine'],
      sampleInputs: [
        { input: 'Allow() called 3 times on capacity=2', output: 'true, true, false' }
      ],
      starterCode: `package main\n\nimport (\n    "fmt"\n    "time"\n)\n\ntype RateLimiter struct {\n    tokens chan struct{}\n    ticker *time.Ticker\n    stop   chan struct{}\n}\n\nfunc NewRateLimiter(ratePerSec int, burstCapacity int) *RateLimiter {\n    rl := &RateLimiter{\n        tokens: make(chan struct{}, burstCapacity),\n        ticker: time.NewTicker(time.Second / time.Duration(ratePerSec)),\n        stop:   make(chan struct{}),\n    }\n    for i := 0; i < burstCapacity; i++ {\n        rl.tokens <- struct{}{}\n    }\n    // TODO: Start refill goroutine reading ticker and adding tokens without blocking\n    \n    return rl\n}\n\nfunc (rl *RateLimiter) Allow() bool {\n    select {\n    case <-rl.tokens:\n        return true\n    default:\n        return false\n    }\n}\n\nfunc main() {\n    rl := NewRateLimiter(5, 2)\n    fmt.Println("Req 1 allowed:", rl.Allow())\n    fmt.Println("Req 2 allowed:", rl.Allow())\n    fmt.Println("Req 3 allowed (burst exceeded):", rl.Allow())\n}`,
      solutionHint: 'go func() { for { select { case <-rl.ticker.C: select { case rl.tokens <- struct{}{}: default: }; case <-rl.stop: return } } }()'
    },
    {
      id: 'go-mod-8',
      title: 'Module 8: Consistent Hash Ring with Virtual Nodes',
      difficulty: 'Hard',
      category: 'Go',
      description: 'Implement a ConsistentHashRing struct with AddNode(node string) and GetNode(key string) string mapping keys to closest ring position using binary search.',
      constraints: ['Uniform distribution with virtual node replicates', 'Time Complexity: O(log(N * V)) lookup'],
      sampleInputs: [
        { input: 'AddNode("server-A"), GetNode("user-101")', output: '"server-A"' }
      ],
      starterCode: `package main\n\nimport (\n    "fmt"\n    "hash/fnv"\n    "sort"\n    "strconv"\n)\n\ntype HashRing struct {\n    vnodes  int\n    ring    []uint32\n    nodeMap map[uint32]string\n}\n\nfunc NewHashRing(vnodes int) *HashRing {\n    return &HashRing{\n        vnodes:  vnodes,\n        nodeMap: make(map[uint32]string),\n    }\n}\n\nfunc hashKey(key string) uint32 {\n    h := fnv.New32a()\n    h.Write([]byte(key))\n    return h.Sum32()\n}\n\nfunc (h *HashRing) AddNode(node string) {\n    // TODO: Hash vnodes for this node and insert into sorted ring\n    \n}\n\nfunc (h *HashRing) GetNode(key string) string {\n    // TODO: Hash key, binary search next largest hash on ring with wraparound\n    \n    return ""\n}\n\nfunc main() {\n    hr := NewHashRing(3)\n    hr.AddNode("server-A")\n    hr.AddNode("server-B")\n    fmt.Println("Node for user-101:", hr.GetNode("user-101"))\n    fmt.Println("Node for session-42:", hr.GetNode("session-42"))\n}`,
      solutionHint: 'idx := sort.Search(len(h.ring), func(i int) bool { return h.ring[i] >= hash }); if idx == len(h.ring) { idx = 0 }; return h.nodeMap[h.ring[idx]]'
    }
  ],

  'rust': [
    {
      id: 'rust-mod-1',
      title: 'Module 1: Ownership & Slicing Vector Sum',
      difficulty: 'Easy',
      category: 'Rust',
      description: 'Implement fn sum_even_numbers(numbers: &[i32]) -> i32 taking a borrowed slice and returning the sum of all even integers using iterators.',
      constraints: ['Borrow with slice reference &[i32] without taking ownership', 'Use idiomatic iterator chaining'],
      sampleInputs: [
        { input: '[1, 2, 3, 4, 5, 6, 7, 8]', output: '20' }
      ],
      starterCode: `fn sum_even_numbers(numbers: &[i32]) -> i32 {\n    // TODO: Filter even numbers and sum with iterator\n    \n    0\n}\n\nfn main() {\n    let nums = vec![1, 2, 3, 4, 5, 6, 7, 8];\n    println!("Sum of evens: {}", sum_even_numbers(&nums));\n}`,
      solutionHint: 'numbers.iter().filter(|&&x| x % 2 == 0).sum()'
    },
    {
      id: 'rust-mod-2',
      title: 'Module 2: Pattern Matching & Custom Option Reducer',
      difficulty: 'Easy',
      category: 'Rust',
      description: 'Implement fn find_first_greater(slice: &[i32], threshold: i32) -> Option<usize> returning the index of the first element strictly greater than threshold.',
      constraints: ['Return Option<usize> (Some(idx) or None)', 'Time Complexity: O(n)'],
      sampleInputs: [
        { input: 'items = [10, 25, 40, 55, 70], threshold = 30', output: 'Some(2)' }
      ],
      starterCode: `fn find_first_greater(slice: &[i32], threshold: i32) -> Option<usize> {\n    // TODO: Find first index where element > threshold\n    \n    None\n}\n\nfn main() {\n    let items = [10, 25, 40, 55, 70];\n    match find_first_greater(&items, 30) {\n        Some(idx) => println!("Found index: {}", idx),\n        None => println!("None found"),\n    }\n}`,
      solutionHint: 'slice.iter().position(|&x| x > threshold)'
    },
    {
      id: 'rust-mod-3',
      title: 'Module 3: Trait Implementation & Summary Formatter',
      difficulty: 'Medium',
      category: 'Rust',
      description: 'Define a Summary trait with summarize(&self) -> String and implement it on Article and Tweet structs.',
      constraints: ['Implement trait contract for multiple distinct structs', 'Return formatted owned String'],
      sampleInputs: [
        { input: 'Article { title: "Rust Concurrency", author: "SkillVerse", ... }', output: '"Rust Concurrency by SkillVerse"' }
      ],
      starterCode: `pub trait Summary {\n    fn summarize(&self) -> String;\n}\n\npub struct Article {\n    pub title: String,\n    pub author: String,\n    pub content: String,\n}\n\nimpl Summary for Article {\n    fn summarize(&self) -> String {\n        // TODO: Format: "{title} by {author}"\n        format!("")\n    }\n}\n\npub struct Tweet {\n    pub username: String,\n    pub text: String,\n}\n\nimpl Summary for Tweet {\n    fn summarize(&self) -> String {\n        // TODO: Format: "@{username}: {text}"\n        format!("")\n    }\n}\n\nfn main() {\n    let post = Article {\n        title: String::from("Rust Concurrency"),\n        author: String::from("SkillVerse"),\n        content: String::from("..."),\n    };\n    println!("Summary: {}", post.summarize());\n}`,
      solutionHint: 'format!("{} by {}", self.title, self.author) and format!("@{}: {}", self.username, self.text)'
    },
    {
      id: 'rust-mod-4',
      title: 'Module 4: Robust Error Propagation with Result and ? Operator',
      difficulty: 'Medium',
      category: 'Rust',
      description: 'Create an AppError enum with EmptyInput and ParseFailed variants and write fn parse_and_validate(raw: &str) -> Result<u32, AppError>.',
      constraints: ['Return custom Result<u32, AppError>', 'Handle string trimming and boundary checks [1..100]'],
      sampleInputs: [
        { input: '"42"', output: 'Ok(42)' },
        { input: '""', output: 'Err(AppError::EmptyInput)' }
      ],
      starterCode: `#[derive(Debug, PartialEq)]\npub enum AppError {\n    EmptyInput,\n    ParseFailed,\n    OutOfRange(u32),\n}\n\npub fn parse_and_validate(raw: &str) -> Result<u32, AppError> {\n    if raw.trim().is_empty() {\n        return Err(AppError::EmptyInput);\n    }\n    // TODO: Parse string to u32, validate between 1 and 100\n    \n    Err(AppError::ParseFailed)\n}\n\nfn main() {\n    println!("Result '42': {:?}", parse_and_validate("42"));\n    println!("Result '': {:?}", parse_and_validate(""));\n    println!("Result '200': {:?}", parse_and_validate("200"));\n}`,
      solutionHint: 'let val = raw.trim().parse::<u32>().map_err(|_| AppError::ParseFailed)?; if val < 1 || val > 100 { return Err(AppError::OutOfRange(val)); } Ok(val)'
    },
    {
      id: 'rust-mod-5',
      title: 'Module 5: Thread-Safe State Sharing with Arc and Mutex',
      difficulty: 'Medium',
      category: 'Rust',
      description: 'Implement fn parallel_word_count(chunks: Vec<String>) -> usize using std::sync::Arc, std::sync::Mutex, and std::thread::spawn.',
      constraints: ['Spawn threads safely with move closures', 'Lock mutex and accumulate total counts'],
      sampleInputs: [
        { input: 'chunks = ["Rust is fast", "SkillVerse is awesome"]', output: '6' }
      ],
      starterCode: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\npub fn parallel_word_count(chunks: Vec<String>) -> usize {\n    let total = Arc::new(Mutex::new(0));\n    let mut handles = vec![];\n\n    for chunk in chunks {\n        let total_clone = Arc::clone(&total);\n        let handle = thread::spawn(move || {\n            let count = chunk.split_whitespace().count();\n            // TODO: Lock mutex and add count to total\n            \n        });\n        handles.push(handle);\n    }\n\n    for h in handles {\n        h.join().unwrap();\n    }\n\n    let final_count = *total.lock().unwrap();\n    final_count\n}\n\nfn main() {\n    let text_chunks = vec![\n        String::from("Rust is blazingly fast and memory-efficient"),\n        String::from("SkillVerse provides interactive hands-on coding"),\n    ];\n    println!("Total Words: {}", parallel_word_count(text_chunks));\n}`,
      solutionHint: 'let mut lock = total_clone.lock().unwrap(); *lock += count;'
    },
    {
      id: 'rust-mod-6',
      title: 'Module 6: Interior Mutability Tree Node with Rc and RefCell',
      difficulty: 'Hard',
      category: 'Rust',
      description: 'Implement a TreeNode struct with val: i32, left: Option<Rc<RefCell<TreeNode>>>, and right: Option<Rc<RefCell<TreeNode>>> with in_order_traversal.',
      constraints: ['Safely borrow RefCell interior mutability without runtime panic', 'Return ordered Vec<i32>'],
      sampleInputs: [
        { input: 'Tree: 2 (left: 1, right: 3)', output: '[1, 2, 3]' }
      ],
      starterCode: `use std::rc::Rc;\nuse std::cell::RefCell;\n\npub struct TreeNode {\n    pub val: i32,\n    pub left: Option<Rc<RefCell<TreeNode>>>,\n    pub right: Option<Rc<RefCell<TreeNode>>>,\n}\n\nimpl TreeNode {\n    pub fn new(val: i32) -> Rc<RefCell<Self>> {\n        Rc::new(RefCell::new(TreeNode { val, left: None, right: None }))\n    }\n}\n\npub fn in_order_traversal(root: &Option<Rc<RefCell<TreeNode>>>) -> Vec<i32> {\n    let mut result = vec![];\n    // TODO: Traverse left, push val, traverse right\n    \n    result\n}\n\nfn main() {\n    let root = TreeNode::new(2);\n    root.borrow_mut().left = Some(TreeNode::new(1));\n    root.borrow_mut().right = Some(TreeNode::new(3));\n    println!("In-order: {:?}", in_order_traversal(&Some(root)));\n}`,
      solutionHint: 'if let Some(node) = root { let n = node.borrow(); result.extend(in_order_traversal(&n.left)); result.push(n.val); result.extend(in_order_traversal(&n.right)); }'
    },
    {
      id: 'rust-mod-7',
      title: 'Module 7: Zero-Copy String Tokenizer with Lifetimes',
      difficulty: 'Hard',
      category: 'Rust',
      description: 'Build a struct Tokenizer<\'a> with next_token(&mut self) -> Option<&\'a str> that yields token string slices directly referencing the underlying buffer with zero heap allocations.',
      constraints: ['Explicit lifetime parameter <\'a>', 'Zero allocation iterator pattern'],
      sampleInputs: [
        { input: '"struct Point { x: i32 }"', output: 'Tokens: "struct", "Point", "{", "x:", "i32", "}"' }
      ],
      starterCode: `pub struct Tokenizer<'a> {\n    input: &'a str,\n    pos: usize,\n}\n\nimpl<'a> Tokenizer<'a> {\n    pub fn new(input: &'a str) -> Self {\n        Tokenizer { input, pos: 0 }\n    }\n\n    pub fn next_token(&mut self) -> Option<&'a str> {\n        // TODO: Skip whitespace, find next token boundary, return slice without allocating String\n        \n        None\n    }\n}\n\nfn main() {\n    let source = "struct Point { x: i32, y: i32 }";\n    let mut tokenizer = Tokenizer::new(source);\n    while let Some(tok) = tokenizer.next_token() {\n        println!("Token: '{}'", tok);\n    }\n}`,
      solutionHint: 'let remaining = &self.input[self.pos..]; let trimmed = remaining.trim_start(); let offset = self.input.len() - remaining.len() + (remaining.len() - trimmed.len()); let end = trimmed.find(char::is_whitespace).unwrap_or(trimmed.len()); self.pos = offset + end; Some(&self.input[offset..offset+end])'
    },
    {
      id: 'rust-mod-8',
      title: 'Module 8: Atomic SpinLock with std::sync::atomic::AtomicBool',
      difficulty: 'Hard',
      category: 'Rust',
      description: 'Implement a SpinLock struct using AtomicBool with Ordering::Acquire and Ordering::Release for lock and unlock operations.',
      constraints: ['Correct memory ordering semantics (Acquire/Release)', 'Spin-wait without thread sleeping'],
      sampleInputs: [
        { input: 'lock.lock(); critical_section(); lock.unlock();', output: 'Mutual exclusion across 3 concurrent threads' }
      ],
      starterCode: `use std::sync::atomic::{AtomicBool, Ordering};\nuse std::sync::Arc;\nuse std::thread;\n\npub struct SpinLock {\n    locked: AtomicBool,\n}\n\nimpl SpinLock {\n    pub fn new() -> Self {\n        SpinLock { locked: AtomicBool::new(false) }\n    }\n\n    pub fn lock(&self) {\n        // TODO: Spin loop while compare_exchange or swap returns true\n        \n    }\n\n    pub fn unlock(&self) {\n        // TODO: Store false with Ordering::Release\n        \n    }\n}\n\nfn main() {\n    let lock = Arc::new(SpinLock::new());\n    let mut handles = vec![];\n    for i in 0..3 {\n        let l = Arc::clone(&lock);\n        handles.push(thread::spawn(move || {\n            l.lock();\n            println!("Thread {} in critical section", i);\n            l.unlock();\n        }));\n    }\n    for h in handles { h.join().unwrap(); }\n}`,
      solutionHint: 'lock: while self.locked.swap(true, Ordering::Acquire) { std::hint::spin_loop(); } unlock: self.locked.store(false, Ordering::Release);'
    }
  ],

  'kotlin': [
    {
      id: 'kt-mod-1',
      title: 'Module 1: Null-Safe String Parser with Elvis Operator',
      difficulty: 'Easy',
      category: 'Kotlin',
      description: 'Implement fun parseDisplayName(fullName: String?, defaultTag: String): String using safe call (?.) and Elvis (?:) operators.',
      constraints: ['Safe calls (?.) and Elvis operator (?:)', 'Handle null, empty, and whitespace-only strings'],
      sampleInputs: [
        { input: '"  alex dev  ", "Anonymous"', output: '"ALEX DEV"' },
        { input: 'null, "Guest"', output: '"Guest"' }
      ],
      starterCode: `fun parseDisplayName(fullName: String?, defaultTag: String): String {\n    // TODO: Return trimmed upper-case name if present and non-blank, else defaultTag\n    \n    return defaultTag\n}\n\nfun main() {\n    println(parseDisplayName("  alex dev  ", "Anonymous")) // "ALEX DEV"\n    println(parseDisplayName(null, "Guest User"))          // "Guest User"\n    println(parseDisplayName("   ", "Guest User"))         // "Guest User"\n}`,
      solutionHint: 'return fullName?.trim()?.takeIf { it.isNotBlank() }?.uppercase() ?: defaultTag'
    },
    {
      id: 'kt-mod-2',
      title: 'Module 2: Data Class Transformations & Destructuring',
      difficulty: 'Easy',
      category: 'Kotlin',
      description: 'Define data class UserProfile(id: String, name: String, xp: Int, isPro: Boolean) and implement fun promoteToPro(user: UserProfile, bonusXp: Int): UserProfile using .copy().',
      constraints: ['Immutable data class', 'Use .copy() method for state update'],
      sampleInputs: [
        { input: 'UserProfile("u-1", "Jordan", 450, false), bonusXp = 500', output: 'UserProfile("u-1", "Jordan", 950, true)' }
      ],
      starterCode: `data class UserProfile(\n    val id: String,\n    val name: String,\n    val xp: Int,\n    val isPro: Boolean\n)\n\nfun promoteToPro(user: UserProfile, bonusXp: Int): UserProfile {\n    // TODO: Return copied user with isPro = true and xp = user.xp + bonusXp\n    \n    return user\n}\n\nfun main() {\n    val u1 = UserProfile("u-1", "Jordan", 450, false)\n    val proUser = promoteToPro(u1, 500)\n    val (id, name, xp, isPro) = proUser\n    println("Promoted $name ($id): $xp XP, Pro: $isPro")\n}`,
      solutionHint: 'return user.copy(isPro = true, xp = user.xp + bonusXp)'
    },
    {
      id: 'kt-mod-3',
      title: 'Module 3: Sealed Class State Machine & Extension Functions',
      difficulty: 'Medium',
      category: 'Kotlin',
      description: 'Create a sealed class NetworkResult<out T> (Success, Error, Loading) and write an extension function <T> NetworkResult<T>.getOrDefault(fallback: T): T.',
      constraints: ['Exhaustive when expressions without else branch', 'Generic type parameter variance'],
      sampleInputs: [
        { input: 'NetworkResult.Success("Certificate").getOrDefault("Default")', output: '"Certificate"' },
        { input: 'NetworkResult.Error("404", 404).getOrDefault("Default")', output: '"Default"' }
      ],
      starterCode: `sealed class NetworkResult<out T> {\n    data class Success<out T>(val data: T) : NetworkResult<T>()\n    data class Error(val message: String, val code: Int) : NetworkResult<Nothing>()\n    object Loading : NetworkResult<Nothing>()\n}\n\nfun <T> NetworkResult<T>.getOrDefault(fallback: T): T {\n    // TODO: Exhaustive when branch returning data for Success and fallback for Error/Loading\n    \n    return fallback\n}\n\nfun main() {\n    val res1: NetworkResult<String> = NetworkResult.Success("SkillVerse Certificate")\n    val res2: NetworkResult<String> = NetworkResult.Error("Not Found", 404)\n    println("Result 1: \${res1.getOrDefault("Default")}")\n    println("Result 2: \${res2.getOrDefault("Default")}")\n}`,
      solutionHint: 'return when (this) { is NetworkResult.Success -> this.data; is NetworkResult.Error, NetworkResult.Loading -> fallback }'
    },
    {
      id: 'kt-mod-4',
      title: 'Module 4: Higher-Order Inline Builder Function',
      difficulty: 'Medium',
      category: 'Kotlin',
      description: 'Build a custom HTML/DSL-like builder using lambda with receiver: fun buildReport(block: ReportBuilder.() -> Unit): String.',
      constraints: ['Lambda with receiver ReportBuilder.() -> Unit', 'String concatenation'],
      sampleInputs: [
        { input: 'buildReport { title("Report"); section("A", "Body") }', output: '"# Report\\n\\n## A\\nBody"' }
      ],
      starterCode: `class ReportBuilder {\n    private val lines = mutableListOf<String>()\n\n    fun title(text: String) { lines.add("# $text") }\n    fun section(name: String, content: String) { lines.add("## $name\\n$content") }\n    fun build(): String = lines.joinToString("\\n\\n")\n}\n\nfun buildReport(block: ReportBuilder.() -> Unit): String {\n    // TODO: Instantiate ReportBuilder, apply block, and return build() string\n    \n    return ""\n}\n\nfun main() {\n    val report = buildReport {\n        title("SkillVerse Module Completion")\n        section("Kotlin Track", "8/8 modules completed with 100% quiz score.")\n    }\n    println(report)\n}`,
      solutionHint: 'val builder = ReportBuilder(); builder.block(); return builder.build()'
    },
    {
      id: 'kt-mod-5',
      title: 'Module 5: Concurrent Async Processing with CoroutineScope',
      difficulty: 'Medium',
      category: 'Kotlin',
      description: 'Implement suspend fun fetchAllMetrics(endpoints: List<String>): List<String> using coroutineScope and async/awaitAll to fetch simulated network calls concurrently.',
      constraints: ['Structured concurrency with coroutineScope', 'Non-blocking parallel task fan-out'],
      sampleInputs: [
        { input: '["api/users", "api/courses", "api/quests"]', output: 'List of 3 fetched response strings' }
      ],
      starterCode: `import kotlinx.coroutines.*\n\nsuspend fun simulateFetch(endpoint: String): String {\n    delay(50)\n    return "Data from $endpoint"\n}\n\nsuspend fun fetchAllMetrics(endpoints: List<String>): List<String> = coroutineScope {\n    // TODO: Map endpoints to async deferred tasks and awaitAll\n    \n    emptyList()\n}\n\nfun main() = runBlocking {\n    val targets = listOf("api/users", "api/courses", "api/quests")\n    val results = fetchAllMetrics(targets)\n    println("Fetched \${results.size} endpoints: $results")\n}`,
      solutionHint: 'endpoints.map { async { simulateFetch(it) } }.awaitAll()'
    },
    {
      id: 'kt-mod-6',
      title: 'Module 6: Reactive Event Processing with Kotlin Flow',
      difficulty: 'Hard',
      category: 'Kotlin',
      description: 'Implement fun processNumberFlow(numbers: List<Int>): Flow<Int> emitting numbers, filtering odd numbers, and transforming with .map { it * 10 }.',
      constraints: ['Cold stream Kotlin Flow', 'Declarative flow operator chaining'],
      sampleInputs: [
        { input: '[1, 2, 3, 4, 5, 6]', output: 'Emits 20, 40, 60' }
      ],
      starterCode: `import kotlinx.coroutines.flow.*\nimport kotlinx.coroutines.runBlocking\n\nfun processNumberFlow(numbers: List<Int>): Flow<Int> = flow {\n    for (n in numbers) {\n        emit(n)\n    }\n}.filter { it % 2 == 0 }\n .map { it * 10 }\n\nfun main() = runBlocking {\n    val input = listOf(1, 2, 3, 4, 5, 6)\n    println("Flow Output:")\n    processNumberFlow(input).collect { value ->\n        print("$value ")\n    }\n    println()\n}`,
      solutionHint: 'flow { for (n in numbers) emit(n) }.filter { it % 2 == 0 }.map { it * 10 }'
    },
    {
      id: 'kt-mod-7',
      title: 'Module 7: Custom Property Delegate with Change History',
      difficulty: 'Hard',
      category: 'Kotlin',
      description: 'Create a custom ReadWriteProperty delegate class ObservableHistory<T>(initialValue: T) that logs and tracks all previous values of a property.',
      constraints: ['Implement ReadWriteProperty<Any?, T>', 'Retain chronological mutation list'],
      sampleInputs: [
        { input: 'session.score = 100; session.score = 250;', output: 'session.score is 250' }
      ],
      starterCode: `import kotlin.properties.ReadWriteProperty\nimport kotlin.reflect.KProperty\n\nclass ObservableHistory<T>(initialValue: T) : ReadWriteProperty<Any?, T> {\n    private var value: T = initialValue\n    val history = mutableListOf<T>(initialValue)\n\n    override fun getValue(thisRef: Any?, property: KProperty<*>): T = value\n\n    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {\n        // TODO: Append to history and update value\n        \n    }\n}\n\nclass GameSession {\n    var score: Int by ObservableHistory(0)\n}\n\nfun main() {\n    val session = GameSession()\n    session.score = 100\n    session.score = 250\n    println("Current Score: \${session.score}")\n}`,
      solutionHint: 'this.value = value; history.add(value);'
    },
    {
      id: 'kt-mod-8',
      title: 'Module 8: Covariant & Contravariant Event Dispatcher',
      difficulty: 'Hard',
      category: 'Kotlin',
      description: 'Design an EventConsumer<in T> interface and EventSource<out T> interface demonstrating declaration-site variance and consumer piping.',
      constraints: ['Declaration-site variance (in T for consumer, out T for producer)', 'Type safety across subtype hierarchies'],
      sampleInputs: [
        { input: 'queue.consume(UserLoginEvent("Alex")); queue.poll()', output: 'Polled event: UserLoginEvent' }
      ],
      starterCode: `open class AppEvent(val timestamp: Long = System.currentTimeMillis())\nclass UserLoginEvent(val username: String) : AppEvent()\nclass QuestCompleteEvent(val questId: String, val xp: Int) : AppEvent()\n\ninterface EventConsumer<in T> {\n    fun consume(event: T)\n}\n\ninterface EventSource<out T> {\n    fun poll(): T?\n}\n\nclass GenericEventQueue<T : AppEvent> : EventConsumer<T>, EventSource<T> {\n    private val queue = ArrayDeque<T>()\n\n    override fun consume(event: T) {\n        queue.addLast(event)\n    }\n\n    override fun poll(): T? = if (queue.isNotEmpty()) queue.removeFirst() else null\n}\n\nfun main() {\n    val q = GenericEventQueue<AppEvent>()\n    q.consume(UserLoginEvent("Alex"))\n    q.consume(QuestCompleteEvent("quest-1", 250))\n    println("Polled event 1: \${q.poll()?.javaClass?.simpleName}")\n    println("Polled event 2: \${q.poll()?.javaClass?.simpleName}")\n}`,
      solutionHint: 'Declaration-site variance in T enables EventConsumer<AppEvent> to accept UserLoginEvent; out T enables safe polymorphic reading.'
    }
  ],

  'php': [
    {
      id: 'php-mod-1',
      title: 'Module 1: Associative Array Filtering & Value Mapping',
      difficulty: 'Easy',
      category: 'PHP',
      description: 'Implement filterAndDoubleEvens(array $nums): array using array_filter and array_map with arrow functions (fn) in modern PHP 8.',
      constraints: ['Filter out odd values and multiply even numbers by 2', 'Re-index returned array with array_values'],
      sampleInputs: [
        { input: '[1, 2, 3, 4, 5, 6]', output: '[4, 8, 12]' }
      ],
      starterCode: `<?php\n\nfunction filterAndDoubleEvens(array $nums): array {\n    // TODO: Filter even numbers and map each to value * 2\n    \n    return [];\n}\n\n$sample = [1, 2, 3, 4, 5, 6];\nprint_r(filterAndDoubleEvens($sample));`,
      solutionHint: 'return array_values(array_map(fn($n) => $n * 2, array_filter($nums, fn($n) => $n % 2 === 0)));'
    },
    {
      id: 'php-mod-2',
      title: 'Module 2: Strict Typed JSON API Envelope Formatter',
      difficulty: 'Easy',
      category: 'PHP',
      description: 'Implement formatApiResponse(bool $success, mixed $data, ?string $error = null): string returning a valid JSON string envelope with timestamp.',
      constraints: ['Strict typing with declare(strict_types=1)', 'Return valid JSON via json_encode'],
      sampleInputs: [
        { input: 'formatApiResponse(true, ["user" => "Alex", "xp" => 450])', output: 'JSON envelope with success, data, error, timestamp' }
      ],
      starterCode: `<?php\ndeclare(strict_types=1);\n\nfunction formatApiResponse(bool $success, mixed $data, ?string $error = null): string {\n    $payload = [\n        'success' => $success,\n        'data' => $data,\n        'error' => $error,\n        'timestamp' => time()\n    ];\n    // TODO: Encode $payload as JSON and return string\n    \n    return json_encode($payload);\n}\n\necho formatApiResponse(true, ['user' => 'Alex', 'xp' => 450]);`,
      solutionHint: 'return json_encode($payload, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);'
    },
    {
      id: 'php-mod-3',
      title: 'Module 3: PHP 8 Match Expression & Order State Machine',
      difficulty: 'Medium',
      category: 'PHP',
      description: 'Write getNextOrderStatus(string $currentStatus, string $action): string using modern PHP 8 match expressions to transition between pending, processing, completed, and cancelled.',
      constraints: ['Use PHP 8 match ($action) construct', 'Throw InvalidArgumentException on illegal transitions'],
      sampleInputs: [
        { input: '"pending", "PAY"', output: '"processing"' },
        { input: '"processing", "SHIP"', output: '"completed"' }
      ],
      starterCode: `<?php\ndeclare(strict_types=1);\n\nfunction getNextOrderStatus(string $currentStatus, string $action): string {\n    // TODO: Use match expression to transition status safely\n    \n    return $currentStatus;\n}\n\necho "Next: " . getNextOrderStatus("pending", "PAY") . "\\n";       // "processing"\necho "Next: " . getNextOrderStatus("processing", "SHIP") . "\\n";   // "completed"`,
      solutionHint: 'return match ($action) { "PAY" => $currentStatus === "pending" ? "processing" : throw new InvalidArgumentException(), "SHIP" => $currentStatus === "processing" ? "completed" : throw new InvalidArgumentException(), "CANCEL" => "cancelled", default => $currentStatus };'
    },
    {
      id: 'php-mod-4',
      title: 'Module 4: PSR Middleware Request Pipeline',
      difficulty: 'Medium',
      category: 'PHP',
      description: 'Implement a MiddlewarePipeline class where handle(array $request, callable $coreHandler) passes request through an array of callable middlewares in onion architecture.',
      constraints: ['Support chaining arbitrary middleware callables', 'Preserve mutated request payload'],
      sampleInputs: [
        { input: '$pipeline->add(authMiddleware)->handle($req, $coreHandler)', output: 'Request processed through all layers' }
      ],
      starterCode: `<?php\n\nclass MiddlewarePipeline {\n    private array $middlewares = [];\n\n    public function add(callable $middleware): self {\n        $this->middlewares[] = $middleware;\n        return $this;\n    }\n\n    public function handle(array $request, callable $destination): array {\n        // TODO: Wrap $destination in reverse through $middlewares\n        \n        return $destination($request);\n    }\n}\n\n$pipeline = new MiddlewarePipeline();\n$pipeline->add(function($req, $next) {\n    $req['authenticated'] = true;\n    return $next($req);\n});\n\n$result = $pipeline->handle(['ip' => '127.0.0.1'], fn($r) => array_merge($r, ['status' => 'OK']));\nprint_r($result);`,
      solutionHint: 'let runner = array_reduce(array_reverse($this->middlewares), fn($next, $mw) => fn($req) => $mw($req, $next), $destination); return $runner($request);'
    },
    {
      id: 'php-mod-5',
      title: 'Module 5: Generator Stream for Batch Processing (Yield)',
      difficulty: 'Medium',
      category: 'PHP',
      description: 'Implement function chunkGenerator(iterable $items, int $chunkSize): Generator that yields arrays of $chunkSize in O(1) memory without creating full nested lists in memory.',
      constraints: ['Memory Complexity: O(1)', 'Yield array batches lazily'],
      sampleInputs: [
        { input: 'range(1, 10), chunkSize = 3', output: '[1,2,3], [4,5,6], [7,8,9], [10]' }
      ],
      starterCode: `<?php\n\nfunction chunkGenerator(iterable $items, int $chunkSize): Generator {\n    $chunk = [];\n    // TODO: Iterate items, accumulate in $chunk, and yield when count reaches $chunkSize\n    \n}\n\n$numbers = range(1, 10);\nforeach (chunkGenerator($numbers, 3) as $batch) {\n    echo "Batch: " . implode(", ", $batch) . "\\n";\n}`,
      solutionHint: 'foreach ($items as $item) { $chunk[] = $item; if (count($chunk) === $chunkSize) { yield $chunk; $chunk = []; } } if (!empty($chunk)) { yield $chunk; }'
    },
    {
      id: 'php-mod-6',
      title: 'Module 6: Auto-Wiring Dependency Injection Container (Reflection)',
      difficulty: 'Hard',
      category: 'PHP',
      description: 'Implement a Container class with get(string $class) that inspects constructor parameters via ReflectionClass and automatically resolves and instantiates dependencies recursively.',
      constraints: ['Use ReflectionClass and ReflectionParameter types', 'Handle classes without constructors'],
      sampleInputs: [
        { input: '$container->get(UserService::class)', output: 'Instantiates UserService with injected Database and Logger dependencies' }
      ],
      starterCode: `<?php\n\nclass Container {\n    private array $instances = [];\n\n    public function get(string $className): object {\n        if (isset($this->instances[$className])) {\n            return $this->instances[$className];\n        }\n\n        $reflector = new ReflectionClass($className);\n        $constructor = $reflector->getConstructor();\n        if (!$constructor) {\n            return new $className();\n        }\n\n        // TODO: Inspect constructor parameters, recursively resolve each type, and newInstanceArgs\n        \n        return $reflector->newInstance();\n    }\n}\n\nclass Logger {}\nclass Database { public function __construct(public Logger $logger) {} }\nclass UserService { public function __construct(public Database $db) {} }\n\n$c = new Container();\n$service = $c->get(UserService::class);\necho "Instantiated: " . get_class($service) . "\\n";`,
      solutionHint: '$dependencies = array_map(fn($param) => $this->get($param->getType()->getName()), $constructor->getParameters()); return $this->instances[$className] = $reflector->newInstanceArgs($dependencies);'
    },
    {
      id: 'php-mod-7',
      title: 'Module 7: PHP 8.1 Fiber Coroutine Task Scheduler',
      difficulty: 'Hard',
      category: 'PHP',
      description: 'Implement an AsyncScheduler class with enqueue(callable $task) and run() using PHP 8.1 Fiber to concurrently execute and resume cooperative tasks.',
      constraints: ['Use PHP 8.1 Fiber class', 'Cooperative multitasking with Fiber::suspend() and ->resume()'],
      sampleInputs: [
        { input: 'Enqueue two cooperative fibers', output: 'Interleaved execution across tasks' }
      ],
      starterCode: `<?php\n\nclass AsyncScheduler {\n    private SplQueue $queue;\n\n    public function __construct() {\n        $this->queue = new SplQueue();\n    }\n\n    public function enqueue(callable $task): void {\n        $fiber = new Fiber($task);\n        $this->queue->enqueue($fiber);\n    }\n\n    public function run(): void {\n        // TODO: While queue not empty, dequeue Fiber, start or resume it if not terminated, and re-enqueue if suspended\n        \n    }\n}\n\n$scheduler = new AsyncScheduler();\n$scheduler->enqueue(function() {\n    echo "Task 1: Step 1\\n";\n    Fiber::suspend();\n    echo "Task 1: Step 2 (Finished)\\n";\n});\n$scheduler->enqueue(function() {\n    echo "Task 2: Instant Run\\n";\n});\n$scheduler->run();`,
      solutionHint: 'while (!$this->queue->isEmpty()) { $fiber = $this->queue->dequeue(); if (!$fiber->isStarted()) { $fiber->start(); } elseif ($fiber->isSuspended()) { $fiber->resume(); } if ($fiber->isSuspended()) { $this->queue->enqueue($fiber); } }'
    },
    {
      id: 'php-mod-8',
      title: 'Module 8: Token Bucket Sliding Window Rate Limiter',
      difficulty: 'Hard',
      category: 'PHP',
      description: 'Build a SlidingWindowRateLimiter class with isAllowed(string $key, int $limit, int $windowSeconds): bool calculating request timestamps within the sliding window.',
      constraints: ['Sub-second accuracy using microtime(true)', 'Memory cleanup of expired timestamps'],
      sampleInputs: [
        { input: 'isAllowed("user-1", 2, 1) called 3 times', output: 'true, true, false' }
      ],
      starterCode: `<?php\n\nclass SlidingWindowRateLimiter {\n    private array $requests = [];\n\n    public function isAllowed(string $key, int $limit, int $windowSeconds): bool {\n        $now = microtime(true);\n        $cutoff = $now - $windowSeconds;\n\n        // TODO: Filter out timestamps older than $cutoff, check if count < $limit, add $now and return bool\n        \n        return true;\n    }\n}\n\n$limiter = new SlidingWindowRateLimiter();\necho "Req 1: " . ($limiter->isAllowed("user-1", 2, 1) ? "Allowed" : "Blocked") . "\\n";\necho "Req 2: " . ($limiter->isAllowed("user-1", 2, 1) ? "Allowed" : "Blocked") . "\\n";\necho "Req 3: " . ($limiter->isAllowed("user-1", 2, 1) ? "Allowed" : "Blocked") . "\\n";`,
      solutionHint: '$this->requests[$key] = array_values(array_filter($this->requests[$key] ?? [], fn($t) => $t > $cutoff)); if (count($this->requests[$key]) >= $limit) return false; $this->requests[$key][] = $now; return true;'
    }
  ],

  // --- DATA STRUCTURES & ALGORITHMS ---
  'arrays': [
    {
      id: 'arr-mod-1',
      title: 'Module 1: Two Sum Hash Map Lookup',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target in O(n) linear time.',
      constraints: ['Time Complexity: O(n)', 'Exactly one valid answer exists', 'Do not use same element twice'],
      sampleInputs: [
        { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }
      ],
      starterCode: `function twoSum(nums, target) {\n  const map = new Map();\n  // TODO: Iterate nums, compute complement target - num, and return [map.get(comp), i]\n  \n  return [];\n}\n\nconsole.log("Indices:", twoSum([2, 7, 11, 15], 9));`,
      solutionHint: 'for (let i = 0; i < nums.length; i++) { const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); }',
      languageVariants: {
        javascript: {
          starterCode: `function twoSum(nums, target) {\n  const map = new Map();\n  // TODO: Find complement target - nums[i]\n  \n  return [];\n}\n\nconsole.log("Indices:", twoSum([2, 7, 11, 15], 9));`,
          solutionHint: 'for (let i = 0; i < nums.length; i++) { const diff = target - nums[i]; if (map.has(diff)) return [map.get(diff), i]; map.set(nums[i], i); }'
        },
        python: {
          starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    # TODO: Iterate and find target - num in seen\n    \n    return []\n\nprint("Indices:", two_sum([2, 7, 11, 15], 9))`,
          solutionHint: 'for i, num in enumerate(nums): diff = target - num; if diff in seen: return [seen[diff], i]; seen[num] = i'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        // TODO: Find complement target - nums[i]\n        \n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println("Indices: " + Arrays.toString(res));\n    }\n}`,
          solutionHint: 'for (int i = 0; i < nums.length; i++) { int diff = target - nums[i]; if (map.containsKey(diff)) return new int[]{map.get(diff), i}; map.put(nums[i], i); }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nstd::vector<int> twoSum(const std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> seen;\n    // TODO: Find complement target - nums[i]\n    \n    return {};\n}\n\nint main() {\n    auto res = twoSum({2, 7, 11, 15}, 9);\n    std::cout << "Indices: [" << res[0] << ", " << res[1] << "]\\n";\n    return 0;\n}`,
          solutionHint: 'for (int i = 0; i < nums.size(); i++) { int diff = target - nums[i]; if (seen.count(diff)) return {seen[diff], i}; seen[nums[i]] = i; } return {};'
        }
      }
    },
    {
      id: 'arr-mod-2',
      title: 'Module 2: In-Place Duplicate Removal (Two Pointers)',
      difficulty: 'Easy',
      category: 'Arrays',
      description: 'Given an integer array nums sorted in non-decreasing order, remove duplicates in-place such that each unique element appears only once. Return number of unique elements.',
      constraints: ['Modify array in-place with O(1) extra memory', 'Preserve sorted order'],
      sampleInputs: [
        { input: 'nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]', output: 'k = 5, nums prefix = [0, 1, 2, 3, 4]' }
      ],
      starterCode: `function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let writeIdx = 1;\n  // TODO: Iterate readIdx from 1 to nums.length and write distinct values\n  \n  return writeIdx;\n}\n\nconst arr = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];\nconst k = removeDuplicates(arr);\nconsole.log("Unique count:", k, "Prefix:", arr.slice(0, k));`,
      solutionHint: 'for (let i = 1; i < nums.length; i++) { if (nums[i] !== nums[i - 1]) nums[writeIdx++] = nums[i]; } return writeIdx;',
      languageVariants: {
        javascript: {
          starterCode: `function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let writeIdx = 1;\n  // TODO: Iterate and write unique elements in-place\n  \n  return writeIdx;\n}\n\nconst arr = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];\nconst k = removeDuplicates(arr);\nconsole.log("Unique count:", k, "Prefix:", arr.slice(0, k));`,
          solutionHint: 'for (let i = 1; i < nums.length; i++) { if (nums[i] !== nums[i - 1]) nums[writeIdx++] = nums[i]; } return writeIdx;'
        },
        python: {
          starterCode: `def remove_duplicates(nums: list[int]) -> int:\n    if not nums: return 0\n    write_idx = 1\n    # TODO: Modify nums in-place and return unique count\n    \n    return write_idx\n\nnums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]\nk = remove_duplicates(nums)\nprint(f"Unique count: {k}, Prefix: {nums[:k]}")`,
          solutionHint: 'for i in range(1, len(nums)): if nums[i] != nums[i - 1]: nums[write_idx] = nums[i]; write_idx += 1'
        },
        java: {
          starterCode: `import java.util.Arrays;\n\npublic class Solution {\n    public static int removeDuplicates(int[] nums) {\n        if (nums.length == 0) return 0;\n        int writeIdx = 1;\n        // TODO: In-place two pointers\n        \n        return writeIdx;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};\n        int k = removeDuplicates(arr);\n        System.out.println("Unique count: " + k + ", Prefix: " + Arrays.toString(Arrays.copyOf(arr, k)));\n    }\n}`,
          solutionHint: 'for (int i = 1; i < nums.length; i++) { if (nums[i] != nums[i - 1]) nums[writeIdx++] = nums[i]; } return writeIdx;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nint removeDuplicates(std::vector<int>& nums) {\n    if (nums.empty()) return 0;\n    int writeIdx = 1;\n    // TODO: In-place two pointers\n    \n    return writeIdx;\n}\n\nint main() {\n    std::vector<int> nums = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};\n    int k = removeDuplicates(nums);\n    std::cout << "Unique count: " << k << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (size_t i = 1; i < nums.size(); i++) { if (nums[i] != nums[i - 1]) nums[writeIdx++] = nums[i]; } return writeIdx;'
        }
      }
    },
    {
      id: 'arr-mod-3',
      title: 'Module 3: Maximum Subarray Sum (Kadane Algorithm)',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Given an integer array nums, find the contiguous subarray with the largest sum, and return its sum in O(n) linear time.',
      constraints: ['Time Complexity: O(n)', 'Handle all-negative number arrays correctly'],
      sampleInputs: [
        { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6 ([4, -1, 2, 1])' }
      ],
      starterCode: `function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  // TODO: Loop from index 1 to nums.length, updating currentMax and maxSoFar\n  \n  return maxSoFar;\n}\n\nconsole.log("Max Subarray:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
      solutionHint: 'for (let i = 1; i < nums.length; i++) { currentMax = Math.max(nums[i], currentMax + nums[i]); maxSoFar = Math.max(maxSoFar, currentMax); } return maxSoFar;',
      languageVariants: {
        javascript: {
          starterCode: `function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  // TODO: Kadane algorithm\n  \n  return maxSoFar;\n}\n\nconsole.log("Max Subarray:", maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
          solutionHint: 'for (let i = 1; i < nums.length; i++) { currentMax = Math.max(nums[i], currentMax + nums[i]); maxSoFar = Math.max(maxSoFar, currentMax); }'
        },
        python: {
          starterCode: `def max_sub_array(nums: list[int]) -> int:\n    max_so_far = current_max = nums[0]\n    # TODO: Kadane's algorithm\n    \n    return max_so_far\n\nprint("Max Subarray:", max_sub_array([-2, 1, -3, 4, -1, 2, 1, -5, 4]))`,
          solutionHint: 'for num in nums[1:]: current_max = max(num, current_max + num); max_so_far = max(max_so_far, current_max)'
        },
        java: {
          starterCode: `public class Solution {\n    public static int maxSubArray(int[] nums) {\n        int maxSoFar = nums[0], currentMax = nums[0];\n        // TODO: Kadane's loop\n        \n        return maxSoFar;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Max: " + maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4}));\n    }\n}`,
          solutionHint: 'for (int i = 1; i < nums.length; i++) { currentMax = Math.max(nums[i], currentMax + nums[i]); maxSoFar = Math.max(maxSoFar, currentMax); }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint maxSubArray(const std::vector<int>& nums) {\n    int maxSoFar = nums[0], currentMax = nums[0];\n    // TODO: Kadane algorithm\n    \n    return maxSoFar;\n}\n\nint main() {\n    std::cout << "Max: " << maxSubArray({-2, 1, -3, 4, -1, 2, 1, -5, 4}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (size_t i = 1; i < nums.size(); i++) { currentMax = std::max(nums[i], currentMax + nums[i]); maxSoFar = std::max(maxSoFar, currentMax); }'
        }
      }
    },
    {
      id: 'arr-mod-4',
      title: 'Module 4: Container With Most Water (Two-Pointer)',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Given n non-negative integers height where each point represents a vertical line, find two lines that together with the x-axis form a container holding the maximum water.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', output: '49' }
      ],
      starterCode: `function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let maxWater = 0;\n  // TODO: Calculate area = min(height[left], height[right]) * (right - left), move smaller pointer\n  \n  return maxWater;\n}\n\nconsole.log("Max Water:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`,
      solutionHint: 'while (left < right) { const w = right - left; const h = Math.min(height[left], height[right]); maxWater = Math.max(maxWater, w * h); if (height[left] < height[right]) left++; else right--; }',
      languageVariants: {
        javascript: {
          starterCode: `function maxArea(height) {\n  let left = 0, right = height.length - 1;\n  let maxWater = 0;\n  // TODO: Two pointers inward scan\n  \n  return maxWater;\n}\n\nconsole.log("Max Water:", maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));`,
          solutionHint: 'while (left < right) { const area = Math.min(height[left], height[right]) * (right - left); maxWater = Math.max(maxWater, area); if (height[left] < height[right]) left++; else right--; }'
        },
        python: {
          starterCode: `def max_area(height: list[int]) -> int:\n    left, right = 0, len(height) - 1\n    max_water = 0\n    # TODO: Inward two pointers\n    \n    return max_water\n\nprint("Max Water:", max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))`,
          solutionHint: 'while left < right: area = min(height[left], height[right]) * (right - left); max_water = max(max_water, area); if height[left] < height[right]: left += 1; else: right -= 1'
        },
        java: {
          starterCode: `public class Solution {\n    public static int maxArea(int[] height) {\n        int left = 0, right = height.length - 1, maxWater = 0;\n        // TODO: Two pointers\n        \n        return maxWater;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Max Water: " + maxArea(new int[]{1, 8, 6, 2, 5, 4, 8, 3, 7}));\n    }\n}`,
          solutionHint: 'while (left < right) { int area = Math.min(height[left], height[right]) * (right - left); maxWater = Math.max(maxWater, area); if (height[left] < height[right]) left++; else right--; }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint maxArea(const std::vector<int>& height) {\n    int left = 0, right = height.size() - 1, maxWater = 0;\n    // TODO: Two pointers\n    \n    return maxWater;\n}\n\nint main() {\n    std::cout << "Max Water: " << maxArea({1, 8, 6, 2, 5, 4, 8, 3, 7}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'while (left < right) { int area = std::min(height[left], height[right]) * (right - left); maxWater = std::max(maxWater, area); if (height[left] < height[right]) left++; else right--; }'
        }
      }
    },
    {
      id: 'arr-mod-5',
      title: 'Module 5: Merge Overlapping Intervals',
      difficulty: 'Medium',
      category: 'Arrays',
      description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
      constraints: ['Sort intervals by start time in O(n log n)', 'Time Complexity: O(n log n)'],
      sampleInputs: [
        { input: '[[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' }
      ],
      starterCode: `function mergeIntervals(intervals) {\n  if (intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n\n  // TODO: Iterate remaining intervals and merge if current start <= previous end\n  \n  return merged;\n}\n\nconsole.log("Merged:", mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));`,
      solutionHint: 'for (let i = 1; i < intervals.length; i++) { const curr = intervals[i]; const last = merged[merged.length - 1]; if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]); else merged.push(curr); }',
      languageVariants: {
        javascript: {
          starterCode: `function mergeIntervals(intervals) {\n  if (intervals.length <= 1) return intervals;\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  // TODO: Merge overlapping intervals\n  \n  return merged;\n}\n\nconsole.log("Merged:", mergeIntervals([[1,3],[2,6],[8,10],[15,18]]));`,
          solutionHint: 'for (let i = 1; i < intervals.length; i++) { const curr = intervals[i]; const last = merged[merged.length - 1]; if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]); else merged.push(curr); }'
        },
        python: {
          starterCode: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:\n    if len(intervals) <= 1: return intervals\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    # TODO: Merge overlapping intervals\n    \n    return merged\n\nprint("Merged:", merge_intervals([[1,3],[2,6],[8,10],[15,18]]))`,
          solutionHint: 'for start, end in intervals[1:]: if start <= merged[-1][1]: merged[-1][1] = max(merged[-1][1], end); else: merged.append([start, end])'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int[][] merge(int[][] intervals) {\n        if (intervals.length <= 1) return intervals;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        merged.add(intervals[0]);\n        // TODO: Merge intervals\n        \n        return merged.toArray(new int[merged.size()][]);\n    }\n\n    public static void main(String[] args) {\n        int[][] res = merge(new int[][]{{1,3},{2,6},{8,10},{15,18}});\n        for (int[] row : res) System.out.print(Arrays.toString(row) + " ");\n        System.out.println();\n    }\n}`,
          solutionHint: 'for (int i = 1; i < intervals.length; i++) { int[] curr = intervals[i]; int[] last = merged.get(merged.size() - 1); if (curr[0] <= last[1]) last[1] = Math.max(last[1], curr[1]); else merged.add(curr); }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nstd::vector<std::vector<int>> merge(std::vector<std::vector<int>>& intervals) {\n    if (intervals.size() <= 1) return intervals;\n    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) { return a[0] < b[0]; });\n    std::vector<std::vector<int>> merged = {intervals[0]};\n    // TODO: Merge intervals\n    \n    return merged;\n}\n\nint main() {\n    std::vector<std::vector<int>> input = {{1,3},{2,6},{8,10},{15,18}};\n    auto res = merge(input);\n    std::cout << "Merged count: " << res.size() << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (size_t i = 1; i < intervals.size(); i++) { if (intervals[i][0] <= merged.back()[1]) merged.back()[1] = std::max(merged.back()[1], intervals[i][1]); else merged.push_back(intervals[i]); }'
        }
      }
    },
    {
      id: 'arr-mod-6',
      title: 'Module 6: Trapping Rain Water (Two Pointers)',
      difficulty: 'Hard',
      category: 'Arrays',
      description: 'Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining in O(n) time and O(1) space.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1) using two pointers'],
      sampleInputs: [
        { input: '[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]', output: '6' }
      ],
      starterCode: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let totalWater = 0;\n\n  // TODO: Process two pointers tracking leftMax and rightMax\n  \n  return totalWater;\n}\n\nconsole.log("Trapped Water:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));`,
      solutionHint: 'while (left < right) { if (height[left] < height[right]) { if (height[left] >= leftMax) leftMax = height[left]; else totalWater += leftMax - height[left]; left++; } else { if (height[right] >= rightMax) rightMax = height[right]; else totalWater += rightMax - height[right]; right--; } }',
      languageVariants: {
        javascript: {
          starterCode: `function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0, totalWater = 0;\n  // TODO: Inward two pointers tracking leftMax and rightMax\n  \n  return totalWater;\n}\n\nconsole.log("Trapped Water:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]));`,
          solutionHint: 'while (left < right) { if (height[left] < height[right]) { if (height[left] >= leftMax) leftMax = height[left]; else totalWater += leftMax - height[left]; left++; } else { if (height[right] >= rightMax) rightMax = height[right]; else totalWater += rightMax - height[right]; right--; } }'
        },
        python: {
          starterCode: `def trap(height: list[int]) -> int:\n    left, right = 0, len(height) - 1\n    left_max = right_max = total_water = 0\n    # TODO: Two pointers rain trap\n    \n    return total_water\n\nprint("Trapped Water:", trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]))`,
          solutionHint: 'while left < right: if height[left] < height[right]: if height[left] >= left_max: left_max = height[left]; else: total_water += left_max - height[left]; left += 1; else: if height[right] >= right_max: right_max = height[right]; else: total_water += right_max - height[right]; right -= 1'
        },
        java: {
          starterCode: `public class Solution {\n    public static int trap(int[] height) {\n        int left = 0, right = height.length - 1, leftMax = 0, rightMax = 0, total = 0;\n        // TODO: Two pointers rain trap\n        \n        return total;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Trapped: " + trap(new int[]{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}));\n    }\n}`,
          solutionHint: 'while (left < right) { if (height[left] < height[right]) { if (height[left] >= leftMax) leftMax = height[left]; else total += leftMax - height[left]; left++; } else { if (height[right] >= rightMax) rightMax = height[right]; else total += rightMax - height[right]; right--; } }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nint trap(const std::vector<int>& height) {\n    int left = 0, right = height.size() - 1, leftMax = 0, rightMax = 0, total = 0;\n    // TODO: Two pointers rain trap\n    \n    return total;\n}\n\nint main() {\n    std::cout << "Trapped: " << trap({0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'while (left < right) { if (height[left] < height[right]) { if (height[left] >= leftMax) leftMax = height[left]; else total += leftMax - height[left]; left++; } else { if (height[right] >= rightMax) rightMax = height[right]; else total += rightMax - height[right]; right--; } }'
        }
      }
    },
    {
      id: 'arr-mod-7',
      title: 'Module 7: Sliding Window Maximum (Monotonic Deque)',
      difficulty: 'Hard',
      category: 'Arrays',
      description: 'Given an integer array nums and sliding window size k, return the max value in each window position in O(n) amortized time using a monotonic deque.',
      constraints: ['Time Complexity: O(n)', 'Maintain monotonic decreasing index queue'],
      sampleInputs: [
        { input: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3', output: '[3, 3, 5, 5, 6, 7]' }
      ],
      starterCode: `function maxSlidingWindow(nums, k) {\n  const deque = [];\n  const result = [];\n\n  for (let i = 0; i < nums.length; i++) {\n    // TODO: 1. Remove indices outside current window (i - k)\n    // TODO: 2. Remove indices with values smaller than nums[i] from back\n    // TODO: 3. Push i, and record deque[0] once i >= k - 1\n    \n  }\n\n  return result;\n}\n\nconsole.log("Sliding Max:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));`,
      solutionHint: 'while (deque.length && deque[0] <= i - k) deque.shift(); while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop(); deque.push(i); if (i >= k - 1) result.push(nums[deque[0]]);',
      languageVariants: {
        javascript: {
          starterCode: `function maxSlidingWindow(nums, k) {\n  const deque = [];\n  const result = [];\n  // TODO: Monotonic deque sliding window\n  \n  return result;\n}\n\nconsole.log("Sliding Max:", maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3));`,
          solutionHint: 'while (deque.length && deque[0] <= i - k) deque.shift(); while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop(); deque.push(i); if (i >= k - 1) result.push(nums[deque[0]]);'
        },
        python: {
          starterCode: `from collections import deque\n\ndef max_sliding_window(nums: list[int], k: int) -> list[int]:\n    q = deque()\n    result = []\n    # TODO: Monotonic deque\n    \n    return result\n\nprint("Sliding Max:", max_sliding_window([1, 3, -1, -3, 5, 3, 6, 7], 3))`,
          solutionHint: 'for i, n in enumerate(nums): while q and q[0] <= i - k: q.popleft(); while q and nums[q[-1]] < n: q.pop(); q.append(i); if i >= k - 1: result.append(nums[q[0]])'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int[] maxSlidingWindow(int[] nums, int k) {\n        Deque<Integer> deque = new ArrayDeque<>();\n        int[] result = new int[nums.length - k + 1];\n        // TODO: Monotonic deque\n        \n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Sliding Max: " + Arrays.toString(maxSlidingWindow(new int[]{1, 3, -1, -3, 5, 3, 6, 7}, 3)));\n    }\n}`,
          solutionHint: 'for (int i = 0; i < nums.length; i++) { while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst(); while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast(); deque.offerLast(i); if (i >= k - 1) result[i - k + 1] = nums[deque.peekFirst()]; }'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <deque>\n\nstd::vector<int> maxSlidingWindow(const std::vector<int>& nums, int k) {\n    std::deque<int> dq;\n    std::vector<int> result;\n    // TODO: Monotonic deque\n    \n    return result;\n}\n\nint main() {\n    auto res = maxSlidingWindow({1, 3, -1, -3, 5, 3, 6, 7}, 3);\n    for (int x : res) std::cout << x << " ";\n    std::cout << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (int i = 0; i < nums.size(); i++) { while (!dq.empty() && dq.front() <= i - k) dq.pop_front(); while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back(); dq.push_back(i); if (i >= k - 1) result.push_back(nums[dq.front()]); }'
        }
      }
    },
    {
      id: 'arr-mod-8',
      title: 'Module 8: First Missing Positive (Index Cycle Sort)',
      difficulty: 'Hard',
      category: 'Arrays',
      description: 'Given an unsorted integer array nums, return the smallest positive integer that is not present in nums in O(n) time and O(1) auxiliary space.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1) in-place'],
      sampleInputs: [
        { input: '[3, 4, -1, 1]', output: '2' },
        { input: '[7, 8, 9, 11, 12]', output: '1' }
      ],
      starterCode: `function firstMissingPositive(nums) {\n  const n = nums.length;\n  // TODO: Place each number x in index x - 1 if 1 <= x <= n\n  \n  // TODO: Find first index i where nums[i] !== i + 1\n  \n  return n + 1;\n}\n\nconsole.log("Missing:", firstMissingPositive([3, 4, -1, 1]));\nconsole.log("Missing:", firstMissingPositive([7, 8, 9, 11, 12]));`,
      solutionHint: 'for (let i = 0; i < n; i++) { while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) { const temp = nums[nums[i] - 1]; nums[nums[i] - 1] = nums[i]; nums[i] = temp; } } for (let i = 0; i < n; i++) { if (nums[i] !== i + 1) return i + 1; } return n + 1;',
      languageVariants: {
        javascript: {
          starterCode: `function firstMissingPositive(nums) {\n  const n = nums.length;\n  // TODO: Cycle sort in-place\n  \n  return n + 1;\n}\n\nconsole.log("Missing:", firstMissingPositive([3, 4, -1, 1]));`,
          solutionHint: 'for (let i = 0; i < n; i++) { while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) { const temp = nums[nums[i] - 1]; nums[nums[i] - 1] = nums[i]; nums[i] = temp; } } for (let i = 0; i < n; i++) { if (nums[i] !== i + 1) return i + 1; } return n + 1;'
        },
        python: {
          starterCode: `def first_missing_positive(nums: list[int]) -> int:\n    n = len(nums)\n    # TODO: Cycle sort\n    \n    return n + 1\n\nprint("Missing:", first_missing_positive([3, 4, -1, 1]))`,
          solutionHint: 'for i in range(n): while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]: target = nums[i] - 1; nums[i], nums[target] = nums[target], nums[i]; for i in range(n): if nums[i] != i + 1: return i + 1'
        },
        java: {
          starterCode: `public class Solution {\n    public static int firstMissingPositive(int[] nums) {\n        int n = nums.length;\n        // TODO: Cycle sort in-place\n        \n        return n + 1;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Missing: " + firstMissingPositive(new int[]{3, 4, -1, 1}));\n    }\n}`,
          solutionHint: 'for (int i = 0; i < n; i++) { while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) { int target = nums[i] - 1; int temp = nums[target]; nums[target] = nums[i]; nums[i] = temp; } } for (int i = 0; i < n; i++) { if (nums[i] != i + 1) return i + 1; } return n + 1;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <utility>\n\nint firstMissingPositive(std::vector<int>& nums) {\n    int n = nums.size();\n    // TODO: Cycle sort\n    \n    return n + 1;\n}\n\nint main() {\n    std::vector<int> input = {3, 4, -1, 1};\n    std::cout << "Missing: " << firstMissingPositive(input) << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (int i = 0; i < n; i++) { while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) { std::swap(nums[i], nums[nums[i] - 1]); } } for (int i = 0; i < n; i++) { if (nums[i] != i + 1) return i + 1; } return n + 1;'
        }
      }
    }
  ],

  'strings': [
    {
      id: 'str-mod-1',
      title: 'Module 1: Valid Palindrome with Two Pointers',
      difficulty: 'Easy',
      category: 'Strings',
      description: 'Given a string s, return true if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: '"A man, a plan, a canal: Panama"', output: 'true' },
        { input: '"race a car"', output: 'false' }
      ],
      starterCode: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  // TODO: Compare characters from outside inwards\n  \n  return true;\n}\n\nconsole.log("Is Palindrome:", isPalindrome("A man, a plan, a canal: Panama"));`,
      solutionHint: 'while (left < right) { if (clean[left++] !== clean[right--]) return false; } return true;',
      languageVariants: {
        javascript: {
          starterCode: `function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  let left = 0, right = clean.length - 1;\n  // TODO: Two pointers palindrome check\n  \n  return true;\n}\n\nconsole.log("Is Palindrome:", isPalindrome("A man, a plan, a canal: Panama"));`,
          solutionHint: 'while (left < right) { if (clean[left++] !== clean[right--]) return false; } return true;'
        },
        python: {
          starterCode: `import re\n\ndef is_palindrome(s: str) -> bool:\n    clean = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    left, right = 0, len(clean) - 1\n    # TODO: Two pointers\n    \n    return True\n\nprint("Is Palindrome:", is_palindrome("A man, a plan, a canal: Panama"))`,
          solutionHint: 'while left < right: if clean[left] != clean[right]: return False; left += 1; right -= 1; return True'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isPalindrome(String s) {\n        String clean = s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();\n        int left = 0, right = clean.length() - 1;\n        // TODO: Two pointers\n        \n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Is Palindrome: " + isPalindrome("A man, a plan, a canal: Panama"));\n    }\n}`,
          solutionHint: 'while (left < right) { if (clean.charAt(left++) != clean.charAt(right--)) return false; } return true;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <cctype>\n\nbool isPalindrome(const std::string& s) {\n    std::string clean = "";\n    for (char c : s) if (isalnum(c)) clean += tolower(c);\n    int left = 0, right = (int)clean.size() - 1;\n    // TODO: Two pointers\n    \n    return true;\n}\n\nint main() {\n    std::cout << "Is Palindrome: " << (isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: 'while (left < right) { if (clean[left++] != clean[right--]) return false; } return true;'
        }
      }
    },
    {
      id: 'str-mod-2',
      title: 'Module 2: Longest Common Prefix (Vertical Scanning)',
      difficulty: 'Easy',
      category: 'Strings',
      description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
      constraints: ['Input contains lowercase English letters', 'Time Complexity: O(S) where S is sum of all characters'],
      sampleInputs: [
        { input: '["flower", "flow", "flight"]', output: '"fl"' }
      ],
      starterCode: `function longestCommonPrefix(strs) {\n  if (!strs || strs.length === 0) return "";\n  let prefix = strs[0];\n  // TODO: Truncate prefix until all match\n  \n  return prefix;\n}\n\nconsole.log("Prefix:", longestCommonPrefix(["flower", "flow", "flight"]));`,
      solutionHint: 'for (let i = 1; i < strs.length; i++) { while (strs[i].indexOf(prefix) !== 0) { prefix = prefix.substring(0, prefix.length - 1); if (!prefix) return ""; } } return prefix;',
      languageVariants: {
        javascript: {
          starterCode: `function longestCommonPrefix(strs) {\n  if (!strs || strs.length === 0) return "";\n  let prefix = strs[0];\n  // TODO: Truncate prefix until all match\n  \n  return prefix;\n}\n\nconsole.log("Prefix:", longestCommonPrefix(["flower", "flow", "flight"]));`,
          solutionHint: 'for (let i = 1; i < strs.length; i++) { while (strs[i].indexOf(prefix) !== 0) { prefix = prefix.substring(0, prefix.length - 1); if (!prefix) return ""; } } return prefix;'
        },
        python: {
          starterCode: `def longest_common_prefix(strs: list[str]) -> str:\n    if not strs: return ""\n    prefix = strs[0]\n    # TODO: Truncate prefix\n    \n    return prefix\n\nprint("Prefix:", longest_common_prefix(["flower", "flow", "flight"]))`,
          solutionHint: 'for s in strs[1:]: while not s.startswith(prefix): prefix = prefix[:-1]; if not prefix: return ""; return prefix'
        },
        java: {
          starterCode: `public class Solution {\n    public static String longestCommonPrefix(String[] strs) {\n        if (strs == null || strs.length == 0) return "";\n        String prefix = strs[0];\n        // TODO: Truncate prefix\n        \n        return prefix;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Prefix: " + longestCommonPrefix(new String[]{"flower", "flow", "flight"}));\n    }\n}`,
          solutionHint: 'for (int i = 1; i < strs.length; i++) { while (strs[i].indexOf(prefix) != 0) { prefix = prefix.substring(0, prefix.length - 1); if (prefix.isEmpty()) return ""; } } return prefix;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nstd::string longestCommonPrefix(const std::vector<std::string>& strs) {\n    if (strs.empty()) return "";\n    std::string prefix = strs[0];\n    // TODO: Truncate prefix\n    \n    return prefix;\n}\n\nint main() {\n    std::cout << "Prefix: " << longestCommonPrefix({"flower", "flow", "flight"}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (size_t i = 1; i < strs.size(); i++) { while (strs[i].find(prefix) != 0) { prefix = prefix.substr(0, prefix.size() - 1); if (prefix.empty()) return ""; } } return prefix;'
        }
      }
    },
    {
      id: 'str-mod-3',
      title: 'Module 3: Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      category: 'Strings',
      description: 'Given a string s, find the length of the longest substring without repeating characters in O(n) time using a sliding window and Map.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(min(m, n))'],
      sampleInputs: [
        { input: '"abcabcbb"', output: '3 ("abc")' }
      ],
      starterCode: `function lengthOfLongestSubstring(s) {\n  const charIndexMap = new Map();\n  let maxLength = 0, windowStart = 0;\n  // TODO: Sliding window\n  \n  return maxLength;\n}\n\nconsole.log("Longest Unique Substring:", lengthOfLongestSubstring("abcabcbb"));`,
      solutionHint: 'for (let windowEnd = 0; windowEnd < s.length; windowEnd++) { const rightChar = s[windowEnd]; if (charIndexMap.has(rightChar)) { windowStart = Math.max(windowStart, charIndexMap.get(rightChar) + 1); } charIndexMap.set(rightChar, windowEnd); maxLength = Math.max(maxLength, windowEnd - windowStart + 1); } return maxLength;',
      languageVariants: {
        javascript: {
          starterCode: `function lengthOfLongestSubstring(s) {\n  const charIndexMap = new Map();\n  let maxLength = 0, windowStart = 0;\n  // TODO: Sliding window\n  \n  return maxLength;\n}\n\nconsole.log("Longest Unique Substring:", lengthOfLongestSubstring("abcabcbb"));`,
          solutionHint: 'for (let windowEnd = 0; windowEnd < s.length; windowEnd++) { const rightChar = s[windowEnd]; if (charIndexMap.has(rightChar)) { windowStart = Math.max(windowStart, charIndexMap.get(rightChar) + 1); } charIndexMap.set(rightChar, windowEnd); maxLength = Math.max(maxLength, windowEnd - windowStart + 1); } return maxLength;'
        },
        python: {
          starterCode: `def length_of_longest_substring(s: str) -> int:\n    seen = {}\n    max_len = start = 0\n    # TODO: Sliding window\n    \n    return max_len\n\nprint("Longest Unique:", length_of_longest_substring("abcabcbb"))`,
          solutionHint: 'for end, char in enumerate(s): if char in seen: start = max(start, seen[char] + 1); seen[char] = end; max_len = max(max_len, end - start + 1); return max_len'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> map = new HashMap<>();\n        int maxLen = 0, start = 0;\n        // TODO: Sliding window\n        \n        return maxLen;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Longest: " + lengthOfLongestSubstring("abcabcbb"));\n    }\n}`,
          solutionHint: 'for (int end = 0; end < s.length(); end++) { char c = s.charAt(end); if (map.containsKey(c)) start = Math.max(start, map.get(c) + 1); map.put(c, end); maxLen = Math.max(maxLen, end - start + 1); } return maxLen;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\n\nint lengthOfLongestSubstring(const std::string& s) {\n    std::unordered_map<char, int> seen;\n    int maxLen = 0, start = 0;\n    // TODO: Sliding window\n    \n    return maxLen;\n}\n\nint main() {\n    std::cout << "Longest: " << lengthOfLongestSubstring("abcabcbb") << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (int end = 0; end < (int)s.size(); end++) { if (seen.count(s[end])) start = std::max(start, seen[s[end]] + 1); seen[s[end]] = end; maxLen = std::max(maxLen, end - start + 1); } return maxLen;'
        }
      }
    },
    {
      id: 'str-mod-4',
      title: 'Module 4: String to Integer Parser (atoi)',
      difficulty: 'Medium',
      category: 'Strings',
      description: 'Implement myAtoi(s) that converts a string to a 32-bit signed integer handling leading whitespace, +/- signs, digits, and 32-bit integer clamping [-2^31, 2^31 - 1].',
      constraints: ['Clamp overflow to [-2147483648, 2147483647]', 'Ignore subsequent non-digit characters'],
      sampleInputs: [
        { input: '"   -42"', output: '-42' },
        { input: '"4193 with words"', output: '4193' }
      ],
      starterCode: `function myAtoi(s) {\n  let i = 0, sign = 1, total = 0;\n  const INT_MAX = 2147483647, INT_MIN = -2147483648;\n  // TODO: Parse string to 32-bit int with clamping\n  \n  return total * sign;\n}\n\nconsole.log("Atoi \'   -42\':", myAtoi("   -42"));`,
      solutionHint: 'while (s[i] === " ") i++; if (s[i] === "+" || s[i] === "-") { sign = s[i] === "-" ? -1 : 1; i++; } while (i < s.length && s[i] >= "0" && s[i] <= "9") { total = total * 10 + (s.charCodeAt(i) - 48); if (total * sign >= INT_MAX) return INT_MAX; if (total * sign <= INT_MIN) return INT_MIN; i++; }',
      languageVariants: {
        javascript: {
          starterCode: `function myAtoi(s) {\n  let i = 0, sign = 1, total = 0;\n  const INT_MAX = 2147483647, INT_MIN = -2147483648;\n  // TODO: Parse string to 32-bit int\n  \n  return total * sign;\n}\n\nconsole.log("Atoi \'   -42\':", myAtoi("   -42"));`,
          solutionHint: 'while (s[i] === " ") i++; if (s[i] === "+" || s[i] === "-") { sign = s[i] === "-" ? -1 : 1; i++; } while (i < s.length && s[i] >= "0" && s[i] <= "9") { total = total * 10 + (s.charCodeAt(i) - 48); if (total * sign >= INT_MAX) return INT_MAX; if (total * sign <= INT_MIN) return INT_MIN; i++; }'
        },
        python: {
          starterCode: `def my_atoi(s: str) -> int:\n    i = total = 0\n    sign = 1\n    INT_MAX, INT_MIN = 2**31 - 1, -2**31\n    s = s.lstrip()\n    if not s: return 0\n    if s[0] in ['+', '-']:\n        sign = -1 if s[0] == '-' else 1\n        s = s[1:]\n    for c in s:\n        if not c.isdigit(): break\n        total = total * 10 + int(c)\n        if total * sign >= INT_MAX: return INT_MAX\n        if total * sign <= INT_MIN: return INT_MIN\n    return total * sign\n\nprint("Atoi:", my_atoi("   -42"))`,
          solutionHint: 'Strip whitespace, extract leading sign, accumulate digits, and clamp between INT_MIN and INT_MAX'
        },
        java: {
          starterCode: `public class Solution {\n    public static int myAtoi(String s) {\n        int i = 0, sign = 1;\n        long total = 0;\n        while (i < s.length() && s.charAt(i) == ' ') i++;\n        if (i < s.length() && (s.charAt(i) == '+' || s.charAt(i) == '-')) {\n            sign = s.charAt(i) == '-' ? -1 : 1;\n            i++;\n        }\n        while (i < s.length() && Character.isDigit(s.charAt(i))) {\n            total = total * 10 + (s.charAt(i) - '0');\n            if (total * sign >= Integer.MAX_VALUE) return Integer.MAX_VALUE;\n            if (total * sign <= Integer.MIN_VALUE) return Integer.MIN_VALUE;\n            i++;\n        }\n        return (int)(total * sign);\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Atoi: " + myAtoi("   -42"));\n    }\n}`,
          solutionHint: 'Use long total for intermediate sums and check Integer.MAX_VALUE / Integer.MIN_VALUE bounds.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <climits>\n\nint myAtoi(const std::string& s) {\n    int i = 0, sign = 1;\n    long total = 0;\n    while (i < s.size() && s[i] == ' ') i++;\n    if (i < s.size() && (s[i] == '+' || s[i] == '-')) {\n        sign = s[i] == '-' ? -1 : 1;\n        i++;\n    }\n    while (i < s.size() && isdigit(s[i])) {\n        total = total * 10 + (s[i] - '0');\n        if (total * sign >= INT_MAX) return INT_MAX;\n        if (total * sign <= INT_MIN) return INT_MIN;\n        i++;\n    }\n    return total * sign;\n}\n\nint main() {\n    std::cout << "Atoi: " << myAtoi("   -42") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Check whitespace, parse +/- sign, convert digit chars to int and clamp to INT_MAX/INT_MIN.'
        }
      }
    },
    {
      id: 'str-mod-5',
      title: 'Module 5: Longest Palindromic Substring',
      difficulty: 'Medium',
      category: 'Strings',
      description: 'Given a string s, return the longest palindromic substring in s in O(n^2) time and O(1) extra space using expand around center.',
      constraints: ['Time Complexity: O(n^2)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: '"babad"', output: '"bab" or "aba"' }
      ],
      starterCode: `function longestPalindrome(s) {\n  if (!s || s.length < 1) return "";\n  let start = 0, end = 0;\n  // TODO: Expand around center\n  \n  return s.substring(start, end + 1);\n}\n\nconsole.log("Longest Palindrome:", longestPalindrome("babad"));`,
      solutionHint: 'for (let i = 0; i < s.length; i++) { const len1 = expand(i, i); const len2 = expand(i, i + 1); const len = Math.max(len1, len2); if (len > end - start) { start = i - Math.floor((len - 1) / 2); end = i + Math.floor(len / 2); } }',
      languageVariants: {
        javascript: {
          starterCode: `function longestPalindrome(s) {\n  if (!s || s.length < 1) return "";\n  let start = 0, end = 0;\n  const expand = (l, r) => {\n    while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }\n    return r - l - 1;\n  };\n  for (let i = 0; i < s.length; i++) {\n    const len = Math.max(expand(i, i), expand(i, i + 1));\n    if (len > end - start) {\n      start = i - Math.floor((len - 1) / 2);\n      end = i + Math.floor(len / 2);\n    }\n  }\n  return s.substring(start, end + 1);\n}\n\nconsole.log("Longest Palindrome:", longestPalindrome("babad"));`,
          solutionHint: 'Expand outward around each center index (both odd and even lengths) and track start/end indices.'
        },
        python: {
          starterCode: `def longest_palindrome(s: str) -> str:\n    if not s: return ""\n    start = end = 0\n    def expand(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1; r += 1\n        return r - l - 1\n    for i in range(len(s)):\n        length = max(expand(i, i), expand(i, i + 1))\n        if length > end - start:\n            start = i - (length - 1) // 2\n            end = i + length // 2\n    return s[start:end + 1]\n\nprint("Longest Palindrome:", longest_palindrome("babad"))`,
          solutionHint: 'Expand around center for both single and paired characters and slice longest matching palindrome.'
        },
        java: {
          starterCode: `public class Solution {\n    private static int expand(String s, int l, int r) {\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }\n        return r - l - 1;\n    }\n    public static String longestPalindrome(String s) {\n        if (s == null || s.isEmpty()) return "";\n        int start = 0, end = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int len = Math.max(expand(s, i, i), expand(s, i, i + 1));\n            if (len > end - start) {\n                start = i - (len - 1) / 2;\n                end = i + len / 2;\n            }\n        }\n        return s.substring(start, end + 1);\n    }\n    public static void main(String[] args) {\n        System.out.println("Longest: " + longestPalindrome("babad"));\n    }\n}`,
          solutionHint: 'Expand outward around center indices and maintain substring boundaries.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <algorithm>\n\nint expand(const std::string& s, int l, int r) {\n    while (l >= 0 && r < (int)s.size() && s[l] == s[r]) { l--; r++; }\n    return r - l - 1;\n}\n\nstd::string longestPalindrome(const std::string& s) {\n    if (s.empty()) return "";\n    int start = 0, end = 0;\n    for (int i = 0; i < (int)s.size(); i++) {\n        int len = std::max(expand(s, i, i), expand(s, i, i + 1));\n        if (len > end - start) {\n            start = i - (len - 1) / 2;\n            end = i + len / 2;\n        }\n    }\n    return s.substr(start, end - start + 1);\n}\n\nint main() {\n    std::cout << "Longest: " << longestPalindrome("babad") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Helper function expand() checks boundary parity and returns substring length.'
        }
      }
    },
    {
      id: 'str-mod-6',
      title: 'Module 6: Minimum Window Substring',
      difficulty: 'Hard',
      category: 'Strings',
      description: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window in O(m + n) time.',
      constraints: ['Time Complexity: O(|s| + |t|)', 'Space Complexity: O(|s| + |t|)'],
      sampleInputs: [
        { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }
      ],
      starterCode: `function minWindow(s, t) {\n  if (s.length === 0 || t.length === 0) return "";\n  const targetMap = {};\n  for (const c of t) targetMap[c] = (targetMap[c] || 0) + 1;\n  let required = Object.keys(targetMap).length;\n  let l = 0, r = 0, formed = 0;\n  const windowCounts = {};\n  let minLen = Infinity, minStart = 0;\n  // TODO: Sliding window expand & contract\n  \n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}\n\nconsole.log("Min Window:", minWindow("ADOBECODEBANC", "ABC"));`,
      solutionHint: 'while (r < s.length) { const c = s[r]; windowCounts[c] = (windowCounts[c] || 0) + 1; if (targetMap[c] && windowCounts[c] === targetMap[c]) formed++; while (l <= r && formed === required) { if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; } windowCounts[s[l]]--; if (targetMap[s[l]] && windowCounts[s[l]] < targetMap[s[l]]) formed--; l++; } r++; }',
      languageVariants: {
        javascript: {
          starterCode: `function minWindow(s, t) {\n  if (s.length === 0 || t.length === 0) return "";\n  const targetMap = {};\n  for (const c of t) targetMap[c] = (targetMap[c] || 0) + 1;\n  let required = Object.keys(targetMap).length;\n  let l = 0, r = 0, formed = 0;\n  const windowCounts = {};\n  let minLen = Infinity, minStart = 0;\n  while (r < s.length) {\n    const c = s[r];\n    windowCounts[c] = (windowCounts[c] || 0) + 1;\n    if (targetMap[c] && windowCounts[c] === targetMap[c]) formed++;\n    while (l <= r && formed === required) {\n      if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; }\n      windowCounts[s[l]]--;\n      if (targetMap[s[l]] && windowCounts[s[l]] < targetMap[s[l]]) formed--;\n      l++;\n    }\n    r++;\n  }\n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}\n\nconsole.log("Min Window:", minWindow("ADOBECODEBANC", "ABC"));`,
          solutionHint: 'Two pointers window expansion on right and contraction on left when all character frequencies match.'
        },
        python: {
          starterCode: `from collections import Counter\n\ndef min_window(s: str, t: str) -> str:\n    if not s or not t: return ""\n    target_counts = Counter(t)\n    required = len(target_counts)\n    l = r = formed = 0\n    window_counts = {}\n    min_len, min_start = float('inf'), 0\n    while r < len(s):\n        c = s[r]\n        window_counts[c] = window_counts.get(c, 0) + 1\n        if c in target_counts and window_counts[c] == target_counts[c]:\n            formed += 1\n        while l <= r and formed == required:\n            if r - l + 1 < min_len:\n                min_len = r - l + 1\n                min_start = l\n            window_counts[s[l]] -= 1\n            if s[l] in target_counts and window_counts[s[l]] < target_counts[s[l]]:\n                formed -= 1\n            l += 1\n        r += 1\n    return "" if min_len == float('inf') else s[min_start:min_start + min_len]\n\nprint("Min Window:", min_window("ADOBECODEBANC", "ABC"))`,
          solutionHint: 'Sliding window tracking formed character frequency matches with dynamic contraction.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static String minWindow(String s, String t) {\n        if (s.isEmpty() || t.isEmpty()) return "";\n        int[] target = new int[128], window = new int[128];\n        for (char c : t.toCharArray()) target[c]++;\n        int required = 0;\n        for (int count : target) if (count > 0) required++;\n        int l = 0, r = 0, formed = 0, minLen = Integer.MAX_VALUE, start = 0;\n        while (r < s.length()) {\n            char c = s.charAt(r);\n            window[c]++;\n            if (target[c] > 0 && window[c] == target[c]) formed++;\n            while (l <= r && formed == required) {\n                if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n                char leftChar = s.charAt(l);\n                window[leftChar]--;\n                if (target[leftChar] > 0 && window[leftChar] < target[leftChar]) formed--;\n                l++;\n            }\n            r++;\n        }\n        return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);\n    }\n    public static void main(String[] args) {\n        System.out.println("Min Window: " + minWindow("ADOBECODEBANC", "ABC"));\n    }\n}`,
          solutionHint: 'Use 128-element ASCII frequency array for high-performance O(1) character lookup.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n#include <climits>\n\nstd::string minWindow(const std::string& s, const std::string& t) {\n    if (s.empty() || t.empty()) return "";\n    std::vector<int> target(128, 0), window(128, 0);\n    for (char c : t) target[c]++;\n    int required = 0;\n    for (int count : target) if (count > 0) required++;\n    int l = 0, r = 0, formed = 0, minLen = INT_MAX, start = 0;\n    while (r < (int)s.size()) {\n        char c = s[r];\n        window[c]++;\n        if (target[c] > 0 && window[c] == target[c]) formed++;\n        while (l <= r && formed == required) {\n            if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n            char leftChar = s[l];\n            window[leftChar]--;\n            if (target[leftChar] > 0 && window[leftChar] < target[leftChar]) formed--;\n            l++;\n        }\n        r++;\n    }\n    return minLen == INT_MAX ? "" : s.substr(start, minLen);\n}\n\nint main() {\n    std::cout << "Min Window: " << minWindow("ADOBECODEBANC", "ABC") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Slide right pointer to expand, contract left pointer when window matches all t frequencies.'
        }
      }
    },
    {
      id: 'str-mod-7',
      title: 'Module 7: KMP Pattern Matcher with LPS Prefix Table',
      difficulty: 'Hard',
      category: 'Strings',
      description: 'Implement strStrKMP(haystack, needle) returning the index of the first occurrence of needle in haystack using the Knuth-Morris-Pratt O(N + M) algorithm with Longest Prefix Suffix (LPS) table.',
      constraints: ['Time Complexity: O(N + M)', 'Space Complexity: O(M) LPS table'],
      sampleInputs: [
        { input: 'haystack = "ABABDABACDABABCABAB", needle = "ABABCABAB"', output: '10' }
      ],
      starterCode: `function strStrKMP(haystack, needle) {\n  if (needle.length === 0) return 0;\n  const lps = new Array(needle.length).fill(0);\n  let prevLPS = 0, i = 1;\n  while (i < needle.length) {\n    if (needle[i] === needle[prevLPS]) { lps[i++] = ++prevLPS; }\n    else if (prevLPS === 0) { lps[i++] = 0; }\n    else { prevLPS = lps[prevLPS - 1]; }\n  }\n  let h = 0, n = 0;\n  while (h < haystack.length) {\n    if (haystack[h] === needle[n]) { h++; n++; }\n    if (n === needle.length) return h - n;\n    if (h < haystack.length && haystack[h] !== needle[n]) {\n      if (n !== 0) n = lps[n - 1]; else h++;\n    }\n  }\n  return -1;\n}\n\nconsole.log("KMP Match Index:", strStrKMP("ABABDABACDABABCABAB", "ABABCABAB"));`,
      solutionHint: 'Build Longest Prefix Suffix (LPS) table to shift pattern position without backtracking source pointer.',
      languageVariants: {
        javascript: {
          starterCode: `function strStrKMP(haystack, needle) {\n  if (needle.length === 0) return 0;\n  const lps = new Array(needle.length).fill(0);\n  let prevLPS = 0, i = 1;\n  while (i < needle.length) {\n    if (needle[i] === needle[prevLPS]) { lps[i++] = ++prevLPS; }\n    else if (prevLPS === 0) { lps[i++] = 0; }\n    else { prevLPS = lps[prevLPS - 1]; }\n  }\n  let h = 0, n = 0;\n  while (h < haystack.length) {\n    if (haystack[h] === needle[n]) { h++; n++; }\n    if (n === needle.length) return h - n;\n    if (h < haystack.length && haystack[h] !== needle[n]) {\n      if (n !== 0) n = lps[n - 1]; else h++;\n    }\n  }\n  return -1;\n}\n\nconsole.log("KMP Match Index:", strStrKMP("ABABDABACDABABCABAB", "ABABCABAB"));`,
          solutionHint: 'Precompute LPS array in O(m) and run linear scan on haystack without pointer backtracking.'
        },
        python: {
          starterCode: `def str_str_kmp(haystack: str, needle: str) -> int:\n    if not needle: return 0\n    lps = [0] * len(needle)\n    prev_lps, i = 0, 1\n    while i < len(needle):\n        if needle[i] == needle[prev_lps]:\n            prev_lps += 1\n            lps[i] = prev_lps\n            i += 1\n        elif prev_lps == 0:\n            lps[i] = 0\n            i += 1\n        else:\n            prev_lps = lps[prev_lps - 1]\n    h = n = 0\n    while h < len(haystack):\n        if haystack[h] == needle[n]:\n            h += 1; n += 1\n        if n == len(needle):\n            return h - n\n        if h < len(haystack) and haystack[h] != needle[n]:\n            if n != 0: n = lps[n - 1]\n            else: h += 1\n    return -1\n\nprint("KMP Match Index:", str_str_kmp("ABABDABACDABABCABAB", "ABABCABAB"))`,
          solutionHint: 'Knuth-Morris-Pratt pattern searching using precomputed Longest Prefix Suffix list.'
        },
        java: {
          starterCode: `public class Solution {\n    public static int strStr(String haystack, String needle) {\n        if (needle.isEmpty()) return 0;\n        int[] lps = new int[needle.length()];\n        int prevLPS = 0, i = 1;\n        while (i < needle.length()) {\n            if (needle.charAt(i) == needle.charAt(prevLPS)) { lps[i++] = ++prevLPS; }\n            else if (prevLPS == 0) { lps[i++] = 0; }\n            else { prevLPS = lps[prevLPS - 1]; }\n        }\n        int h = 0, n = 0;\n        while (h < haystack.length()) {\n            if (haystack.charAt(h) == needle.charAt(n)) { h++; n++; }\n            if (n == needle.length()) return h - n;\n            if (h < haystack.length() && haystack.charAt(h) != needle.charAt(n)) {\n                if (n != 0) n = lps[n - 1]; else h++;\n            }\n        }\n        return -1;\n    }\n    public static void main(String[] args) {\n        System.out.println("KMP Match: " + strStr("ABABDABACDABABCABAB", "ABABCABAB"));\n    }\n}`,
          solutionHint: 'Linear time pattern match using LPS array avoid backtracking on the source string.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n\nint strStrKMP(const std::string& haystack, const std::string& needle) {\n    if (needle.empty()) return 0;\n    std::vector<int> lps(needle.size(), 0);\n    int prevLPS = 0, i = 1;\n    while (i < (int)needle.size()) {\n        if (needle[i] == needle[prevLPS]) { lps[i++] = ++prevLPS; }\n        else if (prevLPS == 0) { lps[i++] = 0; }\n        else { prevLPS = lps[prevLPS - 1]; }\n    }\n    int h = 0, n = 0;\n    while (h < (int)haystack.size()) {\n        if (haystack[h] == needle[n]) { h++; n++; }\n        if (n == (int)needle.size()) return h - n;\n        if (h < (int)haystack.size() && haystack[h] != needle[n]) {\n            if (n != 0) n = lps[n - 1]; else h++;\n        }\n    }\n    return -1;\n}\n\nint main() {\n    std::cout << "KMP Match: " << strStrKMP("ABABDABACDABABCABAB", "ABABCABAB") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Build LPS jump table and match in single pass O(N + M).'
        }
      }
    },
    {
      id: 'str-mod-8',
      title: 'Module 8: Regular Expression Dynamic Programming Matching',
      difficulty: 'Hard',
      category: 'Strings',
      description: 'Implement isMatch(s, p) with support for . (matches any single character) and * (matches zero or more of preceding element) using a 2D boolean dynamic programming table.',
      constraints: ['Time Complexity: O(s.length * p.length)', 'Space Complexity: O(s.length * p.length)'],
      sampleInputs: [
        { input: 's = "aab", p = "c*a*b"', output: 'true' },
        { input: 's = "mississippi", p = "mis*is*p*."', output: 'false' }
      ],
      starterCode: `function isMatch(s, p) {\n  const dp = Array.from({ length: s.length + 1 }, () => new Array(p.length + 1).fill(false));\n  dp[0][0] = true;\n  for (let j = 1; j <= p.length; j++) {\n    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];\n  }\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 1; j <= p.length; j++) {\n      if (p[j - 1] === s[i - 1] || p[j - 1] === '.') {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      }\n    }\n  }\n  return dp[s.length][p.length];\n}\n\nconsole.log("Match \'aab\' against \'c*a*b\':", isMatch("aab", "c*a*b"));`,
      solutionHint: '2D DP grid where dp[i][j] tracks if prefix s[0..i] matches pattern p[0..j].',
      languageVariants: {
        javascript: {
          starterCode: `function isMatch(s, p) {\n  const dp = Array.from({ length: s.length + 1 }, () => new Array(p.length + 1).fill(false));\n  dp[0][0] = true;\n  for (let j = 1; j <= p.length; j++) {\n    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];\n  }\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 1; j <= p.length; j++) {\n      if (p[j - 1] === s[i - 1] || p[j - 1] === '.') {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else if (p[j - 1] === '*') {\n        dp[i][j] = dp[i][j - 2];\n        if (p[j - 2] === s[i - 1] || p[j - 2] === '.') {\n          dp[i][j] = dp[i][j] || dp[i - 1][j];\n        }\n      }\n    }\n  }\n  return dp[s.length][p.length];\n}\n\nconsole.log("Match \'aab\' against \'c*a*b\':", isMatch("aab", "c*a*b"));`,
          solutionHint: '2D boolean DP grid where asterisk transitions take either zero matches (j-2) or match previous character.'
        },
        python: {
          starterCode: `def is_match(s: str, p: str) -> bool:\n    dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]\n    dp[0][0] = True\n    for j in range(1, len(p) + 1):\n        if p[j - 1] == '*':\n            dp[0][j] = dp[0][j - 2]\n    for i in range(1, len(s) + 1):\n        for j in range(1, len(p) + 1):\n            if p[j - 1] == s[i - 1] or p[j - 1] == '.':\n                dp[i][j] = dp[i - 1][j - 1]\n            elif p[j - 1] == '*':\n                dp[i][j] = dp[i][j - 2]\n                if p[j - 2] == s[i - 1] or p[j - 2] == '.':\n                    dp[i][j] = dp[i][j] or dp[i - 1][j]\n    return dp[len(s)][len(p)]\n\nprint("Match 'aab' against 'c*a*b':", is_match("aab", "c*a*b"))`,
          solutionHint: 'Dynamic programming table evaluating exact characters, wildcard dots, and repeating asterisks.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isMatch(String s, String p) {\n        boolean[][] dp = new boolean[s.length() + 1][p.length() + 1];\n        dp[0][0] = true;\n        for (int j = 1; j <= p.length(); j++) {\n            if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];\n        }\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 1; j <= p.length(); j++) {\n                if (p.charAt(j - 1) == s.charAt(i - 1) || p.charAt(j - 1) == '.') {\n                    dp[i][j] = dp[i - 1][j - 1];\n                } else if (p.charAt(j - 1) == '*') {\n                    dp[i][j] = dp[i][j - 2];\n                    if (p.charAt(j - 2) == s.charAt(i - 1) || p.charAt(j - 2) == '.') {\n                        dp[i][j] = dp[i][j] || dp[i - 1][j];\n                    }\n                }\n            }\n        }\n        return dp[s.length()][p.length()];\n    }\n    public static void main(String[] args) {\n        System.out.println("Match: " + isMatch("aab", "c*a*b"));\n    }\n}`,
          solutionHint: '2D boolean DP grid tracking state transitions across pattern tokens and string characters.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n\nbool isMatch(const std::string& s, const std::string& p) {\n    int m = s.size(), n = p.size();\n    std::vector<std::vector<bool>> dp(m + 1, std::vector<bool>(n + 1, false));\n    dp[0][0] = true;\n    for (int j = 1; j <= n; j++) {\n        if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];\n    }\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (p[j - 1] == s[i - 1] || p[j - 1] == '.') {\n                dp[i][j] = dp[i - 1][j - 1];\n            } else if (p[j - 1] == '*') {\n                dp[i][j] = dp[i][j - 2];\n                if (p[j - 2] == s[i - 1] || p[j - 2] == '.') {\n                    dp[i][j] = dp[i][j] || dp[i - 1][j];\n                }\n            }\n        }\n    }\n    return dp[m][n];\n}\n\nint main() {\n    std::cout << "Match: " << (isMatch("aab", "c*a*b") ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: '2D DP grid evaluating characters, period wildcard, and repeating asterisk transitions.'
        }
      }
    }
  ],

  'linked-lists': [
    {
      id: 'll-mod-1',
      title: 'Module 1: Reverse Singly Linked List',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: 'Given the head of a singly linked list, reverse the list in-place and return the reversed list head in O(n) time and O(1) space.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1) in-place pointers'],
      sampleInputs: [
        { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' }
      ],
      starterCode: `class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  // TODO: Iteratively reverse next pointers\n  \n  return prev;\n}\n\n// Test helper\nconst list = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));\nlet rev = reverseList(list);\nconst res = []; while (rev) { res.push(rev.val); rev = rev.next; }\nconsole.log("Reversed:", res);`,
      solutionHint: 'while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; } return prev;',
      languageVariants: {
        javascript: {
          starterCode: `class ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\nfunction reverseList(head) {\n  let prev = null, curr = head;\n  // TODO: Reverse next pointers\n  \n  return prev;\n}\n\nconst list = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));\nlet rev = reverseList(list);\nconst res = []; while (rev) { res.push(rev.val); rev = rev.next; }\nconsole.log("Reversed:", res);`,
          solutionHint: 'while (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; } return prev;'
        },
        python: {
          starterCode: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head: ListNode | None) -> ListNode | None:\n    prev, curr = None, head\n    # TODO: Reverse next pointers\n    \n    return prev\n\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\nrev = reverse_list(head)\nres = []\nwhile rev:\n    res.append(rev.val)\n    rev = rev.next\nprint("Reversed:", res)`,
          solutionHint: 'while curr: nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; return prev'
        },
        java: {
          starterCode: `class ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) { this.val = val; }\n    ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n}\n\npublic class Solution {\n    public static ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        // TODO: Reverse next pointers\n        \n        return prev;\n    }\n    public static void main(String[] args) {\n        ListNode head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));\n        ListNode rev = reverseList(head);\n        while (rev != null) { System.out.print(rev.val + " "); rev = rev.next; }\n        System.out.println();\n    }\n}`,
          solutionHint: 'while (curr != null) { ListNode nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; } return prev;'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nstruct ListNode {\n    int val;\n    ListNode* next;\n    ListNode(int x, ListNode* n = nullptr) : val(x), next(n) {}\n};\n\nListNode* reverseList(ListNode* head) {\n    ListNode *prev = nullptr, *curr = head;\n    // TODO: Reverse next pointers\n    \n    return prev;\n}\n\nint main() {\n    ListNode* head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));\n    ListNode* rev = reverseList(head);\n    while (rev) { std::cout << rev->val << " "; rev = rev->next; }\n    std::cout << "\\n";\n    return 0;\n}`,
          solutionHint: 'while (curr) { ListNode* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; } return prev;'
        }
      }
    },
    {
      id: 'll-mod-2',
      title: 'Module 2: Linked List Cycle Detection (Floyd Algorithm)',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it using Floyd’s Tortoise and Hare algorithm in O(1) memory.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'head = [3,2,0,-4], pos = 1 (tail connects to node index 1)', output: 'true' }
      ],
      starterCode: `function hasCycle(head) {\n  let slow = head, fast = head;\n  // TODO: Move slow by 1, fast by 2, check collision\n  \n  return false;\n}\n\nconsole.log("Has cycle:", hasCycle(null));`,
      solutionHint: 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; } return false;',
      languageVariants: {
        javascript: {
          starterCode: `function hasCycle(head) {\n  let slow = head, fast = head;\n  // TODO: Fast & slow pointer collision check\n  \n  return false;\n}\n\nconsole.log("Has cycle:", hasCycle(null));`,
          solutionHint: 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; if (slow === fast) return true; } return false;'
        },
        python: {
          starterCode: `def has_cycle(head: ListNode | None) -> bool:\n    slow = fast = head\n    # TODO: Floyd cycle detection\n    \n    return False\n\nprint("Has cycle:", has_cycle(None))`,
          solutionHint: 'while fast and fast.next: slow = slow.next; fast = fast.next.next; if slow == fast: return True; return False'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        // TODO: Floyd cycle check\n        \n        return false;\n    }\n    public static void main(String[] args) {\n        System.out.println("Has cycle: " + hasCycle(null));\n    }\n}`,
          solutionHint: 'while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; if (slow == fast) return true; } return false;'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nbool hasCycle(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    // TODO: Floyd cycle check\n    \n    return false;\n}\n\nint main() {\n    std::cout << "Has cycle: " << (hasCycle(nullptr) ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: 'while (fast && fast->next) { slow = slow->next; fast = fast->next->next; if (slow == fast) return true; } return false;'
        }
      }
    },
    {
      id: 'll-mod-3',
      title: 'Module 3: Merge Two Sorted Linked Lists',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: 'Merge two sorted linked lists list1 and list2 and return the head of the new, sorted linked list by splicing together existing nodes in O(m + n) time.',
      constraints: ['Time Complexity: O(m + n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }
      ],
      starterCode: `function mergeTwoLists(list1, list2) {\n  const dummy = new ListNode(-1);\n  let tail = dummy;\n  // TODO: Splice smaller node until one list exhausted\n  \n  return dummy.next;\n}\n\nconsole.log("Merged:", mergeTwoLists(null, null));`,
      solutionHint: 'while (list1 && list2) { if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; } else { tail.next = list2; list2 = list2.next; } tail = tail.next; } tail.next = list1 || list2; return dummy.next;',
      languageVariants: {
        javascript: {
          starterCode: `function mergeTwoLists(list1, list2) {\n  const dummy = new ListNode(-1);\n  let tail = dummy;\n  // TODO: Splice smaller node\n  \n  return dummy.next;\n}`,
          solutionHint: 'while (list1 && list2) { if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; } else { tail.next = list2; list2 = list2.next; } tail = tail.next; } tail.next = list1 || list2; return dummy.next;'
        },
        python: {
          starterCode: `def merge_two_lists(list1: ListNode | None, list2: ListNode | None) -> ListNode | None:\n    dummy = ListNode(-1)\n    tail = dummy\n    # TODO: Merge two lists\n    \n    return dummy.next`,
          solutionHint: 'while list1 and list2: if list1.val <= list2.val: tail.next = list1; list1 = list1.next; else: tail.next = list2; list2 = list2.next; tail = tail.next; tail.next = list1 or list2; return dummy.next'
        },
        java: {
          starterCode: `public class Solution {\n    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(-1), tail = dummy;\n        // TODO: Merge two lists\n        \n        return dummy.next;\n    }\n}`,
          solutionHint: 'while (list1 != null && list2 != null) { if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; } else { tail.next = list2; list2 = list2.next; } tail = tail.next; } tail.next = (list1 != null) ? list1 : list2; return dummy.next;'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    ListNode dummy(-1);\n    ListNode* tail = &dummy;\n    // TODO: Merge two lists\n    \n    return dummy.next;\n}`,
          solutionHint: 'while (list1 && list2) { if (list1->val <= list2->val) { tail->next = list1; list1 = list1->next; } else { tail->next = list2; list2 = list2->next; } tail = tail->next; } tail->next = list1 ? list1 : list2; return dummy.next;'
        }
      }
    },
    {
      id: 'll-mod-4',
      title: 'Module 4: Remove Nth Node From End of List',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head in a single pass.',
      constraints: ['Time Complexity: O(n) single pass', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]' }
      ],
      starterCode: `function removeNthFromEnd(head, n) {\n  const dummy = new ListNode(0, head);\n  let fast = dummy, slow = dummy;\n  // TODO: Advance fast by n+1, then move both until fast is null\n  \n  return dummy.next;\n}`,
      solutionHint: 'for (let i = 0; i <= n; i++) fast = fast.next; while (fast) { slow = slow.next; fast = fast.next; } slow.next = slow.next.next; return dummy.next;',
      languageVariants: {
        javascript: {
          starterCode: `function removeNthFromEnd(head, n) {\n  const dummy = new ListNode(0, head);\n  let fast = dummy, slow = dummy;\n  // TODO: Fast gap pointer\n  \n  return dummy.next;\n}`,
          solutionHint: 'for (let i = 0; i <= n; i++) fast = fast.next; while (fast) { slow = slow.next; fast = fast.next; } slow.next = slow.next.next; return dummy.next;'
        },
        python: {
          starterCode: `def remove_nth_from_end(head: ListNode | None, n: int) -> ListNode | None:\n    dummy = ListNode(0, head)\n    fast = slow = dummy\n    # TODO: Remove Nth node\n    \n    return dummy.next`,
          solutionHint: 'for _ in range(n + 1): fast = fast.next; while fast: slow = slow.next; fast = fast.next; slow.next = slow.next.next; return dummy.next'
        },
        java: {
          starterCode: `public class Solution {\n    public static ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0, head), fast = dummy, slow = dummy;\n        // TODO: Remove Nth node\n        \n        return dummy.next;\n    }\n}`,
          solutionHint: 'for (int i = 0; i <= n; i++) fast = fast.next; while (fast != null) { slow = slow.next; fast = fast.next; } slow.next = slow.next.next; return dummy.next;'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nListNode* removeNthFromEnd(ListNode* head, int n) {\n    ListNode dummy(0, head);\n    ListNode *fast = &dummy, *slow = &dummy;\n    // TODO: Remove Nth node\n    \n    return dummy.next;\n}`,
          solutionHint: 'for (int i = 0; i <= n; i++) fast = fast->next; while (fast) { slow = slow->next; fast = fast->next; } slow->next = slow->next->next; return dummy.next;'
        }
      }
    },
    {
      id: 'll-mod-5',
      title: 'Module 5: Middle of the Linked List',
      difficulty: 'Easy',
      category: 'Linked Lists',
      description: 'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: '[1, 2, 3, 4, 5]', output: 'Node with value 3' },
        { input: '[1, 2, 3, 4, 5, 6]', output: 'Node with value 4' }
      ],
      starterCode: `function middleNode(head) {\n  let slow = head, fast = head;\n  // TODO: Advance slow by 1, fast by 2\n  \n  return slow;\n}`,
      solutionHint: 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; } return slow;',
      languageVariants: {
        javascript: {
          starterCode: `function middleNode(head) {\n  let slow = head, fast = head;\n  // TODO: Fast/slow pointers\n  \n  return slow;\n}`,
          solutionHint: 'while (fast && fast.next) { slow = slow.next; fast = fast.next.next; } return slow;'
        },
        python: {
          starterCode: `def middle_node(head: ListNode | None) -> ListNode | None:\n    slow = fast = head\n    # TODO: Find middle\n    \n    return slow`,
          solutionHint: 'while fast and fast.next: slow = slow.next; fast = fast.next.next; return slow'
        },
        java: {
          starterCode: `public class Solution {\n    public static ListNode middleNode(ListNode head) {\n        ListNode slow = head, fast = head;\n        // TODO: Find middle\n        \n        return slow;\n    }\n}`,
          solutionHint: 'while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; } return slow;'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nListNode* middleNode(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    // TODO: Find middle\n    \n    return slow;\n}`,
          solutionHint: 'while (fast && fast->next) { slow = slow->next; fast = fast->next->next; } return slow;'
        }
      }
    },
    {
      id: 'll-mod-6',
      title: 'Module 6: Palindrome Linked List Verification',
      difficulty: 'Medium',
      category: 'Linked Lists',
      description: 'Given the head of a singly linked list, return true if it is a palindrome in O(n) time and O(1) space by reversing the second half in-place.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: '[1, 2, 2, 1]', output: 'true' },
        { input: '[1, 2]', output: 'false' }
      ],
      starterCode: `function isPalindrome(head) {\n  // TODO: 1. Find middle, 2. Reverse second half, 3. Compare values\n  \n  return true;\n}`,
      solutionHint: 'Find middle with slow/fast pointers, reverse from slow onwards, and compare nodes from head and reversed second half.',
      languageVariants: {
        javascript: {
          starterCode: `function isPalindrome(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\n  let prev = null;\n  while (slow) { const nxt = slow.next; slow.next = prev; prev = slow; slow = nxt; }\n  while (prev) { if (head.val !== prev.val) return false; head = head.next; prev = prev.next; }\n  return true;\n}`,
          solutionHint: 'Reverse second half and compare node values step by step.'
        },
        python: {
          starterCode: `def is_palindrome(head: ListNode | None) -> bool:\n    slow = fast = head\n    while fast and fast.next: slow = slow.next; fast = fast.next.next\n    prev = None\n    while slow:\n        nxt = slow.next; slow.next = prev; prev = slow; slow = nxt\n    while prev:\n        if head.val != prev.val: return False\n        head, prev = head.next, prev.next\n    return True`,
          solutionHint: 'Reverse second half from middle in-place and compare values.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isPalindrome(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }\n        ListNode prev = null;\n        while (slow != null) { ListNode nxt = slow.next; slow.next = prev; prev = slow; slow = nxt; }\n        while (prev != null) { if (head.val != prev.val) return false; head = head.next; prev = prev.next; }\n        return true;\n    }\n}`,
          solutionHint: 'Reverse second half in-place and compare with first half.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nbool isPalindrome(ListNode* head) {\n    ListNode *slow = head, *fast = head;\n    while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }\n    ListNode *prev = nullptr;\n    while (slow) { ListNode* nxt = slow->next; slow->next = prev; prev = slow; slow = nxt; }\n    while (prev) { if (head->val != prev->val) return false; head = head->next; prev = prev->next; }\n    return true;\n}`,
          solutionHint: 'Reverse second half and compare corresponding elements.'
        }
      }
    },
    {
      id: 'll-mod-7',
      title: 'Module 7: Reverse Nodes in k-Group',
      difficulty: 'Hard',
      category: 'Linked Lists',
      description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list in O(n) time and O(1) extra space.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [
        { input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]' },
        { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]' }
      ],
      starterCode: `function reverseKGroup(head, k) {\n  let count = 0, ptr = head;\n  while (count < k && ptr) { ptr = ptr.next; count++; }\n  if (count === k) {\n    let reversedHead = reverseKGroup(ptr, k);\n    while (count > 0) {\n      const nxt = head.next;\n      head.next = reversedHead;\n      reversedHead = head;\n      head = nxt;\n      count--;\n    }\n    head = reversedHead;\n  }\n  return head;\n}`,
      solutionHint: 'Check if at least k nodes remain; recursively reverse k nodes and hook tail to subsequent group.',
      languageVariants: {
        javascript: {
          starterCode: `function reverseKGroup(head, k) {\n  let count = 0, ptr = head;\n  while (count < k && ptr) { ptr = ptr.next; count++; }\n  if (count === k) {\n    let reversedHead = reverseKGroup(ptr, k);\n    while (count > 0) {\n      const nxt = head.next; head.next = reversedHead; reversedHead = head; head = nxt; count--;\n    }\n    head = reversedHead;\n  }\n  return head;\n}`,
          solutionHint: 'Reverse k elements in current group and connect to recursively reversed rest.'
        },
        python: {
          starterCode: `def reverse_k_group(head: ListNode | None, k: int) -> ListNode | None:\n    count, ptr = 0, head\n    while count < k and ptr: ptr = ptr.next; count += 1\n    if count == k:\n        reversed_head = reverse_k_group(ptr, k)\n        while count > 0:\n            nxt = head.next; head.next = reversed_head; reversed_head = head; head = nxt; count -= 1\n        head = reversed_head\n    return head`,
          solutionHint: 'Count k nodes, reverse subgroup, and hook to recursive call on remaining list.'
        },
        java: {
          starterCode: `public class Solution {\n    public static ListNode reverseKGroup(ListNode head, int k) {\n        int count = 0;\n        ListNode ptr = head;\n        while (count < k && ptr != null) { ptr = ptr.next; count++; }\n        if (count == k) {\n            ListNode reversedHead = reverseKGroup(ptr, k);\n            while (count > 0) {\n                ListNode nxt = head.next; head.next = reversedHead; reversedHead = head; head = nxt; count--;\n            }\n            head = reversedHead;\n        }\n        return head;\n    }\n}`,
          solutionHint: 'Reverse k nodes and recursively recurse for the remainder.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nListNode* reverseKGroup(ListNode* head, int k) {\n    int count = 0;\n    ListNode* ptr = head;\n    while (count < k && ptr) { ptr = ptr->next; count++; }\n    if (count == k) {\n        ListNode* reversedHead = reverseKGroup(ptr, k);\n        while (count > 0) {\n            ListNode* nxt = head->next; head->next = reversedHead; reversedHead = head; head = nxt; count--;\n        }\n        head = reversedHead;\n    }\n    return head;\n}`,
          solutionHint: 'Iterate k steps, reverse group pointers, and splice into recursive result.'
        }
      }
    },
    {
      id: 'll-mod-8',
      title: 'Module 8: LRU Cache (Doubly Linked List + Hash Map)',
      difficulty: 'Hard',
      category: 'Linked Lists',
      description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) get and put operations using a doubly linked list and Map.',
      constraints: ['get and put must each run in O(1) average time', 'Capacity: 1 to 3000'],
      sampleInputs: [
        { input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: 'returns 1, -1 (evicted 2)' }
      ],
      starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const oldestKey = this.map.keys().next().value;\n      this.map.delete(oldestKey);\n    }\n    this.map.set(key, value);\n  }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1); cache.put(2, 2);\nconsole.log("Get 1:", cache.get(1));\ncache.put(3, 3);\nconsole.log("Get 2 (evicted):", cache.get(2));`,
      solutionHint: 'Maintain node access order using doubly linked list with head/tail sentinels and HashMap for O(1) lookups.',
      languageVariants: {
        javascript: {
          starterCode: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const val = this.map.get(key);\n    this.map.delete(key);\n    this.map.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.map.has(key)) this.map.delete(key);\n    else if (this.map.size >= this.capacity) {\n      const oldest = this.map.keys().next().value;\n      this.map.delete(oldest);\n    }\n    this.map.set(key, value);\n  }\n}`,
          solutionHint: 'Re-insert keys in Map to maintain access order or maintain DLL node references.'
        },
        python: {
          starterCode: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.cap = capacity\n        self.cache = OrderedDict()\n    def get(self, key: int) -> int:\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.cap:\n            self.cache.popitem(last=False)`,
          solutionHint: 'Use OrderedDict move_to_end and popitem(last=False) for O(1) operations.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private final int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) { return super.getOrDefault(key, -1); }\n    public void put(int key, int value) { super.put(key, value); }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) { return size() > capacity; }\n}`,
          solutionHint: 'Extend LinkedHashMap with access-order mode and override removeEldestEntry.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <unordered_map>\n#include <list>\n\nclass LRUCache {\n    int cap;\n    std::list<std::pair<int, int>> dll;\n    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> map;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        if (!map.count(key)) return -1;\n        dll.splice(dll.begin(), dll, map[key]);\n        return map[key]->second;\n    }\n    void put(int key, int value) {\n        if (map.count(key)) {\n            dll.splice(dll.begin(), dll, map[key]);\n            map[key]->second = value;\n            return;\n        }\n        if (dll.size() >= cap) {\n            map.erase(dll.back().first);\n            dll.pop_back();\n        }\n        dll.emplace_front(key, value);\n        map[key] = dll.begin();\n    }\n};`,
          solutionHint: 'Combine std::list doubly linked list with std::unordered_map storing iterators.'
        }
      }
    }
  ],

  'stacks': [
    {
      id: 'stk-mod-1',
      title: 'Module 1: Valid Parentheses Matching',
      difficulty: 'Easy',
      category: 'Stacks',
      description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid using a LIFO stack in O(n) linear time.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(n)'],
      sampleInputs: [
        { input: '"()[]{}"', output: 'true' },
        { input: '"(]"', output: 'false' }
      ],
      starterCode: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  // TODO: Push opening brackets, match closing against stack.pop()\n  \n  return stack.length === 0;\n}\n\nconsole.log("Is valid \'()[]{}\':", isValid("()[]{}"));`,
      solutionHint: 'for (const c of s) { if (map[c]) { if (stack.pop() !== map[c]) return false; } else stack.push(c); } return stack.length === 0;',
      languageVariants: {
        javascript: {
          starterCode: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (map[c]) { if (stack.pop() !== map[c]) return false; }\n    else stack.push(c);\n  }\n  return stack.length === 0;\n}`,
          solutionHint: 'Use stack to match corresponding bracket pairs.'
        },
        python: {
          starterCode: `def is_valid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in pairs:\n            if not stack or stack.pop() != pairs[c]: return False\n        else: stack.append(c)\n    return len(stack) == 0\n\nprint("Is valid:", is_valid("()[]{}"))`,
          solutionHint: 'Push opening brackets and pop matching pairs on closing brackets.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
          solutionHint: 'Push expected closing brackets onto stack and pop to verify matches.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <stack>\n\nbool isValid(const std::string& s) {\n    std::stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '{') st.push('}');\n        else if (c == '[') st.push(']');\n        else if (st.empty() || st.top() != c) return false;\n        else st.pop();\n    }\n    return st.empty();\n}`,
          solutionHint: 'Push complementary brackets onto std::stack.'
        }
      }
    },
    {
      id: 'stk-mod-2',
      title: 'Module 2: Min Stack with O(1) Retrieval',
      difficulty: 'Medium',
      category: 'Stacks',
      description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) constant time.',
      constraints: ['Methods push, pop, top, and getMin must operate in O(1) time'],
      sampleInputs: [
        { input: 'push(-2), push(0), push(-3), getMin() -> -3, pop(), top() -> 0, getMin() -> -2', output: 'Correct O(1) min values' }
      ],
      starterCode: `class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n    const min = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;\n    this.minStack.push(min);\n  }\n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}`,
      solutionHint: 'Track cumulative minimums in parallel minStack array.',
      languageVariants: {
        javascript: {
          starterCode: `class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = [];\n  }\n  push(val) {\n    this.stack.push(val);\n    const m = this.minStack.length ? Math.min(val, this.minStack[this.minStack.length - 1]) : val;\n    this.minStack.push(m);\n  }\n  pop() { this.stack.pop(); this.minStack.pop(); }\n  top() { return this.stack[this.stack.length - 1]; }\n  getMin() { return this.minStack[this.minStack.length - 1]; }\n}`,
          solutionHint: 'Push current minimum onto parallel minStack on every push.'
        },
        python: {
          starterCode: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        m = min(val, self.min_stack[-1]) if self.min_stack else val\n        self.min_stack.append(m)\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n    def top(self) -> int:\n        return self.stack[-1]\n    def get_min(self) -> int:\n        return self.min_stack[-1]`,
          solutionHint: 'Maintain dual stacks where min_stack holds prefix minimums.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass MinStack {\n    private Deque<Integer> stack = new ArrayDeque<>();\n    private Deque<Integer> minStack = new ArrayDeque<>();\n    public void push(int val) {\n        stack.push(val);\n        int m = minStack.isEmpty() ? val : Math.min(val, minStack.peek());\n        minStack.push(m);\n    }\n    public void pop() { stack.pop(); minStack.pop(); }\n    public int top() { return stack.peek(); }\n    public int getMin() { return minStack.peek(); }\n}`,
          solutionHint: 'Use two ArrayDeque instances to maintain values and cumulative minimums.'
        },
        cpp: {
          starterCode: `#include <stack>\n#include <algorithm>\n\nclass MinStack {\n    std::stack<int> st, minSt;\npublic:\n    void push(int val) {\n        st.push(val);\n        int m = minSt.empty() ? val : std::min(val, minSt.top());\n        minSt.push(m);\n    }\n    void pop() { st.pop(); minSt.pop(); }\n    int top() { return st.top(); }\n    int getMin() { return minSt.top(); }\n};`,
          solutionHint: 'Keep minSt in sync with st so getMin() runs in O(1).'
        }
      }
    },
    {
      id: 'stk-mod-3',
      title: 'Module 3: Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      category: 'Stacks',
      description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation (Postfix Notation) supporting +, -, *, / with truncation towards zero.',
      constraints: ['Valid RPN expression guaranteed', 'Division truncates towards zero'],
      sampleInputs: [
        { input: '["2", "1", "+", "3", "*"]', output: '9 ((2 + 1) * 3)' },
        { input: '["4", "13", "5", "/", "+"]', output: '6 (4 + (13 / 5))' }
      ],
      starterCode: `function evalRPN(tokens) {\n  const stack = [];\n  // TODO: Push numbers, pop two operands on operators\n  \n  return stack.pop();\n}\n\nconsole.log("RPN Result:", evalRPN(["2", "1", "+", "3", "*"]));`,
      solutionHint: 'for (const t of tokens) { if (!isNaN(t)) stack.push(Number(t)); else { const b = stack.pop(), a = stack.pop(); if (t === "+") stack.push(a + b); else if (t === "-") stack.push(a - b); else if (t === "*") stack.push(a * b); else stack.push(Math.trunc(a / b)); } } return stack.pop();',
      languageVariants: {
        javascript: {
          starterCode: `function evalRPN(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (["+", "-", "*", "/"].includes(t)) {\n      const b = stack.pop(), a = stack.pop();\n      if (t === "+") stack.push(a + b);\n      else if (t === "-") stack.push(a - b);\n      else if (t === "*") stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else stack.push(Number(t));\n  }\n  return stack.pop();\n}`,
          solutionHint: 'Use Math.trunc(a / b) for zero-truncated division.'
        },
        python: {
          starterCode: `def eval_rpn(tokens: list[str]) -> int:\n    stack = []\n    for t in tokens:\n        if t in {"+", "-", "*", "/"}:\n            b, a = stack.pop(), stack.pop()\n            if t == "+": stack.append(a + b)\n            elif t == "-": stack.append(a - b)\n            elif t == "*": stack.append(a * b)\n            else: stack.append(int(a / b))\n        else: stack.append(int(t))\n    return stack.pop()`,
          solutionHint: 'int(a / b) in Python truncates towards zero.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int evalRPN(String[] tokens) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (String t : tokens) {\n            if (t.equals("+")) stack.push(stack.pop() + stack.pop());\n            else if (t.equals("*")) stack.push(stack.pop() * stack.pop());\n            else if (t.equals("-")) { int b = stack.pop(), a = stack.pop(); stack.push(a - b); }\n            else if (t.equals("/")) { int b = stack.pop(), a = stack.pop(); stack.push(a / b); }\n            else stack.push(Integer.parseInt(t));\n        }\n        return stack.pop();\n    }\n}`,
          solutionHint: 'Pop operands b then a and apply operators.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <stack>\n\nint evalRPN(const std::vector<std::string>& tokens) {\n    std::stack<int> st;\n    for (const auto& t : tokens) {\n        if (t == "+" || t == "-" || t == "*" || t == "/") {\n            int b = st.top(); st.pop();\n            int a = st.top(); st.pop();\n            if (t == "+") st.push(a + b);\n            else if (t == "-") st.push(a - b);\n            else if (t == "*") st.push(a * b);\n            else st.push(a / b);\n        } else st.push(std::stoi(t));\n    }\n    return st.top();\n}`,
          solutionHint: 'Evaluate binary expressions using integer stack.'
        }
      }
    },
    {
      id: 'stk-mod-4',
      title: 'Module 4: Daily Temperatures (Monotonic Decreasing Stack)',
      difficulty: 'Medium',
      category: 'Stacks',
      description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(n)'],
      sampleInputs: [
        { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' }
      ],
      starterCode: `function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const result = new Array(n).fill(0);\n  const stack = []; // stores indices\n  // TODO: Monotonic decreasing stack\n  \n  return result;\n}`,
      solutionHint: 'for (let i = 0; i < n; i++) { while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) { const prevIdx = stack.pop(); result[prevIdx] = i - prevIdx; } stack.push(i); } return result;',
      languageVariants: {
        javascript: {
          starterCode: `function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const res = new Array(n).fill(0), stack = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop(); res[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return res;\n}`,
          solutionHint: 'Maintain monotonic decreasing index stack.'
        },
        python: {
          starterCode: `def daily_temperatures(temperatures: list[int]) -> list[int]:\n    res = [0] * len(temperatures)\n    stack = [] # indices\n    for i, t in enumerate(temperatures):\n        while stack and t > temperatures[stack[-1]]:\n            prev = stack.pop()\n            res[prev] = i - prev\n        stack.append(i)\n    return res`,
          solutionHint: 'Pop colder previous days whenever a warmer day is encountered.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] res = new int[n];\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n                int prev = stack.pop();\n                res[prev] = i - prev;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}`,
          solutionHint: 'Monotonic stack storing indices of days.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <stack>\n\nstd::vector<int> dailyTemperatures(const std::vector<int>& temperatures) {\n    int n = temperatures.size();\n    std::vector<int> res(n, 0);\n    std::stack<int> st;\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n            int prev = st.top(); st.pop();\n            res[prev] = i - prev;\n        }\n        st.push(i);\n    }\n    return res;\n}`,
          solutionHint: 'Monotonic decreasing stack for next greater element.'
        }
      }
    },
    {
      id: 'stk-mod-5',
      title: 'Module 5: Simplify Unix Canonical Path',
      difficulty: 'Medium',
      category: 'Stacks',
      description: 'Given an absolute path for a Unix-style file system, convert it to the simplified canonical path by resolving . (current dir), .. (parent dir), and duplicate slashes.',
      constraints: ['Path begins with single slash /', 'Components separated by /'],
      sampleInputs: [
        { input: '"/home//foo/"', output: '"/home/foo"' },
        { input: '"/../"', output: '"/"' },
        { input: '"/a/./b/../../c/"', output: '"/c"' }
      ],
      starterCode: `function simplifyPath(path) {\n  const parts = path.split('/');\n  const stack = [];\n  // TODO: Push valid dir names, pop on \'..\', ignore \'.\' and empty\n  \n  return '/' + stack.join('/');\n}`,
      solutionHint: 'for (const part of parts) { if (part === "" || part === ".") continue; if (part === "..") stack.pop(); else stack.push(part); } return "/" + stack.join("/");',
      languageVariants: {
        javascript: {
          starterCode: `function simplifyPath(path) {\n  const parts = path.split('/');\n  const stack = [];\n  for (const p of parts) {\n    if (p === '' || p === '.') continue;\n    if (p === '..') stack.pop();\n    else stack.push(p);\n  }\n  return '/' + stack.join('/');\n}`,
          solutionHint: 'Filter tokens with stack to eliminate relative paths.'
        },
        python: {
          starterCode: `def simplify_path(path: str) -> str:\n    stack = []\n    for part in path.split('/'):\n        if part == '' or part == '.': continue\n        if part == '..':\n            if stack: stack.pop()\n        else: stack.append(part)\n    return '/' + '/'.join(stack)`,
          solutionHint: 'Split by slash and manage directory hierarchy with stack.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static String simplifyPath(String path) {\n        Deque<String> stack = new ArrayDeque<>();\n        for (String p : path.split("/")) {\n            if (p.isEmpty() || p.equals(".")) continue;\n            if (p.equals("..")) { if (!stack.isEmpty()) stack.pop(); }\n            else stack.push(p);\n        }\n        List<String> list = new ArrayList<>(stack);\n        Collections.reverse(list);\n        return "/" + String.join("/", list);\n    }\n}`,
          solutionHint: 'Split path by / and pop on ".." elements.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n#include <sstream>\n\nstd::string simplifyPath(const std::string& path) {\n    std::stringstream ss(path);\n    std::string token;\n    std::vector<std::string> stack;\n    while (std::getline(ss, token, '/')) {\n        if (token == "" || token == ".") continue;\n        if (token == "..") { if (!stack.empty()) stack.pop_back(); }\n        else stack.push_back(token);\n    }\n    std::string res = "";\n    for (const auto& s : stack) res += "/" + s;\n    return res.empty() ? "/" : res;\n}`,
          solutionHint: 'Use stringstream to tokenize by slash delimiter.'
        }
      }
    },
    {
      id: 'stk-mod-6',
      title: 'Module 6: Decode String with Nested Counts',
      difficulty: 'Medium',
      category: 'Stacks',
      description: 'Given an encoded string such as 3[a2[c]], return its decoded string accaccacc using dual count & string stacks.',
      constraints: ['Digits k are positive integers', 'Brackets are well-formed'],
      sampleInputs: [
        { input: '"3[a]2[bc]"', output: '"aaabcbc"' },
        { input: '"3[a2[c]]"', output: '"accaccacc"' }
      ],
      starterCode: `function decodeString(s) {\n  const countStack = [], strStack = [];\n  let currStr = '', currNum = 0;\n  // TODO: Parse digits, handle \'[\' by pushing context, handle \']\' by repeating\n  \n  return currStr;\n}`,
      solutionHint: 'for (const c of s) { if (!isNaN(c)) currNum = currNum * 10 + Number(c); else if (c === "[") { countStack.push(currNum); strStack.push(currStr); currStr = ""; currNum = 0; } else if (c === "]") { currStr = strStack.pop() + currStr.repeat(countStack.pop()); } else currStr += c; } return currStr;',
      languageVariants: {
        javascript: {
          starterCode: `function decodeString(s) {\n  const countStack = [], strStack = [];\n  let currStr = '', currNum = 0;\n  for (const c of s) {\n    if (c >= '0' && c <= '9') currNum = currNum * 10 + Number(c);\n    else if (c === '[') { countStack.push(currNum); strStack.push(currStr); currStr = ''; currNum = 0; }\n    else if (c === ']') { currStr = strStack.pop() + currStr.repeat(countStack.pop()); }\n    else currStr += c;\n  }\n  return currStr;\n}`,
          solutionHint: 'Push previous string context on [ and repeat popped count on ].'
        },
        python: {
          starterCode: `def decode_string(s: str) -> str:\n    count_stack, str_stack = [], []\n    curr_str, curr_num = "", 0\n    for c in s:\n        if c.isdigit(): curr_num = curr_num * 10 + int(c)\n        elif c == '[':\n            count_stack.append(curr_num); str_stack.append(curr_str)\n            curr_str, curr_num = "", 0\n        elif c == ']':\n            curr_str = str_stack.pop() + curr_str * count_stack.pop()\n        else: curr_str += c\n    return curr_str`,
          solutionHint: 'Use counts and string stacks to handle nested repetitions.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static String decodeString(String s) {\n        Deque<Integer> countStack = new ArrayDeque<>();\n        Deque<StringBuilder> strStack = new ArrayDeque<>();\n        StringBuilder curr = new StringBuilder();\n        int k = 0;\n        for (char c : s.toCharArray()) {\n            if (Character.isDigit(c)) k = k * 10 + (c - '0');\n            else if (c == '[') {\n                countStack.push(k); strStack.push(curr);\n                curr = new StringBuilder(); k = 0;\n            } else if (c == ']') {\n                StringBuilder prev = strStack.pop();\n                int repeat = countStack.pop();\n                for (int i = 0; i < repeat; i++) prev.append(curr);\n                curr = prev;\n            } else curr.append(c);\n        }\n        return curr.toString();\n    }\n}`,
          solutionHint: 'Use StringBuilder with stacks to reconstruct nested sequences.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <stack>\n\nstd::string decodeString(const std::string& s) {\n    std::stack<int> countStack;\n    std::stack<std::string> strStack;\n    std::string curr = "";\n    int k = 0;\n    for (char c : s) {\n        if (isdigit(c)) k = k * 10 + (c - '0');\n        else if (c == '[') {\n            countStack.push(k); strStack.push(curr);\n            curr = ""; k = 0;\n        } else if (c == ']') {\n            std::string prev = strStack.top(); strStack.pop();\n            int repeat = countStack.top(); countStack.pop();\n            while (repeat--) prev += curr;\n            curr = prev;\n        } else curr += c;\n    }\n    return curr;\n}`,
          solutionHint: 'Accumulate multiplier k and push string state onto stacks.'
        }
      }
    },
    {
      id: 'stk-mod-7',
      title: 'Module 7: Largest Rectangle in Histogram',
      difficulty: 'Hard',
      category: 'Stacks',
      description: 'Given an array of integers heights representing the histogram bar height where the width of each bar is 1, return the area of the largest rectangle in O(n) linear time.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(n)'],
      sampleInputs: [
        { input: 'heights = [2,1,5,6,2,3]', output: '10' }
      ],
      starterCode: `function largestRectangleArea(heights) {\n  const stack = [];\n  let maxArea = 0;\n  // TODO: Monotonic increasing stack tracking index & height boundaries\n  \n  return maxArea;\n}`,
      solutionHint: 'for (let i = 0; i <= heights.length; i++) { const h = i === heights.length ? 0 : heights[i]; while (stack.length && h < heights[stack[stack.length - 1]]) { const height = heights[stack.pop()]; const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1; maxArea = Math.max(maxArea, height * width); } stack.push(i); } return maxArea;',
      languageVariants: {
        javascript: {
          starterCode: `function largestRectangleArea(heights) {\n  const stack = [];\n  let maxArea = 0;\n  for (let i = 0; i <= heights.length; i++) {\n    const h = i === heights.length ? 0 : heights[i];\n    while (stack.length && h < heights[stack[stack.length - 1]]) {\n      const height = heights[stack.pop()];\n      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}`,
          solutionHint: 'Append dummy 0 height to flush all remaining elements in monotonic stack.'
        },
        python: {
          starterCode: `def largest_rectangle_area(heights: list[int]) -> int:\n    stack = []\n    max_area = 0\n    for i in range(len(heights) + 1):\n        h = 0 if i == len(heights) else heights[i]\n        while stack and h < heights[stack[-1]]:\n            height = heights[stack.pop()]\n            width = i if not stack else i - stack[-1] - 1\n            max_area = max(max_area, height * width)\n        stack.append(i)\n    return max_area`,
          solutionHint: 'Monotonic stack calculates width bounded by previous smaller and current bar.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int largestRectangleArea(int[] heights) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        int maxArea = 0, n = heights.length;\n        for (int i = 0; i <= n; i++) {\n            int h = (i == n) ? 0 : heights[i];\n            while (!stack.isEmpty() && h < heights[stack.peek()]) {\n                int height = heights[stack.pop()];\n                int width = stack.isEmpty() ? i : i - stack.peek() - 1;\n                maxArea = Math.max(maxArea, height * width);\n            }\n            stack.push(i);\n        }\n        return maxArea;\n    }\n}`,
          solutionHint: 'Calculate rectangle area at boundary drop in O(n) total pops.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <stack>\n#include <algorithm>\n\nint largestRectangleArea(const std::vector<int>& heights) {\n    std::stack<int> st;\n    int maxArea = 0, n = heights.size();\n    for (int i = 0; i <= n; i++) {\n        int h = (i == n) ? 0 : heights[i];\n        while (!st.empty() && h < heights[st.top()]) {\n            int height = heights[st.top()]; st.pop();\n            int width = st.empty() ? i : i - st.top() - 1;\n            maxArea = std::max(maxArea, height * width);\n        }\n        st.push(i);\n    }\n    return maxArea;\n}`,
          solutionHint: 'Monotonic increasing stack evaluating maximal area.'
        }
      }
    },
    {
      id: 'stk-mod-8',
      title: 'Module 8: Basic Calculator with Parentheses & Signs',
      difficulty: 'Hard',
      category: 'Stacks',
      description: 'Implement a basic calculator to evaluate a simple expression string containing digits, +, -, (, ) and empty spaces in O(n) time.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(n)'],
      sampleInputs: [
        { input: '"(1+(4+5+2)-3)+(6+8)"', output: '23' },
        { input: '" 2-1 + 2 "', output: '3' }
      ],
      starterCode: `function calculate(s) {\n  let total = 0, curr = 0, sign = 1;\n  const stack = [];\n  // TODO: Parse numbers, handle signs, push state on \'(\', pop & combine on \')\'\n  \n  return total + sign * curr;\n}`,
      solutionHint: 'for (const c of s) { if (!isNaN(c) && c !== " ") curr = curr * 10 + Number(c); else if (c === "+") { total += sign * curr; curr = 0; sign = 1; } else if (c === "-") { total += sign * curr; curr = 0; sign = -1; } else if (c === "(") { stack.push(total); stack.push(sign); total = 0; sign = 1; } else if (c === ")") { total += sign * curr; curr = 0; total *= stack.pop(); total += stack.pop(); } } return total + sign * curr;',
      languageVariants: {
        javascript: {
          starterCode: `function calculate(s) {\n  let total = 0, curr = 0, sign = 1;\n  const stack = [];\n  for (const c of s) {\n    if (c >= '0' && c <= '9') curr = curr * 10 + Number(c);\n    else if (c === '+') { total += sign * curr; curr = 0; sign = 1; }\n    else if (c === '-') { total += sign * curr; curr = 0; sign = -1; }\n    else if (c === '(') { stack.push(total); stack.push(sign); total = 0; sign = 1; }\n    else if (c === ')') { total += sign * curr; curr = 0; total *= stack.pop(); total += stack.pop(); }\n  }\n  return total + sign * curr;\n}`,
          solutionHint: 'Push accumulator and preceding sign onto stack on ( and fold upon ).'
        },
        python: {
          starterCode: `def calculate(s: str) -> int:\n    total, curr, sign = 0, 0, 1\n    stack = []\n    for c in s:\n        if c.isdigit(): curr = curr * 10 + int(c)\n        elif c == '+': total += sign * curr; curr = 0; sign = 1\n        elif c == '-': total += sign * curr; curr = 0; sign = -1\n        elif c == '(':\n            stack.append(total); stack.append(sign)\n            total, sign = 0, 1\n        elif c == ')':\n            total += sign * curr; curr = 0\n            total *= stack.pop(); total += stack.pop()\n    return total + sign * curr`,
          solutionHint: 'Preserve accumulator and active sign in stack on parentheses entry.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int calculate(String s) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        int total = 0, curr = 0, sign = 1;\n        for (char c : s.toCharArray()) {\n            if (Character.isDigit(c)) curr = curr * 10 + (c - '0');\n            else if (c == '+') { total += sign * curr; curr = 0; sign = 1; }\n            else if (c == '-') { total += sign * curr; curr = 0; sign = -1; }\n            else if (c == '(') { stack.push(total); stack.push(sign); total = 0; sign = 1; }\n            else if (c == ')') { total += sign * curr; curr = 0; total *= stack.pop(); total += stack.pop(); }\n        }\n        return total + sign * curr;\n    }\n}`,
          solutionHint: 'Stack preserves arithmetic context across nested parentheses.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <stack>\n\nint calculate(const std::string& s) {\n    std::stack<int> st;\n    long long total = 0, curr = 0, sign = 1;\n    for (char c : s) {\n        if (isdigit(c)) curr = curr * 10 + (c - '0');\n        else if (c == '+') { total += sign * curr; curr = 0; sign = 1; }\n        else if (c == '-') { total += sign * curr; curr = 0; sign = -1; }\n        else if (c == '(') { st.push(total); st.push(sign); total = 0; sign = 1; }\n        else if (c == ')') { total += sign * curr; curr = 0; total *= st.top(); st.pop(); total += st.top(); st.pop(); }\n    }\n    return total + sign * curr;\n}`,
          solutionHint: 'Push total and sign on ( and resolve on ).'
        }
      }
    }
  ],

  'queues': [
    {
      id: 'que-mod-1',
      title: 'Module 1: Implement Queue using Two Stacks',
      difficulty: 'Easy',
      category: 'Queues',
      description: 'Implement a first in first out (FIFO) queue using only two standard stacks supporting push, pop, peek, and empty with amortized O(1) time complexity.',
      constraints: ['Amortized O(1) time per operation', 'Only standard stack operations allowed'],
      sampleInputs: [
        { input: 'push(1), push(2), peek() -> 1, pop() -> 1, empty() -> false', output: 'Correct FIFO sequence' }
      ],
      starterCode: `class MyQueue {\n  constructor() {\n    this.inStack = [];\n    this.outStack = [];\n  }\n  push(x) { this.inStack.push(x); }\n  pop() {\n    this.peek();\n    return this.outStack.pop();\n  }\n  peek() {\n    if (this.outStack.length === 0) {\n      while (this.inStack.length) this.outStack.push(this.inStack.pop());\n    }\n    return this.outStack[this.outStack.length - 1];\n  }\n  empty() { return this.inStack.length === 0 && this.outStack.length === 0; }\n}`,
      solutionHint: 'Transfer elements from inStack to outStack only when outStack is empty.',
      languageVariants: {
        javascript: {
          starterCode: `class MyQueue {\n  constructor() {\n    this.inStack = [];\n    this.outStack = [];\n  }\n  push(x) { this.inStack.push(x); }\n  pop() {\n    this.peek();\n    return this.outStack.pop();\n  }\n  peek() {\n    if (this.outStack.length === 0) {\n      while (this.inStack.length) this.outStack.push(this.inStack.pop());\n    }\n    return this.outStack[this.outStack.length - 1];\n  }\n  empty() { return this.inStack.length === 0 && this.outStack.length === 0; }\n}`,
          solutionHint: 'Amortized O(1) FIFO transfer.'
        },
        python: {
          starterCode: `class MyQueue:\n    def __init__(self):\n        self.in_stack = []\n        self.out_stack = []\n    def push(self, x: int) -> None:\n        self.in_stack.append(x)\n    def pop(self) -> int:\n        self.peek()\n        return self.out_stack.pop()\n    def peek(self) -> int:\n        if not self.out_stack:\n            while self.in_stack: self.out_stack.append(self.in_stack.pop())\n        return self.out_stack[-1]\n    def empty(self) -> bool:\n        return len(self.in_stack) == 0 and len(self.out_stack) == 0`,
          solutionHint: 'Transfer from in_stack to out_stack on peek/pop when out_stack is empty.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass MyQueue {\n    private Deque<Integer> inStack = new ArrayDeque<>();\n    private Deque<Integer> outStack = new ArrayDeque<>();\n    public void push(int x) { inStack.push(x); }\n    public int pop() { peek(); return outStack.pop(); }\n    public int peek() {\n        if (outStack.isEmpty()) {\n            while (!inStack.isEmpty()) outStack.push(inStack.pop());\n        }\n        return outStack.peek();\n    }\n    public boolean empty() { return inStack.isEmpty() && outStack.isEmpty(); }\n}`,
          solutionHint: 'Amortized O(1) transfer between two ArrayDeque stacks.'
        },
        cpp: {
          starterCode: `#include <stack>\n\nclass MyQueue {\n    std::stack<int> inSt, outSt;\npublic:\n    void push(int x) { inSt.push(x); }\n    int pop() { int val = peek(); outSt.pop(); return val; }\n    int peek() {\n        if (outSt.empty()) {\n            while (!inSt.empty()) { outSt.push(inSt.top()); inSt.pop(); }\n        }\n        return outSt.top();\n    }\n    bool empty() { return inSt.empty() && outSt.empty(); }\n};`,
          solutionHint: 'Two std::stack objects providing FIFO guarantees.'
        }
      }
    },
    {
      id: 'que-mod-2',
      title: 'Module 2: Design Circular Queue (Ring Buffer)',
      difficulty: 'Medium',
      category: 'Queues',
      description: 'Design a circular queue data structure using a fixed-size array supporting enQueue, deQueue, Front, Rear, isEmpty, and isFull in O(1) time without dynamic resizing.',
      constraints: ['O(1) time per method', 'Capacity fixed at initialization'],
      sampleInputs: [
        { input: 'MyCircularQueue(3), enQueue(1), enQueue(2), enQueue(3), enQueue(4) -> false, Rear() -> 3', output: 'Ring buffer wrap around' }
      ],
      starterCode: `class MyCircularQueue {\n  constructor(k) {\n    this.buffer = new Array(k);\n    this.capacity = k;\n    this.head = 0;\n    this.tail = 0;\n    this.size = 0;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    this.buffer[this.tail] = value;\n    this.tail = (this.tail + 1) % this.capacity;\n    this.size++;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.capacity;\n    this.size--;\n    return true;\n  }\n  Front() { return this.isEmpty() ? -1 : this.buffer[this.head]; }\n  Rear() { return this.isEmpty() ? -1 : this.buffer[(this.tail - 1 + this.capacity) % this.capacity]; }\n  isEmpty() { return this.size === 0; }\n  isFull() { return this.size === this.capacity; }\n}`,
      solutionHint: 'Advance pointers with modulo arithmetic: (ptr + 1) % capacity.',
      languageVariants: {
        javascript: {
          starterCode: `class MyCircularQueue {\n  constructor(k) {\n    this.buffer = new Array(k);\n    this.capacity = k;\n    this.head = 0; this.tail = 0; this.size = 0;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    this.buffer[this.tail] = value;\n    this.tail = (this.tail + 1) % this.capacity;\n    this.size++;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.capacity;\n    this.size--;\n    return true;\n  }\n  Front() { return this.isEmpty() ? -1 : this.buffer[this.head]; }\n  Rear() { return this.isEmpty() ? -1 : this.buffer[(this.tail - 1 + this.capacity) % this.capacity]; }\n  isEmpty() { return this.size === 0; }\n  isFull() { return this.size === this.capacity; }\n}`,
          solutionHint: 'Use modulo wrapping for head and tail indexes.'
        },
        python: {
          starterCode: `class MyCircularQueue:\n    def __init__(self, k: int):\n        self.buffer = [0] * k\n        self.cap = k\n        self.head = self.tail = self.size = 0\n    def en_queue(self, value: int) -> bool:\n        if self.is_full(): return False\n        self.buffer[self.tail] = value\n        self.tail = (self.tail + 1) % self.cap\n        self.size += 1\n        return True\n    def de_queue(self) -> bool:\n        if self.is_empty(): return False\n        self.head = (self.head + 1) % self.cap\n        self.size -= 1\n        return True\n    def front(self) -> int: return -1 if self.is_empty() else self.buffer[self.head]\n    def rear(self) -> int: return -1 if self.is_empty() else self.buffer[(self.tail - 1 + self.cap) % self.cap]\n    def is_empty(self) -> bool: return self.size == 0\n    def is_full(self) -> bool: return self.size == self.cap`,
          solutionHint: 'Maintain size count and modular pointer arithmetic.'
        },
        java: {
          starterCode: `class MyCircularQueue {\n    private int[] buffer;\n    private int head = 0, tail = 0, size = 0, cap;\n    public MyCircularQueue(int k) { this.buffer = new int[k]; this.cap = k; }\n    public boolean enQueue(int value) {\n        if (isFull()) return false;\n        buffer[tail] = value;\n        tail = (tail + 1) % cap;\n        size++;\n        return true;\n    }\n    public boolean deQueue() {\n        if (isEmpty()) return false;\n        head = (head + 1) % cap;\n        size--;\n        return true;\n    }\n    public int Front() { return isEmpty() ? -1 : buffer[head]; }\n    public int Rear() { return isEmpty() ? -1 : buffer[(tail - 1 + cap) % cap]; }\n    public boolean isEmpty() { return size == 0; }\n    public boolean isFull() { return size == cap; }\n}`,
          solutionHint: 'Array indexing with modular arithmetic.'
        },
        cpp: {
          starterCode: `#include <vector>\n\nclass MyCircularQueue {\n    std::vector<int> buffer;\n    int head = 0, tail = 0, size = 0, cap;\npublic:\n    MyCircularQueue(int k) : buffer(k, 0), cap(k) {}\n    bool enQueue(int value) {\n        if (isFull()) return false;\n        buffer[tail] = value;\n        tail = (tail + 1) % cap;\n        size++;\n        return true;\n    }\n    bool deQueue() {\n        if (isEmpty()) return false;\n        head = (head + 1) % cap;\n        size--;\n        return true;\n    }\n    int Front() { return isEmpty() ? -1 : buffer[head]; }\n    int Rear() { return isEmpty() ? -1 : buffer[(tail - 1 + cap) % cap]; }\n    bool isEmpty() { return size == 0; }\n    bool isFull() { return size == cap; }\n};`,
          solutionHint: 'Wrap head and tail with (ptr + 1) % cap.'
        }
      }
    },
    {
      id: 'que-mod-3',
      title: 'Module 3: First Unique Character in Data Stream',
      difficulty: 'Medium',
      category: 'Queues',
      description: 'Design a stream processor that accepts characters one by one and returns the first unique (non-repeating) character in the stream in O(1) amortized time using a queue and frequency array.',
      constraints: ['Lowercase English characters', 'O(1) amortized lookup per query'],
      sampleInputs: [
        { input: 'add("a"), add("a"), add("b"), add("c"), getFirstUnique() -> "b"', output: 'Correct first non-repeating character' }
      ],
      starterCode: `class FirstUniqueStream {\n  constructor() {\n    this.queue = [];\n    this.counts = {};\n  }\n  add(char) {\n    this.counts[char] = (this.counts[char] || 0) + 1;\n    this.queue.push(char);\n  }\n  getFirstUnique() {\n    while (this.queue.length && this.counts[this.queue[0]] > 1) {\n      this.queue.shift();\n    }\n    return this.queue.length ? this.queue[0] : null;\n  }\n}`,
      solutionHint: 'Pop front elements from queue as soon as their frequency exceeds 1.',
      languageVariants: {
        javascript: {
          starterCode: `class FirstUniqueStream {\n  constructor() {\n    this.queue = [];\n    this.counts = {};\n  }\n  add(char) {\n    this.counts[char] = (this.counts[char] || 0) + 1;\n    this.queue.push(char);\n  }\n  getFirstUnique() {\n    while (this.queue.length && this.counts[this.queue[0]] > 1) this.queue.shift();\n    return this.queue.length ? this.queue[0] : null;\n  }\n}`,
          solutionHint: 'Shift duplicate characters off the queue lazily.'
        },
        python: {
          starterCode: `from collections import deque, Counter\n\nclass FirstUniqueStream:\n    def __init__(self):\n        self.queue = deque()\n        self.counts = Counter()\n    def add(self, char: str) -> None:\n        self.counts[char] += 1\n        self.queue.append(char)\n    def get_first_unique(self) -> str | None:\n        while self.queue and self.counts[self.queue[0]] > 1:\n            self.queue.popleft()\n        return self.queue[0] if self.queue else None`,
          solutionHint: 'Maintain FIFO queue and popleft while front element is duplicated.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass FirstUniqueStream {\n    private Deque<Character> queue = new ArrayDeque<>();\n    private int[] counts = new int[26];\n    public void add(char c) {\n        counts[c - 'a']++;\n        queue.offer(c);\n    }\n    public Character getFirstUnique() {\n        while (!queue.isEmpty() && counts[queue.peek() - 'a'] > 1) queue.poll();\n        return queue.isEmpty() ? null : queue.peek();\n    }\n}`,
          solutionHint: 'ArrayDeque queue with 26-slot alphabet frequency array.'
        },
        cpp: {
          starterCode: `#include <queue>\n#include <vector>\n\nclass FirstUniqueStream {\n    std::queue<char> q;\n    std::vector<int> counts = std::vector<int>(26, 0);\npublic:\n    void add(char c) {\n        counts[c - 'a']++;\n        q.push(c);\n    }\n    char getFirstUnique() {\n        while (!q.empty() && counts[q.front() - 'a'] > 1) q.pop();\n        return q.empty() ? '#' : q.front();\n    }\n};`,
          solutionHint: 'Use std::queue combined with ASCII counts.'
        }
      }
    },
    {
      id: 'que-mod-4',
      title: 'Module 4: Binary Tree Level Order Traversal (BFS)',
      difficulty: 'Medium',
      category: 'Queues',
      description: 'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level) using a FIFO queue in O(n) time.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(n)'],
      sampleInputs: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
      ],
      starterCode: `function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  // TODO: Level by level BFS\n  \n  return result;\n}`,
      solutionHint: 'while (queue.length) { const levelSize = queue.length, level = []; for (let i = 0; i < levelSize; i++) { const node = queue.shift(); level.push(node.val); if (node.left) queue.push(node.left); if (node.right) queue.push(node.right); } result.push(level); } return result;',
      languageVariants: {
        javascript: {
          starterCode: `function levelOrder(root) {\n  if (!root) return [];\n  const res = [], queue = [root];\n  while (queue.length) {\n    const size = queue.length, level = [];\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift(); level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(level);\n  }\n  return res;\n}`,
          solutionHint: 'Loop level by level by freezing queue.length at start of each iteration.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef level_order(root) -> list[list[int]]:\n    if not root: return []\n    res, q = [], deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res`,
          solutionHint: 'Queue BFS tracking nodes per level with deque.popleft().'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> res = new ArrayList<>();\n        if (root == null) return res;\n        Deque<TreeNode> q = new ArrayDeque<>();\n        q.offer(root);\n        while (!q.isEmpty()) {\n            int size = q.size();\n            List<Integer> level = new ArrayList<>();\n            for (int i = 0; i < size; i++) {\n                TreeNode node = q.poll();\n                level.add(node.val);\n                if (node.left != null) q.offer(node.left);\n                if (node.right != null) q.offer(node.right);\n            }\n            res.add(level);\n        }\n        return res;\n    }\n}`,
          solutionHint: 'Level-by-level breadth first search.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n\nstd::vector<std::vector<int>> levelOrder(TreeNode* root) {\n    std::vector<std::vector<int>> res;\n    if (!root) return res;\n    std::queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int size = q.size();\n        std::vector<int> level;\n        for (int i = 0; i < size; i++) {\n            TreeNode* node = q.front(); q.pop();\n            level.push_back(node->val);\n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n        res.push_back(level);\n    }\n    return res;\n}`,
          solutionHint: 'BFS queue level traversal.'
        }
      }
    },
    {
      id: 'que-mod-5',
      title: 'Module 5: Rotting Oranges (Multi-Source BFS)',
      difficulty: 'Medium',
      category: 'Queues',
      description: 'Given an m x n grid where 0 is empty, 1 is fresh orange, and 2 is rotten orange, return the minimum number of minutes until no fresh orange remains using multi-source BFS queue.',
      constraints: ['Time Complexity: O(m * n)', 'Space Complexity: O(m * n)'],
      sampleInputs: [
        { input: '[[2,1,1],[1,1,0],[0,1,1]]', output: '4' }
      ],
      starterCode: `function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length;\n  const queue = [];\n  let fresh = 0, minutes = 0;\n  // TODO: Enqueue all rotten (2), count fresh (1), multi-source BFS step by step\n  \n  return fresh === 0 ? minutes : -1;\n}`,
      solutionHint: 'Enqueue all starting rotten oranges with timestamp; decrement fresh on 4-directional spread.',
      languageVariants: {
        javascript: {
          starterCode: `function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length, queue = [];\n  let fresh = 0, minutes = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) queue.push([r, c]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];\n  while (queue.length && fresh > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2; fresh--; queue.push([nr, nc]);\n        }\n      }\n    }\n    minutes++;\n  }\n  return fresh === 0 ? minutes : -1;\n}`,
          solutionHint: 'Multi-source BFS spreading rot layer by layer.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef oranges_rotting(grid: list[list[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 2: q.append((r, c))\n            elif grid[r][c] == 1: fresh += 1\n    minutes = 0\n    dirs = [(1,0),(-1,0),(0,1),(0,-1)]\n    while q and fresh > 0:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in dirs:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2; fresh -= 1; q.append((nr, nc))\n        minutes += 1\n    return minutes if fresh == 0 else -1`,
          solutionHint: 'Enqueue all starting rotten oranges and run simultaneous BFS.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length, fresh = 0, minutes = 0;\n        Deque<int[]> q = new ArrayDeque<>();\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.offer(new int[]{r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        int[][] dirs = {{1,0},{-1,0},{0,1},{0,-1}};\n        while (!q.isEmpty() && fresh > 0) {\n            int size = q.size();\n            for (int i = 0; i < size; i++) {\n                int[] curr = q.poll();\n                for (int[] d : dirs) {\n                    int nr = curr[0] + d[0], nc = curr[1] + d[1];\n                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2; fresh--; q.offer(new int[]{nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n}`,
          solutionHint: 'Multi-source queue BFS.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n\nint orangesRotting(std::vector<std::vector<int>>& grid) {\n    int m = grid.size(), n = grid[0].size(), fresh = 0, minutes = 0;\n    std::queue<std::pair<int, int>> q;\n    for (int r = 0; r < m; r++)\n        for (int c = 0; c < n; c++) {\n            if (grid[r][c] == 2) q.push({r, c});\n            else if (grid[r][c] == 1) fresh++;\n        }\n    int dirs[4][2] = {{1,0},{-1,0},{0,1},{0,-1}};\n    while (!q.empty() && fresh > 0) {\n        int size = q.size();\n        for (int i = 0; i < size; i++) {\n            auto [r, c] = q.front(); q.pop();\n            for (auto& d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                    grid[nr][nc] = 2; fresh--; q.push({nr, nc});\n                }\n            }\n        }\n        minutes++;\n    }\n    return fresh == 0 ? minutes : -1;\n}`,
          solutionHint: 'BFS queue spreads infection layer by layer.'
        }
      }
    },
    {
      id: 'que-mod-6',
      title: 'Module 6: Sliding Window Moving Average',
      difficulty: 'Easy',
      category: 'Queues',
      description: 'Given a stream of integers and a window size size, calculate the moving average of all integers in the sliding window in O(1) time using a queue.',
      constraints: ['O(1) time per next() call', 'Space: O(size)'],
      sampleInputs: [
        { input: 'MovingAverage(3), next(1) -> 1.0, next(10) -> 5.5, next(3) -> 4.67, next(5) -> 6.0', output: 'Sliding averages' }
      ],
      starterCode: `class MovingAverage {\n  constructor(size) {\n    this.size = size;\n    this.queue = [];\n    this.sum = 0;\n  }\n  next(val) {\n    this.sum += val;\n    this.queue.push(val);\n    if (this.queue.length > this.size) this.sum -= this.queue.shift();\n    return this.sum / this.queue.length;\n  }\n}`,
      solutionHint: 'Add new val to sum and subtract shifted oldest element when window size exceeds capacity.',
      languageVariants: {
        javascript: {
          starterCode: `class MovingAverage {\n  constructor(size) {\n    this.size = size;\n    this.queue = [];\n    this.sum = 0;\n  }\n  next(val) {\n    this.sum += val;\n    this.queue.push(val);\n    if (this.queue.length > this.size) this.sum -= this.queue.shift();\n    return this.sum / this.queue.length;\n  }\n}`,
          solutionHint: 'Maintain running sum and sliding window queue.'
        },
        python: {
          starterCode: `from collections import deque\n\nclass MovingAverage:\n    def __init__(self, size: int):\n        self.size = size\n        self.queue = deque()\n        self.total = 0.0\n    def next(self, val: int) -> float:\n        self.total += val\n        self.queue.append(val)\n        if len(self.queue) > self.size:\n            self.total -= self.queue.popleft()\n        return self.total / len(self.queue)`,
          solutionHint: 'deque popleft maintains window size.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass MovingAverage {\n    private Deque<Integer> queue = new ArrayDeque<>();\n    private int size;\n    private double sum = 0;\n    public MovingAverage(int size) { this.size = size; }\n    public double next(int val) {\n        sum += val;\n        queue.offer(val);\n        if (queue.size() > size) sum -= queue.poll();\n        return sum / queue.size();\n    }\n}`,
          solutionHint: 'ArrayDeque with running sum.'
        },
        cpp: {
          starterCode: `#include <queue>\n\nclass MovingAverage {\n    std::queue<int> q;\n    int cap;\n    double sum = 0;\npublic:\n    MovingAverage(int size) : cap(size) {}\n    double next(int val) {\n        sum += val;\n        q.push(val);\n        if (q.size() > cap) { sum -= q.front(); q.pop(); }\n        return sum / q.size();\n    }\n};`,
          solutionHint: 'std::queue sliding window running sum.'
        }
      }
    },
    {
      id: 'que-mod-7',
      title: 'Module 7: Task Scheduler with Cooldown',
      difficulty: 'Medium',
      category: 'Queues',
      description: 'Given a characters array tasks representing CPU tasks (A through Z) and cooling time n, return the least number of CPU intervals required to finish all tasks.',
      constraints: ['Time Complexity: O(tasks.length)', 'Space Complexity: O(1) fixed alphabet'],
      sampleInputs: [
        { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8 (A -> B -> idle -> A -> B -> idle -> A -> B)' }
      ],
      starterCode: `function leastInterval(tasks, n) {\n  const freq = {};\n  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;\n  const maxFreq = Math.max(...Object.values(freq));\n  let maxCount = 0;\n  for (const f of Object.values(freq)) if (f === maxFreq) maxCount++;\n  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n}`,
      solutionHint: 'Formula: (maxFreq - 1) * (n + 1) + count of tasks with max frequency, bounded below by total tasks.',
      languageVariants: {
        javascript: {
          starterCode: `function leastInterval(tasks, n) {\n  const freq = {};\n  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;\n  const maxFreq = Math.max(...Object.values(freq));\n  let maxCount = 0;\n  for (const f of Object.values(freq)) if (f === maxFreq) maxCount++;\n  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n}`,
          solutionHint: 'Calculate idle slots required by most frequent task.'
        },
        python: {
          starterCode: `from collections import Counter\n\ndef least_interval(tasks: list[str], n: int) -> int:\n    counts = Counter(tasks)\n    max_freq = max(counts.values())\n    max_count = sum(1 for v in counts.values() if v == max_freq)\n    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)`,
          solutionHint: 'Greedy scheduling formula with cooldown interval math.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int leastInterval(char[] tasks, int n) {\n        int[] counts = new int[26];\n        for (char c : tasks) counts[c - 'A']++;\n        int maxFreq = 0, maxCount = 0;\n        for (int c : counts) maxFreq = Math.max(maxFreq, c);\n        for (int c : counts) if (c == maxFreq) maxCount++;\n        return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n    }\n}`,
          solutionHint: 'Use 26-slot frequency table to find highest frequency count.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint leastInterval(const std::vector<char>& tasks, int n) {\n    std::vector<int> counts(26, 0);\n    for (char c : tasks) counts[c - 'A']++;\n    int maxFreq = *std::max_element(counts.begin(), counts.end());\n    int maxCount = std::count(counts.begin(), counts.end(), maxFreq);\n    return std::max((int)tasks.size(), (maxFreq - 1) * (n + 1) + maxCount);\n}`,
          solutionHint: 'Count maximum occurrences and apply cooling slot formula.'
        }
      }
    },
    {
      id: 'que-mod-8',
      title: 'Module 8: Shortest Path in Binary Matrix (8-Directional BFS)',
      difficulty: 'Hard',
      category: 'Queues',
      description: 'Given an n x n binary matrix grid, return the length of the shortest clear path from top-left (0, 0) to bottom-right (n - 1, n - 1) moving in 8 directions using BFS queue.',
      constraints: ['Path exists only through 0 cells', 'Time Complexity: O(n^2)'],
      sampleInputs: [
        { input: 'grid = [[0,0,0],[1,1,0],[1,1,0]]', output: '4' },
        { input: 'grid = [[1,0,0],[1,1,0],[1,1,0]]', output: '-1' }
      ],
      starterCode: `function shortestPathBinaryMatrix(grid) {\n  const n = grid.length;\n  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;\n  const queue = [[0, 0, 1]]; // r, c, dist\n  grid[0][0] = 1; // visited\n  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];\n  while (queue.length) {\n    const [r, c, dist] = queue.shift();\n    if (r === n - 1 && c === n - 1) return dist;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {\n        grid[nr][nc] = 1;\n        queue.push([nr, nc, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
      solutionHint: '8-directional BFS marks visited immediately on enqueue for optimal O(V+E) performance.',
      languageVariants: {
        javascript: {
          starterCode: `function shortestPathBinaryMatrix(grid) {\n  const n = grid.length;\n  if (grid[0][0] !== 0 || grid[n - 1][n - 1] !== 0) return -1;\n  const queue = [[0, 0, 1]];\n  grid[0][0] = 1;\n  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];\n  while (queue.length) {\n    const [r, c, dist] = queue.shift();\n    if (r === n - 1 && c === n - 1) return dist;\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {\n        grid[nr][nc] = 1; queue.push([nr, nc, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}`,
          solutionHint: '8-directional queue BFS finding shortest distance.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef shortest_path_binary_matrix(grid: list[list[int]]) -> int:\n    n = len(grid)\n    if grid[0][0] != 0 or grid[n - 1][n - 1] != 0: return -1\n    q = deque([(0, 0, 1)])\n    grid[0][0] = 1\n    dirs = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]\n    while q:\n        r, c, dist = q.popleft()\n        if r == n - 1 and c == n - 1: return dist\n        for dr, dc in dirs:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < n and 0 <= nc < n and grid[nr][nc] == 0:\n                grid[nr][nc] = 1\n                q.append((nr, nc, dist + 1))\n    return -1`,
          solutionHint: '8-directional BFS with immediate visited mark.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int shortestPathBinaryMatrix(int[][] grid) {\n        int n = grid.length;\n        if (grid[0][0] != 0 || grid[n - 1][n - 1] != 0) return -1;\n        Deque<int[]> q = new ArrayDeque<>();\n        q.offer(new int[]{0, 0, 1});\n        grid[0][0] = 1;\n        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};\n        while (!q.isEmpty()) {\n            int[] curr = q.poll();\n            int r = curr[0], c = curr[1], dist = curr[2];\n            if (r == n - 1 && c == n - 1) return dist;\n            for (int[] d : dirs) {\n                int nr = r + d[0], nc = c + d[1];\n                if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {\n                    grid[nr][nc] = 1;\n                    q.offer(new int[]{nr, nc, dist + 1});\n                }\n            }\n        }\n        return -1;\n    }\n}`,
          solutionHint: '8-neighbor BFS using ArrayDeque.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n\nint shortestPathBinaryMatrix(std::vector<std::vector<int>>& grid) {\n    int n = grid.size();\n    if (grid[0][0] != 0 || grid[n - 1][n - 1] != 0) return -1;\n    std::queue<std::tuple<int, int, int>> q;\n    q.push({0, 0, 1});\n    grid[0][0] = 1;\n    int dirs[8][2] = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};\n    while (!q.empty()) {\n        auto [r, c, dist] = q.front(); q.pop();\n        if (r == n - 1 && c == n - 1) return dist;\n        for (auto& d : dirs) {\n            int nr = r + d[0], nc = c + d[1];\n            if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0) {\n                grid[nr][nc] = 1;\n                q.push({nr, nc, dist + 1});\n            }\n        }\n    }\n    return -1;\n}`,
          solutionHint: '8-directional grid search with std::queue.'
        }
      }
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
      solutionHint: 'Use data.filter(Boolean).map(x => x * 2)',
      languageVariants: {
        javascript: {
          starterCode: `function process${modNum}(data) {\n  // TODO: Implement ${topicTitle} Module ${modNum} processing logic\n  return data.map(x => x * 2);\n}\n\nconsole.log(process${modNum}([10, 20, 30]));`,
          solutionHint: 'Use data.filter(Boolean).map(x => x * 2)'
        },
        python: {
          starterCode: `def process_${modNum}(data: list[int]) -> list[int]:\n    # TODO: Implement ${topicTitle} Module ${modNum} processing logic\n    return [x * 2 for x in data]\n\nprint(process_${modNum}([10, 20, 30]))`,
          solutionHint: 'return [x * 2 for x in data if x is not None]'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int[] process${modNum}(int[] data) {\n        // TODO: Implement ${topicTitle} Module ${modNum} processing logic\n        return Arrays.stream(data).map(x -> x * 2).toArray();\n    }\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(process${modNum}(new int[]{10, 20, 30})));\n    }\n}`,
          solutionHint: 'return Arrays.stream(data).map(x -> x * 2).toArray();'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nstd::vector<int> process${modNum}(const std::vector<int>& data) {\n    std::vector<int> res;\n    for (int x : data) res.push_back(x * 2);\n    return res;\n}\n\nint main() {\n    auto res = process${modNum}({10, 20, 30});\n    for (int x : res) std::cout << x << " ";\n    std::cout << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (int x : data) res.push_back(x * 2); return res;'
        }
      }
    },
    {
      title: `${modNum}. ${topicTitle} Frequency Lookup Map`,
      difficulty: 'Medium' as const,
      description: `Build an efficient hash frequency map for ${topicTitle} elements in Module ${modNum}.`,
      constraints: ['Space Complexity: O(n)', 'O(1) lookup speed'],
      sampleInputs: [{ input: 'items = ["a", "b", "a"]', output: '{"a": 2, "b": 1}' }],
      starterCode: `function countFrequency(items) {\n  const map = {};\n  // TODO: Count occurrences of each item in map\n  \n  return map;\n}\n\nconsole.log(countFrequency(["a", "b", "a"]));`,
      solutionHint: 'Loop items: map[item] = (map[item] || 0) + 1',
      languageVariants: {
        javascript: {
          starterCode: `function countFrequency(items) {\n  const map = {};\n  // TODO: Count occurrences of each item in map\n  \n  return map;\n}\n\nconsole.log(countFrequency(["a", "b", "a"]));`,
          solutionHint: 'Loop items: map[item] = (map[item] || 0) + 1'
        },
        python: {
          starterCode: `def count_frequency(items: list[str]) -> dict[str, int]:\n    freq = {}\n    # TODO: Build frequency dictionary\n    \n    return freq\n\nprint(count_frequency(["a", "b", "a"]))`,
          solutionHint: 'for item in items: freq[item] = freq.get(item, 0) + 1; return freq'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static Map<String, Integer> countFrequency(String[] items) {\n        Map<String, Integer> map = new HashMap<>();\n        // TODO: Frequency map\n        \n        return map;\n    }\n    public static void main(String[] args) {\n        System.out.println(countFrequency(new String[]{"a", "b", "a"}));\n    }\n}`,
          solutionHint: 'for (String s : items) map.put(s, map.getOrDefault(s, 0) + 1); return map;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n\nstd::unordered_map<std::string, int> countFrequency(const std::vector<std::string>& items) {\n    std::unordered_map<std::string, int> map;\n    // TODO: Frequency map\n    \n    return map;\n}\n\nint main() {\n    auto res = countFrequency({"a", "b", "a"});\n    for (const auto& [k, v] : res) std::cout << k << ": " << v << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (const auto& item : items) map[item]++; return map;'
        }
      }
    },
    {
      title: `${modNum}. ${topicTitle} Optimization & Boundary Validation`,
      difficulty: 'Hard' as const,
      description: `Optimize ${topicTitle} execution for large datasets while validating boundary constraints.`,
      constraints: ['Optimized linear pass', 'Handle negative integers'],
      sampleInputs: [{ input: 'nums = [5, 1, 9, 3]', output: '9' }],
      starterCode: `function findMaxOptimal(nums) {\n  let max = nums[0];\n  // TODO: Single pass max search\n  \n  return max;\n}\n\nconsole.log(findMaxOptimal([5, 1, 9, 3]));`,
      solutionHint: 'Iterate nums: if (nums[i] > max) max = nums[i]',
      languageVariants: {
        javascript: {
          starterCode: `function findMaxOptimal(nums) {\n  let max = nums[0];\n  // TODO: Single pass max search\n  \n  return max;\n}\n\nconsole.log(findMaxOptimal([5, 1, 9, 3]));`,
          solutionHint: 'Iterate nums: if (nums[i] > max) max = nums[i]'
        },
        python: {
          starterCode: `def find_max_optimal(nums: list[int]) -> int:\n    max_val = nums[0]\n    # TODO: Linear search\n    \n    return max_val\n\nprint(find_max_optimal([5, 1, 9, 3]))`,
          solutionHint: 'for num in nums[1:]: if num > max_val: max_val = num; return max_val'
        },
        java: {
          starterCode: `public class Solution {\n    public static int findMaxOptimal(int[] nums) {\n        int max = nums[0];\n        // TODO: Linear max search\n        \n        return max;\n    }\n    public static void main(String[] args) {\n        System.out.println(findMaxOptimal(new int[]{5, 1, 9, 3}));\n    }\n}`,
          solutionHint: 'for (int i = 1; i < nums.length; i++) if (nums[i] > max) max = nums[i]; return max;'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint findMaxOptimal(const std::vector<int>& nums) {\n    int maxVal = nums[0];\n    // TODO: Linear max search\n    \n    return maxVal;\n}\n\nint main() {\n    std::cout << findMaxOptimal({5, 1, 9, 3}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'for (size_t i = 1; i < nums.size(); i++) if (nums[i] > maxVal) maxVal = nums[i]; return maxVal;'
        }
      }
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
    solutionHint: selected.solutionHint,
    languageVariants: selected.languageVariants
  };
}
