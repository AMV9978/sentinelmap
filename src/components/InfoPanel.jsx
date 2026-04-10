import useSentinelStore from '../store/useSentinelStore'

export default function InfoPanel() {
  const { result, loading, error } = useSentinelStore()

  if (loading) return <div className="panel loading">Scanning target...</div>
  if (error)   return <div className="panel error">{error}</div>
  if (!result) return (
    <div className="panel empty">
      <p>Enter an IP address or domain<br />to begin intelligence gathering.</p>
    </div>
  )

  const rows = [
    { label: 'IP Address', value: result.ip,        accent: true },
    { label: 'City',       value: result.city },
    { label: 'Region',     value: result.region },
    { label: 'Country',    value: result.country },
    { label: 'ISP',        value: result.isp },
    { label: 'Organization', value: result.org },
    { label: 'ASN',        value: result.asn },
    { label: 'Timezone',   value: result.timezone },
    { label: 'Domain',     value: result.domain },
    { label: 'Usage Type', value: result.usageType },
  ]

  return (
    <div className="panel info-panel">
      <h3>IP Intelligence</h3>
      <table>
        <tbody>
          {rows.map(({ label, value, accent }) =>
            value ? (
              <tr key={label}>
                <td className="label">{label}</td>
                <td
                  className="value"
                  style={accent ? { color: 'var(--accent)', letterSpacing: '0.04em' } : undefined}
                >
                  {value}
                </td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  )
}