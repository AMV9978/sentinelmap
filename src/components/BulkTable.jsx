import useSentinelStore from '../store/useSentinelStore'

export default function BulkTable() {
  const { bulkResults } = useSentinelStore()

  if (!bulkResults.length) return null

  const handleExport = () => {
    const headers = ['IP', 'Country', 'ISP', 'Abuse Score', 'Usage Type', 'VPN']
    const rows = bulkResults.map((r) => [
      r.ip, r.country, r.isp, r.abuseScore, r.usageType, r.isVPN ? 'Yes' : 'No'
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sentinelmap-results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bulk-table-wrapper">
      <div className="bulk-table-header">
        <h3>Bulk Results — {bulkResults.length} IPs</h3>
        <button onClick={handleExport} className="export-btn">
          Export CSV
        </button>
      </div>
      <div className="table-scroll">
        <table className="bulk-table">
          <thead>
            <tr>
              <th>IP</th>
              <th>Country</th>
              <th>ISP</th>
              <th>Abuse Score</th>
              <th>Usage Type</th>
              <th>VPN</th>
            </tr>
          </thead>
          <tbody>
            {bulkResults.map((r) => {
              const color =
                r.abuseScore >= 75 ? '#ef4444'
                : r.abuseScore >= 25 ? '#f59e0b'
                : '#22c55e'
              return (
                <tr key={r.ip} className={r.error ? 'row-error' : ''}>
                  <td className="mono">{r.ip}</td>
                  <td>{r.error ? '—' : r.country}</td>
                  <td>{r.error ? '—' : r.isp}</td>
                  <td>
                    {r.error ? '—' : (
                      <span style={{ color, fontWeight: 'bold' }}>
                        {r.abuseScore}%
                      </span>
                    )}
                  </td>
                  <td>{r.error ? '—' : r.usageType}</td>
                  <td>{r.error ? '—' : r.isVPN ? '⚠ Yes' : 'No'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}