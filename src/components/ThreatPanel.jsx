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
  const color =
    score >= 75 ? '#ff4d4d' : score >= 25 ? '#f5a623' : '#22d47a'

  return (
    <div className="score-ring-wrapper">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="#1e2d40" strokeWidth="8" />
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
          fill={color} fontSize="16" fontWeight="600"
          fontFamily="IBM Plex Mono, monospace">
          {score}%
        </text>
      </svg>
      <span className="score-label">Abuse Score</span>
    </div>
  )
}

export default function ThreatPanel() {
  const { result, loading } = useSentinelStore()

  if (loading) return <div className="panel loading">Analyzing threat intelligence...</div>
  if (!result) return null

  const uniqueCategories = [...new Set(result.abuseCategories)]
    .map((id) => ABUSE_CATEGORIES[id])
    .filter(Boolean)

  const riskClass =
    result.abuseScore >= 75 ? 'high'
    : result.abuseScore >= 25 ? 'med'
    : 'low'

  const riskLabel =
    result.abuseScore >= 75 ? 'HIGH'
    : result.abuseScore >= 25 ? 'MEDIUM'
    : 'LOW'

  const flagged = (val) => val
    ? <span style={{ color: '#f5a623' }}>Yes</span>
    : <span style={{ color: '#5a7080' }}>No</span>

  return (
    <div className="panel threat-panel">
      <h3>Threat Intelligence</h3>

      <ScoreRing score={result.abuseScore} />

      <div className="threat-meta">
        <div className="threat-row">
          <span className="label">Risk Level</span>
          <span className="value">
            <span className={`risk-badge ${riskClass}`}>{riskLabel}</span>
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
              : <span style={{ color: '#5a7080' }}>Never</span>}
          </span>
        </div>
        <div className="threat-row">
          <span className="label">VPN</span>
          <span className="value">{flagged(result.isVPN)}</span>
        </div>
        <div className="threat-row">
          <span className="label">Proxy</span>
          <span className="value">{flagged(result.isProxy)}</span>
        </div>
        <div className="threat-row">
          <span className="label">Tor</span>
          <span className="value">{flagged(result.isTor)}</span>
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