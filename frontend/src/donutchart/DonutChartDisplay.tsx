import { useEffect, useState } from "react";
import axios from "axios";
import { DonutChart } from "./DonutChart";

type Metrics = {
    avg_latency_ms: number;
    requests_last_minute: number;
    error_rate: number;
    cpu_percent: number;
    memory_mb: number;
    uptime_seconds: number;
};

export function DonutChartDisplay() {
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

    return(
        <>
            <div className="donutchart-background-container">
                <h1 className="chart-header-container">Percentages</h1>
                {!metrics && <div>Loading metrics...</div>}
                {metrics && (
                    <div className='donut-wrapper'>
                        <DonutChart data={[
                            { name: "CPU Used", value: metrics.cpu_percent },
                            { name: "CPU Free", value: 100 - metrics.cpu_percent }
                        ]} isAnimationActive={true} />
                        <DonutChart data={[
                            { name: "Error Rate", value: Math.round(metrics.error_rate*100) },
                            { name: "Success Rate", value: Math.round(100 - metrics.error_rate*100) }
                        ]} isAnimationActive={true} />
                    </div>
                )}
            </div>
        </>
    );
}