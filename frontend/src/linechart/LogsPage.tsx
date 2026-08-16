import { useEffect, useState } from "react";
import axios from "axios";
import { IndexLineChart } from "./IndexLineChart.tsx";
import "../Page.css"

function parseLocalDate(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d); // local midnight
}


function lastNDaysLabels(n: number) {
    const labels: string[] = [];
    const now = new Date();

    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);

        const local = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        labels.push(local);
    }
    return labels;
}


function formatLineChartDate(dateStr: string) {
    return parseLocalDate(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
}

function aggregateLast7Days(logs: any[]) {
    const labels = lastNDaysLabels(7);
    const counts: Record<string, number> = {};
    for (const lbl of labels) counts[lbl] = 0;

    for (const item of logs) {
        const d = new Date(item.timestamp);
        const day = d.toLocaleDateString('en-CA'); // YYYY-MM-DD

        if (day in counts) counts[day]++;
    }

    return labels.map((day) => ({
        day,               // YYYY-MM-DD (raw)
        name: formatLineChartDate(day), // Sunday, Monday, etc.
        logs: counts[day],
        latency: counts[day]
    }));
}

export function LogsPage() {
    const [summaryChartData, setSummaryChartData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        axios.get('/api/logs')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const logs = response.data;
                    setSummaryChartData(aggregateLast7Days(logs));
                } else {
                    setSummaryChartData([]);
                }
            })
            .catch(err => {
                console.error("ERROR FETCHING logs:", err);
                setError(err?.message || 'Unknown error');
            });
    }, []);

    return (
        <>
            <div className="background-container">
                <title>Logs</title>
                <h1 className="chart-header-container">Logs</h1>
                {error && <div style={{ color: 'var(--error)' }}>Error loading logs: {error}</div>}
                {summaryChartData === null && !error && <div>Loading logs...</div>}
                {summaryChartData && (
                    <div>
                        <h2>Logs (last 7 days)</h2>
                        <IndexLineChart data={summaryChartData} />
                    </div>
                )}
            </div>
        </>
    );
}