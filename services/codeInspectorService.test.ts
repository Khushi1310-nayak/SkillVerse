import { describe, it, expect, vi, beforeEach } from 'vitest';
import { inspectCode } from './codeInspectorService';

describe('codeInspectorService AI & Static Analysis Pipeline', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly parses structured AI JSON response with markdown fences', async () => {
    const mockApiResponse = {
      choices: [
        {
          message: {
            content: `\`\`\`json
{
  "metrics": {
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "explanation": "Single-pass hash map approach."
  },
  "issues": [
    {
      "line": 5,
      "type": "performance",
      "description": "Redundant object recreation in loop.",
      "suggestion": "Instantiate outside loop."
    }
  ],
  "hints": ["Use a Set for instant O(1) checks."],
  "refactoredCode": "function optimized() { return true; }"
}
\`\`\``,
          },
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    } as any);

    const result = await inspectCode('const x = 1;', 'javascript');
    expect(result.metrics.timeComplexity).toBe('O(N)');
    expect(result.metrics.spaceComplexity).toBe('O(N)');
    expect(result.issues.length).toBe(1);
    expect(result.issues[0].type).toBe('performance');
    expect(result.issues[0].line).toBe(5);
    expect(result.refactoredCode).toBe('function optimized() { return true; }');
  });

  it('falls back to local static analysis when API fetch fails with network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network connection failed'));

    const code = `
      function twoSum(nums, target) {
        for (let i = 0; i < nums.length; i++) {
          for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) return [i, j];
          }
        }
        return [];
      }
    `;

    const result = await inspectCode(code, 'javascript');
    expect(result).toBeDefined();
    expect(result.metrics.timeComplexity).toContain('O(N²)');
    expect(result.issues.length).toBeGreaterThan(0);
    const nestedIssue = result.issues.find(i => i.type === 'performance');
    expect(nestedIssue).toBeDefined();
    expect(nestedIssue?.description).toContain('Nested iteration detected');
  });

  it('detects legacy `var` anti-pattern in local analyzer and suggests `const`/`let`', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));

    const code = `
      var count = 0;
      var total = 100;
    `;

    const result = await inspectCode(code, 'javascript');
    const varIssue = result.issues.find(i => i.type === 'anti-pattern');
    expect(varIssue).toBeDefined();
    expect(varIssue?.description).toContain('Legacy `var` keyword used');
    expect(varIssue?.suggestion).toContain('Use `const` or `let` instead');
  });

  it('detects linear lookups inside loops creating quadratic complexity', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));

    const code = `
      function checkItems(arr1, arr2) {
        for (const item of arr1) {
          if (arr2.includes(item)) {
            console.log(item);
          }
        }
      }
    `;

    const result = await inspectCode(code, 'javascript');
    const lookupIssue = result.issues.find(i => i.description.includes('Linear lookup inside loop'));
    expect(lookupIssue).toBeDefined();
    expect(lookupIssue?.suggestion).toContain('Set or Map');
  });

  it('correctly evaluates clean single-pass solutions with minimal complexity', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Offline'));

    const code = `
      function findMax(nums) {
        let max = nums[0];
        for (let i = 1; i < nums.length; i++) {
          if (nums[i] > max) max = nums[i];
        }
        return max;
      }
    `;

    const result = await inspectCode(code, 'javascript');
    expect(result.metrics.timeComplexity).toContain('O(N)');
    expect(result.metrics.spaceComplexity).toContain('O(1)');
  });
});
