import useSentinelStore from '../store/useSentinelStore'

export default function InfoPanel() {
  const { result, loading, error } = useSentinelStore()

  if (loading) return <div className="panel loading">Scanning...</div>
  if (error) return <div className="panel error">{error}</div>
  if (!result) return (
    <div className="panel empty">
      <p>Enter an IP or domain to begin.</p>
    </div>
  )

  const rows = [
    { label: 'IP Address', value: result.ip },
    { label: 'City', value: result.city },
    { label: 'Region', value: result.region },
    { label: 'Country', value: `${result.countryFlag ? `${result.country}` : result.country}` },
    { label: 'ISP', value: result.isp },
    { label: 'Organization', value: result.org },
    { label: 'ASN', value: result.asn },
    { label: 'Timezone', value: result.timezone },
    { label: 'Domain', value: result.domain },
    { label: 'Usage Type', value: result.usageType },
    { label: 'VPN', value: result.isVPN ? 'Yes' : 'No' },
    { label: 'Proxy', value: result.isProxy ? 'Yes' : 'No' },
    { label: 'Tor', value: result.isTor ? 'Yes' : 'No' },
  ]

  return (
    <div className="panel info-panel">
      <h3>IP Intelligence</h3>
      <table>
        <tbody>
          {rows.map(({ label, value }) =>
            value ? (
              <tr key={label}>
                <td className="label">{label}</td>
                <td className="value">{value}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>
    </div>
  )
}