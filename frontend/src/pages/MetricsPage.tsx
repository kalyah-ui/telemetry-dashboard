import { useEffect, useState } from "react";
import axios from "axios";

type Metrics = {
    avg_latency_ms: number;
    requests_last_minute: number;
    error_rate: number;
    cpu_percent: number;
    memory_mb: number;
    uptime_seconds: number;
};


export function MetricsPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    
        useEffect(() => {
    axios.get('/api/metrics')
        .then(res => {
            console.log("METRICS:", res.data);
            setMetrics(res.data);
        })
        .catch(err => {
            console.error("ERROR FETCHING METRICS:", err);
        });
}, []);


    return (
        <>
        <title>Metrics</title>
        <div>
            {!metrics && <div>Loading metrics...</div>}

                {metrics && (
                    <div>
                        <h2>System Metrics</h2>

                        <p><strong>Average Latency:</strong> {metrics.avg_latency_ms} ms</p>
                        <p><strong>Requests Last Minute:</strong> {metrics.requests_last_minute}</p>
                        <p><strong>Error Rate:</strong> {metrics.error_rate}</p>
                        <p><strong>CPU Usage:</strong> {metrics.cpu_percent}%</p>
                        <p><strong>Memory Usage:</strong> {metrics.memory_mb} MB</p>
                        <p><strong>Uptime:</strong> {metrics.uptime_seconds} seconds</p>
                    </div>
                )}
        </div>
        </>
    );
}