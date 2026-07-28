import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillRadarChartProps {
  programming?: number;
  dsa?: number;
  design?: number;
  
}

const SkillRadarChart = ({
  programming = 0,
  dsa = 0,
  design = 0,
  
}: SkillRadarChartProps) => {
  const data = [
    {
      skill: "Programming",
      score: programming,
    },
    {
      skill: "DSA",
      score: dsa,
    },
    {
      skill: "Design",
      score: design,
    },
  ];

  return (
    <div className="bg-glass border border-black/20 dark:border-white/10 rounded-3xl p-6">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-display font-bold text-textMain flex items-center gap-2">
          Skill Profile
        </h2>

        <p className="mt-1 text-sm text-textMuted">
          Your learning progress across key technical skills.
        </p>
      </div>

      {/* Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid
              stroke="rgba(105,104,166,0.2)"
            />

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

            <Radar
              name="Skill Level"
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
              formatter={(value) => [
                `${value}%`,
                "Skill Level",
              ]}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

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