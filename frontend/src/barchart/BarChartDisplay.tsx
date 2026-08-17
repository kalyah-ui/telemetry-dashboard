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


function aggregateLogsLast7Days(logs: any[]) {
  const labels = lastNDaysLabels(7);

  const errorCounts: Record<string, number> = {};
  const warningCounts: Record<string, number> = {};

  for (const lbl of labels) {
    errorCounts[lbl] = 0;
    warningCounts[lbl] = 0;
  }

  for (const item of logs) {
    const d = new Date(item.timestamp);
    const day = d.toLocaleDateString('en-CA'); // YYYY-MM-DD

    if (!(day in errorCounts)) continue;

    if (item.level === "ERROR") {
      errorCounts[day]++;
    } else if (item.level === "WARNING") {
      warningCounts[day]++;
    }
  }

  return labels.map(day => ({
    name: formatBarChartDate(day), // Mon, Tue, Wed...
    errors: errorCounts[day],
    warnings: warningCounts[day]
  }));
}

export function BarchartDisplay() {
    const [barChartData, setBarChartData] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/api/logs')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const logs = response.data;
                    setBarChartData(aggregateLogsLast7Days(logs));
                } else {
                    setBarChartData([]);
                }
            })
            .catch(err => {
                console.error("ERROR FETCHING logs:", err);
                setError(err?.message || 'Unknown error');
            });
    }, []);

    return (
        <>
            <div className="barchart-background-container">
                <h1 className="chart-header-container">Errors</h1>
                {barChartData === null && !error && <div>Loading logs...</div>}
                {barChartData && (
                    <div>
                        <ClusteredBarChart data={barChartData} />
                    </div>
                )}
            </div>
        </>
    );
}