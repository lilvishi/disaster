"use client"

import { useEffect, useRef, useState } from "react"
import { Flame, Home, HandHeart, UtensilsCrossed, AlertCircle, Ban, MapPin, Filter, Layers, X } from "lucide-react"
import { mapMarkers, type MapMarker } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const markerConfig: Record<MapMarker["type"], { color: string; icon: typeof Flame; label: string }> = {
  danger: { color: "#ef4444", icon: Flame, label: "Danger Zone" },
  shelter: { color: "#3b82f6", icon: Home, label: "Shelter" },
  volunteer: { color: "#a855f7", icon: HandHeart, label: "Volunteer" },
  "food-bank": { color: "#22c55e", icon: UtensilsCrossed, label: "Food Bank" },
  report: { color: "#f59e0b", icon: AlertCircle, label: "Report" },
  "road-closed": { color: "#6b7280", icon: Ban, label: "Road Closed" },
}

const filterOptions = [
  { type: "danger" as const, label: "Danger Zones", color: "#ef4444" },
  { type: "shelter" as const, label: "Shelters", color: "#3b82f6" },
  { type: "volunteer" as const, label: "Volunteers", color: "#a855f7" },
  { type: "food-bank" as const, label: "Food Banks", color: "#22c55e" },
  { type: "report" as const, label: "Reports", color: "#f59e0b" },
  { type: "road-closed" as const, label: "Road Closures", color: "#6b7280" },
]

export function CompassPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<MapMarker["type"]>>(new Set(["danger", "shelter", "volunteer", "food-bank", "report", "road-closed"]))
  const [showFilters, setShowFilters] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  const toggleFilter = (type: MapMarker["type"]) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const loadMap = async () => {
      const L = await import("leaflet")
      await import("leaflet/dist/leaflet.css")

      const map = L.map(mapRef.current!, {
        center: [34.0522, -118.2637],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      })

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
      }).addTo(map)

      // Add danger zones as circles
      L.circle([34.0522, -118.2637], {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.15,
        radius: 1500,
        weight: 2,
      }).addTo(map)

      L.circle([34.0622, -118.2837], {
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.1,
        radius: 1000,
        weight: 2,
        dashArray: "8 4",
      }).addTo(map)

      // Add markers
      mapMarkers.forEach((marker) => {
        const config = markerConfig[marker.type]
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="background:${config.color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.2);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${getIconPath(marker.type)}</svg></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })

        L.marker([marker.lat, marker.lng], { icon })
          .addTo(map)
          .on("click", () => {
            setSelectedMarker(marker)
          })
      })

      mapInstanceRef.current = map
      setMapReady(true)
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  const filteredMarkers = mapMarkers.filter((m) => activeFilters.has(m.type))

  return (
    <div className="relative flex flex-col h-[calc(100dvh-7.5rem)]">
      {/* Map */}
      <div ref={mapRef} className="flex-1 bg-secondary" />

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-card/95 backdrop-blur-md border border-border px-3 py-2 shadow-lg transition-colors hover:bg-secondary"
      >
        <Filter className="h-4 w-4 text-foreground" />
        <span className="text-xs font-medium text-foreground">Filter</span>
      </button>

      {/* Layer info */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-card/95 backdrop-blur-md border border-border px-3 py-2 shadow-lg">
        <Layers className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{filteredMarkers.length} locations</span>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="absolute top-14 right-3 z-[1000] rounded-xl bg-card/95 backdrop-blur-md border border-border p-3 shadow-xl w-52">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground font-mono">Filters</span>
            <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {filterOptions.map((f) => (
              <button
                key={f.type}
                onClick={() => toggleFilter(f.type)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors",
                  activeFilters.has(f.type) ? "bg-secondary" : "opacity-40"
                )}
              >
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="text-xs text-foreground">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Marker Detail */}
      {selectedMarker && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] rounded-xl bg-card/95 backdrop-blur-md border border-border p-4 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${markerConfig[selectedMarker.type].color}20` }}
              >
                <MapPin className="h-5 w-5" style={{ color: markerConfig[selectedMarker.type].color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{selectedMarker.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{markerConfig[selectedMarker.type].label}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedMarker(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {selectedMarker.details && (
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">{selectedMarker.details}</p>
          )}
          {selectedMarker.status && (
            <div className="mt-2 flex items-center gap-1.5">
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    selectedMarker.status === "Active" || selectedMarker.status === "Open"
                      ? "#22c55e"
                      : selectedMarker.status === "Warning" || selectedMarker.status === "Near Full"
                        ? "#f59e0b"
                        : "#6b7280",
                }}
              />
              <span className="text-xs font-medium text-foreground">{selectedMarker.status}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getIconPath(type: MapMarker["type"]): string {
  switch (type) {
    case "danger":
      return '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
    case "shelter":
      return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
    case "volunteer":
      return '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>'
    case "food-bank":
      return '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
    case "report":
      return '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
    case "road-closed":
      return '<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>'
    default:
      return '<circle cx="12" cy="12" r="10"/>'
  }
}
