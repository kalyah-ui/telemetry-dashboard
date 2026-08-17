import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import "./DonutChart.css"

export function DonutChart({ data, isAnimationActive = true }: {
  data: any[];
  isAnimationActive?: boolean;
  }) {

  const percent = data[0].value;

  return (
    <div className="donut-shell">
  <ResponsiveContainer width="100%" height="100%" max-height="160px">
      <PieChart>
        <defs>
          <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" />
            <stop offset="25%" stopColor="var(--chart-3)" />
            <stop offset="50%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>

          <linearGradient id="inactiveGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--darker-chart-2)" />
            <stop offset="25%" stopColor="var(--darker-chart-3)" />
            <stop offset="50%" stopColor="var(--darker-chart-3)" />
            <stop offset="100%" stopColor="var(--darker-chart-1)" />
          </linearGradient>
        </defs>
        <Pie
          data={[{ value: 100 }]}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          innerRadius="68%"
          outerRadius="95%"
          fill="url(#inactiveGradient)"
          stroke="none"
          isAnimationActive={isAnimationActive}
        />

        <Pie
          data={[{ value: percent }]}
          dataKey="value"
          startAngle={90}
          endAngle={90 - (percent / 100) * 360}
          innerRadius="68%"
          outerRadius="95%"
          fill="url(#activeGradient)"
          stroke="none"
          isAnimationActive={isAnimationActive}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="donut-center-text"
        >
          {`${percent}%`}
        </text>
      </PieChart>
    </ResponsiveContainer>
    <div className="donut-label">{data[0].name}</div>
    </div>
  );
}
