import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import useSentinelStore from '../store/useSentinelStore'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export default function MapView() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)
  const bulkMarkers = useRef([])

  const { result, bulkResults, mapCenter, mapZoom, mode } = useSentinelStore()

  useEffect(() => {
    if (map.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
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
      score >= 75 ? '#ef4444' : score >= 25 ? '#f59e0b' : '#22c55e'

    const el = document.createElement('div')
    el.style.cssText = `
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${color};
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
      cursor: pointer;
    `

    marker.current = new mapboxgl.Marker(el)
      .setLngLat([result.lng, result.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="font-family: monospace; font-size: 12px; color: #111;">
            <strong>${result.ip}</strong><br/>
            ${result.city}, ${result.country}<br/>
            Abuse Score: <span style="color:${color};font-weight:bold">${result.abuseScore}%</span>
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
  }, [result])

  useEffect(() => {
    if (!map.current || !bulkResults.length) return

    bulkMarkers.current.forEach((m) => m.remove())
    bulkMarkers.current = []

    bulkResults.forEach((r) => {
      if (r.error || !r.lat || !r.lng) return

      const score = r.abuseScore
      const color =
        score >= 75 ? '#ef4444' : score >= 25 ? '#f59e0b' : '#22c55e'

      const el = document.createElement('div')
      el.style.cssText = `
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid white;
        box-shadow: 0 0 8px ${color};
        cursor: pointer;
      `

      const m = new mapboxgl.Marker(el)
        .setLngLat([r.lng, r.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: monospace; font-size: 12px; color: #111;">
              <strong>${r.ip}</strong><br/>
              ${r.country}<br/>
              Abuse Score: <span style="color:${color};font-weight:bold">${r.abuseScore}%</span>
            </div>
          `)
        )
        .addTo(map.current)

      bulkMarkers.current.push(m)
    })
  }, [bulkResults])

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '100%' }}
    />
  )
}