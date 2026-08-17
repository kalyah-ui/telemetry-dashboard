import { Pie, PieChart, Sector, useActiveTooltipDataPoints, useIsTooltipActive, type PieLabelRenderProps, type PieSectorShapeProps } from 'recharts';
import "./DonutChart.css"

type DonutData = {
  name: string;
  value: number;
};


const RADIAN = Math.PI / 180;
const COLORS = ['var(--darker-chart-1)', 'var(--darker-chart-2)', 'var(--darker-chart-3)'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > ncx ? 'start' : 'end'} dominantBaseline="central">
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  const p = useActiveTooltipDataPoints();
  const isAnyPieActive = useIsTooltipActive();
  const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
  let fillOpacity: number;
  if (isAnyPieActive && !isThisPieActive) {
    fillOpacity = 0.5;
  } else {
    fillOpacity = 1;
  }
  return (
    <Sector
      {...props}
      fill={COLORS[props.index % COLORS.length]}
      stroke='var(--dark-container-bg)'
      strokeWidth={2}
      fillOpacity={fillOpacity}
      style={{ transition: 'fill-opacity 0.3s ease' }}
    />
  );
};


export function DonutChart({ data, isAnimationActive = true }: {
  data: any[];
  isAnimationActive?: boolean;
  }) {

  const percent = data[0].value;

  return (
    <div className='donut-wrapper'>
      <PieChart
        style={{
          width: '15%',
          maxWidth: '500px',
          maxHeight: '232px',
          minWidth: '75px',
          minHeight: '75px',
          aspectRatio: 1
        }}
        responsive>
        <defs>
          <linearGradient id="activeGradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-2)" />
            <stop offset="50%" stopColor="var(--chart-3)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>

          <linearGradient id="inactiveGradient" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--darker-chart-2)" />
            <stop offset="50%" stopColor="var(--darker-chart-3)" />
            <stop offset="100%" stopColor="var(--darker-chart-1)" />
          </linearGradient>
        </defs>
        <Pie
          data={[{ value: 100 }]}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          innerRadius="60%"
          outerRadius="80%"
          fill="url(#inactiveGradient)"
          stroke="none"
          isAnimationActive={isAnimationActive}
        />

        <Pie
          data={[{ value: percent }]}
          dataKey="value"
          startAngle={90}
          endAngle={90 - (percent / 100) * 360}
          innerRadius="60%"
          outerRadius="80%"
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
      <div className="donut-center-label">{data[0].name}</div>
    </div>
  );
}
