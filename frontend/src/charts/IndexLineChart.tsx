import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';

export function IndexLineChart({ data }: { data: any[] }) {
    return (
        <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto'}}
        responsive data={data}>
            <CartesianGrid stroke='var(--gridlines)' strokeDasharray="5 5" />
            <XAxis dataKey="name" stroke='var(--gridlines)' />
            <YAxis width="auto" stroke='var(--gridlines)' />
            <Line
                type="monotone"
                dataKey="uv"
                stroke='var(--chart-1)'
                dot={{
                    fill: 'var(--container-bg)',
                }}
                activeDot={{
                    fill: 'var(--container-bg)',
                }}
            />
            <Legend 
                position="insideTopRight"
                offset={20}
                wrapperStyle={{
                    border: '1px solid var(--border)',
                    borderRadius: 5,
                    padding: '1ex',
                    background: 'var(--container-bg)',
                }}
            />
        </LineChart>
    )
}