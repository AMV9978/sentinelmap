import { create } from 'zustand'

const useSentinelStore = create((set) => ({
  mode: 'single',
  setMode: (mode) => set({ mode }),

  query: '',
  setQuery: (query) => set({ query }),

  result: null,
  setResult: (result) => set({ result }),

  bulkResults: [],
  setBulkResults: (bulkResults) => set({ bulkResults }),

  loading: false,
  setLoading: (loading) => set({ loading }),

  error: null,
  setError: (error) => set({ error }),

  mapCenter: [-74.006, 40.7128],
  setMapCenter: (mapCenter) => set({ mapCenter }),

  mapZoom: 2,
  setMapZoom: (mapZoom) => set({ mapZoom }),
}))

export default useSentinelStore