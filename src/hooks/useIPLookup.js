import useSentinelStore from '../store/useSentinelStore'

const IPGEO_KEY = import.meta.env.VITE_IPGEO_KEY
const ABUSEIPDB_KEY = import.meta.env.VITE_ABUSEIPDB_KEY

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
      fetch(
        `/abuseipdb/api/v2/check?ipAddress=${query}&maxAgeInDays=90&verbose`,
        {
          headers: {
            Key: ABUSEIPDB_KEY,
            Accept: 'application/json',
          },
        }
      ),
    ])

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
        fetch(
          `/abuseipdb/api/v2/check?ipAddress=${ip.trim()}&maxAgeInDays=90`,
          {
            headers: {
              Key: ABUSEIPDB_KEY,
              Accept: 'application/json',
            },
          }
        ),
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