export interface CrisisData {
  disasterType: string
  riskLevel: "critical" | "high" | "moderate" | "low"
  location: string
  lastUpdated: string
  evacuationStatus: "mandatory" | "advisory" | "shelter-in-place" | "none"
  immediateActions: string[]
  steps: { title: string; description: string }[]
}

export interface MapMarker {
  id: string
  lat: number
  lng: number
  type: "danger" | "shelter" | "volunteer" | "food-bank" | "report" | "road-closed"
  label: string
  details?: string
  status?: string
  // Danger Zone fields
  acres?: number
  containmentPercent?: number
  rainfallInches?: number
  dangerLevel?: "active-threat" | "incoming" | "contained"
  // Shelter & Food Bank fields
  currentCapacity?: number
  maxCapacity?: number
  foodCondition?: "stable" | "shortage" | "critical"
  contactInfo?: string
  safetyReports?: string[]
  // Crowd Report fields
  reportComment?: string
  isVerified?: boolean
  verificationCount?: number
  reportCount?: number
  reportCategory?: "hazard" | "help" | "resource"
  // Volunteer fields
  volunteerNeeds?: string[]
  // Shared
  userReportId?: boolean // Indicates if this is a user-submitted report
}

export interface NewsItem {
  id: string
  source: string
  title: string
  summary: string
  timestamp: string
  category: "government" | "weather" | "news" | "emergency"
  isOfficial: boolean
}

export interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  windDirection: string
  alerts: { severity: string; title: string; description: string }[]
}

export interface CommunityPost {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  type: "image" | "video" | "text" | "help-needed"
  media?: string
  // vote counts instead of simple likes
  upvotes: number
  downvotes: number
  replies: number
  verified: boolean
  userVote?: "up" | "down" | null
  // how many times community has flagged for misinformation
  reportCount?: number
  // comments that have been added locally
  comments?: { id: string;
              author: string;
              content: string }[]
}

export interface VolunteerLocation {
  id: string
  name: string
  address: string
  distance: string
  needsHelp: boolean
  volunteers: number
  type: "volunteer" | "donation" | "send-love"
}

export const crisisData: CrisisData = {
  disasterType: "Wildfire",
  riskLevel: "critical",
  location: "Los Angeles County, CA",
  lastUpdated: "2 min ago",
  evacuationStatus: "mandatory",
  immediateActions: [
    "Evacuate immediately if in designated zones",
    "Close all windows and doors if sheltering",
    "Wear N95 masks outdoors due to smoke",
    "Keep vehicle fueled and facing exit direction",
  ],
  steps: [
    {
      title: "Gather Essentials",
      description: "Medications, documents, water, phone charger, pet supplies",
    },
    {
      title: "Plan Your Route",
      description: "Use designated evacuation routes. Avoid Canyon Rd and Mulholland Dr.",
    },
    {
      title: "Check On Neighbors",
      description: "Especially elderly, disabled, or those without transport.",
    },
    {
      title: "Register at Shelter",
      description: "Check in at Lincoln High School or Pacific Community Center.",
    },
  ],
}

export const mapMarkers: MapMarker[] = [
  {
    id: "1",
    lat: 34.0522,
    lng: -118.2637,
    type: "danger",
    label: "Active Fire Zone",
    status: "Active",
    dangerLevel: "active-threat",
    acres: 3200,
    containmentPercent: 20,
    details: "3,200 acres, 20% contained",
  },
  {
    id: "2",
    lat: 34.0622,
    lng: -118.2837,
    type: "danger",
    label: "Fire Spread Zone",
    status: "Warning",
    dangerLevel: "incoming",
    acres: 1500,
    containmentPercent: 0,
    details: "Expected to reach area by 6PM",
  },
  {
    id: "3",
    lat: 34.0422,
    lng: -118.2437,
    type: "shelter",
    label: "Lincoln High School",
    status: "Open",
    currentCapacity: 312,
    maxCapacity: 500,
    foodCondition: "stable",
    contactInfo: "555-0142",
    safetyReports: ["meow", "meow"],
  },
  {
    id: "4",
    lat: 34.0322,
    lng: -118.2837,
    type: "shelter",
    label: "Pacific Community Center",
    status: "Near Full",
    currentCapacity: 289,
    maxCapacity: 300,
    foodCondition: "shortage",
    contactInfo: "555-0143",
    safetyReports: ["meow"],
  },
  {
    id: "5",
    lat: 34.0722,
    lng: -118.2537,
    type: "food-bank",
    label: "Red Cross Food Station",
    status: "Active",
    currentCapacity: 100,
    maxCapacity: 150,
    foodCondition: "stable",
    contactInfo: "555-0144",
    safetyReports: ["meow"],
  },
  {
    id: "6",
    lat: 34.0622,
    lng: -118.2337,
    type: "volunteer",
    label: "Volunteer Rally Point",
    status: "Active",
    volunteerNeeds: ["drivers", "translators", "meow"],
  },
  {
    id: "7",
    lat: 34.0522,
    lng: -118.3037,
    type: "road-closed",
    label: "Canyon Rd Closed",
    details: "Fire damage, no access",
  },
  {
    id: "8",
    lat: 34.0472,
    lng: -118.2737,
    type: "report",
    label: "Supply Shortage Report",
    status: "Unverified",
    reportComment: "Water bottles running low at shelter",
    isVerified: false,
    verificationCount: 0,
    reportCount: 0,
    reportCategory: "help",
    userReportId: true,
  },
]

export const newsItems: NewsItem[] = [
  {
    id: "1",
    source: "LA County Emergency Mgmt",
    title: "Mandatory Evacuation Extended to Zone 4",
    summary: "Residents in Zone 4 must evacuate immediately. The fire has jumped containment lines near Topanga Canyon. National Guard deployed to assist.",
    timestamp: "5 min ago",
    category: "government",
    isOfficial: true,
  },
  {
    id: "2",
    source: "National Weather Service",
    title: "Red Flag Warning Extended Through Thursday",
    summary: "Santa Ana winds expected to increase to 60mph overnight. Extremely critical fire weather conditions. Humidity dropping to 5%.",
    timestamp: "18 min ago",
    category: "weather",
    isOfficial: true,
  },
  {
    id: "3",
    source: "FEMA",
    title: "Federal Disaster Declaration Approved",
    summary: "President has approved a major disaster declaration for LA County. Federal assistance now available for affected individuals.",
    timestamp: "1 hour ago",
    category: "government",
    isOfficial: true,
  },
  {
    id: "4",
    source: "ABC7 Los Angeles",
    title: "Evacuation Shelters Reaching Capacity",
    summary: "Several evacuation shelters in the western corridor are approaching full capacity. Officials opening additional sites at local schools.",
    timestamp: "2 hours ago",
    category: "news",
    isOfficial: false,
  },
  {
    id: "5",
    source: "CAL FIRE",
    title: "Fire Now 20% Contained - 3,200 Acres Burned",
    summary: "Firefighters made progress on the southern flank overnight. Structure protection remains the priority. 1,200 firefighters deployed.",
    timestamp: "3 hours ago",
    category: "emergency",
    isOfficial: true,
  },
  {
    id: "6",
    source: "LA Water & Power",
    title: "Boil Water Advisory for Affected Areas",
    summary: "Water pressure loss in evacuation zones may have compromised supply. Boil water before drinking in zones 2-4.",
    timestamp: "4 hours ago",
    category: "government",
    isOfficial: true,
  },
]

export const weatherData: WeatherData = {
  temperature: 94,
  condition: "Hazy / Smoky",
  humidity: 8,
  windSpeed: 45,
  windDirection: "NE",
  alerts: [
    {
      severity: "Extreme",
      title: "Red Flag Warning",
      description: "Critical fire weather through Thursday. Santa Ana winds 40-65mph with gusts to 80mph.",
    },
    {
      severity: "High",
      title: "Air Quality Alert",
      description: "AQI exceeds 200 (Very Unhealthy). Limit outdoor exposure. Use N95 masks.",
    },
  ],
}

export const communityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "Maria Santos",
    avatar: "MS",
    content: "Just evacuated from Zone 3. Roads are clear on Pacific Coast Highway heading south. Stay safe everyone.",
    timestamp: "8 min ago",
    type: "text",
    upvotes: 47,
    downvotes: 0,
    replies: 0,
    verified: true,
    userVote: null,
    reportCount: 0,
    comments: [],
  },
  {
    id: "2",
    author: "David Chen",
    avatar: "DC",
    content: "Lincoln High shelter has water but running low on blankets. If anyone can bring extras, please do.",
    timestamp: "22 min ago",
    type: "help-needed",
    upvotes: 89,
    downvotes: 0,
    replies: 0,
    verified: true,
    userVote: null,
    reportCount: 0,
    comments: [],
  },
  {
    id: "3",
    author: "Sarah Johnson",
    avatar: "SJ",
    content: "View from Griffith Observatory - the fire line is visible from here. Praying for our firefighters.",
    timestamp: "45 min ago",
    type: "image",
    upvotes: 234,
    downvotes: 0,
    replies: 0,
    verified: false,
    userVote: null,
    reportCount: 0,
    comments: [],
  },
  {
    id: "4",
    author: "James Park",
    avatar: "JP",
    content: "Free rides available for elderly residents needing evacuation from Brentwood area. Call 555-0142.",
    timestamp: "1 hour ago",
    type: "help-needed",
    upvotes: 312,
    downvotes: 0,
    replies: 0,
    verified: true,
    userVote: null,
    reportCount: 0,
    comments: [],
  },
  {
    id: "5",
    author: "Ana Rivera",
    avatar: "AR",
    content: "Pet-friendly shelter confirmed at Venice Beach Rec Center. They have kennels and pet food available.",
    timestamp: "2 hours ago",
    type: "text",
    upvotes: 178,
    downvotes: 0,
    replies: 0,
    verified: true,
    userVote: null,
    reportCount: 0,
    comments: [],
  },
]

export const volunteerLocations: VolunteerLocation[] = [
  {
    id: "1",
    name: "Red Cross Relief Center",
    address: "450 S Main St",
    distance: "0.8 mi",
    needsHelp: true,
    volunteers: 24,
    type: "volunteer",
  },
  {
    id: "2",
    name: "LA Food Bank Station",
    address: "1734 E 41st St",
    distance: "1.2 mi",
    needsHelp: true,
    volunteers: 12,
    type: "donation",
  },
  {
    id: "3",
    name: "Community Love Wall",
    address: "Lincoln High School",
    distance: "2.1 mi",
    needsHelp: false,
    volunteers: 45,
    type: "send-love",
  },
  {
    id: "4",
    name: "Animal Rescue Coordination",
    address: "Venice Beach Rec Center",
    distance: "3.4 mi",
    needsHelp: true,
    volunteers: 8,
    type: "volunteer",
  },
]

// Danger zone boundaries as GeoJSON polygons
export interface DangerZone {
  id: string
  name: string
  type: "fire" | "flood" | "storm"
  color: string
  polygon: [number, number][] // [lat, lng] pairs
  dangerLevel: "active-threat" | "incoming" | "contained"
  acres: number
  containmentPercent: number
}

export const dangerZones: DangerZone[] = [
  {
    id: "dz-1",
    name: "Active Fire Zone",
    type: "fire",
    color: "#ef4444",
    dangerLevel: "active-threat",
    acres: 3200,
    containmentPercent: 20,
    polygon: [
      [34.0522, -118.2637],
      [34.0620, -118.2637],
      [34.0620, -118.2540],
      [34.0522, -118.2540],
      [34.0522, -118.2637],
    ],
  },
  {
    id: "dz-2",
    name: "Fire Spread Zone",
    type: "fire",
    color: "#f59e0b",
    dangerLevel: "incoming",
    acres: 1500,
    containmentPercent: 0,
    polygon: [
      [34.0622, -118.2837],
      [34.0750, -118.2837],
      [34.0750, -118.2700],
      [34.0622, -118.2700],
      [34.0622, -118.2837],
    ],
  },
]

// For tracking user-submitted reports in localStorage
export interface VerificationState {
  reportId: string
  isVerified: boolean
  verificationCount: number
  reportCount: number
}
