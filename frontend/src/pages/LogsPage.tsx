import { useEffect, useState } from "react";
import axios from "axios";
import { IndexLineChart } from "../charts/IndexLineChart.tsx";
import { ClusteredBarChart } from "../charts/ClusteredBarChart.tsx";
import "./Page.css"

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

function formatBarChartDate(dateStr: string) {
    return parseLocalDate(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
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
        uv: counts[day],
        pv: counts[day]
    }));
}

function aggregateErrorsLast7Days(logs: any[]) {
    const labels = lastNDaysLabels(7);
    const counts: Record<string, number> = {};
    const latencyTotals: Record<string, number> = {};

    for (const lbl of labels) {
        counts[lbl] = 0;
        latencyTotals[lbl] = 0;
    }

    for (const item of logs) {
        if (item.level !== 'ERROR') continue;

        const d = new Date(item.timestamp);
        const day = d.toLocaleDateString('en-CA');

        if (day in counts) {
            counts[day]++;
            latencyTotals[day] += Number(item.latency_ms || 0);
        }
    }

    return labels.map(day => ({
        name: formatBarChartDate(day),
        pv: counts[day] || 0,
        uv: counts[day] ? Math.round(latencyTotals[day] / counts[day]) : 0
    }));
}

export function LogsPage() {
    const [summaryChartData, setSummaryChartData] = useState<any[] | null>(null);
    const [errorChartData, setErrorChartData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        axios.get('/api/logs')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const logs = response.data;
                    setSummaryChartData(aggregateLast7Days(logs));
                    setErrorChartData(aggregateErrorsLast7Days(logs));
                } else {
                    setSummaryChartData([]);
                    setErrorChartData([]);
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
                <h1 className="small-heading-container">Errors</h1>
                {errorChartData === null && !error && <div>Loading logs...</div>}
                {errorChartData && (
                    <div>
                        <h2>Errors (last 7 days)</h2>
                        <ClusteredBarChart data={errorChartData} />
                    </div>
                )}
                <h1 className="heading-container">Logs</h1>
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