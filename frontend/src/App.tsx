import { Route, Routes } from 'react-router'
import './App.css'
import { Header } from './Header'
import { MetricsPage } from './MetricsPage'
import { LogsPage } from './linechart/LogsPage'
import { BarchartDisplay } from './barchart/BarChartDisplay'

function App() {
  return (
    <div className="background">
      <Header />
      <Routes>
        <Route path="/" element={<MetricsPage />} />
        <Route path="/logs" element={<><BarchartDisplay /> <LogsPage /></>} />
      </Routes>
    </div>
  )
}

export default App
