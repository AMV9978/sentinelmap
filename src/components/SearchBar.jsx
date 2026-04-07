import { useState } from 'react'
import useSentinelStore from '../store/useSentinelStore'
import { lookupIP, bulkLookup } from '../hooks/useIPLookup'

export default function SearchBar() {
  const { mode, setMode, query, setQuery, loading } = useSentinelStore()
  const [bulkText, setBulkText] = useState('')

  const handleSingle = () => {
    if (!query.trim()) return
    lookupIP(query.trim())
  }

  const handleBulk = () => {
    const ips = bulkText
      .split('\n')
      .map((ip) => ip.trim())
      .filter(Boolean)
    if (!ips.length) return
    bulkLookup(ips)
  }

  return (
    <div className="search-bar">
      <div className="mode-toggle">
        <button
          className={mode === 'single' ? 'active' : ''}
          onClick={() => setMode('single')}
        >
          Single Lookup
        </button>
        <button
          className={mode === 'bulk' ? 'active' : ''}
          onClick={() => setMode('bulk')}
        >
          Bulk Lookup
        </button>
      </div>

      {mode === 'single' ? (
        <div className="input-row">
          <input
            type="text"
            placeholder="Enter IP address or domain..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSingle()}
          />
          <button onClick={handleSingle} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </div>
      ) : (
        <div className="bulk-input">
          <textarea
            placeholder="Paste IPs one per line (max 20)..."
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={6}
          />
          <button onClick={handleBulk} disabled={loading}>
            {loading ? 'Scanning...' : 'Scan All'}
          </button>
        </div>
      )}
    </div>
  )
}