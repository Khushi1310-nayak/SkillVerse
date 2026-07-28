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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white">
          Skill Profile
        </h2>

        <p className="mt-1 text-sm text-white/60">
          Your learning progress across key technical skills.
        </p>
      </div>

      {/* Chart */}
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid
              stroke="rgba(255,255,255,0.15)"
            />

            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: "#d8d3f0",
                fontSize: 13,
                fontWeight: 500,
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{
                fill: "rgba(255,255,255,0.45)",
                fontSize: 10,
              }}
              axisLine={false}
            />

            <Radar
              name="Skill Level"
              dataKey="score"
              stroke="#6968A6"
              fill="#6968A6"
              fillOpacity={0.5}
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
                backgroundColor: "#171c2b",
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
      <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4 sm:grid-cols-4 ">
        {data.map((item) => (
          <div
            key={item.skill}
            className="rounded-xl bg-white/5 px-3 py-2 text-center"
          >
            <p className="text-xs text-white/50">
              {item.skill}
            </p>

            <p className="mt-1 text-lg font-semibold text-white">
              {item.score}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadarChart;