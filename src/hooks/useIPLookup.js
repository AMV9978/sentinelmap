import useSentinelStore from '../store/useSentinelStore'

const IPGEO_KEY = import.meta.env.VITE_IPGEO_KEY

export async function lookupIP(query) {
  const { setResult, setLoading, setError, setMapCenter, setMapZoom } =
    useSentinelStore.getState()

  setLoading(true)
  setError(null)

  try {
    const [geoRes, abuseRes] = await Promise.all([
      fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEO_KEY}&ip=${query}`
      ),
      // Task 1: call Vercel serverless proxy instead of AbuseIPDB directly
      fetch(`/api/abusecheck?ipAddress=${query}&maxAgeInDays=90&verbose=true`),
    ])

    if (!geoRes.ok) throw new Error(`IPGeo error: ${geoRes.status}`)
    if (!abuseRes.ok) throw new Error(`AbuseIPDB proxy error: ${abuseRes.status}`)

    const geo = await geoRes.json()
    const abuse = await abuseRes.json()

    const result = {
      ip: geo.ip,
      city: geo.city,
      region: geo.state_prov,
      country: geo.country_name,
      countryFlag: geo.country_flag,
      lat: parseFloat(geo.latitude),
      lng: parseFloat(geo.longitude),
      isp: geo.isp,
      org: geo.organization,
      asn: geo.asn,
      timezone: geo.time_zone?.name,
      isVPN: false,
      isProxy: false,
      isTor: false,
      abuseScore: abuse.data?.abuseConfidenceScore ?? 0,
      totalReports: abuse.data?.totalReports ?? 0,
      lastReported: abuse.data?.lastReportedAt,
      usageType: abuse.data?.usageType,
      domain: abuse.data?.domain,
      abuseCategories: abuse.data?.reports
        ?.map((r) => r.categories)
        .flat() ?? [],
    }

    setResult(result)
    setMapCenter([result.lng, result.lat])
    setMapZoom(10)
  } catch (err) {
    setError('Lookup failed. Check the IP or domain and try again.')
    console.error(err)
  } finally {
    setLoading(false)
  }
}

export async function bulkLookup(ips) {
  const { setBulkResults, setLoading } = useSentinelStore.getState()
  setLoading(true)
  const results = []

  for (const ip of ips) {
    try {
      const [geoRes, abuseRes] = await Promise.all([
        fetch(
          `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGEO_KEY}&ip=${ip.trim()}`
        ),
        // Task 1: same proxy for bulk — no headers needed, key is server-side
        fetch(`/api/abusecheck?ipAddress=${ip.trim()}&maxAgeInDays=90`),
      ])

      const geo = await geoRes.json()
      const abuse = await abuseRes.json()

      results.push({
        ip: geo.ip,
        country: geo.country_name,
        isp: geo.isp,
        lat: parseFloat(geo.latitude),
        lng: parseFloat(geo.longitude),
        abuseScore: abuse.data?.abuseConfidenceScore ?? 0,
        usageType: abuse.data?.usageType,
        isVPN: false,
      })

      await new Promise((r) => setTimeout(r, 300))
    } catch (err) {
      results.push({ ip: ip.trim(), error: true })
    }
  }

  setBulkResults(results)
  setLoading(false)
}