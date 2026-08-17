import { Route, Routes } from 'react-router'
import './App.css'
import { Header } from './Header'
import { MetricsPage } from './MetricsPage'
import { LogsPage } from './linechart/LineChart'
import { BarchartDisplay } from './barchart/BarChartDisplay'
import { DonutChartDisplay } from './donutchart/DonutChartDisplay'

function App() {
  return (
    <div className="background">
      <div className='app-container'>
        <Header />
        <Routes>
          <Route path="/" element={<MetricsPage />} />
          <Route path="/logs" element={
            <>
              <div className="charts-row">
                <BarchartDisplay /> <DonutChartDisplay />
              </div>
              <LogsPage />
            </>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
