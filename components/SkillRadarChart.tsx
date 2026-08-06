import { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TrendingDown } from "lucide-react";

interface SkillRadarChartProps {
  programming?: number;
  dsa?: number;
  design?: number;
}

type BenchmarkMode = "none" | "top10" | "senior";

// NOTE: Real per-category skill data for other users isn't aggregated
// anywhere server-side yet (progress is stored locally per device), so
// these are static, clearly-labeled reference targets rather than a
// live computed average. Swap these for a real backend aggregation
// once that exists.
const BENCHMARKS: Record<Exclude<BenchmarkMode, "none">, { label: string; programming: number; dsa: number; design: number }> = {
  top10: { label: "Top 10% Avg", programming: 82, dsa: 78, design: 75 },
  senior: { label: "Senior Engineer Target", programming: 95, dsa: 90, design: 85 },
};

const SkillRadarChart = ({
  programming = 0,
  dsa = 0,
  design = 0,
}: SkillRadarChartProps) => {
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>("none");

  const mySkills = { programming, dsa, design };
  const benchmark = benchmarkMode !== "none" ? BENCHMARKS[benchmarkMode] : null;

  const data = [
    {
      skill: "Programming",
      score: programming,
      ...(benchmark ? { benchmark: benchmark.programming } : {}),
    },
    {
      skill: "DSA",
      score: dsa,
      ...(benchmark ? { benchmark: benchmark.dsa } : {}),
    },
    {
      skill: "Design",
      score: design,
      ...(benchmark ? { benchmark: benchmark.design } : {}),
    },
  ];

  // Skill Gap Summary: the category with the largest (benchmark - mine) gap
  const biggestGap = useMemo(() => {
    if (!benchmark) return null;
    const gaps = (Object.keys(mySkills) as (keyof typeof mySkills)[]).map((key) => ({
      skill: key.charAt(0).toUpperCase() + key.slice(1),
      gap: benchmark[key] - mySkills[key],
    }));
    const worst = gaps.reduce((max, g) => (g.gap > max.gap ? g : max), gaps[0]);
    return worst.gap > 0 ? worst : null;
  }, [benchmarkMode, programming, dsa, design]);

  return (
    <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6">
      {/* Header */}
      <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-textMain flex items-center gap-2">
            Skill Profile
          </h2>
          <p className="mt-1 text-sm text-textMuted">
            Your learning progress across key technical skills.
          </p>
        </div>

        {/* Benchmark Toggle */}
        <div className="flex flex-wrap gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-1">
          {([
            { key: "none", label: "My Skills Only" },
            { key: "top10", label: "vs. Top 10%" },
            { key: "senior", label: "vs. Senior Target" },
          ] as { key: BenchmarkMode; label: string }[]).map((opt) => (
            <button
              key={opt.key}
              onClick={() => setBenchmarkMode(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryLight focus-visible:ring-offset-2 focus-visible:ring-offset-background ${benchmarkMode === opt.key
                  ? "bg-gradient-main text-white shadow-sm"
                  : "text-textMuted hover:text-textMain"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="rgba(105,104,166,0.2)" />

            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: "#6968A6",
                fontSize: 13,
                fontWeight: 600,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "rgba(150,150,150,0.5)",
                fontSize: 10,
              }}
              axisLine={false}
            />

            {benchmark && (
              <Radar
                name={benchmark.label}
                dataKey="benchmark"
                stroke="#CF9893"
                fill="#CF9893"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={{
                  r: 3,
                  fill: "#CF9893",
                  stroke: "#ffffff",
                  strokeWidth: 1,
                }}
              />
            )}

            <Radar
              name="My Skill Level"
              dataKey="score"
              stroke="#6968A6"
              fill="#6968A6"
              fillOpacity={0.4}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "#6968A6",
                stroke: "#ffffff",
                strokeWidth: 1,
              }}
            />

            {benchmark && (
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#B9B6E3" }}
              />
            )}

            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
                fontWeight: 600,
              }}
              formatter={(value, name) => [`${value}%`, name]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skill Gap Summary Badge */}
      {biggestGap && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
          <TrendingDown size={16} className="shrink-0" />
          <span>
            Biggest gap: <strong>{biggestGap.skill}</strong> is {biggestGap.gap}% behind {benchmark?.label}
          </span>
        </div>
      )}

      {/* Skill Summary */}
      <div className="grid grid-cols-2 gap-3 border-t border-black/10 dark:border-white/10 pt-4 sm:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.skill}
            className="rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-2 text-center"
          >
            <p className="text-xs text-textMuted font-medium">
              {item.skill}
            </p>

            <p className="mt-1 text-lg font-bold text-textMain">
              {item.score}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadarChart;