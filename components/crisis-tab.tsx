"use client"

import { useEffect, useMemo, useState } from "react"
import { CrisisPage } from "./crisis-page"
import { SafeModePage } from "./safe-page"

// MVP: shape of /api/map response (adjust to match your backend)
type DangerZone = {
  id: string
  riskLevel: "low" | "moderate" | "high" | "critical"
  // polygon coords (GeoJSON-ish). You can change this to your real format.
  polygon: Array<[number, number]> // [lat, lng]
}

type MapApiResponse = {
  dangerZones: DangerZone[]
}

type LocationState =
  | { status: "loading" }
  | { status: "denied" }
  | { status: "safe" }
  | { status: "danger" }

function pointInPolygon(point: [number, number], polygon: Array<[number, number]>) {
  // Ray casting (lat/lng treated as x/y). Works fine for small local polygons (MVP).
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi

    if (intersect) inside = !inside
  }

  return inside
}

export default function CrisisTab() {
  const [state, setState] = useState<LocationState>({ status: "loading" })
  const [userPoint, setUserPoint] = useState<[number, number] | null>(null) // [lat, lng]
  const [zones, setZones] = useState<DangerZone[]>([])

  // 1) Get location
  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: "denied" })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPoint([pos.coords.latitude, pos.coords.longitude])
      },
      () => setState({ status: "denied" }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  // 2) Load /api/map polygons
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/map", { cache: "no-store" })
        if (!res.ok) throw new Error("Map fetch failed")
        const json = (await res.json()) as MapApiResponse
        setZones(json.dangerZones ?? [])
      } catch {
        // If your backend is down, default to safe so app still works in MVP
        setZones([])
      }
    }
    load()
  }, [])

  // 3) Decide safe vs danger
  const inDanger = useMemo(() => {
    if (!userPoint) return false
    return zones.some((z) => pointInPolygon(userPoint, z.polygon))
  }, [userPoint, zones])

  useEffect(() => {
    if (!userPoint) return
    setState({ status: inDanger ? "danger" : "safe" })
  }, [userPoint, inDanger])

  // Loading / denied states (simple MVP)
  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 pb-24">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">Checking your location…</p>
          <p className="text-xs text-muted-foreground mt-1">This determines whether to show Crisis or Safe Mode.</p>
        </div>
      </div>
    )
  }

  if (state.status === "denied") {
    return (
      <div className="flex flex-col gap-4 px-4 py-4 pb-24">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm font-semibold text-foreground">Location needed</p>
          <p className="text-xs text-muted-foreground mt-1">
            Enable location to check whether you’re inside an active danger zone.
          </p>
        </div>

        {/* If location is denied, show SafeModePage as a non-blocking default */}
        <SafeModePage />
      </div>
    )
  }

  return state.status === "danger" ? <CrisisPage /> : <SafeModePage />
}