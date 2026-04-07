# [SENTINELMAP]
### IP Intelligence & Threat Analysis

A cybersecurity-focused IP lookup tool built with React. Enter any IP address or domain to instantly retrieve geolocation data, ISP information, and real-time threat intelligence.

## Live Demo
🔗 https://sentinelmap.vercel.app

## Features
- **Single Lookup** — Geolocate any IP or domain with ISP, ASN, org, and timezone data
- **Threat Intelligence** — Real-time abuse confidence score, report count, and attack categories via AbuseIPDB
- **Bulk Lookup** — Paste up to 20 IPs for simultaneous analysis with color-coded risk scoring
- **Interactive Map** — Mapbox dark map with animated markers colored by threat level (green/yellow/red)
- **CSV Export** — Download bulk results for further analysis
- **Responsive** — Works on desktop and mobile

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Map | Mapbox GL JS (Dark Matter tiles) |
| Geolocation | IPGeolocation.io API |
| Threat Intel | AbuseIPDB API |
| State | Zustand |
| Deployment | Vercel |

## Architecture Notes
- Parallel API fan-out — geolocation and threat intel fetched simultaneously via `Promise.all()`
- Vite proxy configured to handle AbuseIPDB CORS restrictions in development
- Rate-limit-aware bulk processing with 300ms delay between requests
- API keys stored as environment variables, never committed to source control

## Local Development
```bash
git clone https://github.com/yourusername/sentinelmap
cd sentinelmap
npm install
# Add your API keys to .env
npm run dev
```

## Environment Variables

VITE_IPGEO_KEY=your_ipgeolocation_key
VITE_ABUSEIPDB_KEY=your_abuseipdb_key
VITE_MAPBOX_TOKEN=your_mapbox_token

## API Credits
- [IPGeolocation.io](https://ipgeolocation.io) — Geolocation, ISP, ASN data
- [AbuseIPDB](https://www.abuseipdb.com) — Threat intelligence and abuse scoring
- [Mapbox](https://www.mapbox.com) — Interactive dark map tiles