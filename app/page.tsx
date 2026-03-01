"use client"

import { useEffect, useMemo, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { CrisisPage } from "@/components/crisis-page"
import { SafeModePage } from "@/components/safe-page"
import { CompassPage } from "@/components/compass-page"
import { CommsPage } from "@/components/comms-page"
import { CommunityPage } from "@/components/community-page"
import { dangerZones } from "@/lib/mock-data"

type LocationStatus = "loading" | "denied" | "ready"

function pointInPolygon(point: [number, number], polygon: Array<[number, number]>) {
  // Ray casting algorithm (fine for local polygons)
  const [x, y] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0.0) + xi
    if (intersect) inside = !inside
  }

  return inside
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("crisis")
  const [compassPreset, setCompassPreset] = useState<"all" | "volunteer" | "shelter">("all")

  const [locationStatus, setLocationStatus] = useState<LocationStatus>("loading")
  const [userPoint, setUserPoint] = useState<[number, number] | null>(null)

  // Request geolocation once on app load
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPoint([pos.coords.latitude, pos.coords.longitude])
        setLocationStatus("ready")
      },
      () => {
        setLocationStatus("denied")
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const isInDangerZone = useMemo(() => {
    if (!userPoint) return false
    return dangerZones.some((z) => z.polygon.length >= 3 && pointInPolygon(userPoint, z.polygon))
  }, [userPoint])

  function openCompassAll() {
    setCompassPreset("all")
    setActiveTab("compass")
  }

  function openCompassVolunteers() {
    setCompassPreset("volunteer")
    setActiveTab("compass")
  }

  function openCompassShelters() {
    setCompassPreset("shelter")
    setActiveTab("compass")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <AppHeader />

      <main className="flex-1">
        {activeTab === "crisis" && (
          <>
            {locationStatus === "loading" && (
              <div className="flex flex-col gap-4 px-4 py-4 pb-24">
                <div className="rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">Checking your location…</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This determines whether to show Crisis Mode or Safe Mode.
                  </p>
                </div>
              </div>
            )}

            {locationStatus === "denied" && (
              <SafeModePage onViewMap={openCompassAll} onVolunteer={openCompassVolunteers} onFindShelter={openCompassShelters} />
            )}

            {locationStatus === "ready" && (
              isInDangerZone ? (
                <CrisisPage />
              ) : (
                <SafeModePage onViewMap={openCompassAll} onVolunteer={openCompassVolunteers} onFindShelter={openCompassShelters} />
              )
            )}
          </>
        )}

        {activeTab === "compass" && <CompassPage preset={compassPreset} />}

        {activeTab === "comms" && <CommsPage />}
        {activeTab === "community" && <CommunityPage />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}