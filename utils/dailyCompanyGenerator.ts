import { Company, InterviewQuestion } from '../types';
import { getDayHash } from './dailyQuizGenerator';

const QUESTION_BANK: Record<string, { title: string; answer: string; link: string }[]> = {
  'Graph Algorithms': [
    { title: 'Detect Cycle in Directed Graph (Tarjan / DFS)', answer: 'Use 3-color DFS (Unvisited=0, Visiting=1, Visited=2). If encountering a node with state 1 (Visiting), a cycle exists.', link: 'https://leetcode.com/problems/course-schedule/' },
    { title: 'Dijkstra Shortest Path with Priority Queue', answer: 'Maintain min-heap priority queue of (distance, node). Pop smallest distance node, relax all adjacent edges if dist[u] + w < dist[v].', link: 'https://leetcode.com/problems/network-delay-time/' },
    { title: 'Word Ladder Transformation Length (BFS)', answer: 'Use BFS starting from beginWord. Change one letter at a time, check if in wordList dictionary, and return level depth.', link: 'https://leetcode.com/problems/word-ladder/' },
    { title: 'Topological Sort for Build Order', answer: 'Calculate in-degrees for all nodes. Push in-degree 0 nodes to queue. Process queue and decrement neighbor in-degrees.', link: 'https://leetcode.com/problems/course-schedule-ii/' }
  ],
  'System Design': [
    { title: 'Design a Distributed Rate Limiter', answer: 'Use Token Bucket or Leaky Bucket algorithm backed by Redis cluster with Lua scripts for atomic increment operations.', link: 'https://systemdesign.one/rate-limiter/' },
    { title: 'Design a Distributed Key-Value Store', answer: 'Use Consistent Hashing for data partitioning, Vector Clocks for conflict resolution, and Gossip protocol for node health checks.', link: 'https://systemdesign.one/consistent-hashing/' },
    { title: 'Design Real-Time Messaging Architecture', answer: 'Use WebSocket connections terminated at Gateway nodes, Kafka message broker for pub/sub event distribution, and Cassandra for message history.', link: 'https://systemdesign.one/chat-system/' },
    { title: 'Design URL Shortener Service (Bitly)', answer: 'Use Base62 encoding on auto-incrementing 64-bit IDs or MD5 hash prefixes. Cache hot URLs in Redis with LRU eviction.', link: 'https://systemdesign.one/url-shortener/' }
  ],
  'Arrays & Strings': [
    { title: 'Trapping Rain Water (Two Pointers)', answer: 'Maintain leftMax and rightMax pointers. Water trapped at position i is Math.min(leftMax, rightMax) - height[i].', link: 'https://leetcode.com/problems/trapping-rain-water/' },
    { title: 'Longest Substring Without Repeating Characters', answer: 'Use Sliding Window with a character index Map. Update left boundary to Math.max(left, map.get(char) + 1).', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { title: '3Sum Zero Combination Triplets', answer: 'Sort array. Loop index i, then use two pointers (left, right) to find target -nums[i]. Skip duplicates.', link: 'https://leetcode.com/problems/3sum/' }
  ],
  'OOP Design': [
    { title: 'Design an Elevator Management System', answer: 'Apply Strategy pattern for dispatcher algorithms (SCAN/LOOK), State pattern for Elevator movement states, and Observer pattern for call button displays.', link: 'https://github.com/donnemartin/system-design-primer' },
    { title: 'Design Parking Lot System', answer: 'Model Vehicle hierarchy (Compact, Large, Motorcycle) and ParkingSpot slots. Use Factory pattern for spot assignment.', link: 'https://github.com/donnemartin/system-design-primer' }
  ],
  'Trees': [
    { title: 'Binary Tree Zigzag Level Order Traversal', answer: 'Use BFS queue. Track level index. Reverse level array values when level % 2 === 1 before pushing to final result.', link: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },
    { title: 'Serialize and Deserialize Binary Tree', answer: 'Use preorder traversal with delimiter for values and null markers ("#"). Reconstruct recursively during deserialization.', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    { title: 'Lowest Common Ancestor of Binary Tree', answer: 'Recurse left and right. If both left and right return non-null, current node is LCA. Otherwise return non-null child.', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' }
  ]
};

export function getDailyCompanyQuestions(companyId: string, focus: string[], date: Date = new Date()): InterviewQuestion[] {
  const dayHash = getDayHash(date);
  const diffs: ('Easy' | 'Medium' | 'Hard')[] = ['Easy', 'Easy', 'Medium', 'Medium', 'Medium', 'Medium', 'Hard', 'Hard', 'Hard', 'Hard'];

  const tag1 = focus[0] || 'System Design';
  const tag2 = focus[1] || 'Arrays & Strings';

  const bank1 = QUESTION_BANK[tag1] || QUESTION_BANK['System Design'];
  const bank2 = QUESTION_BANK[tag2] || QUESTION_BANK['Arrays & Strings'];

  const combinedBank = [...bank1, ...bank2];

  return Array.from({ length: 10 }).map((_, i) => {
    // Deterministic daily rotation using dayHash
    const rotatedIndex = (i + dayHash + (companyId.length % 5)) % combinedBank.length;
    const item = combinedBank[rotatedIndex];

    return {
      id: `${companyId}-q${i + 1}`,
      title: item.title,
      difficulty: diffs[i],
      tags: [i % 2 === 0 ? tag1 : tag2],
      answer: `
        <p className="mb-2"><strong>Target Approach & Architecture:</strong></p>
        <p className="text-textMuted font-mono text-xs leading-relaxed">${item.answer}</p>
      `,
      resourceLink: item.link
    };
  });
}
