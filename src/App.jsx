import MapView from './components/MapView'
import SearchBar from './components/SearchBar'
import InfoPanel from './components/InfoPanel'
import ThreatPanel from './components/ThreatPanel'
import BulkTable from './components/BulkTable'
import useSentinelStore from './store/useSentinelStore'
import './App.css'

export default function App() {
  const { mode } = useSentinelStore()

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-bracket">[</span>
          SENTINEL
          <span className="logo-accent">MAP</span>
          <span className="logo-bracket">]</span>
        </div>
        <p className="tagline">IP Intelligence & Threat Analysis</p>
      </header>

      <div className="search-section">
        <SearchBar />
      </div>

      <div className="main-layout">
        <div className="map-container">
          <MapView />
        </div>

        <div className="side-panels">
          <InfoPanel />
          <ThreatPanel />
        </div>
      </div>

      {mode === 'bulk' && (
        <div className="bulk-section">
          <BulkTable />
        </div>
      )}
    </div>
  )
}