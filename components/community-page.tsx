"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MessageCircle, ShieldCheck, HandHeart, Gift, HeartHandshake, MapPin, Users, ChevronRight, Send, AlertCircle, ArrowUp, ArrowDown, Flag, Image as ImageIcon, Video, ExternalLink } from "lucide-react"
import { communityPosts, volunteerLocations } from "@/lib/MockData/mock-data"
import { cn } from "@/lib/utils"

type ViewMode = "feed" | "help"

const typeConfig = {
  volunteer: { icon: HandHeart, color: "text-chart-5", bg: "bg-chart-5/15", label: "Volunteer" },
  donation: { icon: Gift, color: "text-accent", bg: "bg-accent/15", label: "Donate" },
  "send-love": { icon: HeartHandshake, color: "text-primary", bg: "bg-primary/15", label: "Send Love" },
}

const laResourceLinks = [
  {
    id: "food-bank",
    name: "Los Angeles Regional Food Bank",
    category: "Food Security",
    summary: "Donate food or funds to support local food insecurity.",
    href: "https://www.lafoodbank.org/",
    type: "donation" as const,
  },
  {
    id: "food-oasis",
    name: "Food Oasis LA",
    category: "Food Security",
    summary: "Find trusted meal and pantry resources across LA.",
    href: "https://foodoasis.la/",
    type: "donation" as const,
  },
  {
    id: "midnight-mission",
    name: "The Midnight Mission",
    category: "Homelessness & Housing",
    summary: "Support Skid Row services with clothing, household items, and funds.",
    href: "https://www.midnightmission.org/",
    type: "donation" as const,
  },
  {
    id: "dwc",
    name: "Downtown Women's Center",
    category: "Homelessness & Housing",
    summary: "Donate essentials and support long-term housing services for women.",
    href: "https://downtownwomenscenter.org/",
    type: "donation" as const,
  },
  {
    id: "direct-relief",
    name: "Direct Relief",
    category: "Disaster Relief",
    summary: "Supports wildfire and emergency response with medical aid.",
    href: "https://www.directrelief.org/",
    type: "volunteer" as const,
  },
  {
    id: "ccf",
    name: "California Community Foundation",
    category: "Disaster Relief",
    summary: "Contribute to LA-area disaster recovery and community resilience funds.",
    href: "https://www.calfund.org/",
    type: "donation" as const,
  },
  {
    id: "core",
    name: "CORE",
    category: "Disaster Relief",
    summary: "Supports immediate wildfire response and recovery operations.",
    href: "https://www.coreresponse.org/",
    type: "volunteer" as const,
  },
  {
    id: "mutual-aid",
    name: "Mutual Aid LA Network",
    category: "Community Aid",
    summary: "Community-driven aid requests and volunteer coordination.",
    href: "https://www.mutualaidla.org/",
    type: "send-love" as const,
  },
]

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
  // type for post augmented with vote counts
  type PostWithVotes = (typeof communityPosts)[number] & {
    upvotes: number
    downvotes: number
    userVote: "up" | "down" | null
    reportCount: number
    userReported: boolean
    mediaPreview?: string
  }

  // keep posts in state so we can mutate comments locally
  const [posts, setPosts] = useState<PostWithVotes[]>(
    communityPosts.map(p => ({
      ...p,
      upvotes: (p as any).upvotes ?? (p as any).likes ?? 0,
      downvotes: 0,
      userVote: null,
      reportCount: (p as any).reportCount ?? 0,
      userReported: false,
    }))
  )

  // track composer input
  const [newPostContent, setNewPostContent] = useState("")
  const [mediaType, setMediaType] = useState<"photo" | "video" | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})

  // helper: send a message to service worker to show notification
  const triggerNotification = (title: string, body: string) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        icon: '/icons/icon-192.jpg',
      })
    } else {
      // Fallback: show notification directly if service worker not available
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/icons/icon-192.jpg',
        })
      }
    }
  }

  // handler for the "Test Push" button: show permission status, request if needed, then send notification
  const handleTestPush = async () => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted') {
        const perm = await Notification.requestPermission()
        alert('Notification permission: ' + perm)
      } else {
        alert('Notification permission: ' + Notification.permission)
      }
    } else {
      alert('Notifications are not supported in this browser.')
    }

    // trigger even if denied; triggerNotification will fallback or do nothing
    triggerNotification('Fire near your area', 'An urgent update was posted to your community.')
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "video") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string)
        setMediaType(type)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearMedia = () => {
    setMediaType(null)
    setMediaPreview(null)
  }

  const handleInputChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }))
  }

  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p
        const newComment = {
          id: Date.now().toString(),
          author: "You",
          content: text,
        }
        return {
          ...p,
          comments: [...(p.comments ?? []), newComment],
          replies: (p.replies ?? 0) + 1,
        }
      })
    )
    setCommentInputs(prev => ({ ...prev, [postId]: "" }))
  }

  const deleteComment = (postId: string, commentId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p
        const newComments = (p.comments ?? []).filter(c => c.id !== commentId)
        return {
          ...p,
          comments: newComments,
          replies: Math.max(0, (p.replies ?? 0) - 1),
        }
      })
    )
  }

  // helper: request permission (if needed) and show a notification
  const notifyForUpdate = async () => {
    try {
      if (typeof window === "undefined" || !("Notification" in window)) return
      if (Notification.permission === "granted") {
        new Notification("Fire near your area", {
          body: "An urgent update was posted to your community.",
          icon: "/icons/icon-192.jpg",
        })
        return
      }
      if (Notification.permission !== "denied") {
        const perm = await Notification.requestPermission()
        if (perm === "granted") {
          new Notification("Fire near your area", {
            body: "An urgent update was posted to your community.",
            icon: "/icons/icon-192.jpg",
          })
        }
      }
    } catch (e) {
      // ignore notification errors in unsupported environments
      // console.warn(e)
    }
  }

  const addPost = () => {
    const text = newPostContent.trim()
    if (!text) return
    const newPost: PostWithVotes = {
      id: Date.now().toString(),
      author: "You",
      avatar: "You",
      content: text,
      timestamp: "Just now",
      type: mediaType === "photo" ? "image" : mediaType === "video" ? "video" : ("text" as const),
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      verified: false,
      userVote: null,
      comments: [] as any[],
      reportCount: 0,
      userReported: false,
      mediaPreview: mediaPreview || undefined,
    }
    setPosts(prev => [newPost, ...prev])

    // trigger notification when the post text equals exactly "update"
    if (text.toLowerCase() === "update") {
      // delay 10 seconds then show notification via service worker
      setTimeout(() => {
        triggerNotification("Fire near your area", "An urgent update was posted to your community.")
      }, 1000)
    }
    setNewPostContent("")
    setMediaType(null)
    setMediaPreview(null)
  }

  const toggleReport = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p
        if (p.userReported) {
          return { ...p, userReported: false, reportCount: Math.max(0, p.reportCount - 1) }
        }
        return { ...p, userReported: true, reportCount: p.reportCount + 1 }
      })
    )
  }

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const handleUpvote = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p
        const up = p.upvotes ?? 0
        const down = p.downvotes ?? 0
        if (p.userVote === "up") {
          return { ...p, upvotes: up - 1, userVote: null }
        }
        if (p.userVote === "down") {
          return { ...p, upvotes: up + 1, downvotes: Math.max(0, down - 1), userVote: "up" }
        }
        return { ...p, upvotes: up + 1, userVote: "up" }
      })
    )
  }

  const handleDownvote = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id !== postId) return p
        const up = p.upvotes ?? 0
        const down = p.downvotes ?? 0
        if (p.userVote === "down") {
          return { ...p, downvotes: down - 1, userVote: null }
        }
        if (p.userVote === "up") {
          return { ...p, downvotes: down + 1, upvotes: Math.max(0, up - 1), userVote: "down" }
        }
        return { ...p, downvotes: down + 1, userVote: "down" }
      })
    )
  }

  // sorting mode state
  const [sortMode, setSortMode] = useState<"recent" | "top">("recent")

  // register service worker (one-time)
  useEffect(() => {
    const registerSW = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registered:', reg)
          
          // Wait for service worker to be ready
          await navigator.serviceWorker.ready
          console.log('Service Worker is ready')
          
          // request notification permission when service worker registers
          if ('Notification' in window && Notification.permission === 'default') {
            const perm = await Notification.requestPermission()
            console.log('Notification permission:', perm)
          }
        }
      } catch (e) {
        console.error('Failed to register service worker:', e)
      }
    }
    void registerSW()
  }, [])

  // derive sorted posts based on mode
  const sortedPosts =
    sortMode === "recent"
      ? posts
      : [...posts].sort((a, b) => {
          const scoreA = (a.upvotes ?? 0) - (a.downvotes ?? 0)
          const scoreB = (b.upvotes ?? 0) - (b.downvotes ?? 0)
          return scoreB - scoreA
        })

  return (
    <div className="flex flex-col gap-3">
      {/* Post Composer */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
            <span className="text-xs font-bold text-primary">You</span>
          </div>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                addPost()
              }
            }}
            className="flex-1 rounded-lg bg-secondary/50 px-3 py-2.5 text-xs resize-none"
            placeholder="Share an update with your community..."
          />
          <button
            onClick={addPost}
            className="rounded-lg bg-primary px-3 py-2 transition-colors hover:bg-primary/90"
          >
            <Send className="h-4 w-4 text-primary-foreground" />
          </button>
        </div>
        {/* Media preview and upload buttons */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-xs">
            <ImageIcon className="h-4 w-4" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleMediaUpload(e, "photo")}
              className="hidden"
            />
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground transition-colors text-xs">
            <Video className="h-4 w-4" />
            <span>Video</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleMediaUpload(e, "video")}
              className="hidden"
            />
          </label>
          {mediaPreview && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-primary">{mediaType === "photo" ? "📷" : "🎥"} {mediaType}</span>
              <button
                onClick={clearMedia}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        {/* Media preview */}
        {mediaPreview && (
          <div className="mt-3 rounded-lg overflow-hidden border border-border">
            {mediaType === "photo" ? (
              <img
                src={mediaPreview}
                alt="preview"
                className="w-full h-auto max-h-40 object-cover"
              />
            ) : (
              <video
                src={mediaPreview}
                className="w-full h-auto max-h-40 object-cover"
                controls
              />
            )}
          </div>
        )}
      </div>

      {/* Sorting */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setSortMode("recent")}
          className={cn(
            "rounded-lg px-3 py-1",
            sortMode === "recent"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Most Recent
        </button>
        <button
          onClick={() => setSortMode("top")}
          className={cn(
            "rounded-lg px-3 py-1",
            sortMode === "top"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Most Upvotes
        </button>
        <button
          onClick={handleTestPush}
          className={cn(
            "rounded-lg px-3 py-1 text-xs",
            "bg-card text-foreground shadow-sm"
          )}
        >
          Test Push
        </button>
        {/* <button
          onClick={async () => {
            try {
              await fetch('/api/send-push', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'Test: Fire near your area', body: 'This is a test push message.' }),
              })
              alert('Test push requested (server will attempt to send to saved subscriptions)')
            } catch (e) {
              alert('Failed to request test push')
            }
          }}
          className={cn("rounded-lg px-3 py-1 text-xs", pushSubscribed ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground')}
        >
          Send Test Push
        </button> */}
      </div>

      {/* Posts */}
      {sortedPosts.map((post) => (
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
            {post.author === "You" && (
              <button
                onClick={() => deletePost(post.id)}
                className="ml-auto text-red-500 text-xs"
              >
                Delete
              </button>
            )}
          </div>

          <p className="text-sm text-foreground leading-relaxed mt-3">{post.content}</p>

          {(post.type === "image" || post.type === "video") && (
            <div className="mt-3 rounded-lg overflow-hidden border border-border bg-secondary/50">
              {post.mediaPreview ? (
                post.type === "image" ? (
                  <img src={post.mediaPreview} alt="post media" className="w-full h-auto max-h-128 object-cover" />
                ) : (
                  <video src={post.mediaPreview} controls className="w-full h-auto max-h-64 object-cover" />
                )
              ) : post.media ? (
                <Image src={post.media} alt="post media" className="w-full h-auto max-h-128 object-cover" />
              ) : (
                <div className="h-40 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">[ {post.type === "image" ? "Photo" : "Video"} ]
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <button
              onClick={() => handleUpvote(post.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                post.userVote === "up"
                  ? "text-green-500"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <ArrowUp className="h-4 w-4" />
              <span className="text-xs">{post.upvotes}</span>
            </button>
            <button
              onClick={() => handleDownvote(post.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                post.userVote === "down"
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-destructive"
              )}
            >
              <ArrowDown className="h-4 w-4" />
              <span className="text-xs">{post.downvotes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{post.replies}</span>
            </button>
            <button
              onClick={() => toggleReport(post.id)}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                post.userReported ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-600"
              )}
            >
              <Flag className="h-4 w-4" />
              <span className="text-xs">{post.reportCount}</span>
            </button>
          </div>

          {/* comments list */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-2 space-y-2">
              {post.comments.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    <strong>{c.author}:</strong> {c.content}
                  </span>
                  <button
                    onClick={() => deleteComment(post.id, c.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* new comment input */}
          <div className="mt-2 flex items-center gap-2">
            <input
              value={commentInputs[post.id] || ""}
              onChange={(e) => handleInputChange(post.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addComment(post.id)
                }
              }}
              className="flex-1 rounded-md border px-2 py-1 text-xs"
              placeholder="Write a comment..."
            />
            <button
              onClick={() => addComment(post.id)}
              className="text-primary text-xs font-medium"
            >
              Post
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function VolunteerSection() {
  const quickActionLinks = {
    volunteer: "https://www.coreresponse.org/",
    donation: "https://www.lafoodbank.org/",
    "send-love": "https://www.mutualaidla.org/",
  } as const

  return (
    <div className="flex flex-col gap-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3">
        {(["volunteer", "donation", "send-love"] as const).map((type) => {
          const config = typeConfig[type]
          const Icon = config.icon
          return (
            <a
              key={type}
              href={quickActionLinks[type]}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
            >
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <span className="text-xs font-medium text-foreground">{config.label}</span>
            </a>
          )
        })}
      </div>

      {/* Info card */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          All listed organizations and donation sites have been verified. Report suspicious requests to{" "}
          <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noreferrer">
            https://reportfraud.ftc.gov/
          </a>
          .
        </p>
      </div>

      {/* Resource links */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-foreground font-mono">Top LA Resource Links</h3>
        {laResourceLinks.map((resource) => {
          const config = typeConfig[resource.type]
          const Icon = config.icon
          return (
            <a
              key={resource.id}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:bg-card/80"
            >
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", config.bg)}>
                <Icon className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground truncate">{resource.name}</h4>
                  <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {resource.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">Los Angeles</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{resource.summary}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
