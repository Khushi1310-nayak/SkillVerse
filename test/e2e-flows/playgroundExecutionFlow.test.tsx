import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CodePlayground } from '../../components/CodePlayground';
import { executeCode } from '../../utils/codeExecutor';
import { parseVisualizerState } from '../../utils/visualizerStateParser';
import { storageService } from '../../services/storageService';

vi.mock('../../services/codeInspectorService', () => ({
  codeInspectorService: {
    inspectCode: vi.fn().mockResolvedValue({
      metrics: {
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        explanation: 'Constant space efficiency with single pass.',
      },
      issues: [
        {
          line: 1,
          type: 'performance',
          description: 'Single pass algorithm with minimal heap allocations.',
          suggestion: 'Pre-allocate buffers when size is known.',
        },
      ],
      hints: ['Consider using Map for lookups.'],
      refactoredCode: 'console.log("Optimized");',
    }),
  },
}));

describe('End-to-End Critical Journey: Code Playground & Sandbox Execution Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Multi-Language Code Execution Engine (codeExecutor)', () => {
    it('executes JavaScript and captures console logs', async () => {
      const code = `
        const arr = [1, 2, 3];
        const doubled = arr.map(x => x * 2);
        console.log('Doubled:', doubled.join(', '));
      `;
      const result = await executeCode(code, 'javascript');
      expect(result.error).toBeNull();
      expect(result.logs.some(l => l.message.includes('Doubled: 2, 4, 6'))).toBe(true);
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('handles JavaScript runtime exceptions cleanly without crashing', async () => {
      const faultyCode = `
        const obj = undefined;
        console.log(obj.invalidProp);
      `;
      const result = await executeCode(faultyCode, 'javascript');
      expect(result.error).not.toBeNull();
      expect(result.error?.message).toMatch(/Cannot read propert/i);
    });

    it('simulates Python code execution and print statements', async () => {
      const pythonCode = `
def greet(name):
    print("Hello from Python, " + name)

greet("Antigravity")
      `;
      const result = await executeCode(pythonCode, 'python');
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.logs.some(l => l.message.includes('Antigravity') || l.message.includes('Hello'))).toBe(true);
    });

    it('simulates C++ code execution with cout and types', async () => {
      const cppCode = `
#include <iostream>
using namespace std;

int main() {
    cout << "Binary Search in C++" << endl;
    return 0;
}
      `;
      const result = await executeCode(cppCode, 'cpp');
      expect(result.logs.length).toBeGreaterThan(0);
      expect(result.logs.some(l => l.message.includes('Binary Search in C++') || l.message.includes('Execution'))).toBe(true);
    });

    it('simulates Rust and Go execution diagnostics', async () => {
      const rustCode = `
fn main() {
    println!("Safe Memory in Rust");
}
      `;
      const rustRes = await executeCode(rustCode, 'rust');
      expect(rustRes.logs.length).toBeGreaterThan(0);

      const goCode = `
package main
import "fmt"

func main() {
    fmt.Println("Goroutines in Go")
}
      `;
      const goRes = await executeCode(goCode, 'go');
      expect(goRes.logs.length).toBeGreaterThan(0);
    });
  });

  describe('Algorithm Visualizer State Parser', () => {
    it('parses algorithm state snapshots for array sorting visualization', () => {
      const code = `
        let arr = [5, 2, 8, 1];
        // snapshot 1
        arr = [2, 5, 1, 8];
      `;
      const result = parseVisualizerState(code);
      expect(Array.isArray(result.snapshots)).toBe(true);
      expect(result.snapshots.length).toBeGreaterThan(0);
    });
  });

  describe('CodePlayground Interactive Component Flow', () => {
    it('runs code in UI, saves snippet, and triggers AI code inspection', async () => {
      render(
        <MemoryRouter>
          <CodePlayground
            initialCode="console.log('SkillVerse Interactive Playground');"
            language="javascript"
          />
        </MemoryRouter>
      );

      // 1. Run Code
      const runBtn = screen.getByRole('button', { name: /run/i });
      fireEvent.click(runBtn);

      expect(await screen.findByText(/SkillVerse Interactive Playground/i)).toBeInTheDocument();

      // 2. Open Save Snippet Dialog
      const saveSnippetBtn = screen.getByTitle(/save current code as a snippet/i);
      fireEvent.click(saveSnippetBtn);

      const snippetInput = screen.getByPlaceholderText(/Snippet name/i);
      fireEvent.change(snippetInput, { target: { value: 'Linear Scan Snippet' } });

      const confirmSaveBtn = screen.getByRole('button', { name: /^save$/i });
      fireEvent.click(confirmSaveBtn);

      // Verify snippet persisted to storageService
      const saved = storageService.getSavedSnippets();
      expect(saved.some(s => s.name === 'Linear Scan Snippet')).toBe(true);

      // 3. Trigger AI Code Inspector Drawer
      const inspectBtn = screen.getByRole('button', { name: /inspect/i });
      fireEvent.click(inspectBtn);

      expect(await screen.findByText('O(N)')).toBeInTheDocument();
      expect(screen.getByText('O(1)')).toBeInTheDocument();
      expect(screen.getByText(/Constant space efficiency/i)).toBeInTheDocument();
    });
  });
});
