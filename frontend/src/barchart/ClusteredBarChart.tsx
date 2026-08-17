import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ClusteredBarChart({ data }: { data: any[] }) {
    return(
        <BarChart
            style={{ width: '90%', maxWidth: '700px', minHeight:'180px', maxHeight: '70vh', aspectRatio: 1.618 }}
            responsive
            data={data}
            margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Bar dataKey="latency" fill='var(--darker-chart-1)' activeBar={{ fill: 'var(--chart-1)', stroke: 'var(--chart-1)' }} radius={[10, 10, 0, 0]} />
            <Bar dataKey="errors" fill='var(--darker-chart-2)' activeBar={{ fill: 'var(--chart-2)', stroke: 'var(--chart-2)' }} radius={[10, 10, 0, 0]} />
        </BarChart>
    )
}