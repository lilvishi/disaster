"use client"

import { useState } from "react"
import { Heart, MessageCircle, ShieldCheck, HandHeart, Gift, HeartHandshake, MapPin, Users, ChevronRight, Send, AlertCircle } from "lucide-react"
import { communityPosts, volunteerLocations } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type ViewMode = "feed" | "help"

const typeConfig = {
  volunteer: { icon: HandHeart, color: "text-chart-5", bg: "bg-chart-5/15", label: "Volunteer" },
  donation: { icon: Gift, color: "text-accent", bg: "bg-accent/15", label: "Donate" },
  "send-love": { icon: HeartHandshake, color: "text-primary", bg: "bg-primary/15", label: "Send Love" },
}

export function CommunityPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("feed")

  return (
    <div className="flex flex-col gap-4 px-4 py-4 pb-24">
      {/* Toggle */}
      <div className="flex rounded-xl bg-secondary/50 p-1">
        <button
          onClick={() => setViewMode("feed")}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-xs font-medium transition-all",
            viewMode === "feed"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Community Feed
        </button>
        <button
          onClick={() => setViewMode("help")}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-xs font-medium transition-all",
            viewMode === "help"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Volunteer & Donate
        </button>
      </div>

      {viewMode === "feed" ? <CommunityFeed /> : <VolunteerSection />}
    </div>
  )
}

function CommunityFeed() {
  return (
    <div className="flex flex-col gap-3">
      {/* Post Composer */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
            <span className="text-xs font-bold text-primary">You</span>
          </div>
          <div className="flex-1 rounded-lg bg-secondary/50 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Share an update with your community...</span>
          </div>
          <button className="rounded-lg bg-primary px-3 py-2 transition-colors hover:bg-primary/90">
            <Send className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
      </div>

      {/* Posts */}
      {communityPosts.map((post) => (
        <article key={post.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
              post.type === "help-needed" ? "bg-primary/15" : "bg-secondary"
            )}>
              <span className={cn("text-xs font-bold", post.type === "help-needed" ? "text-primary" : "text-foreground")}>
                {post.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{post.author}</span>
                {post.verified && <ShieldCheck className="h-3 w-3 text-success" />}
                {post.type === "help-needed" && (
                  <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                    Help Needed
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{post.timestamp}</span>
            </div>
          </div>

          <p className="text-sm text-foreground leading-relaxed mt-3">{post.content}</p>

          {post.type === "image" && (
            <div className="mt-3 rounded-lg bg-secondary/50 h-40 flex items-center justify-center border border-border">
              <span className="text-xs text-muted-foreground">[ Community Photo ]</span>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="h-4 w-4" />
              <span className="text-xs">{post.likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.replies}</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function VolunteerSection() {
  return (
    <div className="flex flex-col gap-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {(["volunteer", "donation", "send-love"] as const).map((type) => {
          const config = typeConfig[type]
          const Icon = config.icon
          return (
            <button
              key={type}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <span className="text-xs font-medium text-foreground">{config.label}</span>
            </button>
          )
        })}
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          All listed organizations and donation sites have been verified. Report suspicious requests using the flag button.
        </p>
      </div>

      {/* Locations */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-foreground font-mono">Nearby Opportunities</h3>
        {volunteerLocations.map((loc) => {
          const config = typeConfig[loc.type]
          const Icon = config.icon
          return (
            <button
              key={loc.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-card/80"
            >
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground truncate">{loc.name}</h4>
                  {loc.needsHelp && (
                    <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Needs Help
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{loc.distance}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span className="text-xs">{loc.volunteers} volunteers</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{loc.address}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
