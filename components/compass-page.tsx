"use client"

import { useEffect, useRef, useState } from "react"
import { Flame, Home, HandHeart, UtensilsCrossed, AlertCircle, Ban, MapPin, Filter, Layers, X, Megaphone, Send } from "lucide-react"
import { mapMarkers, type MapMarker, dangerZones } from "@/lib/MockData/mock-data"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

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

type ReportType = "danger" | "shelter" | "food-bank" | "report" | "volunteer" | "road-closed"

interface FormData {
  label: string
  details: string
  [key: string]: string | number | string[]
}

export function CompassPage({ preset = "all" }: { preset?: "all" | "volunteer" | "shelter" }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null) // store Leaflet map instance
  const leafletRef = useRef<any>(null) // store Leaflet namespace (L)
  const markersRef = useRef<any[]>([])
  const polygonsRef = useRef<any[]>([])

  const [allMarkers, setAllMarkers] = useState<MapMarker[]>(mapMarkers)
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<MapMarker["type"]>>(
    new Set(["danger", "shelter", "volunteer", "food-bank", "report", "road-closed"])
  )
  const [showFilters, setShowFilters] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [showReportMenu, setShowReportMenu] = useState(false)
  const [reportingMode, setReportingMode] = useState<ReportType | null>(null)
  const [formData, setFormData] = useState<FormData>({ label: "", details: "" })
  const [placingMarker, setPlacingMarker] = useState(false)
  const [verificationState, setVerificationState] = useState<Record<string, { isVerified: boolean; verificationCount: number; reportCount: number; userVerified?: boolean; userReported?: boolean }>>({})

  const placingMarkerRef = useRef(false)
  const placementHandlerRef = useRef<any>(null)
  const latestFormDataRef = useRef<FormData>(formData)
  const reportingModeRef = useRef<ReportType | null>(reportingMode)

  // Load verification state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("markerVerifications")
    if (saved) {
      setVerificationState(JSON.parse(saved))
    }
  }, [])

  // Save verification state to localStorage
  useEffect(() => {
    localStorage.setItem("markerVerifications", JSON.stringify(verificationState))
  }, [verificationState])

  // Sync ref so the stale map click closure can read latest value
  useEffect(() => {
    placingMarkerRef.current = placingMarker
  }, [placingMarker])

  const toggleFilter = (type: MapMarker["type"]) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  const filteredMarkers = allMarkers.filter((m) => activeFilters.has(m.type))

  // Handle verification/reporting
  const handleVerifyReport = (markerId: string) => {
    setVerificationState((prev) => {
      const current = prev[markerId] || { isVerified: false, verificationCount: 0, reportCount: 0, userVerified: false, userReported: false }
      
      // If user already verified, toggle it off
      if (current.userVerified) {
        return {
          ...prev,
          [markerId]: {
            ...current,
            userVerified: false,
            verificationCount: Math.max(0, current.verificationCount - 1),
            isVerified: false,
          },
        }
      }
      
      // Otherwise, verify and remove report if it exists
      return {
        ...prev,
        [markerId]: {
          ...current,
          userVerified: true,
          verificationCount: current.verificationCount + 1,
          userReported: false,
          reportCount: current.userReported ? Math.max(0, current.reportCount - 1) : current.reportCount,
          isVerified: true,
        },
      }
    })
  }

  const handleReportAsInaccurate = (markerId: string) => {
    setVerificationState((prev) => {
      const current = prev[markerId] || { isVerified: false, verificationCount: 0, reportCount: 0, userVerified: false, userReported: false }
      
      // If user already reported, toggle it off
      if (current.userReported) {
        return {
          ...prev,
          [markerId]: {
            ...current,
            userReported: false,
            reportCount: Math.max(0, current.reportCount - 1),
          },
        }
      }
      
      // Otherwise, report and remove verification if it exists
      return {
        ...prev,
        [markerId]: {
          ...current,
          userReported: true,
          reportCount: current.reportCount + 1,
          userVerified: false,
          verificationCount: current.userVerified ? Math.max(0, current.verificationCount - 1) : current.verificationCount,
          isVerified: false,
        },
      }
    })
  }

  // Render markers on map
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Add filtered markers
    filteredMarkers.forEach((marker) => {
      const config = markerConfig[marker.type]
      const verification = verificationState[marker.id]
      const isVerified = marker.type === "report" ? verification?.isVerified || marker.isVerified : undefined

      const L = leafletRef.current
      if (!L) return
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="background:${config.color};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.2)${
          marker.type === "report" && isVerified ? ";border-color:#22c55e;box-shadow:0 0 12px rgba(34,197,94,0.5)" : ""
        };"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${getIconPath(marker.type)}</svg></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .addTo(mapInstanceRef.current!)
        .on("click", () => {
          setSelectedMarker({ ...marker, isVerified: verification?.isVerified || marker.isVerified })
        })

      markersRef.current.push(leafletMarker)
    })
  }, [filteredMarkers, verificationState, mapReady])

  // Render danger zone polygons
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear old polygons
    polygonsRef.current.forEach((poly) => poly.remove())
    polygonsRef.current = []

    // Add danger zone polygons only if filter is active
    if (activeFilters.has("danger")) {
      dangerZones.forEach((zone) => {
        const polygon = leafletRef.current.polygon(zone.polygon as any, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.15,
          weight: 2,
          dashArray: zone.dangerLevel === "incoming" ? "8 4" : undefined,
        })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<div><strong>${zone.name}</strong><br/>Acres: ${zone.acres}<br/>Contained: ${zone.containmentPercent}%</div>`)

        polygonsRef.current.push(polygon)
      })
    }
  }, [activeFilters, mapReady])

  // Initialize map once on mount
  useEffect(() => {
    if (!mapRef.current) return

    // If Leaflet already owns this container, bail out
    if ((mapRef.current as any)._leaflet_id) return

    const loadMap = async () => {
      const L = (await import("leaflet")).default as any
      leafletRef.current = L
      ;(window as any).L = L

      // Double-check after async gap
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return

      const map = L.map(mapRef.current, {
      center: [34.0522, -118.2637],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true,
      fadeAnimation: false,
    })

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      updateWhenIdle: false,
      updateWhenZooming: false,
      keepBuffer: 4,
    }).addTo(map)

      mapInstanceRef.current = map
      setMapReady(true)
      setTimeout(() => map.invalidateSize(), 100)
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id
      }
    }
  }, [])
  // keep size in sync with window/viewport changes (keyboard, dvh, rotation)
  useEffect(() => {
    const handler = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
    window.addEventListener("resize", handler)
    if ((window as any).visualViewport) {
      (window as any).visualViewport.addEventListener("resize", handler)
    }
    return () => {
      window.removeEventListener("resize", handler)
      if ((window as any).visualViewport) {
        (window as any).visualViewport.removeEventListener("resize", handler)
      }
    }
  }, [])

  const handleMarkerPlacement = (lat: number, lng: number) => {
    const newMarker: MapMarker = {
      id: `user-${Date.now()}`,
      lat,
      lng,
      ...formData,
      type: reportingMode as MapMarker["type"],
      status: "Unverified",
      userReportId: true,
    }

    setAllMarkers((prev) => [...prev, newMarker])
    setPlacingMarker(false)
    setReportingMode(null)
    setFormData({ label: "", details: "" })
    setShowReportMenu(false)
    // ensure map repaints after drawer transition
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize()
      }, 100)
    }
  }

  const handleReportSubmit = async () => {
    if (!formData.label || !formData.details) {
      alert("Please fill in all fields")
      return
    }
    // blur any focused input to close mobile keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    // keep drawer open, switch to placement mode
    setPlacingMarker(true)
    // trigger immediate resize in case map tiles grey out
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 300)
    }
  }

  const renderReportForm = () => {
    const commonFields = (
      <>
        <input
          type="text"
          placeholder="Title/Label"
          value={formData.label}
          onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground mb-2"
        />
        <textarea
          placeholder="Details"
          value={formData.details}
          onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground mb-2 h-20 resize-none"
        />
      </>
    )

    switch (reportingMode) {
      case "danger":
        return (
          <div className="space-y-2">
            {commonFields}
            <select
              value={formData.type || "fire"}
              onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            >
              <option value="fire">Fire</option>
              <option value="flood">Flood</option>
              <option value="storm">Storm</option>
            </select>
          </div>
        )
      case "shelter":
      case "food-bank":
        return (
          <div className="space-y-2">
            {commonFields}
            <input
              type="number"
              placeholder="Current Capacity"
              value={formData.currentCapacity || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentCapacity: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            />
            <input
              type="number"
              placeholder="Max Capacity"
              value={formData.maxCapacity || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxCapacity: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={formData.contactInfo || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            />
          </div>
        )
      case "volunteer":
        return (
          <div className="space-y-2">
            {commonFields}
            <input
              type="text"
              placeholder="Needs (comma-separated)"
              value={(formData.volunteerNeeds as string[])?.join(",") || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, volunteerNeeds: e.target.value.split(",").map((s) => s.trim()) }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            />
          </div>
        )
      case "report":
        return (
          <div className="space-y-2">
            {commonFields}
            <select
              value={formData.reportCategory || "help"}
              onChange={(e) => setFormData((prev) => ({ ...prev, reportCategory: e.target.value as any }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            >
              <option value="help">Help Needed</option>
              <option value="hazard">Hazard Report</option>
              <option value="resource">Resource Request</option>
            </select>
          </div>
        )
      case "road-closed":
        return (
          <div className="space-y-2">
            {commonFields}
            <input
              type="text"
              placeholder="Reason"
              value={formData.reason || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            />
          </div>
        )
      default:
        return commonFields
    }
  }

  // when we toggle placement mode, report menu or reporting mode, force map re-layout
  // keep click rebinding logic out of this effect to avoid races; attach handler when entering placement
  useEffect(() => {
    latestFormDataRef.current = formData
  }, [formData])

  useEffect(() => {
    reportingModeRef.current = reportingMode
  }, [reportingMode])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // helper to invalidate size a few times around animations
    const pokeInvalidate = () => {
      try {
        map.invalidateSize()
      } catch (e) {
        // noop
      }
      setTimeout(() => map.invalidateSize(), 100)
      setTimeout(() => map.invalidateSize(), 300)
      setTimeout(() => map.invalidateSize(), 600)
    }

    pokeInvalidate()

    if (placingMarker) {
      // attach a stable click handler so we don't depend on stale closures
      const handler = (e: any) => {
        console.debug("placement click", e?.latlng?.lat, e?.latlng?.lng)
        handleMarkerPlacement(e.latlng.lat, e.latlng.lng)
      }
      placementHandlerRef.current = handler
      map.on("click", handler)
      console.debug("placement handler attached")
    } else {
      // remove handler if present
      if (placementHandlerRef.current) {
        map.off("click", placementHandlerRef.current)
        placementHandlerRef.current = null
        console.debug("placement handler removed")
      }
    }

    return () => {
      if (placementHandlerRef.current) {
        map.off("click", placementHandlerRef.current)
        placementHandlerRef.current = null
      }
    }
  }, [placingMarker, showReportMenu, reportingMode, mapReady])

  return (
    <div className={cn("relative h-full overflow-hidden", placingMarker && "cursor-crosshair")}>
      {/* Map */}
      <div
        ref={mapRef}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, minHeight: "100%" }}
        className="absolute inset-0 bg-secondary"
        onTransitionEnd={() => mapInstanceRef.current?.invalidateSize()}
      />

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

      {/* Report Button */}
      <button
        onClick={() => setShowReportMenu(!showReportMenu)}
        className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-2 shadow-lg transition-colors hover:opacity-90"
      >
        <Megaphone className="h-4 w-4" />
        <span className="text-xs font-medium">Report</span>
      </button>

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
              <label
                key={f.type}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-colors hover:bg-secondary/50",
                  activeFilters.has(f.type) ? "bg-secondary" : "opacity-40"
                )}
              >
                <input
                  type="checkbox"
                  checked={activeFilters.has(f.type)}
                  onChange={() => toggleFilter(f.type)}
                  className="w-4 h-4 rounded accent-primary"
                />
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                <span className="text-xs text-foreground">{f.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Report Menu */}
      {showReportMenu && !reportingMode && (
        <div className="absolute bottom-14 right-3 z-[1000] rounded-xl bg-card/95 backdrop-blur-md border border-border p-3 shadow-xl w-64">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">Report</span>
            <button onClick={() => setShowReportMenu(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { type: "danger", icon: Flame, label: "Danger" },
              { type: "shelter", icon: Home, label: "Shelter" },
              { type: "food-bank", icon: UtensilsCrossed, label: "Food Bank" },
              { type: "volunteer", icon: HandHeart, label: "Volunteer" },
              { type: "report", icon: AlertCircle, label: "Report" },
              { type: "road-closed", icon: Ban, label: "Road Closed" },
            ].map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setReportingMode(type as ReportType)}
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg bg-secondary hover:bg-secondary/70 transition-colors"
              >
                <Icon className="h-4 w-4 text-foreground" />
                <span className="text-xs text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report Form Drawer - rendered in portal to avoid affecting map paint */}
      {reportingMode && typeof window !== "undefined" && createPortal(
        <div className="fixed bottom-0 left-0 right-0 z-[9999] rounded-t-2xl bg-card border border-border border-b-0 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-foreground">
              {placingMarker ? "Place marker" : `Report ${reportingMode}`}
            </span>
            <button
              onClick={() => {
                setReportingMode(null)
                setFormData({ label: "", details: "" })
                setPlacingMarker(false)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!placingMarker ? (
            <>
              {renderReportForm()}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setReportingMode(null)
                    setFormData({ label: "", details: "" })
                  }}
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportSubmit}
                  className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs text-muted-foreground">
                Tap the map to place your {formData.label || "marker"} or
                cancel below.
              </p>
              <button
                onClick={() => {
                  setPlacingMarker(false)
                  // blur to dismiss keyboard if still open
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur()
                  }
                  // also re-layout map
                  if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize()
                }}
                className="mt-3 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/70 transition-colors"
              >
                Cancel placement
              </button>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* Placement instruction overlay */}
      {placingMarker && (
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-[1000] bg-card/95 backdrop-blur-md border border-border px-3 py-2 rounded-lg shadow-lg">
          <p className="text-xs text-foreground">Tap map to place your {formData.label || "marker"}</p>
        </div>
      )}

      {/* Selected Marker Detail */}
      {selectedMarker && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] rounded-xl bg-card/95 backdrop-blur-md border border-border p-4 shadow-xl animate-in slide-in-from-bottom-4 duration-300 max-h-[40vh] overflow-y-auto">
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
            <button onClick={() => setSelectedMarker(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Marker type specific details */}
          {selectedMarker.type === "danger" && (
            <>
              {selectedMarker.acres && <p className="text-xs text-muted-foreground mt-2">📍 {selectedMarker.acres} acres</p>}
              {selectedMarker.containmentPercent !== undefined && <p className="text-xs text-muted-foreground">🔥 {selectedMarker.containmentPercent}% contained</p>}
              {selectedMarker.dangerLevel && <p className="text-xs text-muted-foreground">⚠️ {selectedMarker.dangerLevel.replace("-", " ")}</p>}
            </>
          )}

          {(selectedMarker.type === "shelter" || selectedMarker.type === "food-bank") && (
            <>
              {selectedMarker.currentCapacity && selectedMarker.maxCapacity && (
                <p className="text-xs text-muted-foreground mt-2">👥 {selectedMarker.currentCapacity}/{selectedMarker.maxCapacity} capacity</p>
              )}
              {selectedMarker.foodCondition && <p className="text-xs text-muted-foreground">🍽️ {selectedMarker.foodCondition}</p>}
              {selectedMarker.contactInfo && <p className="text-xs text-muted-foreground">📞 {selectedMarker.contactInfo}</p>}
              {selectedMarker.safetyReports && selectedMarker.safetyReports.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">📋 {selectedMarker.safetyReports.length} safety reports</p>
              )}
            </>
          )}

          {selectedMarker.type === "volunteer" && (
            <>
              {selectedMarker.volunteerNeeds && selectedMarker.volunteerNeeds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">❓ Needs: {selectedMarker.volunteerNeeds.join(", ")}</p>
              )}
            </>
          )}

          {selectedMarker.type === "report" && (
            <>
              {selectedMarker.reportComment && <p className="text-xs text-muted-foreground mt-2 italic">💬 {selectedMarker.reportComment}</p>}
              {selectedMarker.reportCategory && <p className="text-xs text-muted-foreground">📂 {selectedMarker.reportCategory}</p>}
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleVerifyReport(selectedMarker.id)}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    verificationState[selectedMarker.id]?.userVerified
                      ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                      : verificationState[selectedMarker.id]?.userReported
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 opacity-50 cursor-not-allowed hover:bg-green-500/10"
                        : "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30 hover:bg-green-500/30"
                  )}
                  disabled={verificationState[selectedMarker.id]?.userReported}
                >
                  ✓ Verify
                </button>
                <button
                  onClick={() => handleReportAsInaccurate(selectedMarker.id)}
                  className={cn(
                    "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    verificationState[selectedMarker.id]?.userReported
                      ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                      : verificationState[selectedMarker.id]?.userVerified
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 opacity-50 cursor-not-allowed hover:bg-red-500/10"
                        : "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30 hover:bg-red-500/30"
                  )}
                  disabled={verificationState[selectedMarker.id]?.userVerified}
                >
                  ✕ Report
                </button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                {verificationState[selectedMarker.id]?.verificationCount > 0 && (
                  <p>✓ Verified by {verificationState[selectedMarker.id]?.verificationCount} users</p>
                )}
                {verificationState[selectedMarker.id]?.reportCount > 0 && (
                  <p>⚠️ Reported by {verificationState[selectedMarker.id]?.reportCount} users</p>
                )}
              </div>
            </>
          )}

          {/* Generic details */}
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