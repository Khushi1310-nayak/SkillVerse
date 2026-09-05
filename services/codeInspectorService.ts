/**
 * AI-Powered Code Inspector & Refactoring Engine Service
 * Provides structured code analysis, complexity metrics (Big-O),
 * issue detection, actionable hints, and refactored code generation.
 */

export interface ComplexityMetrics {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
}

export interface InspectionIssue {
  line?: number;
  type: 'performance' | 'bug' | 'anti-pattern';
  description: string;
  suggestion?: string;
}

export interface InspectionResult {
  metrics: ComplexityMetrics;
  issues: InspectionIssue[];
  hints: string[];
  refactoredCode?: string;
}

// Alias for backwards compatibility
export type CodeInspectionResult = InspectionResult;

export interface ProblemContext {
  problemTitle?: string;
  problemDescription?: string;
  sampleInputs?: { input: string; output: string }[];
  solutionHint?: string;
}

/**
 * Main inspection function: Attempts external AI analysis using OpenRouter/Gemini API,
 * falling back gracefully to local static analysis if API key is missing or call fails.
 */
export async function inspectCode(
  code: string,
  language: string = 'javascript',
  context?: ProblemContext
): Promise<InspectionResult> {
  const apiKey =
    import.meta.env.VITE_OPENROUTER_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' && process.env ? process.env.OPENROUTER_API_KEY : undefined);

  if (apiKey && apiKey !== 'your_api_key' && apiKey.trim() !== '') {
    try {
      return await inspectWithAI(code, language, context, apiKey);
    } catch (err) {
      console.warn('AI Code Inspector external call failed. Falling back to local analyzer:', err);
    }
  }

  // Local fallback execution
  return analyzeCodeLocally(code, language, context);
}

/**
 * Calls OpenRouter AI API with structured JSON output instructions.
 */
async function inspectWithAI(
  code: string,
  language: string,
  context: ProblemContext | undefined,
  apiKey: string
): Promise<InspectionResult> {
  const { problemTitle, problemDescription, sampleInputs, solutionHint } = context || {};

  const systemPrompt = `You are a senior code inspector and software architecture auditor. Analyze the following ${language} code written for a programming problem.

${problemTitle ? `PROBLEM TITLE: ${problemTitle}` : ''}
${problemDescription ? `PROBLEM DESCRIPTION: ${problemDescription}` : ''}
${solutionHint ? `ARCHITECTURE HINT: ${solutionHint}` : ''}
${
  sampleInputs && sampleInputs.length > 0
    ? `SAMPLE TEST CASES:\n${sampleInputs.map((s, i) => `Case ${i + 1}: Input=${s.input} -> Expected Output=${s.output}`).join('\n')}`
    : ''
}

USER CODE TO INSPECT:
${code
  .split('\n')
  .map((line, idx) => `Line ${idx + 1}: ${line}`)
  .join('\n')}

CRITICAL INSTRUCTIONS:
1. Output ONLY a valid raw JSON object. Do not include markdown headers, surrounding text, or explanation outside JSON.
2. Generate refactoredCode in ${language} syntax matching the input code language.
3. Return exactly this JSON schema:
{
  "metrics": {
    "timeComplexity": "e.g. O(N)",
    "spaceComplexity": "e.g. O(1)",
    "explanation": "Brief breakdown of time and space complexity"
  },
  "issues": [
    {
      "line": 4,
      "type": "performance",
      "description": "Clear explanation of the problem on line 4",
      "suggestion": "How to fix this issue"
    }
  ],
  "hints": [
    "Progressive actionable hint 1",
    "Progressive actionable hint 2"
  ],
  "refactoredCode": "Production-grade, optimized code solution in ${language} with clean syntax and guards"
}

Issue types must be strictly one of: "performance", "bug", or "anti-pattern".
Only flag lines that contain real flaws, sub-optimal logic, or anti-patterns. If the code is clean, leave the issues array empty.`;

  // Models to try in order of preference on OpenRouter
  const modelsToTry = [
    'google/gemini-2.0-flash-001',
    'google/gemini-flash-1.5',
    'google/gemini-2.5-flash',
    'openai/gpt-4o-mini',
  ];

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://skillverse.dev',
          'X-Title': 'SkillVerse AI Inspector',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'You respond only in valid raw JSON format matching the schema.' },
            { role: 'user', content: systemPrompt },
          ],
          max_tokens: 1800,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`OpenRouter API model '${model}' status ${response.status}:`, errorText);
        lastError = new Error(`OpenRouter API status ${response.status}: ${errorText}`);
        continue;
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content?.trim() || '';

      if (!content) {
        lastError = new Error('Empty response from AI model');
        continue;
      }

      // Robust markdown code block stripping (```json ... ``` or plain ```)
      if (content.includes('```')) {
        const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (match && match[1]) {
          content = match[1].trim();
        } else {
          content = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        }
      }

      // Extract JSON object if surrounded by explanatory text
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }

      const parsed = JSON.parse(content);

      return {
        metrics: {
          timeComplexity: parsed.metrics?.timeComplexity || 'O(N)',
          spaceComplexity: parsed.metrics?.spaceComplexity || 'O(1)',
          explanation: parsed.metrics?.explanation || 'Analyzed code structure.',
        },
        issues: Array.isArray(parsed.issues)
          ? parsed.issues.map((iss: Record<string, unknown>) => ({
              line: typeof iss.line === 'number' ? iss.line : undefined,
              type: ['performance', 'bug', 'anti-pattern'].includes(String(iss.type)) ? (iss.type as InspectionIssue['type']) : 'anti-pattern',
              description: String(iss.description || 'Issue detected'),
              suggestion: iss.suggestion ? String(iss.suggestion) : undefined,
            }))
          : [],
        hints: Array.isArray(parsed.hints) ? parsed.hints.map(String) : [],
        refactoredCode: typeof parsed.refactoredCode === 'string' ? parsed.refactoredCode : undefined,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.warn(`Failed calling model '${model}':`, errorMessage);
      lastError = err instanceof Error ? err : new Error(errorMessage);
    }
  }

  throw lastError || new Error('All AI API requests failed');
}

/**
 * Local Fallback Static Analysis
 */
function analyzeCodeLocally(
  code: string,
  language: string,
  context?: ProblemContext
): InspectionResult {
  const cleanCode = code.trim();
  const rawLines = code.split('\n');
  const issues: InspectionIssue[] = [];
  const normalizedLang = language.toLowerCase().trim();

  let loopDepth = 0;
  let maxLoopDepth = 0;
  let hasNestedLookup = false;
  let hasVar = false;
  let memoryAllocated = false;

  const loopRegex = /\b(for|while|\.forEach|\.map|\.filter|\.reduce)\b/;
  const lookupRegex = /\b(\.indexOf|\.includes|\.find|in\s+)\b/;

  rawLines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('/*')) return;

    if (/\bvar\b/.test(trimmed)) {
      hasVar = true;
      issues.push({
        line: lineNum,
        type: 'anti-pattern',
        description: 'Legacy `var` keyword used, introducing scope hoisting risks.',
        suggestion: 'Use `const` or `let` instead.',
      });
    }

    if (loopRegex.test(trimmed) || /^\s*for\s+/i.test(trimmed) || /^\s*while\s+/i.test(trimmed)) {
      loopDepth++;
      if (loopDepth > maxLoopDepth) maxLoopDepth = loopDepth;

      if (loopDepth > 1) {
        issues.push({
          line: lineNum,
          type: 'performance',
          description: `Nested iteration detected (Depth ${loopDepth}). Multiplies runtime complexity exponentially.`,
          suggestion: 'Refactor using a Hash Map or Set for single-pass O(N) evaluation.',
        });
      }
    }

    if (lookupRegex.test(trimmed) && loopDepth >= 1) {
      hasNestedLookup = true;
      issues.push({
        line: lineNum,
        type: 'performance',
        description: 'Linear lookup inside loop creates quadratic O(N²) execution.',
        suggestion: 'Instantiate a Set or Map outside the loop for O(1) lookups.',
      });
    }

    if (/\b(new\s+(Map|Set|Array|Object)|\[\]|\{\}|set\(|dict\(|list\()\b/.test(trimmed)) {
      memoryAllocated = true;
    }

    const closeBraces = (line.match(/\}/g) || []).length;
    const openBraces = (line.match(/\{/g) || []).length;
    loopDepth = Math.max(0, loopDepth + openBraces - closeBraces);
  });

  // Calculate Big-O metrics
  let timeComplexity = 'O(1)';
  let explanation = 'Direct execution statements without repetitive loops.';

  if (maxLoopDepth >= 3) {
    timeComplexity = 'O(N³)';
    explanation = 'Triple nested loops result in cubic execution scaling on larger inputs.';
  } else if (maxLoopDepth === 2 || hasNestedLookup) {
    timeComplexity = 'O(N²)';
    explanation = 'Quadratic execution time caused by nested loops or searching arrays inside a loop.';
  } else if (/\b(\.sort|Arrays\.sort|std::sort|sorted\()\b/.test(cleanCode)) {
    timeComplexity = 'O(N log N)';
    explanation = 'Sorting step dominates runtime with linearithmic complexity.';
  } else if (maxLoopDepth === 1) {
    timeComplexity = 'O(N)';
    explanation = 'Single loop pass processing input elements linearly.';
  }

  const spaceComplexity = memoryAllocated ? 'O(N)' : 'O(1)';
  if (memoryAllocated) {
    explanation += ' Space complexity is O(N) due to extra collections allocated.';
  } else {
    explanation += ' Space complexity is O(1) operating in-place with constant memory.';
  }

  // Language-aware Refactored Code Generation
  let refactoredCode = '';

  if (normalizedLang.includes('python') || normalizedLang === 'py') {
    refactoredCode = `# Optimized O(N) Refactored Solution (Python)
def solution(arr, target=None):
    if not arr:
        return []

    # Use a set for O(1) instant lookup
    seen = set()

    for item in arr:
        complement = target - item if target is not None else item
        if complement in seen:
            return [complement, item]
        seen.add(item)

    return []`;
  } else if (normalizedLang.includes('java') && !normalizedLang.includes('script')) {
    refactoredCode = `// Optimized O(N) Refactored Solution (Java)
import java.util.*;

public class Solution {
    public static int[] solution(int[] arr, int target) {
        if (arr == null || arr.length == 0) return new int[0];

        // Use a HashSet for O(1) instant lookup
        Set<Integer> seen = new HashSet<>();

        for (int item : arr) {
            int complement = target - item;
            if (seen.contains(complement)) {
                return new int[]{complement, item};
            }
            seen.add(item);
        }

        return new int[0];
    }
}`;
  } else if (normalizedLang.includes('c++') || normalizedLang === 'cpp' || normalizedLang === 'c') {
    refactoredCode = `// Optimized O(N) Refactored Solution (C++)
#include <vector>
#include <unordered_set>

std::vector<int> solution(const std::vector<int>& arr, int target) {
    if (arr.empty()) return {};

    // Use unordered_set for O(1) lookup
    std::unordered_set<int> seen;

    for (int item : arr) {
        int complement = target - item;
        if (seen.count(complement)) {
            return {complement, item};
        }
        seen.insert(item);
    }

    return {};
}`;
  } else {
    refactoredCode = `// Optimized O(N) Refactored Solution (${normalizedLang.toUpperCase()})
function solution(arr, target) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return [];

  // Use a Set/Map for O(1) instant lookup
  const seen = new Set();

  for (const item of arr) {
    const complement = target !== undefined ? target - item : item;
    if (seen.has(complement)) {
      return [complement, item];
    }
    seen.add(item);
  }

  return [];
}`;
  }

  // Hints
  const hints: string[] = [];
  if (hasNestedLookup || maxLoopDepth >= 2) {
    hints.push('Convert nested array scans into a Hash Map or Set outside the loop for O(1) lookups.');
  }
  if (hasVar) {
    hints.push('Replace `var` with `const` or `let` to ensure block scope safety.');
  }
  if (context?.solutionHint) {
    hints.push(`Architecture Tip: ${context.solutionHint}`);
  } else if (hints.length === 0) {
    hints.push('Consider adding early boundary check guards at the start of your function for edge inputs.');
  }

  return {
    metrics: {
      timeComplexity,
      spaceComplexity,
      explanation,
    },
    issues,
    hints,
    refactoredCode,
  };
}

export const codeInspectorService = {
  inspectCode,
};
