"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { BottomNav, type TabId } from "@/components/bottom-nav"
import { CrisisPage } from "@/components/crisis-page"
import { CompassPage } from "@/components/compass-page"
import { CommsPage } from "@/components/comms-page"
import { CommunityPage } from "@/components/community-page"

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("crisis")

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AppHeader />
      <main className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "crisis" && <CrisisPage />}
        {activeTab === "compass" && <CompassPage />}
        {activeTab === "comms" && <CommsPage />}
        {activeTab === "community" && <CommunityPage />}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
