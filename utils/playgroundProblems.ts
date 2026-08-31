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
