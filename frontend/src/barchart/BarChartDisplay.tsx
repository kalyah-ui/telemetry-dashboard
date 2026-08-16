import { useEffect, useState } from "react";
import axios from "axios";
import { ClusteredBarChart } from "../barchart/ClusteredBarChart.tsx";
import "../Page.css"
import "./ClusteredBarChart.css"

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

function formatBarChartDate(dateStr: string) {
    return parseLocalDate(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
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
        latency: counts[day] || 0,
        errors: counts[day] ? Math.round(latencyTotals[day] / counts[day]) : 0
    }));
}
export function BarchartDisplay() {
    const [errorChartData, setErrorChartData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/api/logs')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const logs = response.data;
                    setErrorChartData(aggregateErrorsLast7Days(logs));
                } else {
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
                <h1 className="chart-header-container">Errors</h1>
                {errorChartData === null && !error && <div>Loading logs...</div>}
                {errorChartData && (
                    <div>
                        <h2>Errors (last 7 days)</h2>
                        <ClusteredBarChart data={errorChartData} />
                    </div>
                )}
            </div>
        </>
    );
}