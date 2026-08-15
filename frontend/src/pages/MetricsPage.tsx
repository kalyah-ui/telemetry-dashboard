import { useEffect, useState } from "react";
import axios from "axios";

export function MetricsPage() {
    const [metrics, setMetrics] = useState();
    
        const getMetrics = async () => {
            const response = await axios.get('/metrics');
            setMetrics(response.data);  
        };

        useEffect(() => {
            getMetrics();
        }, []);

    return (
        <>
        <title>Metrics</title>
        </>
    );
}