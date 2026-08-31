import React from 'react';
import { Activity, ArrowRight, BinaryTree, Database, GitBranch, Network, Variable } from 'lucide-react';
import type { VisualizerSnapshot } from '../utils/visualizerStateParser';

interface AlgorithmCanvasProps {
  snapshot?: VisualizerSnapshot;
  currentStep: number;
  totalSteps: number;
}

const getNodeStyle = (active: boolean, visited?: boolean) => ({
  background: active ? 'linear-gradient(135deg, rgba(103, 232, 249, 0.28), rgba(96, 165, 250, 0.18))' : visited ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.22), rgba(52, 211, 153, 0.12))' : 'rgba(15, 23, 42, 0.72)',
  borderColor: active ? 'rgba(103, 232, 249, 0.8)' : visited ? 'rgba(74, 222, 128, 0.7)' : 'rgba(148, 163, 184, 0.35)',
  boxShadow: active ? '0 0 0 1px rgba(103, 232, 249, 0.45), 0 8px 30px rgba(59, 130, 246, 0.15)' : 'none',
});

const renderArray = (snapshot: VisualizerSnapshot) => {
  const arrayState = snapshot.arrays?.[0];
  if (!arrayState) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        {arrayState.values.map((value, index) => {
          const isActive = arrayState.activeIndices.includes(index);
          const isCompare = arrayState.compareIndices?.includes(index);

          return (
            <div key={`${value}-${index}`} className="flex flex-col items-center gap-2">
              <div
                className="flex h-16 w-14 items-center justify-center rounded-xl border text-sm font-bold text-white transition-all duration-200"
                style={{
                  ...getNodeStyle(isActive || isCompare, isActive || isCompare),
                  opacity: isActive || isCompare ? 1 : 0.8,
                }}
              >
                {String(value)}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-textMuted">
                {index}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const renderString = (snapshot: VisualizerSnapshot) => {
  const stringState = snapshot.strings?.[0];
  if (!stringState) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {stringState.value.split('').map((char, index) => {
        const isActive = stringState.activeIndices.includes(index);
        const isCompare = stringState.compareIndices?.includes(index);

        return (
          <div
            key={`${char}-${index}`}
            className="flex h-12 w-10 items-center justify-center rounded-lg border text-sm font-bold text-white"
            style={{
              ...getNodeStyle(isActive || isCompare, isActive || isCompare),
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};

const renderLinkedList = (snapshot: VisualizerSnapshot) => {
  const list = snapshot.linkedList;
  if (!list) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {list.nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          <div
            className="flex h-16 min-w-[70px] items-center justify-center rounded-xl border px-3 text-sm font-bold text-white"
            style={{
              ...getNodeStyle(list.activeNodeIds.includes(node.id), node.active),
            }}
          >
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-textMuted">{node.head ? 'head' : `node ${index + 1}`}</div>
              <div className="mt-1 text-base">{String(node.value)}</div>
            </div>
          </div>
          {node.next && (
            <div className="flex items-center gap-2 text-primaryLight">
              <ArrowRight size={16} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const renderTreeNode = (nodeId: string, nodeMap: Record<string, any>, depth: number, selectedActiveIds: string[]) => {
  const node = nodeMap[nodeId];
  if (!node) return null;

  const active = selectedActiveIds.includes(nodeId);

  return (
    <div key={nodeId} className="flex flex-col items-center" style={{ marginLeft: depth > 0 ? 18 : 0 }}>
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full border text-xs font-bold text-white"
        style={{ ...getNodeStyle(active, node.visited), marginBottom: 8 }}
      >
        {String(node.value)}
      </div>
      {(node.left || node.right) && (
        <div className="flex items-start justify-center gap-6">
          {node.left && (
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-slate-400" />
              {renderTreeNode(node.left, nodeMap, depth + 1, selectedActiveIds)}
            </div>
          )}
          {node.right && (
            <div className="flex flex-col items-center">
              <div className="h-6 w-px bg-slate-400" />
              {renderTreeNode(node.right, nodeMap, depth + 1, selectedActiveIds)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const renderBinaryTree = (snapshot: VisualizerSnapshot) => {
  const tree = snapshot.tree;
  if (!tree) return null;

  const nodeMap = tree.nodes.reduce<Record<string, any>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  if (!tree.rootId) return null;

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max justify-center">
        {renderTreeNode(tree.rootId, nodeMap, 0, tree.activeNodeIds)}
      </div>
    </div>
  );
};

const renderGraph = (snapshot: VisualizerSnapshot) => {
  const graph = snapshot.graph;
  if (!graph) return null;

  return (
    <div className="relative h-72 w-full rounded-2xl border border-black/10 bg-slate-950/40 p-4 dark:border-white/10">
      <svg viewBox="0 0 360 220" className="h-full w-full">
        {graph.edges.map((edge, index) => {
          const fromNode = graph.nodes.find((node) => node.id === edge.from);
          const toNode = graph.nodes.find((node) => node.id === edge.to);

          if (!fromNode || !toNode) return null;

          return (
            <line
              key={`${edge.from}-${edge.to}-${index}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke={edge.active ? 'rgba(103, 232, 249, 0.9)' : 'rgba(148, 163, 184, 0.45)'}
              strokeWidth={edge.active ? 3 : 1.5}
            />
          );
        })}

        {graph.nodes.map((node) => {
          const isActive = graph.activeNodeIds.includes(node.id);
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={24}
                fill={isActive ? 'rgba(96, 165, 250, 0.28)' : 'rgba(15, 23, 42, 0.9)'}
                stroke={isActive ? 'rgba(103, 232, 249, 0.9)' : 'rgba(148, 163, 184, 0.45)'}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const AlgorithmCanvas: React.FC<AlgorithmCanvasProps> = ({ snapshot, currentStep, totalSteps }) => {
  if (!snapshot) {
    return (
      <div className="p-5 text-sm text-textMuted">
        Visualizer supports selected algorithm and data structure patterns. Try an array, string, linked list, tree, or graph example.
      </div>
    );
  }

  const renderSnapshot = () => {
    switch (snapshot.kind) {
      case 'array':
        return renderArray(snapshot);
      case 'string':
        return renderString(snapshot);
      case 'linked-list':
        return renderLinkedList(snapshot);
      case 'binary-tree':
        return renderBinaryTree(snapshot);
      case 'graph':
        return renderGraph(snapshot);
      default:
        return null;
    }
  };

  const variables = Object.entries(snapshot.variables || {});

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-textMain">
          <Activity size={14} className="text-primaryLight" />
          {snapshot.label}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-textMuted">
          Step {currentStep + 1} of {Math.max(totalSteps, 1)}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.7fr)]">
        <div className="rounded-2xl border border-black/10 bg-[#0b1120]/60 p-4 dark:border-white/10">
          {renderSnapshot()}
        </div>

        <div className="rounded-2xl border border-black/10 bg-[#0b1120]/60 p-4 dark:border-white/10">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-textMuted">
            <Variable size={12} className="text-primaryLight" />
            State Inspector
          </div>
          <div className="space-y-3 text-xs">
            {variables.length === 0 ? (
              <div className="text-textMuted/80">No variables in the current step.</div>
            ) : (
              variables.map(([key, value]) => (
                <div key={key} className="rounded-xl border border-black/10 bg-white/5 p-2 dark:border-white/10">
                  <div className="text-[10px] uppercase tracking-wider text-textMuted">{key}</div>
                  <div className="mt-1 break-words font-mono text-[11px] text-textMain">{value}</div>
                </div>
              ))
            )}

            {snapshot.notes && snapshot.notes.length > 0 && (
              <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-2 text-[11px] text-primaryLight">
                <div className="mb-1 flex items-center gap-2 font-bold uppercase tracking-wider">
                  <Database size={11} />
                  Notes
                </div>
                <ul className="space-y-1 text-textMuted">
                  {snapshot.notes.map((note, idx) => (
                    <li key={`${note}-${idx}`}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
