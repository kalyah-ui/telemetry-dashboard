import { Route, Routes } from 'react-router'
import './App.css'
import { Header } from './Header'
import { MetricsPage } from './pages/MetricsPage'
import { LogsPage } from './pages/LogsPage'

function App() {
  return (
    <div className="background">
      <Header />
      <Routes>
        <Route path="/" element={<MetricsPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </div>
  )
}

export default App
