import useSentinelStore from '../store/useSentinelStore'

const ABUSE_CATEGORIES = {
  3: 'Fraud Orders', 4: 'DDoS Attack', 5: 'FTP Brute-Force',
  6: 'Ping of Death', 7: 'Phishing', 8: 'Fraud VoIP',
  9: 'Open Proxy', 10: 'Web Spam', 11: 'Email Spam',
  12: 'Blog Spam', 13: 'VPN IP', 14: 'Port Scan',
  15: 'Hacking', 16: 'SQL Injection', 17: 'Spoofing',
  18: 'Brute Force', 19: 'Bad Web Bot', 20: 'Exploited Host',
  21: 'Web App Attack', 22: 'SSH', 23: 'IoT Targeted',
}

function ScoreRing({ score }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 75 ? '#ef4444' : score >= 25 ? '#f59e0b' : '#22c55e'

  return (
    <div className="score-ring-wrapper">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="#333" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <text x="50" y="50" textAnchor="middle"
          dominantBaseline="central"
          fill={color} fontSize="16" fontWeight="bold"
          fontFamily="monospace">
          {score}%
        </text>
      </svg>
      <span className="score-label">Abuse Score</span>
    </div>
  )
}

export default function ThreatPanel() {
  const { result, loading } = useSentinelStore()

  if (loading) return <div className="panel loading">Analyzing threat...</div>
  if (!result) return null

  const uniqueCategories = [...new Set(result.abuseCategories)]
    .map((id) => ABUSE_CATEGORIES[id])
    .filter(Boolean)

  const riskLevel =
    result.abuseScore >= 75 ? 'HIGH'
    : result.abuseScore >= 25 ? 'MEDIUM'
    : 'LOW'

  const riskColor =
    result.abuseScore >= 75 ? '#ef4444'
    : result.abuseScore >= 25 ? '#f59e0b'
    : '#22c55e'

  return (
    <div className="panel threat-panel">
      <h3>Threat Intelligence</h3>

      <ScoreRing score={result.abuseScore} />

      <div className="threat-meta">
        <div className="threat-row">
          <span className="label">Risk Level</span>
          <span className="value" style={{ color: riskColor, fontWeight: 'bold' }}>
            {riskLevel}
          </span>
        </div>
        <div className="threat-row">
          <span className="label">Total Reports</span>
          <span className="value">{result.totalReports}</span>
        </div>
        <div className="threat-row">
          <span className="label">Last Reported</span>
          <span className="value">
            {result.lastReported
              ? new Date(result.lastReported).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
        <div className="threat-row">
          <span className="label">VPN</span>
          <span className="value">{result.isVPN ? '⚠ Yes' : 'No'}</span>
        </div>
        <div className="threat-row">
          <span className="label">Proxy</span>
          <span className="value">{result.isProxy ? '⚠ Yes' : 'No'}</span>
        </div>
        <div className="threat-row">
          <span className="label">Tor</span>
          <span className="value">{result.isTor ? '⚠ Yes' : 'No'}</span>
        </div>
      </div>

      {uniqueCategories.length > 0 && (
        <div className="categories">
          <p className="cat-label">Abuse Categories</p>
          <div className="cat-tags">
            {uniqueCategories.map((cat) => (
              <span key={cat} className="cat-tag">{cat}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}