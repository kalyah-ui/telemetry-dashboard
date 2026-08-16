import { useEffect, useState } from "react";
import axios from "axios";
import { IndexLineChart } from "../charts/IndexLineChart.tsx";
import "./Page.css"

function lastNDaysLabels(n: number) {
    const labels: string[] = [];
    const now = new Date();
    // use local dates normalized to YYYY-MM-DD
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        labels.push(d.toISOString().slice(0, 10));
    }
    return labels;
}

function aggregateLast7Days(logs: any[]) {
    const labels = lastNDaysLabels(7);
    const counts: Record<string, number> = {};
    for (const lbl of labels) counts[lbl] = 0;

    for (const item of logs) {
        const d = new Date(item.timestamp);
        const day = d.toISOString().slice(0, 10);
        if (day in counts) counts[day]++;
    }

    return labels.map(day => ({ name: day, uv: counts[day] || 0 }));
}

export function LogsPage() {
    const [chartData, setChartData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/api/logs')
            .then(response => {
                console.log("LOGS:", response.data);
                if (Array.isArray(response.data)) {
                    setChartData(aggregateLast7Days(response.data));
                } else {
                    setChartData([]);
                }
            })
            .catch(err => {
                console.error("ERROR FETCHING logs:", err);
                setError(err?.message || 'Unknown error');
            });
    }, []);

    return (
        <div className="background-container">
            <title>Logs</title>
            <h1 className="heading-container">Logs</h1>
            {error && <div style={{ color: 'var(--error)' }}>Error loading logs: {error}</div>}
            {chartData === null && !error && <div>Loading logs...</div>}
            {chartData && (
                <div>
                    <h2>Logs (last 7 days)</h2>
                    <IndexLineChart data={chartData} />
                </div>
            )}
        </div>
    );
}