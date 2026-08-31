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
