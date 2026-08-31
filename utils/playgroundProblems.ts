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
      id: 'tree-mod-1',
      title: 'Module 1: Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the root of a binary tree, return its maximum depth (the number of nodes along the longest path from root to farthest leaf).',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h) recursion stack'],
      sampleInputs: [
        { input: 'root = [3,9,20,null,null,15,7]', output: '3' }
      ],
      starterCode: `class TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\nfunction maxDepth(root) {\n  if (!root) return 0;\n  // TODO: Recursively calculate 1 + max(leftDepth, rightDepth)\n  \n  return 0;\n}\n\nconst root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));\nconsole.log("Max Depth:", maxDepth(root));`,
      solutionHint: 'return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));',
      languageVariants: {
        javascript: {
          starterCode: `class TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\nfunction maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\nconst root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));\nconsole.log("Max Depth:", maxDepth(root));`,
          solutionHint: 'Recursively return 1 + Math.max of left and right subtrees.'
        },
        python: {
          starterCode: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef max_depth(root: TreeNode | None) -> int:\n    if not root: return 0\n    # TODO: Calculate depth\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\nroot = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))\nprint("Max Depth:", max_depth(root))`,
          solutionHint: 'return 1 + max(max_depth(root.left), max_depth(root.right))'
        },
        java: {
          starterCode: `class TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }\n}\n\npublic class Solution {\n    public static int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));\n        System.out.println("Max Depth: " + maxDepth(root));\n    }\n}`,
          solutionHint: 'Recursive depth sum 1 + Math.max(maxDepth(left), maxDepth(right)).'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <algorithm>\n\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x, TreeNode* l = nullptr, TreeNode* r = nullptr) : val(x), left(l), right(r) {}\n};\n\nint maxDepth(TreeNode* root) {\n    if (!root) return 0;\n    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));\n}\n\nint main() {\n    TreeNode* root = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));\n    std::cout << "Max Depth: " << maxDepth(root) << "\\n";\n    return 0;\n}`,
          solutionHint: 'return 1 + std::max(maxDepth(root->left), maxDepth(root->right));'
        }
      }
    },
    {
      id: 'tree-mod-2',
      title: 'Module 2: Invert Binary Tree',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the root of a binary tree, invert the tree (swap left and right child pointers recursively for all subtrees) and return its root.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h)'],
      sampleInputs: [
        { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' }
      ],
      starterCode: `function invertTree(root) {\n  if (!root) return null;\n  // TODO: Swap left and right subtrees recursively\n  \n  return root;\n}`,
      solutionHint: 'const tmp = root.left; root.left = invertTree(root.right); root.right = invertTree(tmp); return root;',
      languageVariants: {
        javascript: {
          starterCode: `function invertTree(root) {\n  if (!root) return null;\n  const tmp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(tmp);\n  return root;\n}`,
          solutionHint: 'Swap left and right children recursively.'
        },
        python: {
          starterCode: `def invert_tree(root: TreeNode | None) -> TreeNode | None:\n    if not root: return None\n    root.left, root.right = invert_tree(root.right), invert_tree(root.left)\n    return root`,
          solutionHint: 'Simultaneous tuple assignment inverts subtrees cleanly.'
        },
        java: {
          starterCode: `public class Solution {\n    public static TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode left = invertTree(root.right);\n        TreeNode right = invertTree(root.left);\n        root.left = left;\n        root.right = right;\n        return root;\n    }\n}`,
          solutionHint: 'Invert subtrees and assign them swapped to root.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nTreeNode* invertTree(TreeNode* root) {\n    if (!root) return nullptr;\n    TreeNode* tmp = root->left;\n    root->left = invertTree(root->right);\n    root->right = invertTree(tmp);\n    return root;\n}`,
          solutionHint: 'Swap left and right pointers after recursive calls.'
        }
      }
    },
    {
      id: 'tree-mod-3',
      title: 'Module 3: Same Tree Verification',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the roots of two binary trees p and q, write a function to check if they are the same (structurally identical with identical node values).',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h)'],
      sampleInputs: [
        { input: 'p = [1,2,3], q = [1,2,3]', output: 'true' },
        { input: 'p = [1,2], q = [1,null,2]', output: 'false' }
      ],
      starterCode: `function isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q || p.val !== q.val) return false;\n  // TODO: Check left and right subtrees\n  \n  return true;\n}`,
      solutionHint: 'return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);',
      languageVariants: {
        javascript: {
          starterCode: `function isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q || p.val !== q.val) return false;\n  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}`,
          solutionHint: 'Check base null cases, compare value, and recurse on both children.'
        },
        python: {
          starterCode: `def is_same_tree(p: TreeNode | None, q: TreeNode | None) -> bool:\n    if not p and not q: return True\n    if not p or not q or p.val != q.val: return False\n    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)`,
          solutionHint: 'Verify equality of values and structural match on both branches.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null || p.val != q.val) return false;\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}`,
          solutionHint: 'Recurse down both trees simultaneously.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nbool isSameTree(TreeNode* p, TreeNode* q) {\n    if (!p && !q) return true;\n    if (!p || !q || p->val != q->val) return false;\n    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);\n}`,
          solutionHint: 'Structural equality recursion.'
        }
      }
    },
    {
      id: 'tree-mod-4',
      title: 'Module 4: Symmetric Tree (Mirror Image)',
      difficulty: 'Easy',
      category: 'Trees',
      description: 'Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h)'],
      sampleInputs: [
        { input: 'root = [1,2,2,3,4,4,3]', output: 'true' },
        { input: 'root = [1,2,2,null,3,null,3]', output: 'false' }
      ],
      starterCode: `function isSymmetric(root) {\n  function isMirror(t1, t2) {\n    if (!t1 && !t2) return true;\n    if (!t1 || !t2 || t1.val !== t2.val) return false;\n    // TODO: Compare outer pair and inner pair\n    \n    return true;\n  }\n  return !root || isMirror(root.left, root.right);\n}`,
      solutionHint: 'return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);',
      languageVariants: {
        javascript: {
          starterCode: `function isSymmetric(root) {\n  function isMirror(t1, t2) {\n    if (!t1 && !t2) return true;\n    if (!t1 || !t2 || t1.val !== t2.val) return false;\n    return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);\n  }\n  return !root || isMirror(root.left, root.right);\n}`,
          solutionHint: 'Compare t1.left with t2.right and t1.right with t2.left.'
        },
        python: {
          starterCode: `def is_symmetric(root: TreeNode | None) -> bool:\n    def is_mirror(t1, t2):\n        if not t1 and not t2: return True\n        if not t1 or not t2 or t1.val != t2.val: return False\n        return is_mirror(t1.left, t2.right) and is_mirror(t1.right, t2.left)\n    return not root or is_mirror(root.left, root.right)`,
          solutionHint: 'Mirror check compares opposite child branches recursively.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isSymmetric(TreeNode root) {\n        return root == null || isMirror(root.left, root.right);\n    }\n    private static boolean isMirror(TreeNode t1, TreeNode t2) {\n        if (t1 == null && t2 == null) return true;\n        if (t1 == null || t2 == null || t1.val != t2.val) return false;\n        return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);\n    }\n}`,
          solutionHint: 'Helper method matching mirror branches.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nbool isMirror(TreeNode* t1, TreeNode* t2) {\n    if (!t1 && !t2) return true;\n    if (!t1 || !t2 || t1->val != t2->val) return false;\n    return isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);\n}\nbool isSymmetric(TreeNode* root) {\n    return !root || isMirror(root->left, root->right);\n}`,
          solutionHint: 'Recursively verify symmetry of left and right child pointers.'
        }
      }
    },
    {
      id: 'tree-mod-5',
      title: 'Module 5: Validate Binary Search Tree (BST)',
      difficulty: 'Medium',
      category: 'Trees',
      description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST) where all left descendants are strictly less than node value and all right descendants are strictly greater.',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h)'],
      sampleInputs: [
        { input: 'root = [2,1,3]', output: 'true' },
        { input: 'root = [5,1,4,null,null,3,6]', output: 'false (4 is in right subtree of 5)' }
      ],
      starterCode: `function isValidBST(root, min = null, max = null) {\n  if (!root) return true;\n  if ((min !== null && root.val <= min) || (max !== null && root.val >= max)) return false;\n  // TODO: Validate left branch with max = root.val, right with min = root.val\n  \n  return true;\n}`,
      solutionHint: 'return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);',
      languageVariants: {
        javascript: {
          starterCode: `function isValidBST(root, min = null, max = null) {\n  if (!root) return true;\n  if ((min !== null && root.val <= min) || (max !== null && root.val >= max)) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}`,
          solutionHint: 'Propagate min and max bounds downwards.'
        },
        python: {
          starterCode: `def is_valid_bst(root: TreeNode | None, min_val=float('-inf'), max_val=float('inf')) -> bool:\n    if not root: return True\n    if not (min_val < root.val < max_val): return False\n    return is_valid_bst(root.left, min_val, root.val) and is_valid_bst(root.right, root.val, max_val)`,
          solutionHint: 'Pass strict interval bounds (min_val, max_val).'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n    private static boolean validate(TreeNode node, Integer min, Integer max) {\n        if (node == null) return true;\n        if ((min != null && node.val <= min) || (max != null && node.val >= max)) return false;\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    }\n}`,
          solutionHint: 'Validate recursive intervals with Integer object references.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <climits>\n\nbool validate(TreeNode* node, long long minVal, long long maxVal) {\n    if (!node) return true;\n    if (node->val <= minVal || node->val >= maxVal) return false;\n    return validate(node->left, minVal, node->val) && validate(node->right, node->val, maxVal);\n}\nbool isValidBST(TreeNode* root) {\n    return validate(root, LLONG_MIN, LLONG_MAX);\n}`,
          solutionHint: 'Use long long bounds to prevent integer overflow.'
        }
      }
    },
    {
      id: 'tree-mod-6',
      title: 'Module 6: Lowest Common Ancestor in BST',
      difficulty: 'Medium',
      category: 'Trees',
      description: 'Given a binary search tree (BST) and two nodes p and q, find their Lowest Common Ancestor (LCA) in O(h) time leveraging the BST ordering property.',
      constraints: ['All node values are unique', 'p and q exist in BST'],
      sampleInputs: [
        { input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', output: 'Node 6' },
        { input: 'root = [6,2,8,0,4,7,9], p = 2, q = 4', output: 'Node 2' }
      ],
      starterCode: `function lowestCommonAncestor(root, p, q) {\n  let curr = root;\n  // TODO: Move left if both values smaller, move right if both greater, else return curr\n  \n  return curr;\n}`,
      solutionHint: 'while (curr) { if (p.val < curr.val && q.val < curr.val) curr = curr.left; else if (p.val > curr.val && q.val > curr.val) curr = curr.right; else return curr; }',
      languageVariants: {
        javascript: {
          starterCode: `function lowestCommonAncestor(root, p, q) {\n  let curr = root;\n  while (curr) {\n    if (p.val < curr.val && q.val < curr.val) curr = curr.left;\n    else if (p.val > curr.val && q.val > curr.val) curr = curr.right;\n    else return curr;\n  }\n  return null;\n}`,
          solutionHint: 'Traverse down BST until values split on opposite sides of current node.'
        },
        python: {
          starterCode: `def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:\n    curr = root\n    while curr:\n        if p.val < curr.val and q.val < curr.val: curr = curr.left\n        elif p.val > curr.val and q.val > curr.val: curr = curr.right\n        else: return curr`,
          solutionHint: 'Step down BST until p and q diverge.'
        },
        java: {
          starterCode: `public class Solution {\n    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        TreeNode curr = root;\n        while (curr != null) {\n            if (p.val < curr.val && q.val < curr.val) curr = curr.left;\n            else if (p.val > curr.val && q.val > curr.val) curr = curr.right;\n            else return curr;\n        }\n        return null;\n    }\n}`,
          solutionHint: 'Traverse left or right based on value comparison in O(h) time.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nTreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n    TreeNode* curr = root;\n    while (curr) {\n        if (p->val < curr->val && q->val < curr->val) curr = curr->left;\n        else if (p->val > curr->val && q->val > curr->val) curr = curr->right;\n        else return curr;\n    }\n    return nullptr;\n}`,
          solutionHint: 'Iterative BST search for lowest split ancestor.'
        }
      }
    },
    {
      id: 'tree-mod-7',
      title: 'Module 7: Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      category: 'Trees',
      description: 'Given the root of a binary tree, return the maximum path sum of any non-empty path (a sequence of nodes connected by edges where no node appears more than once).',
      constraints: ['Time Complexity: O(n)', 'Space Complexity: O(h)'],
      sampleInputs: [
        { input: '[-10,9,20,null,null,15,7]', output: '42 (15 + 20 + 7)' }
      ],
      starterCode: `function maxPathSum(root) {\n  let maxSum = -Infinity;\n  function maxGain(node) {\n    if (!node) return 0;\n    // TODO: Gain from left & right (max with 0)\n    \n    return 0;\n  }\n  maxGain(root);\n  return maxSum;\n}`,
      solutionHint: 'const left = Math.max(0, maxGain(node.left)); const right = Math.max(0, maxGain(node.right)); maxSum = Math.max(maxSum, node.val + left + right); return node.val + Math.max(left, right);',
      languageVariants: {
        javascript: {
          starterCode: `function maxPathSum(root) {\n  let maxSum = -Infinity;\n  function maxGain(node) {\n    if (!node) return 0;\n    const left = Math.max(0, maxGain(node.left));\n    const right = Math.max(0, maxGain(node.right));\n    maxSum = Math.max(maxSum, node.val + left + right);\n    return node.val + Math.max(left, right);\n  }\n  maxGain(root);\n  return maxSum;\n}`,
          solutionHint: 'Post-order DFS computing max gain passing through each node.'
        },
        python: {
          starterCode: `def max_path_sum(root: TreeNode | None) -> int:\n    max_sum = float('-inf')\n    def max_gain(node):\n        nonlocal max_sum\n        if not node: return 0\n        left = max(0, max_gain(node.left))\n        right = max(0, max_gain(node.right))\n        max_sum = max(max_sum, node.val + left + right)\n        return node.val + max(left, right)\n    max_gain(root)\n    return int(max_sum)`,
          solutionHint: 'Post-order DFS tracking global max path through node.'
        },
        java: {
          starterCode: `public class Solution {\n    private static int maxSum;\n    public static int maxPathSum(TreeNode root) {\n        maxSum = Integer.MIN_VALUE;\n        maxGain(root);\n        return maxSum;\n    }\n    private static int maxGain(TreeNode node) {\n        if (node == null) return 0;\n        int left = Math.max(0, maxGain(node.left));\n        int right = Math.max(0, maxGain(node.right));\n        maxSum = Math.max(maxSum, node.val + left + right);\n        return node.val + Math.max(left, right);\n    }\n}`,
          solutionHint: 'Recursively prune negative branch gains with Math.max(0, ...).'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <algorithm>\n#include <climits>\n\nint maxSum = INT_MIN;\nint maxGain(TreeNode* node) {\n    if (!node) return 0;\n    int left = std::max(0, maxGain(node->left));\n    int right = std::max(0, maxGain(node->right));\n    maxSum = std::max(maxSum, node->val + left + right);\n    return node->val + std::max(left, right);\n}\nint maxPathSum(TreeNode* root) {\n    maxSum = INT_MIN;\n    maxGain(root);\n    return maxSum;\n}`,
          solutionHint: 'Calculate path sum across node and return single branch max gain.'
        }
      }
    },
    {
      id: 'tree-mod-8',
      title: 'Module 8: Serialize and Deserialize Binary Tree',
      difficulty: 'Hard',
      category: 'Trees',
      description: 'Design an algorithm to serialize a binary tree into a string and deserialize that string back into the original tree structure using preorder traversal.',
      constraints: ['Preserves complete binary tree structure and values', 'O(n) time serialization and deserialization'],
      sampleInputs: [
        { input: '[1,2,3,null,null,4,5]', output: 'Serialized string & reconstructed matching tree' }
      ],
      starterCode: `function serialize(root) {\n  if (!root) return '#';\n  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;\n}\n\nfunction deserialize(data) {\n  const queue = data.split(',');\n  function build() {\n    const val = queue.shift();\n    if (val === '#' || val === undefined) return null;\n    const node = new TreeNode(Number(val));\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  return build();\n}`,
      solutionHint: 'Use preorder serialization with "#" for null markers, and reconstruct using a queue.',
      languageVariants: {
        javascript: {
          starterCode: `function serialize(root) {\n  if (!root) return '#';\n  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;\n}\n\nfunction deserialize(data) {\n  const queue = data.split(',');\n  function build() {\n    const val = queue.shift();\n    if (val === '#' || val === undefined) return null;\n    const node = new TreeNode(Number(val));\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n  return build();\n}`,
          solutionHint: 'Serialize preorder with delimiter and rebuild recursively from shift queue.'
        },
        python: {
          starterCode: `def serialize(root: TreeNode | None) -> str:\n    if not root: return '#'\n    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"\n\ndef deserialize(data: str) -> TreeNode | None:\n    vals = iter(data.split(','))\n    def build():\n        val = next(vals)\n        if val == '#': return None\n        node = TreeNode(int(val))\n        node.left = build()\n        node.right = build()\n        return node\n    return build()`,
          solutionHint: 'Use Python iter() to build nodes preorder.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static String serialize(TreeNode root) {\n        if (root == null) return "#";\n        return root.val + "," + serialize(root.left) + "," + serialize(root.right);\n    }\n    public static TreeNode deserialize(String data) {\n        Deque<String> nodes = new LinkedList<>(Arrays.asList(data.split(",")));\n        return build(nodes);\n    }\n    private static TreeNode build(Deque<String> nodes) {\n        String val = nodes.poll();\n        if (val == null || val.equals("#")) return null;\n        TreeNode node = new TreeNode(Integer.parseInt(val));\n        node.left = build(nodes);\n        node.right = build(nodes);\n        return node;\n    }\n}`,
          solutionHint: 'LinkedList queue poll for deserialization.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <sstream>\n#include <queue>\n\nstd::string serialize(TreeNode* root) {\n    if (!root) return "#";\n    return std::to_string(root->val) + "," + serialize(root->left) + "," + serialize(root->right);\n}\nTreeNode* build(std::stringstream& ss) {\n    std::string item;\n    if (!std::getline(ss, item, ',')) return nullptr;\n    if (item == "#") return nullptr;\n    TreeNode* node = new TreeNode(std::stoi(item));\n    node->left = build(ss);\n    node->right = build(ss);\n    return node;\n}\nTreeNode* deserialize(const std::string& data) {\n    std::stringstream ss(data);\n    return build(ss);\n}`,
          solutionHint: 'Use std::stringstream to parse comma tokens preorder.'
        }
      }
    }
  ],

  'graphs': [
    {
      id: 'grp-mod-1',
      title: 'Module 1: Number of Connected Components',
      difficulty: 'Medium',
      category: 'Graphs',
      description: 'Given n vertices labeled from 0 to n - 1 and an array of undirected edges, return the total number of connected components in the graph in O(V + E) time.',
      constraints: ['Time Complexity: O(V + E)', 'Space Complexity: O(V + E)'],
      sampleInputs: [
        { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2' },
        { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' }
      ],
      starterCode: `function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }\n  const visited = new Set();\n  let count = 0;\n  // TODO: DFS to visit all reachable nodes for each component\n  \n  return count;\n}\n\nconsole.log("Components:", countComponents(5, [[0,1],[1,2],[3,4]]));`,
      solutionHint: 'function dfs(node) { visited.add(node); for (const neighbor of adj[node]) if (!visited.has(neighbor)) dfs(neighbor); } for (let i = 0; i < n; i++) if (!visited.has(i)) { dfs(i); count++; }',
      languageVariants: {
        javascript: {
          starterCode: `function countComponents(n, edges) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }\n  const visited = new Set();\n  let count = 0;\n  function dfs(u) {\n    visited.add(u);\n    for (const v of adj[u]) if (!visited.has(v)) dfs(v);\n  }\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) { dfs(i); count++; }\n  }\n  return count;\n}`,
          solutionHint: 'Run DFS for every unvisited node and increment component count.'
        },
        python: {
          starterCode: `def count_components(n: int, edges: list[list[int]]) -> int:\n    adj = [[] for _ in range(n)]\n    for u, v in edges: adj[u].append(v); adj[v].append(u)\n    visited = set()\n    def dfs(u):\n        visited.add(u)\n        for v in adj[u]:\n            if v not in visited: dfs(v)\n    count = 0\n    for i in range(n):\n        if i not in visited:\n            dfs(i); count += 1\n    return count`,
          solutionHint: 'Build adjacency list and count DFS traversals.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int countComponents(int n, int[][] edges) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (int[] e : edges) { adj.get(e[0]).add(e[1]); adj.get(e[1]).add(e[0]); }\n        boolean[] visited = new boolean[n];\n        int count = 0;\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) { dfs(i, adj, visited); count++; }\n        }\n        return count;\n    }\n    private static void dfs(int u, List<List<Integer>> adj, boolean[] visited) {\n        visited[u] = true;\n        for (int v : adj.get(u)) if (!visited[v]) dfs(v, adj, visited);\n    }\n}`,
          solutionHint: 'DFS component counting with boolean visited array.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nvoid dfs(int u, const std::vector<std::vector<int>>& adj, std::vector<bool>& visited) {\n    visited[u] = true;\n    for (int v : adj[u]) if (!visited[v]) dfs(v, adj, visited);\n}\nint countComponents(int n, const std::vector<std::vector<int>>& edges) {\n    std::vector<std::vector<int>> adj(n);\n    for (const auto& e : edges) { adj[e[0]].push_back(e[1]); adj[e[1]].push_back(e[0]); }\n    std::vector<bool> visited(n, false);\n    int count = 0;\n    for (int i = 0; i < n; i++) {\n        if (!visited[i]) { dfs(i, adj, visited); count++; }\n    }\n    return count;\n}`,
          solutionHint: 'Adjacency list DFS counting connected subgraphs.'
        }
      }
    },
    {
      id: 'grp-mod-2',
      title: 'Module 2: Number of Islands (2D Grid DFS / BFS)',
      difficulty: 'Medium',
      category: 'Graphs',
      description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands in O(m * n) time.',
      constraints: ['Time Complexity: O(m * n)', 'Space Complexity: O(m * n)'],
      sampleInputs: [
        { input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]', output: '2' }
      ],
      starterCode: `function numIslands(grid) {\n  const m = grid.length, n = grid[0].length;\n  let islands = 0;\n  function sink(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0'; // sink land\n    // TODO: Sink in 4 directions\n  }\n  // TODO: Scan grid and sink islands\n  return islands;\n}`,
      solutionHint: 'sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1); Scan grid: if (grid[r][c] === "1") { islands++; sink(r, c); } return islands;',
      languageVariants: {
        javascript: {
          starterCode: `function numIslands(grid) {\n  const m = grid.length, n = grid[0].length;\n  let islands = 0;\n  function sink(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  }\n  for (let r = 0; r < m; r++)\n    for (let c = 0; c < n; c++)\n      if (grid[r][c] === '1') { islands++; sink(r, c); }\n  return islands;\n}`,
          solutionHint: 'Sink contiguous land cells in-place with DFS.'
        },
        python: {
          starterCode: `def num_islands(grid: list[list[str]]) -> int:\n    m, n = len(grid), len(grid[0])\n    def sink(r, c):\n        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1': return\n        grid[r][c] = '0'\n        sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1)\n    islands = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == '1': islands += 1; sink(r, c)\n    return islands`,
          solutionHint: 'Flood-fill DFS converting visited 1 to 0.'
        },
        java: {
          starterCode: `public class Solution {\n    public static int numIslands(char[][] grid) {\n        int m = grid.length, n = grid[0].length, islands = 0;\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (grid[r][c] == '1') { islands++; sink(grid, r, c, m, n); }\n        return islands;\n    }\n    private static void sink(char[][] grid, int r, int c, int m, int n) {\n        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;\n        grid[r][c] = '0';\n        sink(grid, r + 1, c, m, n); sink(grid, r - 1, c, m, n);\n        sink(grid, r, c + 1, m, n); sink(grid, r, c - 1, m, n);\n    }\n}`,
          solutionHint: 'DFS sink method in-place.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nvoid sink(std::vector<std::vector<char>>& grid, int r, int c, int m, int n) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;\n    grid[r][c] = '0';\n    sink(grid, r + 1, c, m, n); sink(grid, r - 1, c, m, n);\n    sink(grid, r, c + 1, m, n); sink(grid, r, c - 1, m, n);\n}\nint numIslands(std::vector<std::vector<char>>& grid) {\n    int m = grid.size(), n = grid[0].size(), count = 0;\n    for (int r = 0; r < m; r++)\n        for (int c = 0; c < n; c++)\n            if (grid[r][c] == '1') { count++; sink(grid, r, c, m, n); }\n    return count;\n}`,
          solutionHint: '2D grid DFS component sink.'
        }
      }
    },
    {
      id: 'grp-mod-3',
      title: 'Module 3: Clone Graph (Deep Copy)',
      difficulty: 'Medium',
      category: 'Graphs',
      description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph using a visited HashMap to avoid cycles.',
      constraints: ['Time Complexity: O(V + E)', 'Space Complexity: O(V)'],
      sampleInputs: [
        { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: 'Deep cloned graph with identical topology' }
      ],
      starterCode: `class Node {\n  constructor(val = 0, neighbors = []) {\n    this.val = val;\n    this.neighbors = neighbors;\n  }\n}\n\nfunction cloneGraph(node, visited = new Map()) {\n  if (!node) return null;\n  if (visited.has(node)) return visited.get(node);\n  const clone = new Node(node.val);\n  visited.set(node, clone);\n  // TODO: Clone all neighbors\n  \n  return clone;\n}`,
      solutionHint: 'for (const n of node.neighbors) clone.neighbors.push(cloneGraph(n, visited)); return clone;',
      languageVariants: {
        javascript: {
          starterCode: `function cloneGraph(node, visited = new Map()) {\n  if (!node) return null;\n  if (visited.has(node)) return visited.get(node);\n  const clone = new Node(node.val);\n  visited.set(node, clone);\n  for (const n of node.neighbors) clone.neighbors.push(cloneGraph(n, visited));\n  return clone;\n}`,
          solutionHint: 'Maintain original-to-clone node mapping in Map.'
        },
        python: {
          starterCode: `class Node:\n    def __init__(self, val=0, neighbors=None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\ndef clone_graph(node: Node | None, visited=None) -> Node | None:\n    if not node: return None\n    if visited is None: visited = {}\n    if node in visited: return visited[node]\n    clone = Node(node.val)\n    visited[node] = clone\n    for n in node.neighbors:\n        clone.neighbors.append(clone_graph(n, visited))\n    return clone`,
          solutionHint: 'Store cloned instances in dictionary to handle cycles.'
        },
        java: {
          starterCode: `import java.util.*;\n\nclass Node {\n    public int val;\n    public List<Node> neighbors;\n    public Node(int _val) { val = _val; neighbors = new ArrayList<>(); }\n}\n\npublic class Solution {\n    private static Map<Node, Node> visited = new HashMap<>();\n    public static Node cloneGraph(Node node) {\n        if (node == null) return null;\n        if (visited.containsKey(node)) return visited.get(node);\n        Node clone = new Node(node.val);\n        visited.put(node, clone);\n        for (Node n : node.neighbors) clone.neighbors.add(cloneGraph(n));\n        return clone;\n    }\n}`,
          solutionHint: 'Map<Node, Node> stores visited copies.'
        },
        cpp: {
          starterCode: `#include <vector>\n#include <unordered_map>\n\nclass Node {\npublic:\n    int val;\n    std::vector<Node*> neighbors;\n    Node(int _val) : val(_val) {}\n};\n\nstd::unordered_map<Node*, Node*> visited;\nNode* cloneGraph(Node* node) {\n    if (!node) return nullptr;\n    if (visited.count(node)) return visited[node];\n    Node* clone = new Node(node->val);\n    visited[node] = clone;\n    for (Node* n : node->neighbors) clone->neighbors.push_back(cloneGraph(n));\n    return clone;\n}`,
          solutionHint: 'Recursive DFS deep copy with unordered_map.'
        }
      }
    },
    {
      id: 'grp-mod-4',
      title: 'Module 4: Course Schedule (Topological Sort / Cycle Detection)',
      difficulty: 'Medium',
      category: 'Graphs',
      description: 'There are a total of numCourses you have to take, labeled from 0 to numCourses - 1. Determine if it is possible to finish all courses given prerequisite pairs using Kahn’s Algorithm.',
      constraints: ['Time Complexity: O(V + E)', 'Space Complexity: O(V + E)'],
      sampleInputs: [
        { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
        { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' }
      ],
      starterCode: `function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  // TODO: Enqueue 0-indegree courses and run Kahn BFS\n  \n  return false;\n}`,
      solutionHint: 'for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i); let taken = 0; while (queue.length) { const u = queue.shift(); taken++; for (const v of adj[u]) { if (--inDegree[v] === 0) queue.push(v); } } return taken === numCourses;',
      languageVariants: {
        javascript: {
          starterCode: `function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0), adj = Array.from({ length: numCourses }, () => []);\n  for (const [c, pre] of prerequisites) { adj[pre].push(c); inDegree[c]++; }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  let taken = 0;\n  while (queue.length) {\n    const u = queue.shift(); taken++;\n    for (const v of adj[u]) if (--inDegree[v] === 0) queue.push(v);\n  }\n  return taken === numCourses;\n}`,
          solutionHint: 'Kahn algorithm for topological sorting in directed graph.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:\n    in_degree = [0] * num_courses\n    adj = [[] for _ in range(num_courses)]\n    for c, pre in prerequisites: adj[pre].append(c); in_degree[c] += 1\n    q = deque([i for i in range(num_courses) if in_degree[i] == 0])\n    taken = 0\n    while q:\n        u = q.popleft(); taken += 1\n        for v in adj[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0: q.append(v)\n    return taken == num_courses`,
          solutionHint: 'BFS queue starting from zero in-degree nodes.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static boolean canFinish(int numCourses, int[][] prerequisites) {\n        int[] inDegree = new int[numCourses];\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        for (int[] p : prerequisites) { adj.get(p[1]).add(p[0]); inDegree[p[0]]++; }\n        Deque<Integer> q = new ArrayDeque<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int taken = 0;\n        while (!q.isEmpty()) {\n            int u = q.poll(); taken++;\n            for (int v : adj.get(u)) if (--inDegree[v] == 0) q.offer(v);\n        }\n        return taken == numCourses;\n    }\n}`,
          solutionHint: 'Topological sort cycle check.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n\nbool canFinish(int numCourses, const std::vector<std::vector<int>>& prerequisites) {\n    std::vector<int> inDegree(numCourses, 0);\n    std::vector<std::vector<int>> adj(numCourses);\n    for (const auto& p : prerequisites) { adj[p[1]].push_back(p[0]); inDegree[p[0]]++; }\n    std::queue<int> q;\n    for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n    int taken = 0;\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); taken++;\n        for (int v : adj[u]) if (--inDegree[v] == 0) q.push(v);\n    }\n    return taken == numCourses;\n}`,
          solutionHint: 'Kahn algorithm with queue.'
        }
      }
    },
    {
      id: 'grp-mod-5',
      title: 'Module 5: Word Ladder (Shortest Transformation BFS)',
      difficulty: 'Hard',
      category: 'Graphs',
      description: 'Given beginWord, endWord, and wordList, return the number of words in the shortest transformation sequence from beginWord to endWord where adjacent words differ by exactly 1 character.',
      constraints: ['All words same length', 'All lowercase English letters'],
      sampleInputs: [
        { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5 ("hit" -> "hot" -> "dot" -> "dog" -> "cog")' }
      ],
      starterCode: `function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const queue = [[beginWord, 1]];\n  // TODO: Level BFS mutating 1 character at a time\n  \n  return 0;\n}`,
      solutionHint: 'while (queue.length) { const [word, len] = queue.shift(); if (word === endWord) return len; for (let i = 0; i < word.length; i++) { for (let c = 97; c <= 122; c++) { const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1); if (wordSet.has(next)) { wordSet.delete(next); queue.push([next, len + 1]); } } } } return 0;',
      languageVariants: {
        javascript: {
          starterCode: `function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const queue = [[beginWord, 1]];\n  while (queue.length) {\n    const [w, len] = queue.shift();\n    if (w === endWord) return len;\n    for (let i = 0; i < w.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const nxt = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);\n        if (wordSet.has(nxt)) { wordSet.delete(nxt); queue.push([nxt, len + 1]); }\n      }\n    }\n  }\n  return 0;\n}`,
          solutionHint: 'BFS queue transforming 1 letter per step.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef ladder_length(begin_word: str, end_word: str, word_list: list[str]) -> int:\n    word_set = set(word_list)\n    if end_word not in word_set: return 0\n    q = deque([(begin_word, 1)])\n    while q:\n        w, length = q.popleft()\n        if w == end_word: return length\n        for i in range(len(w)):\n            for c in 'abcdefghijklmnopqrstuvwxyz':\n                nxt = w[:i] + c + w[i+1:]\n                if nxt in word_set:\n                    word_set.remove(nxt)\n                    q.append((nxt, length + 1))\n    return 0`,
          solutionHint: 'Mutate each letter a-z and traverse via BFS.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        Set<String> wordSet = new HashSet<>(wordList);\n        if (!wordSet.contains(endWord)) return 0;\n        Deque<String> q = new ArrayDeque<>();\n        q.offer(beginWord);\n        int steps = 1;\n        while (!q.isEmpty()) {\n            int size = q.size();\n            for (int k = 0; k < size; k++) {\n                String w = q.poll();\n                if (w.equals(endWord)) return steps;\n                char[] chs = w.toCharArray();\n                for (int i = 0; i < chs.length; i++) {\n                    char orig = chs[i];\n                    for (char c = 'a'; c <= 'z'; c++) {\n                        chs[i] = c;\n                        String nxt = new String(chs);\n                        if (wordSet.remove(nxt)) q.offer(nxt);\n                    }\n                    chs[i] = orig;\n                }\n            }\n            steps++;\n        }\n        return 0;\n    }\n}`,
          solutionHint: 'Level-order BFS mutating character array.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\n\nint ladderLength(const std::string& beginWord, const std::string& endWord, const std::vector<std::string>& wordList) {\n    std::unordered_set<std::string> wordSet(wordList.begin(), wordList.end());\n    if (!wordSet.count(endWord)) return 0;\n    std::queue<std::pair<std::string, int>> q;\n    q.push({beginWord, 1});\n    while (!q.empty()) {\n        auto [w, len] = q.front(); q.pop();\n        if (w == endWord) return len;\n        for (int i = 0; i < w.size(); i++) {\n            char orig = w[i];\n            for (char c = 'a'; c <= 'z'; c++) {\n                w[i] = c;\n                if (wordSet.count(w)) {\n                    wordSet.erase(w);\n                    q.push({w, len + 1});\n                }\n            }\n            w[i] = orig;\n        }\n    }\n    return 0;\n}`,
          solutionHint: 'BFS queue searching shortest word transformation.'
        }
      }
    },
    {
      id: 'grp-mod-6',
      title: 'Module 6: Network Delay Time (Dijkstra\'s Algorithm)',
      difficulty: 'Medium',
      category: 'Graphs',
      description: 'You are given a network of n nodes labeled 1 to n, and times where times[i] = (u, v, w). Compute the minimum time it takes for all n nodes to receive a signal from source k using Dijkstra\'s Algorithm.',
      constraints: ['Time Complexity: O(E log V)', 'Weights w >= 0'],
      sampleInputs: [
        { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
        { input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1' }
      ],
      starterCode: `function networkDelayTime(times, n, k) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  const queue = [[0, k]]; // dist, node\n  while (queue.length) {\n    queue.sort((a, b) => a[0] - b[0]);\n    const [d, u] = queue.shift();\n    if (d > dist[u]) continue;\n    for (const [v, w] of adj[u]) {\n      if (d + w < dist[v]) { dist[v] = d + w; queue.push([dist[v], v]); }\n    }\n  }\n  const maxTime = Math.max(...dist.slice(1));\n  return maxTime === Infinity ? -1 : maxTime;\n}`,
      solutionHint: 'Dijkstra shortest path algorithm with distance updates.',
      languageVariants: {
        javascript: {
          starterCode: `function networkDelayTime(times, n, k) {\n  const adj = Array.from({ length: n + 1 }, () => []);\n  for (const [u, v, w] of times) adj[u].push([v, w]);\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  const queue = [[0, k]];\n  while (queue.length) {\n    queue.sort((a, b) => a[0] - b[0]);\n    const [d, u] = queue.shift();\n    if (d > dist[u]) continue;\n    for (const [v, w] of adj[u]) {\n      if (d + w < dist[v]) { dist[v] = d + w; queue.push([dist[v], v]); }\n    }\n  }\n  const maxT = Math.max(...dist.slice(1));\n  return maxT === Infinity ? -1 : maxT;\n}`,
          solutionHint: 'Dijkstra priority queue shortest path.'
        },
        python: {
          starterCode: `import heapq\n\ndef network_delay_time(times: list[list[int]], n: int, k: int) -> int:\n    adj = [[] for _ in range(n + 1)]\n    for u, v, w in times: adj[u].append((v, w))\n    dist = {i: float('inf') for i in range(1, n + 1)}\n    dist[k] = 0\n    pq = [(0, k)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in adj[u]:\n            if d + w < dist[v]:\n                dist[v] = d + w\n                heapq.heappush(pq, (d + w, v))\n    res = max(dist.values())\n    return -1 if res == float('inf') else res`,
          solutionHint: 'Use heapq for Dijkstra O(E log V) shortest path search.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int networkDelayTime(int[][] times, int n, int k) {\n        List<List<int[]>> adj = new ArrayList<>();\n        for (int i = 0; i <= n; i++) adj.add(new ArrayList<>());\n        for (int[] t : times) adj.get(t[0]).add(new int[]{t[1], t[2]});\n        int[] dist = new int[n + 1];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        dist[k] = 0;\n        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));\n        pq.offer(new int[]{0, k});\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int d = curr[0], u = curr[1];\n            if (d > dist[u]) continue;\n            for (int[] edge : adj.get(u)) {\n                int v = edge[0], w = edge[1];\n                if (d + w < dist[v]) { dist[v] = d + w; pq.offer(new int[]{dist[v], v}); }\n            }\n        }\n        int maxTime = 0;\n        for (int i = 1; i <= n; i++) {\n            if (dist[i] == Integer.MAX_VALUE) return -1;\n            maxTime = Math.max(maxTime, dist[i]);\n        }\n        return maxTime;\n    }\n}`,
          solutionHint: 'PriorityQueue Dijkstra min-heap.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n#include <algorithm>\n\nint networkDelayTime(const std::vector<std::vector<int>>& times, int n, int k) {\n    std::vector<std::vector<std::pair<int, int>>> adj(n + 1);\n    for (const auto& t : times) adj[t[0]].emplace_back(t[1], t[2]);\n    std::vector<int> dist(n + 1, 1e9);\n    dist[k] = 0;\n    std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, std::greater<>> pq;\n    pq.push({0, k});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : adj[u]) {\n            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }\n        }\n    }\n    int res = *std::max_element(dist.begin() + 1, dist.end());\n    return res >= 1e9 ? -1 : res;\n}`,
          solutionHint: 'Min-heap priority queue Dijkstra.'
        }
      }
    },
    {
      id: 'grp-mod-7',
      title: 'Module 7: Alien Dictionary (Topological Sort)',
      difficulty: 'Hard',
      category: 'Graphs',
      description: 'Given a sorted list of words in an alien language, deduce the unique lexicographical order of characters using topological sorting.',
      constraints: ['Unique ordering if valid', 'Detect invalid prefixes and cycles'],
      sampleInputs: [
        { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
        { input: 'words = ["z","x","z"]', output: '"" (invalid cycle)' }
      ],
      starterCode: `function alienOrder(words) {\n  const adj = {}, inDegree = {};\n  for (const w of words) for (const c of w) { adj[c] = new Set(); inDegree[c] = 0; }\n  // TODO: Build graph from first differing character in adjacent words\n  \n  return "";\n}`,
      solutionHint: 'Compare adjacent words w1, w2. If w1.length > w2.length && w1.startsWith(w2) return ""; on first differing char, add edge and increment inDegree.',
      languageVariants: {
        javascript: {
          starterCode: `function alienOrder(words) {\n  const adj = {}, inDegree = {};\n  for (const w of words) for (const c of w) { adj[c] = new Set(); inDegree[c] = 0; }\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return '';\n    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n      if (w1[j] !== w2[j]) {\n        if (!adj[w1[j]].has(w2[j])) { adj[w1[j]].add(w2[j]); inDegree[w2[j]]++; }\n        break;\n      }\n    }\n  }\n  const queue = Object.keys(inDegree).filter(c => inDegree[c] === 0);\n  let res = '';\n  while (queue.length) {\n    const c = queue.shift(); res += c;\n    for (const nxt of adj[c]) if (--inDegree[nxt] === 0) queue.push(nxt);\n  }\n  return res.length === Object.keys(inDegree).length ? res : '';\n}`,
          solutionHint: 'Topological sort on character dependency DAG.'
        },
        python: {
          starterCode: `from collections import deque\n\ndef alien_order(words: list[str]) -> str:\n    adj = {c: set() for w in words for c in w}\n    in_degree = {c: 0 for c in adj}\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i+1]\n        if len(w1) > len(w2) and w1.startswith(w2): return ""\n        for c1, c2 in zip(w1, w2):\n            if c1 != c2:\n                if c2 not in adj[c1]:\n                    adj[c1].add(c2); in_degree[c2] += 1\n                break\n    q = deque([c for c in in_degree if in_degree[c] == 0])\n    res = []\n    while q:\n        c = q.popleft(); res.append(c)\n        for nxt in adj[c]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0: q.append(nxt)\n    return "".join(res) if len(res) == len(in_degree) else ""`,
          solutionHint: 'Topological sorting across adjacent word character differences.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static String alienOrder(String[] words) {\n        Map<Character, Set<Character>> adj = new HashMap<>();\n        Map<Character, Integer> inDegree = new HashMap<>();\n        for (String w : words) for (char c : w.toCharArray()) { adj.putIfAbsent(c, new HashSet<>()); inDegree.putIfAbsent(c, 0); }\n        for (int i = 0; i < words.length - 1; i++) {\n            String w1 = words[i], w2 = words[i + 1];\n            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";\n            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {\n                char c1 = w1.charAt(j), c2 = w2.charAt(j);\n                if (c1 != c2) {\n                    if (adj.get(c1).add(c2)) inDegree.put(c2, inDegree.get(c2) + 1);\n                    break;\n                }\n            }\n        }\n        Deque<Character> q = new ArrayDeque<>();\n        for (char c : inDegree.keySet()) if (inDegree.get(c) == 0) q.offer(c);\n        StringBuilder sb = new StringBuilder();\n        while (!q.isEmpty()) {\n            char c = q.poll(); sb.append(c);\n            for (char nxt : adj.get(c)) {\n                inDegree.put(nxt, inDegree.get(nxt) - 1);\n                if (inDegree.get(nxt) == 0) q.offer(nxt);\n            }\n        }\n        return sb.length() == inDegree.size() ? sb.toString() : "";\n    }\n}`,
          solutionHint: 'Kahn algorithm for alien character ordering.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\n\nstd::string alienOrder(const std::vector<std::string>& words) {\n    std::unordered_map<char, std::unordered_set<char>> adj;\n    std::unordered_map<char, int> inDegree;\n    for (const auto& w : words) for (char c : w) { adj[c]; inDegree[c] = 0; }\n    for (size_t i = 0; i < words.size() - 1; i++) {\n        const auto& w1 = words[i], &w2 = words[i+1];\n        if (w1.size() > w2.size() && w1.substr(0, w2.size()) == w2) return "";\n        for (size_t j = 0; j < std::min(w1.size(), w2.size()); j++) {\n            if (w1[j] != w2[j]) {\n                if (!adj[w1[j]].count(w2[j])) { adj[w1[j]].insert(w2[j]); inDegree[w2[j]]++; }\n                break;\n            }\n        }\n    }\n    std::queue<char> q;\n    for (auto [c, deg] : inDegree) if (deg == 0) q.push(c);\n    std::string res = "";\n    while (!q.empty()) {\n        char c = q.front(); q.pop(); res += c;\n        for (char nxt : adj[c]) if (--inDegree[nxt] == 0) q.push(nxt);\n    }\n    return res.size() == inDegree.size() ? res : "";\n}`,
          solutionHint: 'Character level topological sort with cycle validation.'
        }
      }
    },
    {
      id: 'grp-mod-8',
      title: 'Module 8: Critical Connections (Tarjan\'s Bridge Algorithm)',
      difficulty: 'Hard',
      category: 'Graphs',
      description: 'Given n servers numbered 0 to n - 1 connected by undirected connections, return all critical connections (bridges) whose removal disconnects the network in O(V + E) time.',
      constraints: ['Time Complexity: O(V + E)', 'Space Complexity: O(V + E)'],
      sampleInputs: [
        { input: 'n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]', output: '[[1,3]]' }
      ],
      starterCode: `function criticalConnections(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) { adj[u].push(v); adj[v].push(u); }\n  const disc = new Array(n).fill(-1), low = new Array(n).fill(-1);\n  const bridges = [];\n  let time = 0;\n  // TODO: Tarjan DFS tracking discovery & lowest reachable timestamps\n  \n  return bridges;\n}`,
      solutionHint: 'function dfs(u, p) { disc[u] = low[u] = ++time; for (const v of adj[u]) { if (v === p) continue; if (disc[v] !== -1) low[u] = Math.min(low[u], disc[v]); else { dfs(v, u); low[u] = Math.min(low[u], low[v]); if (low[v] > disc[u]) bridges.push([u, v]); } } }',
      languageVariants: {
        javascript: {
          starterCode: `function criticalConnections(n, connections) {\n  const adj = Array.from({ length: n }, () => []);\n  for (const [u, v] of connections) { adj[u].push(v); adj[v].push(u); }\n  const disc = new Array(n).fill(-1), low = new Array(n).fill(-1), bridges = [];\n  let time = 0;\n  function dfs(u, p) {\n    disc[u] = low[u] = ++time;\n    for (const v of adj[u]) {\n      if (v === p) continue;\n      if (disc[v] !== -1) low[u] = Math.min(low[u], disc[v]);\n      else {\n        dfs(v, u);\n        low[u] = Math.min(low[u], low[v]);\n        if (low[v] > disc[u]) bridges.push([u, v]);\n      }\n    }\n  }\n  dfs(0, -1);\n  return bridges;\n}`,
          solutionHint: 'Bridge condition: low[v] > disc[u].'
        },
        python: {
          starterCode: `def critical_connections(n: int, connections: list[list[int]]) -> list[list[int]]:\n    adj = [[] for _ in range(n)]\n    for u, v in connections: adj[u].append(v); adj[v].append(u)\n    disc, low = [-1] * n, [-1] * n\n    bridges = []\n    time = 0\n    def dfs(u, p):\n        nonlocal time\n        time += 1\n        disc[u] = low[u] = time\n        for v in adj[u]:\n            if v == p: continue\n            if disc[v] != -1: low[u] = min(low[u], disc[v])\n            else:\n                dfs(v, u)\n                low[u] = min(low[u], low[v])\n                if low[v] > disc[u]: bridges.append([u, v])\n    dfs(0, -1)\n    return bridges`,
          solutionHint: 'Tarjan discovery and low-link values identify bridge edges.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    private static int time = 0;\n    public static List<List<Integer>> criticalConnections(int n, List<List<Integer>> connections) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n        for (List<Integer> c : connections) { adj.get(c.get(0)).add(c.get(1)); adj.get(c.get(1)).add(c.get(0)); }\n        int[] disc = new int[n], low = new int[n];\n        Arrays.fill(disc, -1);\n        List<List<Integer>> bridges = new ArrayList<>();\n        time = 0;\n        dfs(0, -1, adj, disc, low, bridges);\n        return bridges;\n    }\n    private static void dfs(int u, int p, List<List<Integer>> adj, int[] disc, int[] low, List<List<Integer>> bridges) {\n        disc[u] = low[u] = ++time;\n        for (int v : adj.get(u)) {\n            if (v == p) continue;\n            if (disc[v] != -1) low[u] = Math.min(low[u], disc[v]);\n            else {\n                dfs(v, u, adj, disc, low, bridges);\n                low[u] = Math.min(low[u], low[v]);\n                if (low[v] > disc[u]) bridges.add(Arrays.asList(u, v));\n            }\n        }\n    }\n}`,
          solutionHint: 'Tarjan bridge finder recursion.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint timer = 0;\nvoid dfs(int u, int p, const std::vector<std::vector<int>>& adj, std::vector<int>& disc, std::vector<int>& low, std::vector<std::vector<int>>& bridges) {\n    disc[u] = low[u] = ++timer;\n    for (int v : adj[u]) {\n        if (v == p) continue;\n        if (disc[v] != -1) low[u] = std::min(low[u], disc[v]);\n        else {\n            dfs(v, u, adj, disc, low, bridges);\n            low[u] = std::min(low[u], low[v]);\n            if (low[v] > disc[u]) bridges.push_back({u, v});\n        }\n    }\n}\nstd::vector<std::vector<int>> criticalConnections(int n, const std::vector<std::vector<int>>& connections) {\n    std::vector<std::vector<int>> adj(n);\n    for (const auto& c : connections) { adj[c[0]].push_back(c[1]); adj[c[1]].push_back(c[0]); }\n    std::vector<int> disc(n, -1), low(n, -1);\n    std::vector<std::vector<int>> bridges;\n    timer = 0;\n    dfs(0, -1, adj, disc, low, bridges);\n    return bridges;\n}`,
          solutionHint: 'Tarjan bridge algorithm in O(V + E).'
        }
      }
    }
  ],

  'recursion': [
    {
      id: 'rec-mod-1',
      title: 'Module 1: Recursive Power Function (Fast Exponentiation)',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n) using divide-and-conquer recursion in O(log n) time.',
      constraints: ['Time Complexity: O(log n)', '-100.0 < x < 100.0', 'n is a 32-bit signed integer'],
      sampleInputs: [
        { input: 'x = 2.00000, n = 10', output: '1024.00000' },
        { input: 'x = 2.00000, n = -2', output: '0.25000' }
      ],
      starterCode: `function myPow(x, n) {\n  if (n === 0) return 1.0;\n  if (n < 0) return 1.0 / myPow(x, -n);\n  // TODO: Fast exponentiation via half powers\n  \n  return 0.0;\n}\n\nconsole.log("2^10:", myPow(2, 10));`,
      solutionHint: 'const half = myPow(x, Math.floor(n / 2)); return n % 2 === 0 ? half * half : half * half * x;',
      languageVariants: {
        javascript: {
          starterCode: `function myPow(x, n) {\n  if (n === 0) return 1.0;\n  if (n < 0) return 1.0 / myPow(x, -n);\n  const half = myPow(x, Math.floor(n / 2));\n  return n % 2 === 0 ? half * half : half * half * x;\n}`,
          solutionHint: 'Divide exponent by 2 recursively.'
        },
        python: {
          starterCode: `def my_pow(x: float, n: int) -> float:\n    if n == 0: return 1.0\n    if n < 0: return 1.0 / my_pow(x, -n)\n    half = my_pow(x, n // 2)\n    return half * half if n % 2 == 0 else half * half * x`,
          solutionHint: 'O(log n) fast exponentiation recursion.'
        },
        java: {
          starterCode: `public class Solution {\n    public static double myPow(double x, int n) {\n        long N = n;\n        if (N < 0) { x = 1 / x; N = -N; }\n        return fastPow(x, N);\n    }\n    private static double fastPow(double x, long n) {\n        if (n == 0) return 1.0;\n        double half = fastPow(x, n / 2);\n        return n % 2 == 0 ? half * half : half * half * x;\n    }\n}`,
          solutionHint: 'Handle Integer.MIN_VALUE by promoting n to long.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\ndouble fastPow(double x, long long n) {\n    if (n == 0) return 1.0;\n    double half = fastPow(x, n / 2);\n    return n % 2 == 0 ? half * half : half * half * x;\n}\ndouble myPow(double x, int n) {\n    long long N = n;\n    if (N < 0) { x = 1.0 / x; N = -N; }\n    return fastPow(x, N);\n}`,
          solutionHint: 'Fast recursive exponentiation in O(log n).'
        }
      }
    },
    {
      id: 'rec-mod-2',
      title: 'Module 2: Subsets (Power Set via Backtracking)',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Given an integer array nums of unique elements, return all possible subsets (the power set) of size 2^n using backtracking recursion.',
      constraints: ['Time Complexity: O(2^n)', 'Space Complexity: O(n) recursion stack'],
      sampleInputs: [
        { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }
      ],
      starterCode: `function subsets(nums) {\n  const result = [];\n  function backtrack(start, path) {\n    result.push([...path]);\n    // TODO: Iterate from start index and recurse\n    \n  }\n  backtrack(0, []);\n  return result;\n}`,
      solutionHint: 'for (let i = start; i < nums.length; i++) { path.push(nums[i]); backtrack(i + 1, path); path.pop(); }',
      languageVariants: {
        javascript: {
          starterCode: `function subsets(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]); backtrack(i + 1, path); path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}`,
          solutionHint: 'Push copy of path at each decision node.'
        },
        python: {
          starterCode: `def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res`,
          solutionHint: 'Backtrack branching on each index.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> subsets(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, nums, new ArrayList<>(), res);\n        return res;\n    }\n    private static void backtrack(int start, int[] nums, List<Integer> path, List<List<Integer>> res) {\n        res.add(new ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);\n            backtrack(i + 1, nums, path, res);\n            path.remove(path.size() - 1);\n        }\n    }\n}`,
          solutionHint: 'Backtracking power set tree exploration.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nvoid backtrack(int start, const std::vector<int>& nums, std::vector<int>& path, std::vector<std::vector<int>>& res) {\n    res.push_back(path);\n    for (int i = start; i < nums.size(); i++) {\n        path.push_back(nums[i]);\n        backtrack(i + 1, nums, path, res);\n        path.pop_back();\n    }\n}\nstd::vector<std::vector<int>> subsets(const std::vector<int>& nums) {\n    std::vector<std::vector<int>> res;\n    std::vector<int> path;\n    backtrack(0, nums, path, res);\n    return res;\n}`,
          solutionHint: 'Push path and backtrack with push/pop.'
        }
      }
    },
    {
      id: 'rec-mod-3',
      title: 'Module 3: Combination Sum (Candidate Backtracking)',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations where candidate numbers may be chosen an unlimited number of times.',
      constraints: ['All numbers positive', 'Unique combinations only'],
      sampleInputs: [
        { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' }
      ],
      starterCode: `function combinationSum(candidates, target) {\n  const result = [];\n  function backtrack(start, remain, path) {\n    if (remain === 0) { result.push([...path]); return; }\n    if (remain < 0) return;\n    // TODO: Recurse with i maintaining repetition capability\n    \n  }\n  backtrack(0, target, []);\n  return result;\n}`,
      solutionHint: 'for (let i = start; i < candidates.length; i++) { path.push(candidates[i]); backtrack(i, remain - candidates[i], path); path.pop(); }',
      languageVariants: {
        javascript: {
          starterCode: `function combinationSum(candidates, target) {\n  const res = [];\n  function backtrack(start, remain, path) {\n    if (remain === 0) { res.push([...path]); return; }\n    if (remain < 0) return;\n    for (let i = start; i < candidates.length; i++) {\n      path.push(candidates[i]);\n      backtrack(i, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  backtrack(0, target, []);\n  return res;\n}`,
          solutionHint: 'Allow reusing index i in recursive call.'
        },
        python: {
          starterCode: `def combination_sum(candidates: list[int], target: int) -> list[list[int]]:\n    res = []\n    def backtrack(start, remain, path):\n        if remain == 0: res.append(list(path)); return\n        if remain < 0: return\n        for i in range(start, len(candidates)):\n            path.append(candidates[i])\n            backtrack(i, remain - candidates[i], path)\n            path.pop()\n    backtrack(0, target, [])\n    return res`,
          solutionHint: 'Pass current index i to allow unlimited candidate reuse.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> combinationSum(int[] candidates, int target) {\n        List<List<Integer>> res = new ArrayList<>();\n        backtrack(0, target, candidates, new ArrayList<>(), res);\n        return res;\n    }\n    private static void backtrack(int start, int remain, int[] candidates, List<Integer> path, List<List<Integer>> res) {\n        if (remain == 0) { res.add(new ArrayList<>(path)); return; }\n        if (remain < 0) return;\n        for (int i = start; i < candidates.length; i++) {\n            path.add(candidates[i]);\n            backtrack(i, remain - candidates[i], candidates, path, res);\n            path.remove(path.size() - 1);\n        }\n    }\n}`,
          solutionHint: 'Backtrack tree exploring candidate sums.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nvoid backtrack(int start, int remain, const std::vector<int>& candidates, std::vector<int>& path, std::vector<std::vector<int>>& res) {\n    if (remain == 0) { res.push_back(path); return; }\n    if (remain < 0) return;\n    for (int i = start; i < candidates.size(); i++) {\n        path.push_back(candidates[i]);\n        backtrack(i, remain - candidates[i], candidates, path, res);\n        path.pop_back();\n    }\n}\nstd::vector<std::vector<int>> combinationSum(const std::vector<int>& candidates, int target) {\n    std::vector<std::vector<int>> res;\n    std::vector<int> path;\n    backtrack(0, target, candidates, path, res);\n    return res;\n}`,
          solutionHint: 'Target reduction recursion.'
        }
      }
    },
    {
      id: 'rec-mod-4',
      title: 'Module 4: Permutations (Full Array Ordering)',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Given an array nums of distinct integers, return all the possible permutations of size n! using swap-based or used-set backtracking.',
      constraints: ['Time Complexity: O(n * n!)', 'All elements unique'],
      sampleInputs: [
        { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }
      ],
      starterCode: `function permute(nums) {\n  const result = [];\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) { result.push([...path]); return; }\n    // TODO: Iterate used array, mark used, backtrack, unmark\n    \n  }\n  backtrack([]);\n  return result;\n}`,
      solutionHint: 'for (let i = 0; i < nums.length; i++) { if (used[i]) continue; used[i] = true; path.push(nums[i]); backtrack(path); path.pop(); used[i] = false; }',
      languageVariants: {
        javascript: {
          starterCode: `function permute(nums) {\n  const res = [], used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) { res.push([...path]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true; path.push(nums[i]);\n      backtrack(path);\n      path.pop(); used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}`,
          solutionHint: 'Track visited elements with boolean used flags.'
        },
        python: {
          starterCode: `def permute(nums: list[int]) -> list[list[int]]:\n    res = []\n    used = [False] * len(nums)\n    def backtrack(path):\n        if len(path) == len(nums): res.append(list(path)); return\n        for i in range(len(nums)):\n            if used[i]: continue\n            used[i] = True; path.append(nums[i])\n            backtrack(path)\n            path.pop(); used[i] = False\n    backtrack([])\n    return res`,
          solutionHint: 'Permutations generated using visited element flags.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<List<Integer>> permute(int[] nums) {\n        List<List<Integer>> res = new ArrayList<>();\n        boolean[] used = new boolean[nums.length];\n        backtrack(nums, used, new ArrayList<>(), res);\n        return res;\n    }\n    private static void backtrack(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {\n        if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }\n        for (int i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true; path.add(nums[i]);\n            backtrack(nums, used, path, res);\n            path.remove(path.size() - 1); used[i] = false;\n        }\n    }\n}`,
          solutionHint: 'Boolean used array permutation generator.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nvoid backtrack(const std::vector<int>& nums, std::vector<bool>& used, std::vector<int>& path, std::vector<std::vector<int>>& res) {\n    if (path.size() == nums.size()) { res.push_back(path); return; }\n    for (int i = 0; i < nums.size(); i++) {\n        if (used[i]) continue;\n        used[i] = true; path.push_back(nums[i]);\n        backtrack(nums, used, path, res);\n        path.pop_back(); used[i] = false;\n    }\n}\nstd::vector<std::vector<int>> permute(const std::vector<int>& nums) {\n    std::vector<std::vector<int>> res;\n    std::vector<bool> used(nums.size(), false);\n    std::vector<int> path;\n    backtrack(nums, used, path, res);\n    return res;\n}`,
          solutionHint: 'Vector used state backtracking.'
        }
      }
    },
    {
      id: 'rec-mod-5',
      title: 'Module 5: Generate Well-Formed Parentheses',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Given n pairs of parentheses, write a recursive function to generate all combinations of well-formed (valid) parentheses.',
      constraints: ['1 <= n <= 8', 'Result count matches nth Catalan number'],
      sampleInputs: [
        { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
        { input: 'n = 1', output: '["()"]' }
      ],
      starterCode: `function generateParenthesis(n) {\n  const result = [];\n  function backtrack(curr, openCount, closeCount) {\n    if (curr.length === 2 * n) { result.push(curr); return; }\n    // TODO: Add \'(\' if openCount < n, add \')\' if closeCount < openCount\n    \n  }\n  backtrack('', 0, 0);\n  return result;\n}`,
      solutionHint: 'if (openCount < n) backtrack(curr + "(", openCount + 1, closeCount); if (closeCount < openCount) backtrack(curr + ")", openCount, closeCount + 1);',
      languageVariants: {
        javascript: {
          starterCode: `function generateParenthesis(n) {\n  const res = [];\n  function backtrack(curr, open, close) {\n    if (curr.length === 2 * n) { res.push(curr); return; }\n    if (open < n) backtrack(curr + '(', open + 1, close);\n    if (close < open) backtrack(curr + ')', open, close + 1);\n  }\n  backtrack('', 0, 0);\n  return res;\n}`,
          solutionHint: 'Only append closing parenthesis when fewer than opening.'
        },
        python: {
          starterCode: `def generate_parenthesis(n: int) -> list[str]:\n    res = []\n    def backtrack(curr, open_cnt, close_cnt):\n        if len(curr) == 2 * n: res.append(curr); return\n        if open_cnt < n: backtrack(curr + '(', open_cnt + 1, close_cnt)\n        if close_cnt < open_cnt: backtrack(curr + ')', open_cnt, close_cnt + 1)\n    backtrack('', 0, 0)\n    return res`,
          solutionHint: 'Catalan branching recursion maintaining valid balance.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<String> generateParenthesis(int n) {\n        List<String> res = new ArrayList<>();\n        backtrack("", 0, 0, n, res);\n        return res;\n    }\n    private static void backtrack(String curr, int open, int close, int n, List<String> res) {\n        if (curr.length() == 2 * n) { res.add(curr); return; }\n        if (open < n) backtrack(curr + "(", open + 1, close, n, res);\n        if (close < open) backtrack(curr + ")", open, close + 1, n, res);\n    }\n}`,
          solutionHint: 'Recursive bracket expansion with bounds check.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nvoid backtrack(std::string curr, int open, int close, int n, std::vector<std::string>& res) {\n    if (curr.size() == 2 * n) { res.push_back(curr); return; }\n    if (open < n) backtrack(curr + "(", open + 1, close, n, res);\n    if (close < open) backtrack(curr + ")", open, close + 1, n, res);\n}\nstd::vector<std::string> generateParenthesis(int n) {\n    std::vector<std::string> res;\n    backtrack("", 0, 0, n, res);\n    return res;\n}`,
          solutionHint: 'Parenthesis balancing recursion.'
        }
      }
    },
    {
      id: 'rec-mod-6',
      title: 'Module 6: Word Search in 2D Grid',
      difficulty: 'Medium',
      category: 'Recursion',
      description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid constructed from sequentially adjacent cells in 4 directions.',
      constraints: ['Same letter cell cannot be used more than once per word', 'Time Complexity: O(m * n * 4^L)'],
      sampleInputs: [
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' },
        { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false' }
      ],
      starterCode: `function exist(board, word) {\n  const m = board.length, n = board[0].length;\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;\n    const tmp = board[r][c];\n    board[r][c] = '#'; // mark visited\n    // TODO: Search 4 directions, then unmark board[r][c] = tmp\n    \n    return false;\n  }\n  // TODO: Search starting from every matching cell\n  return false;\n}`,
      solutionHint: 'const found = dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1); board[r][c] = tmp; return found;',
      languageVariants: {
        javascript: {
          starterCode: `function exist(board, word) {\n  const m = board.length, n = board[0].length;\n  function dfs(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[idx]) return false;\n    const tmp = board[r][c]; board[r][c] = '#';\n    const found = dfs(r + 1, c, idx + 1) || dfs(r - 1, c, idx + 1) || dfs(r, c + 1, idx + 1) || dfs(r, c - 1, idx + 1);\n    board[r][c] = tmp;\n    return found;\n  }\n  for (let r = 0; r < m; r++)\n    for (let c = 0; c < n; c++)\n      if (dfs(r, c, 0)) return true;\n  return false;\n}`,
          solutionHint: 'Backtrack by temporarily replacing cell with "#".'
        },
        python: {
          starterCode: `def exist(board: list[list[str]], word: str) -> bool:\n    m, n = len(board), len(board[0])\n    def dfs(r, c, idx):\n        if idx == len(word): return True\n        if r < 0 or r >= m or c < 0 or c >= n or board[r][c] != word[idx]: return False\n        tmp, board[r][c] = board[r][c], '#'\n        found = dfs(r + 1, c, idx + 1) or dfs(r - 1, c, idx + 1) or dfs(r, c + 1, idx + 1) or dfs(r, c - 1, idx + 1)\n        board[r][c] = tmp\n        return found\n    for r in range(m):\n        for c in range(n):\n            if dfs(r, c, 0): return True\n    return False`,
          solutionHint: '4-directional DFS with backtrack unmarking.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean exist(char[][] board, String word) {\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (dfs(board, word, r, c, 0, m, n)) return true;\n        return false;\n    }\n    private static boolean dfs(char[][] board, String word, int r, int c, int idx, int m, int n) {\n        if (idx == word.length()) return true;\n        if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word.charAt(idx)) return false;\n        char tmp = board[r][c]; board[r][c] = '#';\n        boolean found = dfs(board, word, r + 1, c, idx + 1, m, n) || dfs(board, word, r - 1, c, idx + 1, m, n) || dfs(board, word, r, c + 1, idx + 1, m, n) || dfs(board, word, r, c - 1, idx + 1, m, n);\n        board[r][c] = tmp;\n        return found;\n    }\n}`,
          solutionHint: 'In-place character swap backtracking.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nbool dfs(std::vector<std::vector<char>>& board, const std::string& word, int r, int c, int idx, int m, int n) {\n    if (idx == word.size()) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[idx]) return false;\n    char tmp = board[r][c]; board[r][c] = '#';\n    bool found = dfs(board, word, r + 1, c, idx + 1, m, n) || dfs(board, word, r - 1, c, idx + 1, m, n) || dfs(board, word, r, c + 1, idx + 1, m, n) || dfs(board, word, r, c - 1, idx + 1, m, n);\n    board[r][c] = tmp;\n    return found;\n}\nbool exist(std::vector<std::vector<char>>& board, const std::string& word) {\n    int m = board.size(), n = board[0].size();\n    for (int r = 0; r < m; r++)\n        for (int c = 0; c < n; c++)\n            if (dfs(board, word, r, c, 0, m, n)) return true;\n    return false;\n}`,
          solutionHint: '2D grid character backtrack search.'
        }
      }
    },
    {
      id: 'rec-mod-7',
      title: 'Module 7: N-Queens Problem (Diagonal Backtracking)',
      difficulty: 'Hard',
      category: 'Recursion',
      description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions formatted as boards.',
      constraints: ['1 <= n <= 9', 'No two queens in same row, column, or diagonal'],
      sampleInputs: [
        { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }
      ],
      starterCode: `function solveNQueens(n) {\n  const result = [];\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(r) {\n    if (r === n) { result.push(board.map(row => row.join(''))); return; }\n    // TODO: Iterate columns c (0 to n-1), test diag constraints (r - c, r + c), backtrack\n    \n  }\n  backtrack(0);\n  return result;\n}`,
      solutionHint: 'for (let c = 0; c < n; c++) { if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue; cols.add(c); diag1.add(r - c); diag2.add(r + c); board[r][c] = "Q"; backtrack(r + 1); board[r][c] = "."; cols.delete(c); diag1.delete(r - c); diag2.delete(r + c); }',
      languageVariants: {
        javascript: {
          starterCode: `function solveNQueens(n) {\n  const res = [], cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill('.'));\n  function backtrack(r) {\n    if (r === n) { res.push(board.map(row => row.join(''))); return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;\n      cols.add(c); diag1.add(r - c); diag2.add(r + c); board[r][c] = 'Q';\n      backtrack(r + 1);\n      board[r][c] = '.'; cols.delete(c); diag1.delete(r - c); diag2.delete(r + c);\n    }\n  }\n  backtrack(0);\n  return res;\n}`,
          solutionHint: 'Track occupied columns and diagonals (r - c, r + c).'
        },
        python: {
          starterCode: `def solve_n_queens(n: int) -> list[list[str]]:\n    res = []\n    cols, diag1, diag2 = set(), set(), set()\n    board = [['.'] * n for _ in range(n)]\n    def backtrack(r):\n        if r == n: res.append(["".join(row) for row in board]); return\n        for c in range(n):\n            if c in cols or (r - c) in diag1 or (r + c) in diag2: continue\n            cols.add(c); diag1.add(r - c); diag2.add(r + c); board[r][c] = 'Q'\n            backtrack(r + 1)\n            board[r][c] = '.'; cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)\n    backtrack(0)\n    return res`,
          solutionHint: 'Use sets for column, main diagonal (r - c), and anti-diagonal (r + c).'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static List<List<String>> solveNQueens(int n) {\n        List<List<String>> res = new ArrayList<>();\n        char[][] board = new char[n][n];\n        for (char[] row : board) Arrays.fill(row, '.');\n        boolean[] cols = new boolean[n], diag1 = new boolean[2 * n], diag2 = new boolean[2 * n];\n        backtrack(0, n, board, cols, diag1, diag2, res);\n        return res;\n    }\n    private static void backtrack(int r, int n, char[][] board, boolean[] cols, boolean[] diag1, boolean[] diag2, List<List<String>> res) {\n        if (r == n) {\n            List<String> list = new ArrayList<>();\n            for (char[] row : board) list.add(new String(row));\n            res.add(list);\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            if (cols[c] || diag1[r - c + n] || diag2[r + c]) continue;\n            cols[c] = diag1[r - c + n] = diag2[r + c] = true;\n            board[r][c] = 'Q';\n            backtrack(r + 1, n, board, cols, diag1, diag2, res);\n            board[r][c] = '.';\n            cols[c] = diag1[r - c + n] = diag2[r + c] = false;\n        }\n    }\n}`,
          solutionHint: 'Boolean arrays index diagonals with r - c + n offset.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n\nvoid backtrack(int r, int n, std::vector<std::string>& board, std::vector<bool>& cols, std::vector<bool>& diag1, std::vector<bool>& diag2, std::vector<std::vector<std::string>>& res) {\n    if (r == n) { res.push_back(board); return; }\n    for (int c = 0; c < n; c++) {\n        if (cols[c] || diag1[r - c + n] || diag2[r + c]) continue;\n        cols[c] = diag1[r - c + n] = diag2[r + c] = true;\n        board[r][c] = 'Q';\n        backtrack(r + 1, n, board, cols, diag1, diag2, res);\n        board[r][c] = '.';\n        cols[c] = diag1[r - c + n] = diag2[r + c] = false;\n    }\n}\nstd::vector<std::vector<std::string>> solveNQueens(int n) {\n    std::vector<std::vector<std::string>> res;\n    std::vector<std::string> board(n, std::string(n, '.'));\n    std::vector<bool> cols(n, false), diag1(2 * n, false), diag2(2 * n, false);\n    backtrack(0, n, board, cols, diag1, diag2, res);\n    return res;\n}`,
          solutionHint: 'N-Queens diagonal constraint solver.'
        }
      }
    },
    {
      id: 'rec-mod-8',
      title: 'Module 8: Sudoku Solver (9x9 Constraint Backtracking)',
      difficulty: 'Hard',
      category: 'Recursion',
      description: 'Write a program to solve a 9x9 Sudoku puzzle by filling the empty cells (marked with \'.\') ensuring each digit 1-9 occurs exactly once per row, column, and 3x3 sub-box.',
      constraints: ['Input board always has unique valid solution', 'Time Complexity: O(9^(empty cells))'],
      sampleInputs: [
        { input: '9x9 board with empty cells marked with \'.\'', output: 'Fully solved valid 9x9 Sudoku board in-place' }
      ],
      starterCode: `function solveSudoku(board) {\n  function isValid(r, c, ch) {\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch || board[i][c] === ch) return false;\n      const boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3);\n      const boxC = 3 * Math.floor(c / 3) + (i % 3);\n      if (board[boxR][boxC] === ch) return false;\n    }\n    return true;\n  }\n  function solve() {\n    // TODO: Find first empty \'.\', try \'1\'-\'9\', backtrack\n    \n    return true;\n  }\n  solve();\n}`,
      solutionHint: 'Loop r from 0-8, c from 0-8: if (board[r][c] === ".") { for (let d = 1; d <= 9; d++) { const ch = String(d); if (isValid(r, c, ch)) { board[r][c] = ch; if (solve()) return true; board[r][c] = "."; } } return false; } return true;',
      languageVariants: {
        javascript: {
          starterCode: `function solveSudoku(board) {\n  function isValid(r, c, ch) {\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch || board[i][c] === ch) return false;\n      const br = 3 * Math.floor(r / 3) + Math.floor(i / 3), bc = 3 * Math.floor(c / 3) + (i % 3);\n      if (board[br][bc] === ch) return false;\n    }\n    return true;\n  }\n  function solve() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === '.') {\n          for (let d = 1; d <= 9; d++) {\n            const ch = String(d);\n            if (isValid(r, c, ch)) {\n              board[r][c] = ch;\n              if (solve()) return true;\n              board[r][c] = '.';\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  solve();\n}`,
          solutionHint: 'Try candidate digits 1-9 on empty cell with box, row, and column checks.'
        },
        python: {
          starterCode: `def solve_sudoku(board: list[list[str]]) -> None:\n    def is_valid(r, c, ch):\n        for i in range(9):\n            if board[r][i] == ch or board[i][c] == ch: return False\n            if board[3 * (r // 3) + i // 3][3 * (c // 3) + i % 3] == ch: return False\n        return True\n    def solve():\n        for r in range(9):\n            for c in range(9):\n                if board[r][c] == '.':\n                    for d in '123456789':\n                        if is_valid(r, c, d):\n                            board[r][c] = d\n                            if solve(): return True\n                            board[r][c] = '.'\n                    return False\n        return True\n    solve()`,
          solutionHint: 'In-place Sudoku board constraint propagation and backtracking.'
        },
        java: {
          starterCode: `public class Solution {\n    public static void solveSudoku(char[][] board) {\n        solve(board);\n    }\n    private static boolean solve(char[][] board) {\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                if (board[r][c] == '.') {\n                    for (char d = '1'; d <= '9'; d++) {\n                        if (isValid(board, r, c, d)) {\n                            board[r][c] = d;\n                            if (solve(board)) return true;\n                            board[r][c] = '.';\n                        }\n                    }\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n    private static boolean isValid(char[][] board, int r, int c, char ch) {\n        for (int i = 0; i < 9; i++) {\n            if (board[r][i] == ch || board[i][c] == ch) return false;\n            if (board[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == ch) return false;\n        }\n        return true;\n    }\n}`,
          solutionHint: 'Recursive cell filling with sub-box math check.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nbool isValid(const std::vector<std::vector<char>>& board, int r, int c, char ch) {\n    for (int i = 0; i < 9; i++) {\n        if (board[r][i] == ch || board[i][c] == ch) return false;\n        if (board[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == ch) return false;\n    }\n    return true;\n}\nbool solve(std::vector<std::vector<char>>& board) {\n    for (int r = 0; r < 9; r++) {\n        for (int c = 0; c < 9; c++) {\n            if (board[r][c] == '.') {\n                for (char d = '1'; d <= '9'; d++) {\n                    if (isValid(board, r, c, d)) {\n                        board[r][c] = d;\n                        if (solve(board)) return true;\n                        board[r][c] = '.';\n                    }\n                }\n                return false;\n            }\n        }\n    }\n    return true;\n}\nvoid solveSudoku(std::vector<std::vector<char>>& board) {\n    solve(board);\n}`,
          solutionHint: '9x9 Sudoku backtracking constraint solver.'
        }
      }
    }
  ],

  'dynamic-programming': [
    {
      id: 'dp-1',
      title: '1. Climbing Stairs (Fibonacci 1D DP)',
      difficulty: 'Easy',
      category: 'Dynamic Programming',
      description: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?',
      constraints: ['1 <= n <= 45', 'Time Complexity: O(n)', 'Space Complexity: O(1)'],
      sampleInputs: [{ input: 'n = 5', output: '8' }],
      starterCode: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  // TODO: Compute ways to climb n stairs\n  \n  return prev1;\n}\n\nconsole.log(climbStairs(5));`,
      solutionHint: 'for (let i = 3; i <= n; i++) { let cur = prev1 + prev2; prev2 = prev1; prev1 = cur; }',
      languageVariants: {
        javascript: {
          starterCode: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}\n\nconsole.log(climbStairs(5));`,
          solutionHint: 'Fibonacci state transition: dp[i] = dp[i-1] + dp[i-2]'
        },
        python: {
          starterCode: `def climb_stairs(n: int) -> int:\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    # TODO: Compute DP steps\n    for _ in range(3, n + 1):\n        prev2, prev1 = prev1, prev2 + prev1\n    return prev1\n\nprint(climb_stairs(5))`,
          solutionHint: 'prev2, prev1 = prev1, prev2 + prev1'
        },
        java: {
          starterCode: `public class Solution {\n    public static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int cur = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = cur;\n        }\n        return prev1;\n    }\n    public static void main(String[] args) {\n        System.out.println(climbStairs(5));\n    }\n}`,
          solutionHint: 'O(1) space Fibonacci iteration.'
        },
        cpp: {
          starterCode: `#include <iostream>\n\nint climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for (int i = 3; i <= n; i++) {\n        int cur = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}\n\nint main() {\n    std::cout << climbStairs(5) << "\\n";\n    return 0;\n}`,
          solutionHint: '1D DP space optimization with two variables.'
        }
      }
    },
    {
      id: 'dp-2',
      title: '2. Coin Change (Minimum Coins DP)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given an array of coin denominations and a target amount, return the fewest coins needed to make up that amount. Return -1 if impossible.',
      constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4', 'Time: O(coins * amount)'],
      sampleInputs: [{ input: 'coins = [1, 2, 5], amount = 11', output: '3 (5 + 5 + 1)' }],
      starterCode: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  // TODO: Fill minimum coin DP table\n  \n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1, 2, 5], 11));`,
      solutionHint: 'For each coin, for amount from coin to total: dp[i] = min(dp[i], dp[i - coin] + 1)',
      languageVariants: {
        javascript: {
          starterCode: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let i = 1; i <= amount; i++) {\n    for (const coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1, 2, 5], 11));`,
          solutionHint: 'Unbounded knapsack: dp[i] = min(dp[i], dp[i - coin] + 1)'
        },
        python: {
          starterCode: `def coin_change(coins: list[int], amount: int) -> int:\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if i - coin >= 0:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1\n\nprint(coin_change([1, 2, 5], 11))`,
          solutionHint: 'dp[i] = min(dp[i], dp[i - coin] + 1)'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int i = 1; i <= amount; i++) {\n            for (int coin : coins) {\n                if (i - coin >= 0) {\n                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n                }\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n    public static void main(String[] args) {\n        System.out.println(coinChange(new int[]{1, 2, 5}, 11));\n    }\n}`,
          solutionHint: 'Fill array with amount + 1 as sentinel.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint coinChange(const std::vector<int>& coins, int amount) {\n    std::vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++) {\n        for (int coin : coins) {\n            if (i - coin >= 0) {\n                dp[i] = std::min(dp[i], dp[i - coin] + 1);\n            }\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n\nint main() {\n    std::cout << coinChange({1, 2, 5}, 11) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Classic 1D DP tabulation for minimum coin count.'
        }
      }
    },
    {
      id: 'dp-3',
      title: '3. Longest Increasing Subsequence (LIS)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) or O(n^2) time.',
      constraints: ['1 <= nums.length <= 2500', 'Subsequence elements do not need to be contiguous'],
      sampleInputs: [{ input: 'nums = [10, 9, 2, 5, 3, 7, 101, 18]', output: '4 ([2, 3, 7, 101])' }],
      starterCode: `function lengthOfLIS(nums) {\n  if (!nums.length) return 0;\n  const dp = new Array(nums.length).fill(1);\n  // TODO: Compute longest increasing subsequence\n  \n  return Math.max(...dp);\n}\n\nconsole.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));`,
      solutionHint: 'For i from 1 to n: for j from 0 to i-1: if nums[i] > nums[j], dp[i] = max(dp[i], dp[j] + 1)',
      languageVariants: {
        javascript: {
          starterCode: `function lengthOfLIS(nums) {\n  if (!nums.length) return 0;\n  const dp = new Array(nums.length).fill(1);\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n  }\n  return Math.max(...dp);\n}\n\nconsole.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]));`,
          solutionHint: 'dp[i] stores longest increasing subsequence ending at index i.'
        },
        python: {
          starterCode: `import bisect\n\ndef length_of_lis(nums: list[int]) -> int:\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails):\n            tails.append(x)\n        else:\n            tails[idx] = x\n    return len(tails)\n\nprint(length_of_lis([10, 9, 2, 5, 3, 7, 101, 18]))`,
          solutionHint: 'Patience sort binary search in O(n log n).'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int lengthOfLIS(int[] nums) {\n        int[] dp = new int[nums.length];\n        int len = 0;\n        for (int x : nums) {\n            int i = Arrays.binarySearch(dp, 0, len, x);\n            if (i < 0) i = -(i + 1);\n            dp[i] = x;\n            if (i == len) len++;\n        }\n        return len;\n    }\n    public static void main(String[] args) {\n        System.out.println(lengthOfLIS(new int[]{10, 9, 2, 5, 3, 7, 101, 18}));\n    }\n}`,
          solutionHint: 'Patience sorting with binary search replacement.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint lengthOfLIS(const std::vector<int>& nums) {\n    std::vector<int> tails;\n    for (int x : nums) {\n        auto it = std::lower_bound(tails.begin(), tails.end(), x);\n        if (it == tails.end()) tails.push_back(x);\n        else *it = x;\n    }\n    return tails.size();\n}\n\nint main() {\n    std::cout << lengthOfLIS({10, 9, 2, 5, 3, 7, 101, 18}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'std::lower_bound greedy tail array maintenance.'
        }
      }
    },
    {
      id: 'dp-4',
      title: '4. 0/1 Knapsack Problem',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given item weights, values, and max capacity W, find the maximum value achievable without exceeding weight W where each item can only be selected once.',
      constraints: ['1 <= N <= 1000', '1 <= W <= 1000', 'Time: O(N * W)', 'Space: O(W)'],
      sampleInputs: [{ input: 'weights = [2, 3, 4, 5], values = [3, 4, 5, 6], W = 5', output: '7 (item 1 + item 2)' }],
      starterCode: `function knapsack(weights, values, W) {\n  const dp = new Array(W + 1).fill(0);\n  // TODO: Compute maximum value fitting in knapsack W\n  \n  return dp[W];\n}\n\nconsole.log(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5));`,
      solutionHint: 'Iterate items: for cap from W down to weight: dp[cap] = max(dp[cap], dp[cap - weight] + val)',
      languageVariants: {
        javascript: {
          starterCode: `function knapsack(weights, values, W) {\n  const dp = new Array(W + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    const w = weights[i];\n    const v = values[i];\n    for (let cap = W; cap >= w; cap--) {\n      dp[cap] = Math.max(dp[cap], dp[cap - w] + v);\n    }\n  }\n  return dp[W];\n}\n\nconsole.log(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5));`,
          solutionHint: 'Traverse capacity backwards to prevent reusing the same item.'
        },
        python: {
          starterCode: `def knapsack(weights: list[int], values: list[int], W: int) -> int:\n    dp = [0] * (W + 1)\n    for w, v in zip(weights, values):\n        for cap in range(W, w - 1, -1):\n            dp[cap] = max(dp[cap], dp[cap - w] + v)\n    return dp[W]\n\nprint(knapsack([2, 3, 4, 5], [3, 4, 5, 6], 5))`,
          solutionHint: 'Reverse capacity loop ensures 0/1 single item constraint.'
        },
        java: {
          starterCode: `public class Solution {\n    public static int knapsack(int[] weights, int[] values, int W) {\n        int[] dp = new int[W + 1];\n        for (int i = 0; i < weights.length; i++) {\n            int w = weights[i], v = values[i];\n            for (int cap = W; cap >= w; cap--) {\n                dp[cap] = Math.max(dp[cap], dp[cap - w] + v);\n            }\n        }\n        return dp[W];\n    }\n    public static void main(String[] args) {\n        System.out.println(knapsack(new int[]{2, 3, 4, 5}, new int[]{3, 4, 5, 6}, 5));\n    }\n}`,
          solutionHint: 'O(W) 1D space optimized bounded knapsack.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint knapsack(const std::vector<int>& weights, const std::vector<int>& values, int W) {\n    std::vector<int> dp(W + 1, 0);\n    for (size_t i = 0; i < weights.size(); i++) {\n        for (int cap = W; cap >= weights[i]; cap--) {\n            dp[cap] = std::max(dp[cap], dp[cap - weights[i]] + values[i]);\n        }\n    }\n    return dp[W];\n}\n\nint main() {\n    std::cout << knapsack({2, 3, 4, 5}, {3, 4, 5, 6}, 5) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Backward inner loop maintains 1D DP table correctness.'
        }
      }
    },
    {
      id: 'dp-5',
      title: '5. Longest Common Subsequence (LCS 2D DP)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given two strings text1 and text2, return the length of their longest common subsequence in O(m * n) time.',
      constraints: ['1 <= text1.length, text2.length <= 1000', 'Subsequence preserves relative order'],
      sampleInputs: [{ input: 'text1 = "abcde", text2 = "ace"', output: '3 ("ace")' }],
      starterCode: `function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  // TODO: Build 2D LCS grid\n  \n  return dp[m][n];\n}\n\nconsole.log(longestCommonSubsequence("abcde", "ace"));`,
      solutionHint: 'if text1[i-1] === text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1], else max(dp[i-1][j], dp[i][j-1])',
      languageVariants: {
        javascript: {
          starterCode: `function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i - 1] === text2[j - 1]) {\n        dp[i][j] = 1 + dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log(longestCommonSubsequence("abcde", "ace"));`,
          solutionHint: 'Classic 2D matrix matching state transitions.'
        },
        python: {
          starterCode: `def longest_common_subsequence(text1: str, text2: str) -> int:\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i - 1] == text2[j - 1]:\n                dp[i][j] = 1 + dp[i - 1][j - 1]\n            else:\n                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])\n    return dp[m][n]\n\nprint(longest_common_subsequence("abcde", "ace"))`,
          solutionHint: '2D grid match: 1 + dp[i-1][j-1] or max(adjacent).'
        },
        java: {
          starterCode: `public class Solution {\n    public static int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {\n                    dp[i][j] = 1 + dp[i - 1][j - 1];\n                } else {\n                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n                }\n            }\n        }\n        return dp[m][n];\n    }\n    public static void main(String[] args) {\n        System.out.println(longestCommonSubsequence("abcde", "ace"));\n    }\n}`,
          solutionHint: '2D table comparing characters at (i-1, j-1).'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nint longestCommonSubsequence(const std::string& text1, const std::string& text2) {\n    int m = text1.size(), n = text2.size();\n    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (text1[i - 1] == text2[j - 1]) {\n                dp[i][j] = 1 + dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = std::max(dp[i - 1][j], dp[i][j - 1]);\n            }\n        }\n    }\n    return dp[m][n];\n}\n\nint main() {\n    std::cout << longestCommonSubsequence("abcde", "ace") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Matrix cell (m, n) yields longest common sequence length.'
        }
      }
    },
    {
      id: 'dp-6',
      title: '6. Word Break (String Segmentation DP)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Given a string s and a dictionary wordDict, return true if s can be segmented into a space-separated sequence of valid dictionary words.',
      constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', 'Words can be reused'],
      sampleInputs: [{ input: 's = "leetcode", wordDict = ["leet", "code"]', output: 'true' }],
      starterCode: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n  // TODO: Validate prefix substrings\n  \n  return dp[s.length];\n}\n\nconsole.log(wordBreak("leetcode", ["leet", "code"]));`,
      solutionHint: 'For i from 1 to n: for j from 0 to i-1: if dp[j] && wordSet.has(s.substring(j, i)), dp[i] = true',
      languageVariants: {
        javascript: {
          starterCode: `function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true;\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && wordSet.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n  return dp[s.length];\n}\n\nconsole.log(wordBreak("leetcode", ["leet", "code"]));`,
          solutionHint: 'Prefix substring matching against HashSet.'
        },
        python: {
          starterCode: `def word_break(s: str, word_dict: list[str]) -> bool:\n    word_set = set(word_dict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    return dp[len(s)]\n\nprint(word_break("leetcode", ["leet", "code"]))`,
          solutionHint: 'dp[i] checks if prefix s[:i] can be segmented.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> wordSet = new HashSet<>(wordDict);\n        boolean[] dp = new boolean[s.length() + 1];\n        dp[0] = true;\n        for (int i = 1; i <= s.length(); i++) {\n            for (int j = 0; j < i; j++) {\n                if (dp[j] && wordSet.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break;\n                }\n            }\n        }\n        return dp[s.length()];\n    }\n    public static void main(String[] args) {\n        System.out.println(wordBreak("leetcode", Arrays.asList("leet", "code")));\n    }\n}`,
          solutionHint: 'O(n^2) prefix DP with sub-string verification.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_set>\n\nbool wordBreak(const std::string& s, const std::vector<std::string>& wordDict) {\n    std::unordered_set<std::string> wordSet(wordDict.begin(), wordDict.end());\n    std::vector<bool> dp(s.size() + 1, false);\n    dp[0] = true;\n    for (size_t i = 1; i <= s.size(); i++) {\n        for (size_t j = 0; j < i; j++) {\n            if (dp[j] && wordSet.count(s.substr(j, i - j))) {\n                dp[i] = true;\n                break;\n            }\n        }\n    }\n    return dp[s.size()];\n}\n\nint main() {\n    std::cout << (wordBreak("leetcode", {"leet", "code"}) ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: 'String slice hash check with boolean array.'
        }
      }
    },
    {
      id: 'dp-7',
      title: '7. House Robber II (Circular Array DP)',
      difficulty: 'Medium',
      category: 'Dynamic Programming',
      description: 'Houses are arranged in a circular street. First and last houses are adjacent. Return maximum money you can rob without triggering police alarm.',
      constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000', 'Time: O(n)', 'Space: O(1)'],
      sampleInputs: [{ input: 'nums = [2, 3, 2]', output: '3' }],
      starterCode: `function rob(nums) {\n  if (nums.length === 1) return nums[0];\n  const robLinear = (arr) => {\n    let prev2 = 0, prev1 = 0;\n    for (const num of arr) {\n      const cur = Math.max(prev1, prev2 + num);\n      prev2 = prev1;\n      prev1 = cur;\n    }\n    return prev1;\n  };\n  // TODO: Return max between [0..n-2] and [1..n-1]\n  \n  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));\n}\n\nconsole.log(rob([2, 3, 2]));`,
      solutionHint: 'Circular break: Max of linear rob excluding first vs linear rob excluding last house.',
      languageVariants: {
        javascript: {
          starterCode: `function rob(nums) {\n  if (nums.length === 1) return nums[0];\n  const robLinear = (arr) => {\n    let prev2 = 0, prev1 = 0;\n    for (const num of arr) {\n      const cur = Math.max(prev1, prev2 + num);\n      prev2 = prev1;\n      prev1 = cur;\n    }\n    return prev1;\n  };\n  return Math.max(robLinear(nums.slice(0, -1)), robLinear(nums.slice(1)));\n}\n\nconsole.log(rob([2, 3, 2]));`,
          solutionHint: 'Two-pass linear robing breaking the circle.'
        },
        python: {
          starterCode: `def rob(nums: list[int]) -> int:\n    if len(nums) == 1:\n        return nums[0]\n    def rob_linear(arr):\n        prev2, prev1 = 0, 0\n        for x in arr:\n            prev2, prev1 = prev1, max(prev1, prev2 + x)\n        return prev1\n    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))\n\nprint(rob([2, 3, 2]))`,
          solutionHint: 'max(rob_linear(nums[:-1]), rob_linear(nums[1:]))'
        },
        java: {
          starterCode: `public class Solution {\n    private static int robLinear(int[] nums, int start, int end) {\n        int prev2 = 0, prev1 = 0;\n        for (int i = start; i <= end; i++) {\n            int cur = Math.max(prev1, prev2 + nums[i]);\n            prev2 = prev1;\n            prev1 = cur;\n        }\n        return prev1;\n    }\n    public static int rob(int[] nums) {\n        if (nums.length == 1) return nums[0];\n        return Math.max(robLinear(nums, 0, nums.length - 2), robLinear(nums, 1, nums.length - 1));\n    }\n    public static void main(String[] args) {\n        System.out.println(rob(new int[]{2, 3, 2}));\n    }\n}`,
          solutionHint: 'O(1) space dual linear DP comparison.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint robLinear(const std::vector<int>& nums, int start, int end) {\n    int prev2 = 0, prev1 = 0;\n    for (int i = start; i <= end; i++) {\n        int cur = std::max(prev1, prev2 + nums[i]);\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}\nint rob(const std::vector<int>& nums) {\n    if (nums.size() == 1) return nums[0];\n    return std::max(robLinear(nums, 0, nums.size() - 2), robLinear(nums, 1, nums.size() - 1));\n}\n\nint main() {\n    std::cout << rob({2, 3, 2}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Compare ranges [0..n-2] and [1..n-1].'
        }
      }
    },
    {
      id: 'dp-8',
      title: '8. Edit Distance (Levenshtein Distance 2D DP)',
      difficulty: 'Hard',
      category: 'Dynamic Programming',
      description: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, or replace a character) required to convert word1 to word2.',
      constraints: ['0 <= word1.length, word2.length <= 500', 'Time: O(m * n)', 'Space: O(m * n)'],
      sampleInputs: [{ input: 'word1 = "horse", word2 = "ros"', output: '3 (replace h->r, remove r, remove e)' }],
      starterCode: `function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  // TODO: Base cases & Levenshtein matrix\n  \n  return dp[m][n];\n}\n\nconsole.log(minDistance("horse", "ros"));`,
      solutionHint: 'if match: dp[i-1][j-1]; else: 1 + min(dp[i-1][j] (del), dp[i][j-1] (ins), dp[i-1][j-1] (rep))',
      languageVariants: {
        javascript: {
          starterCode: `function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1];\n      } else {\n        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n      }\n    }\n  }\n  return dp[m][n];\n}\n\nconsole.log(minDistance("horse", "ros"));`,
          solutionHint: '2D grid: 1 + min(insertion, deletion, replacement)'
        },
        python: {
          starterCode: `def min_distance(word1: str, word2: str) -> int:\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]:\n                dp[i][j] = dp[i - 1][j - 1]\n            else:\n                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]\n\nprint(min_distance("horse", "ros"))`,
          solutionHint: 'Levenshtein edit distance matrix transformation.'
        },
        java: {
          starterCode: `public class Solution {\n    public static int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length();\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {\n                    dp[i][j] = dp[i - 1][j - 1];\n                } else {\n                    dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));\n                }\n            }\n        }\n        return dp[m][n];\n    }\n    public static void main(String[] args) {\n        System.out.println(minDistance("horse", "ros"));\n    }\n}`,
          solutionHint: '2D matrix computing min edit operations.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nint minDistance(const std::string& word1, const std::string& word2) {\n    int m = word1.size(), n = word2.size();\n    std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1, 0));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++) {\n        for (int j = 1; j <= n; j++) {\n            if (word1[i - 1] == word2[j - 1]) {\n                dp[i][j] = dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = 1 + std::min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});\n            }\n        }\n    }\n    return dp[m][n];\n}\n\nint main() {\n    std::cout << minDistance("horse", "ros") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Classic Levenshtein DP calculation.'
        }
      }
    }
  ],

  'greedy-algorithms': [
    {
      id: 'greedy-1',
      title: '1. Jump Game (Greedy Maximum Reach)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'You are given an integer array nums where nums[i] represents maximum jump distance from that index. Return true if you can reach the last index.',
      constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5', 'Time: O(n)', 'Space: O(1)'],
      sampleInputs: [{ input: 'nums = [2, 3, 1, 1, 4]', output: 'true' }],
      starterCode: `function canJump(nums) {\n  let maxReach = 0;\n  // TODO: Greedily track farthest reachable index\n  \n  return true;\n}\n\nconsole.log(canJump([2, 3, 1, 1, 4]));`,
      solutionHint: 'Loop index i: if i > maxReach return false; maxReach = max(maxReach, i + nums[i])',
      languageVariants: {
        javascript: {
          starterCode: `function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n    if (maxReach >= nums.length - 1) return true;\n  }\n  return true;\n}\n\nconsole.log(canJump([2, 3, 1, 1, 4]));`,
          solutionHint: 'Track maxReach in single linear pass.'
        },
        python: {
          starterCode: `def can_jump(nums: list[int]) -> bool:\n    max_reach = 0\n    for i, jump in enumerate(nums):\n        if i > max_reach:\n            return False\n        max_reach = max(max_reach, i + jump)\n        if max_reach >= len(nums) - 1:\n            return True\n    return True\n\nprint(can_jump([2, 3, 1, 1, 4]))`,
          solutionHint: 'Greedy reach boundary comparison.'
        },
        java: {
          starterCode: `public class Solution {\n    public static boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n            if (maxReach >= nums.length - 1) return true;\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        System.out.println(canJump(new int[]{2, 3, 1, 1, 4}));\n    }\n}`,
          solutionHint: 'O(n) time and O(1) space max reach tracking.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nbool canJump(const std::vector<int>& nums) {\n    int maxReach = 0;\n    for (size_t i = 0; i < nums.size(); i++) {\n        if (static_cast<int>(i) > maxReach) return false;\n        maxReach = std::max(maxReach, static_cast<int>(i) + nums[i]);\n        if (maxReach >= static_cast<int>(nums.size()) - 1) return true;\n    }\n    return true;\n}\n\nint main() {\n    std::cout << (canJump({2, 3, 1, 1, 4}) ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: 'Single loop greedy frontier expansion.'
        }
      }
    },
    {
      id: 'greedy-2',
      title: '2. Gas Station (Circular Circuit Route)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'There are n gas stations along a circular route. Return starting gas station index if you can complete the circuit once, or -1 otherwise.',
      constraints: ['1 <= gas.length == cost.length <= 10^5', 'Time: O(n)', 'Space: O(1)'],
      sampleInputs: [{ input: 'gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]', output: '3 (station index 3)' }],
      starterCode: `function canCompleteCircuit(gas, cost) {\n  let totalGas = 0, currentGas = 0, startIndex = 0;\n  // TODO: Greedily determine valid start station\n  \n  return totalGas >= 0 ? startIndex : -1;\n}\n\nconsole.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));`,
      solutionHint: 'Add (gas[i] - cost[i]) to total & current. If current < 0: reset current = 0, startIndex = i + 1.',
      languageVariants: {
        javascript: {
          starterCode: `function canCompleteCircuit(gas, cost) {\n  let totalGas = 0, currentGas = 0, startIndex = 0;\n  for (let i = 0; i < gas.length; i++) {\n    const diff = gas[i] - cost[i];\n    totalGas += diff;\n    currentGas += diff;\n    if (currentGas < 0) {\n      currentGas = 0;\n      startIndex = i + 1;\n    }\n  }\n  return totalGas >= 0 ? startIndex : -1;\n}\n\nconsole.log(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]));`,
          solutionHint: 'If totalGas >= 0, a unique starting index is guaranteed.'
        },
        python: {
          starterCode: `def can_complete_circuit(gas: list[int], cost: list[int]) -> int:\n    if sum(gas) < sum(cost):\n        return -1\n    total = 0\n    start = 0\n    for i in range(len(gas)):\n        total += gas[i] - cost[i]\n        if total < 0:\n            total = 0\n            start = i + 1\n    return start\n\nprint(can_complete_circuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]))`,
          solutionHint: 'Reset start index whenever running gas deficit occurs.'
        },
        java: {
          starterCode: `public class Solution {\n    public static int canCompleteCircuit(int[] gas, int[] cost) {\n        int totalGas = 0, currentGas = 0, start = 0;\n        for (int i = 0; i < gas.length; i++) {\n            int diff = gas[i] - cost[i];\n            totalGas += diff;\n            currentGas += diff;\n            if (currentGas < 0) {\n                currentGas = 0;\n                start = i + 1;\n            }\n        }\n        return totalGas >= 0 ? start : -1;\n    }\n    public static void main(String[] args) {\n        System.out.println(canCompleteCircuit(new int[]{1, 2, 3, 4, 5}, new int[]{3, 4, 5, 1, 2}));\n    }\n}`,
          solutionHint: 'Single O(n) pass greedy index shift.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n\nint canCompleteCircuit(const std::vector<int>& gas, const std::vector<int>& cost) {\n    int totalGas = 0, currentGas = 0, start = 0;\n    for (size_t i = 0; i < gas.size(); i++) {\n        int diff = gas[i] - cost[i];\n        totalGas += diff;\n        currentGas += diff;\n        if (currentGas < 0) {\n            currentGas = 0;\n            start = i + 1;\n        }\n    }\n    return totalGas >= 0 ? start : -1;\n}\n\nint main() {\n    std::cout << canCompleteCircuit({1, 2, 3, 4, 5}, {3, 4, 5, 1, 2}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Greedy prefix deficit reset.'
        }
      }
    },
    {
      id: 'greedy-3',
      title: '3. Non-Overlapping Intervals (Interval Scheduling)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'Given an array of intervals intervals, find the minimum number of intervals to remove to make the rest non-overlapping.',
      constraints: ['1 <= intervals.length <= 10^5', 'intervals[i] = [start, end]', 'Time: O(n log n)'],
      sampleInputs: [{ input: 'intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]', output: '1 (remove [1, 3])' }],
      starterCode: `function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  // Sort by end time ascending\n  intervals.sort((a, b) => a[1] - b[1]);\n  let removals = 0, prevEnd = intervals[0][1];\n  // TODO: Count overlapping intervals\n  \n  return removals;\n}\n\nconsole.log(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));`,
      solutionHint: 'For interval: if start < prevEnd: removals++; else: prevEnd = end',
      languageVariants: {
        javascript: {
          starterCode: `function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let removals = 0, prevEnd = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      removals++;\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n  return removals;\n}\n\nconsole.log(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]]));`,
          solutionHint: 'Greedy interval scheduling: prioritize earliest finish time.'
        },
        python: {
          starterCode: `def erase_overlap_intervals(intervals: list[list[int]]) -> int:\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[1])\n    removals = 0\n    prev_end = intervals[0][1]\n    for start, end in intervals[1:]:\n        if start < prev_end:\n            removals += 1\n        else:\n            prev_end = end\n    return removals\n\nprint(erase_overlap_intervals([[1, 2], [2, 3], [3, 4], [1, 3]]))`,
          solutionHint: 'Sort by interval end time.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int removals = 0, prevEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < prevEnd) {\n                removals++;\n            } else {\n                prevEnd = intervals[i][1];\n            }\n        }\n        return removals;\n    }\n    public static void main(String[] args) {\n        System.out.println(eraseOverlapIntervals(new int[][]{{1, 2}, {2, 3}, {3, 4}, {1, 3}}));\n    }\n}`,
          solutionHint: 'Sort by finish time to leave maximum room for remaining intervals.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint eraseOverlapIntervals(std::vector<std::vector<int>>& intervals) {\n    if (intervals.empty()) return 0;\n    std::sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {\n        return a[1] < b[1];\n    });\n    int removals = 0, prevEnd = intervals[0][1];\n    for (size_t i = 1; i < intervals.size(); i++) {\n        if (intervals[i][0] < prevEnd) {\n            removals++;\n        } else {\n            prevEnd = intervals[i][1];\n        }\n    }\n    return removals;\n}\n\nint main() {\n    std::vector<std::vector<int>> intervals = {{1, 2}, {2, 3}, {3, 4}, {1, 3}};\n    std::cout << eraseOverlapIntervals(intervals) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Custom lambda sort on interval finish time.'
        }
      }
    },
    {
      id: 'greedy-4',
      title: '4. Minimum Number of Arrows to Burst Balloons',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'Balloons are horizontal segments [xstart, xend]. An arrow shot at x bursts all balloons with xstart <= x <= xend. Return minimum arrows needed.',
      constraints: ['1 <= points.length <= 10^5', '-2^31 <= xstart < xend <= 2^31 - 1', 'Time: O(n log n)'],
      sampleInputs: [{ input: 'points = [[10, 16], [2, 8], [1, 6], [7, 12]]', output: '2 (shots at x=6, x=12)' }],
      starterCode: `function findMinArrowShots(points) {\n  if (!points.length) return 0;\n  points.sort((a, b) => a[1] - b[1]);\n  let arrows = 1, currentEnd = points[0][1];\n  // TODO: Greedily shot overlapping balloons\n  \n  return arrows;\n}\n\nconsole.log(findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]]));`,
      solutionHint: 'Loop points: if point[0] > currentEnd: arrows++; currentEnd = point[1]',
      languageVariants: {
        javascript: {
          starterCode: `function findMinArrowShots(points) {\n  if (!points.length) return 0;\n  points.sort((a, b) => a[1] - b[1]);\n  let arrows = 1, currentEnd = points[0][1];\n  for (let i = 1; i < points.length; i++) {\n    if (points[i][0] > currentEnd) {\n      arrows++;\n      currentEnd = points[i][1];\n    }\n  }\n  return arrows;\n}\n\nconsole.log(findMinArrowShots([[10, 16], [2, 8], [1, 6], [7, 12]]));`,
          solutionHint: 'Sort by right coordinate; shot at farthest right position.'
        },
        python: {
          starterCode: `def find_min_arrow_shots(points: list[list[int]]) -> int:\n    if not points:\n        return 0\n    points.sort(key=lambda x: x[1])\n    arrows = 1\n    current_end = points[0][1]\n    for start, end in points[1:]:\n        if start > current_end:\n            arrows += 1\n            current_end = end\n    return arrows\n\nprint(find_min_arrow_shots([[10, 16], [2, 8], [1, 6], [7, 12]]))`,
          solutionHint: 'Shoot arrow at the end of each non-overlapping cluster.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int findMinArrowShots(int[][] points) {\n        if (points.length == 0) return 0;\n        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));\n        int arrows = 1, currentEnd = points[0][1];\n        for (int i = 1; i < points.length; i++) {\n            if (points[i][0] > currentEnd) {\n                arrows++;\n                currentEnd = points[i][1];\n            }\n        }\n        return arrows;\n    }\n    public static void main(String[] args) {\n        System.out.println(findMinArrowShots(new int[][]{{10, 16}, {2, 8}, {1, 6}, {7, 12}}));\n    }\n}`,
          solutionHint: 'Integer.compare prevents 32-bit overflow when sorting coordinates.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint findMinArrowShots(std::vector<std::vector<int>>& points) {\n    if (points.empty()) return 0;\n    std::sort(points.begin(), points.end(), [](const auto& a, const auto& b) {\n        return a[1] < b[1];\n    });\n    int arrows = 1, currentEnd = points[0][1];\n    for (size_t i = 1; i < points.size(); i++) {\n        if (points[i][0] > currentEnd) {\n            arrows++;\n            currentEnd = points[i][1];\n        }\n    }\n    return arrows;\n}\n\nint main() {\n    std::vector<std::vector<int>> points = {{10, 16}, {2, 8}, {1, 6}, {7, 12}};\n    std::cout << findMinArrowShots(points) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Greedy interval overlapping arrow reduction.'
        }
      }
    },
    {
      id: 'greedy-5',
      title: '5. Task Scheduler (CPU Cooling Intervals)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'Given CPU tasks and a cooldown period n between identical tasks, return the least number of units of times the CPU will take to finish all tasks.',
      constraints: ['1 <= tasks.length <= 10^4', '0 <= n <= 100', 'Tasks represented by uppercase letters A-Z'],
      sampleInputs: [{ input: 'tasks = ["A", "A", "A", "B", "B", "B"], n = 2', output: '8 (A -> B -> idle -> A -> B -> idle -> A -> B)' }],
      starterCode: `function leastInterval(tasks, n) {\n  const freq = {};\n  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;\n  const maxFreq = Math.max(...Object.values(freq));\n  const maxCount = Object.values(freq).filter(f => f === maxFreq).length;\n  // TODO: Compute minimal time formula\n  \n  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n}\n\nconsole.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2));`,
      solutionHint: 'Formula: Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount)',
      languageVariants: {
        javascript: {
          starterCode: `function leastInterval(tasks, n) {\n  const freq = {};\n  for (const t of tasks) freq[t] = (freq[t] || 0) + 1;\n  const maxFreq = Math.max(...Object.values(freq));\n  const maxCount = Object.values(freq).filter(f => f === maxFreq).length;\n  return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n}\n\nconsole.log(leastInterval(["A", "A", "A", "B", "B", "B"], 2));`,
          solutionHint: 'Greedy frequency chunking formula: (maxFreq - 1) * (n + 1) + maxCount'
        },
        python: {
          starterCode: `from collections import Counter\n\ndef least_interval(tasks: list[str], n: int) -> int:\n    counts = Counter(tasks)\n    max_freq = max(counts.values())\n    max_count = sum(1 for count in counts.values() if count == max_freq)\n    return max(len(tasks), (max_freq - 1) * (n + 1) + max_count)\n\nprint(least_interval(["A", "A", "A", "B", "B", "B"], 2))`,
          solutionHint: 'max(len(tasks), (max_freq - 1) * (n + 1) + max_count)'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int leastInterval(char[] tasks, int n) {\n        int[] counts = new int[26];\n        for (char c : tasks) counts[c - 'A']++;\n        int maxFreq = 0;\n        for (int c : counts) maxFreq = Math.max(maxFreq, c);\n        int maxCount = 0;\n        for (int c : counts) if (c == maxFreq) maxCount++;\n        return Math.max(tasks.length, (maxFreq - 1) * (n + 1) + maxCount);\n    }\n    public static void main(String[] args) {\n        System.out.println(leastInterval(new char[]{'A', 'A', 'A', 'B', 'B', 'B'}, 2));\n    }\n}`,
          solutionHint: 'Greedy cooling bucket mathematics.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <algorithm>\n\nint leastInterval(const std::vector<char>& tasks, int n) {\n    std::vector<int> counts(26, 0);\n    for (char c : tasks) counts[c - 'A']++;\n    int maxFreq = *std::max_element(counts.begin(), counts.end());\n    int maxCount = std::count(counts.begin(), counts.end(), maxFreq);\n    return std::max(static_cast<int>(tasks.size()), (maxFreq - 1) * (n + 1) + maxCount);\n}\n\nint main() {\n    std::cout << leastInterval({'A', 'A', 'A', 'B', 'B', 'B'}, 2) << "\\n";\n    return 0;\n}`,
          solutionHint: 'O(tasks.size()) greedy frame calculation.'
        }
      }
    },
    {
      id: 'greedy-6',
      title: '6. Hand of Straights (Consecutive Group Greedy)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'Given an array hand of cards and groupSize, determine if cards can be rearranged into groups of size groupSize consisting of consecutive numbers.',
      constraints: ['1 <= hand.length <= 10^4', '1 <= groupSize <= hand.length', 'Time: O(n log n)'],
      sampleInputs: [{ input: 'hand = [1, 2, 3, 6, 2, 3, 4, 7, 8], groupSize = 3', output: 'true ([1, 2, 3], [2, 3, 4], [6, 7, 8])' }],
      starterCode: `function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n  const count = {};\n  for (const card of hand) count[card] = (count[card] || 0) + 1;\n  hand.sort((a, b) => a - b);\n  // TODO: Greedily build consecutive groups\n  \n  return true;\n}\n\nconsole.log(isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3));`,
      solutionHint: 'For card in sorted hand: if count[card] > 0: decrement count for card .. card + groupSize - 1',
      languageVariants: {
        javascript: {
          starterCode: `function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n  const count = {};\n  for (const card of hand) count[card] = (count[card] || 0) + 1;\n  hand.sort((a, b) => a - b);\n  for (const card of hand) {\n    if (count[card] > 0) {\n      for (let i = 0; i < groupSize; i++) {\n        const nextCard = card + i;\n        if (!count[nextCard]) return false;\n        count[nextCard]--;\n      }\n    }\n  }\n  return true;\n}\n\nconsole.log(isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3));`,
          solutionHint: 'Always begin group from smallest available card.'
        },
        python: {
          starterCode: `from collections import Counter\nimport heapq\n\ndef is_n_straight_hand(hand: list[int], group_size: int) -> bool:\n    if len(hand) % group_size != 0:\n        return False\n    count = Counter(hand)\n    min_heap = list(count.keys())\n    heapq.heapify(min_heap)\n    while min_heap:\n        first = min_heap[0]\n        for i in range(first, first + group_size):\n            if count[i] == 0:\n                return False\n            count[i] -= 1\n            if count[i] == 0:\n                if i != heapq.heappop(min_heap):\n                    return False\n    return True\n\nprint(is_n_straight_hand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3))`,
          solutionHint: 'Greedy min-heap checking consecutive card availability.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static boolean isNStraightHand(int[] hand, int groupSize) {\n        if (hand.length % groupSize != 0) return false;\n        TreeMap<Integer, Integer> map = new TreeMap<>();\n        for (int c : hand) map.put(c, map.getOrDefault(c, 0) + 1);\n        for (int key : map.keySet()) {\n            int count = map.get(key);\n            if (count > 0) {\n                for (int i = 0; i < groupSize; i++) {\n                    int next = key + i;\n                    if (map.getOrDefault(next, 0) < count) return false;\n                    map.put(next, map.get(next) - count);\n                }\n            }\n        }\n        return true;\n    }\n    public static void main(String[] args) {\n        System.out.println(isNStraightHand(new int[]{1, 2, 3, 6, 2, 3, 4, 7, 8}, 3));\n    }\n}`,
          solutionHint: 'TreeMap guarantees natural ascending card processing.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <map>\n\nbool isNStraightHand(const std::vector<int>& hand, int groupSize) {\n    if (hand.size() % groupSize != 0) return false;\n    std::map<int, int> count;\n    for (int card : hand) count[card]++;\n    for (auto& [card, cnt] : count) {\n        if (cnt > 0) {\n            int needed = cnt;\n            for (int i = 0; i < groupSize; i++) {\n                if (count[card + i] < needed) return false;\n                count[card + i] -= needed;\n            }\n        }\n    }\n    return true;\n}\n\nint main() {\n    std::cout << (isNStraightHand({1, 2, 3, 6, 2, 3, 4, 7, 8}, 3) ? "true" : "false") << "\\n";\n    return 0;\n}`,
          solutionHint: 'std::map sorted frequency reduction.'
        }
      }
    },
    {
      id: 'greedy-7',
      title: '7. Minimum Cost to Connect Sticks (Greedy Min-Heap)',
      difficulty: 'Medium',
      category: 'Greedy Algorithms',
      description: 'You have sticks of different lengths. Cost to connect two sticks is their sum. Find the minimum total cost to connect all sticks into one stick.',
      constraints: ['1 <= sticks.length <= 10^4', '1 <= sticks[i] <= 10^4', 'Time: O(n log n)'],
      sampleInputs: [{ input: 'sticks = [2, 4, 3]', output: '14 ((2+3=5) -> (5+4=9) -> cost 5+9=14)' }],
      starterCode: `function connectSticks(sticks) {\n  if (sticks.length <= 1) return 0;\n  // Simulate min-heap with sorted array / priority queue\n  sticks.sort((a, b) => a - b);\n  let totalCost = 0;\n  // TODO: Greedily merge two smallest sticks\n  \n  return totalCost;\n}\n\nconsole.log(connectSticks([2, 4, 3]));`,
      solutionHint: 'Always pick the two smallest sticks, sum them, add to total cost, and insert sum back.',
      languageVariants: {
        javascript: {
          starterCode: `function connectSticks(sticks) {\n  if (sticks.length <= 1) return 0;\n  sticks.sort((a, b) => a - b);\n  let totalCost = 0;\n  while (sticks.length > 1) {\n    const sum = sticks.shift() + sticks.shift();\n    totalCost += sum;\n    // Binary insert back into sorted list\n    let idx = 0;\n    while (idx < sticks.length && sticks[idx] < sum) idx++;\n    sticks.splice(idx, 0, sum);\n  }\n  return totalCost;\n}\n\nconsole.log(connectSticks([2, 4, 3]));`,
          solutionHint: 'Huffman coding tree greedy min-heap merge.'
        },
        python: {
          starterCode: `import heapq\n\ndef connect_sticks(sticks: list[int]) -> int:\n    if len(sticks) <= 1:\n        return 0\n    heapq.heapify(sticks)\n    total_cost = 0\n    while len(sticks) > 1:\n        first = heapq.heappop(sticks)\n        second = heapq.heappop(sticks)\n        merged = first + second\n        total_cost += merged\n        heapq.heappush(sticks, merged)\n    return total_cost\n\nprint(connect_sticks([2, 4, 3]))`,
          solutionHint: 'heapq min-heap pops smallest two elements.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int connectSticks(int[] sticks) {\n        if (sticks.length <= 1) return 0;\n        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        for (int s : sticks) pq.offer(s);\n        int totalCost = 0;\n        while (pq.size() > 1) {\n            int sum = pq.poll() + pq.poll();\n            totalCost += sum;\n            pq.offer(sum);\n        }\n        return totalCost;\n    }\n    public static void main(String[] args) {\n        System.out.println(connectSticks(new int[]{2, 4, 3}));\n    }\n}`,
          solutionHint: 'PriorityQueue min-heap in O(n log n) time.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <queue>\n\nint connectSticks(const std::vector<int>& sticks) {\n    if (sticks.size() <= 1) return 0;\n    std::priority_queue<int, std::vector<int>, std::greater<int>> pq(sticks.begin(), sticks.end());\n    int totalCost = 0;\n    while (pq.size() > 1) {\n        int a = pq.top(); pq.pop();\n        int b = pq.top(); pq.pop();\n        int sum = a + b;\n        totalCost += sum;\n        pq.push(sum);\n    }\n    return totalCost;\n}\n\nint main() {\n    std::cout << connectSticks({2, 4, 3}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'std::greater<int> min priority queue.'
        }
      }
    },
    {
      id: 'greedy-8',
      title: '8. Candy Distribution (Two-Pass Greedy Slope)',
      difficulty: 'Hard',
      category: 'Greedy Algorithms',
      description: 'Children stand in line with ratings. Each child gets >= 1 candy. A child with higher rating gets more candies than immediate neighbors. Find min candies needed.',
      constraints: ['1 <= ratings.length <= 2 * 10^4', '0 <= ratings[i] <= 2 * 10^4', 'Time: O(n)', 'Space: O(n)'],
      sampleInputs: [{ input: 'ratings = [1, 0, 2]', output: '5 ([2, 1, 2])' }],
      starterCode: `function candy(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  // Pass 1: Left to right\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n  }\n  // TODO: Pass 2 Right to left\n  \n  return candies.reduce((a, b) => a + b, 0);\n}\n\nconsole.log(candy([1, 0, 2]));`,
      solutionHint: 'Pass 2: for i from n-2 down to 0: if ratings[i] > ratings[i+1]: candies[i] = max(candies[i], candies[i+1] + 1)',
      languageVariants: {
        javascript: {
          starterCode: `function candy(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n  }\n  for (let i = n - 2; i >= 0; i--) {\n    if (ratings[i] > ratings[i + 1]) {\n      candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n    }\n  }\n  return candies.reduce((a, b) => a + b, 0);\n}\n\nconsole.log(candy([1, 0, 2]));`,
          solutionHint: 'Dual left-right pass satisfying bidirectional slope constraints.'
        },
        python: {
          starterCode: `def candy(ratings: list[int]) -> int:\n    n = len(ratings)\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]:\n            candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]:\n            candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)\n\nprint(candy([1, 0, 2]))`,
          solutionHint: 'Two linear greedy sweeps satisfying local maximums.'
        },
        java: {
          starterCode: `import java.util.*;\n\npublic class Solution {\n    public static int candy(int[] ratings) {\n        int n = ratings.length;\n        int[] candies = new int[n];\n        Arrays.fill(candies, 1);\n        for (int i = 1; i < n; i++) {\n            if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n        }\n        for (int i = n - 2; i >= 0; i--) {\n            if (ratings[i] > ratings[i + 1]) {\n                candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n            }\n        }\n        int sum = 0;\n        for (int c : candies) sum += c;\n        return sum;\n    }\n    public static void main(String[] args) {\n        System.out.println(candy(new int[]{1, 0, 2}));\n    }\n}`,
          solutionHint: 'O(n) time and O(n) space two-pass greedy optimization.'
        },
        cpp: {
          starterCode: `#include <iostream>\n#include <vector>\n#include <numeric>\n#include <algorithm>\n\nint candy(const std::vector<int>& ratings) {\n    int n = ratings.size();\n    std::vector<int> candies(n, 1);\n    for (int i = 1; i < n; i++) {\n        if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n    }\n    for (int i = n - 2; i >= 0; i--) {\n        if (ratings[i] > ratings[i + 1]) {\n            candies[i] = std::max(candies[i], candies[i + 1] + 1);\n        }\n    }\n    return std::accumulate(candies.begin(), candies.end(), 0);\n}\n\nint main() {\n    std::cout << candy({1, 0, 2}) << "\\n";\n    return 0;\n}`,
          solutionHint: 'Bidirectional pass with std::accumulate total summation.'
        }
      }
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
