import { Pie, PieChart, Sector, useActiveTooltipDataPoints, useIsTooltipActive, type PieLabelRenderProps, type PieSectorShapeProps } from 'recharts';
import "./DonutChart.css"

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


export function DonutChart({
    data,
    isAnimationActive = true,
    }: {
    data: any[];
    isAnimationActive?: boolean;
    }) {
        console.log({data})
  return (
    <PieChart 
        style={{
            width: '15%', 
            maxWidth: '500px', 
            maxHeight: '232px', 
            minHeight:'180px', 
            aspectRatio: 1 
        }} 
    responsive>
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={isAnimationActive}
        shape={MyCustomPie}
      />
    </PieChart>
    ); 
}
