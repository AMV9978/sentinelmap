import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useSentinelStore from '../store/useSentinelStore'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapView() {
  const mapContainer = useRef(null)
  const map          = useRef(null)
  const marker       = useRef(null)
  const bulkMarkers  = useRef([])

  const { result, bulkResults, mapCenter, mapZoom, visitorIP } =
    useSentinelStore()

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-night-v1',
      center: mapCenter,
      zoom: mapZoom,
    })
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
  }, [])

  useEffect(() => {
    if (!map.current || !result) return

    if (marker.current) marker.current.remove()

    const score = result.abuseScore
    const color =
      score >= 75 ? '#c0392b' : score >= 25 ? '#b8863a' : '#4a9e7f'

    const wrapper = document.createElement('div')
    wrapper.style.cssText = `
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    `

    if (result.ip === visitorIP) {
      const badge = document.createElement('div')
      badge.className = 'your-ip-badge'
      badge.textContent = 'Your Public IP'
      wrapper.appendChild(badge)
    }

    const dot = document.createElement('div')
    dot.style.cssText = `
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid rgba(205, 216, 227, 0.6);
      box-shadow: 0 0 8px ${color};
      cursor: pointer;
    `
    wrapper.appendChild(dot)

    marker.current = new mapboxgl.Marker({ element: wrapper, anchor: 'bottom' })
      .setLngLat([result.lng, result.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:#0c1320; line-height:1.6;">
            <strong style="font-size:12px;">${result.ip}</strong>
            ${result.ip === visitorIP ? ' <span style="color:#7eb8d4;font-weight:600">[YOU]</span>' : ''}
            <br/>
            ${result.city}, ${result.country}<br/>
            Abuse Score: <span style="color:${color};font-weight:600">${result.abuseScore}%</span>
          </div>
        `)
      )
      .addTo(map.current)

    map.current.flyTo({
      center: [result.lng, result.lat],
      zoom: 9,
      duration: 1800,
      essential: true,
    })
  }, [result, visitorIP])

  useEffect(() => {
    if (!map.current || !bulkResults.length) return

    bulkMarkers.current.forEach((m) => m.remove())
    bulkMarkers.current = []

    bulkResults.forEach((r) => {
      if (r.error || !r.lat || !r.lng) return

      const score = r.abuseScore
      const color =
        score >= 75 ? '#c0392b' : score >= 25 ? '#b8863a' : '#4a9e7f'

      const el = document.createElement('div')
      el.style.cssText = `
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid rgba(205, 216, 227, 0.6);
        box-shadow: 0 0 6px ${color};
        cursor: pointer;
      `

      const m = new mapboxgl.Marker(el)
        .setLngLat([r.lng, r.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family:'IBM Plex Mono',monospace; font-size:11px; color:#0c1320; line-height:1.6;">
              <strong>${r.ip}</strong><br/>
              ${r.country}<br/>
              Abuse Score: <span style="color:${color};font-weight:600">${r.abuseScore}%</span>
            </div>
          `)
        )
        .addTo(map.current)

      bulkMarkers.current.push(m)
    })
  }, [bulkResults])

  const showOverlay = !result && !bulkResults.length

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      {showOverlay && (
        <div className="map-overlay">
          <div className="map-overlay-inner">
            <div className="map-overlay-pulse" />
            <span className="map-overlay-label">Awaiting Target</span>
            <span className="map-overlay-sub">Enter an IP or domain to begin</span>
          </div>
        </div>
      )}
    </div>
  )
}