import { PieChart, Pie, Label } from 'recharts';

export function DonutChart({ data }: { data: any[] }) {
    const MyPie = () => (
        <Pie data={data} dataKey="value" nameKey="name" outerRadius="80%" innerRadius="60%" isAnimationActive={false} />
    );

    return(
        <div style={{ width: '100%', minHeight: '500px' }}>
        <div
            style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            gap: '10px',
            width: '100%',
            minHeight: '400px',
            border: '1px solid #ccc',
            padding: '10px',
            }}
        >
            <PieChart
            responsive
            style={{
                gridColumn: '1 / 3',
                gridRow: '1 / 3',
                border: '1px solid #ddd',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: 1,
            }}
            >
            <MyPie />
            <Label position="center" fill="#666">
                2x2 cell
            </Label>
            </PieChart>

            <PieChart
            responsive
            style={{
                gridColumn: '3 / 4',
                gridRow: '1 / 2',
                border: '1px solid #ddd',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: 1,
            }}
            >
            <MyPie />
            <Label position="center" fill="#666">
                1x1 cell
            </Label>
            </PieChart>

            <PieChart
            responsive
            style={{
                gridColumn: '3 / 4',
                gridRow: '2 / 3',
                border: '1px solid #ddd',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: 1,
            }}
            >
            <MyPie />
            <Label position="center" fill="#666">
                1x1 cell
            </Label>
            </PieChart>

            <PieChart
            responsive
            style={{
                gridColumn: '1 / 4',
                gridRow: '3 / 4',
                border: '1px solid #ddd',
                height: '100%',
                // maxHeight: '200px',
                aspectRatio: 1,
                margin: '0 auto',
            }}
            >
            <MyPie />
            <Label position="center" fill="#666">
                3x1 cell
            </Label>
            </PieChart>
        </div>
        </div>
    ); 
}