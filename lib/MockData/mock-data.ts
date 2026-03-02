import UCLAFire from "./ucla-fire.jpg"
import { StaticImageData } from "next/image"
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
  roadPath?: [number, number][]
  // Danger Zone fields
  acres?: number
  containmentPercent?: number
  rainfallInches?: number
  dangerLevel?: "active-threat" | "incoming" | "contained"
  // Shelter & Food Bank fields
  currentCapacity?: number
  maxCapacity?: number
  foodCondition?: "food condition stable" | "in shortage" | "critical shortage"
  contactInfo?: string
  safetyReports?: string[]
  // Crowd Report fields
  reportComment?: string
  isVerified?: boolean
  verificationCount?: number
  reportCount?: number
  // optional image for report
  imageUrl?: string | StaticImageData
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
  media?: StaticImageData
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
      description: "Pack medications, documents, water, phone charger, pet supplies and other important items you can’t live without",
    },
    {
      title: "Plan Your Route",
      description: "Check sites/apps like Google Maps or official evacuation maps for the best route",
    },
    {
      title: "Check On Neighbors",
      description: "Especially elderly, disabled, or those without transport.",
    },
    {
      title: "Register at Shelter",
      description: "Look up nearby shelters using local news or government websites before heading in",
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
    id: "3",
    lat: 34.0422,
    lng: -118.2437,
    type: "shelter",
    label: "Lincoln High School",
    status: "Open",
    currentCapacity: 312,
    maxCapacity: 500,
    foodCondition: "food condition stable",
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
    foodCondition: "in shortage",
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
    foodCondition: "food condition stable",
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
  // additional shelters
  {
    id: "s-1",
    lat: 34.0900,
    lng: -118.2700,
    type: "shelter",
    label: "Valley Community Center",
    status: "Open",
    currentCapacity: 150,
    maxCapacity: 400,
    foodCondition: "food condition stable",
    contactInfo: "555-0199",
  },
  {
    id: "s-2",
    lat: 34.0450,
    lng: -118.3050,
    type: "shelter",
    label: "Westside Gymnasium",
    status: "Open",
    currentCapacity: 80,
    maxCapacity: 300,
    foodCondition: "in shortage",
    contactInfo: "555-0188",
  },
  {
    id: "s-3",
    lat: 34.0320,
    lng: -118.2900,
    type: "shelter",
    label: "Downtown Church",
    status: "Near Full",
    currentCapacity: 290,
    maxCapacity: 300,
    foodCondition: "food condition stable",
    contactInfo: "555-0177",
  },
  {
    id: "s-4",
    lat: 34.1000,
    lng: -118.2400,
    type: "shelter",
    label: "Harbor High School",
    status: "Open",
    currentCapacity: 120,
    maxCapacity: 500,
    foodCondition: "food condition stable",
    contactInfo: "555-0166",
  },
  {
    id: "s-5",
    lat: 34.1200,
    lng: -118.2500,
    type: "shelter",
    label: "Pacific Arena",
    status: "Open",
    currentCapacity: 220,
    maxCapacity: 600,
    foodCondition: "food condition stable",
    contactInfo: "555-0155",
  },
  {
    id: "s-6",
    lat: 34.0700,
    lng: -118.3200,
    type: "shelter",
    label: "Metro Convention Center",
    status: "Open",
    currentCapacity: 400,
    maxCapacity: 1000,
    foodCondition: "food condition stable",
    contactInfo: "555-0140",
  },
  // food banks
  {
    id: "f-1",
    lat: 34.1100,
    lng: -118.2800,
    type: "food-bank",
    label: "Northside Food Bank",
    status: "Active",
    currentCapacity: 200,
    maxCapacity: 500,
    foodCondition: "food condition stable",
    contactInfo: "555-0133",
    safetyReports: [],
  },
  {
    id: "f-2",
    lat: 34.0400,
    lng: -118.2600,
    type: "food-bank",
    label: "Eastside Pantry",
    status: "Active",
    currentCapacity: 150,
    maxCapacity: 400,
    foodCondition: "food condition stable",
    contactInfo: "555-0122",
    safetyReports: [],
  },
  {
    id: "f-3",
    lat: 34.0800,
    lng: -118.3000,
    type: "food-bank",
    label: "Central Food Hub",
    status: "Active",
    currentCapacity: 300,
    maxCapacity: 600,
    foodCondition: "food condition stable",
    contactInfo: "555-0111",
    safetyReports: [],
  },
  {
    id: "f-4",
    lat: 34.0200,
    lng: -118.2450,
    type: "food-bank",
    label: "Southside Distribution",
    status: "Active",
    currentCapacity: 180,
    maxCapacity: 450,
    foodCondition: "food condition stable",
    contactInfo: "555-0100",
    safetyReports: [],
  },
  {
    id: "f-5",
    lat: 34.0500,
    lng: -118.3200,
    type: "food-bank",
    label: "Valley Relief Center",
    status: "Active",
    currentCapacity: 220,
    maxCapacity: 500,
    foodCondition: "food condition stable",
    contactInfo: "555-0099",
    safetyReports: [],
  },
  // volunteering spots
  {
    id: "v-1",
    lat: 34.1150,
    lng: -118.2650,
    type: "volunteer",
    label: "Beach Cleanup",
    status: "Active",
    volunteerNeeds: ["bags", "truck drivers"],
  },
  {
    id: "v-2",
    lat: 34.0300,
    lng: -118.3100,
    type: "volunteer",
    label: "Food Distribution",
    status: "Active",
    volunteerNeeds: ["streamers", "sign holders"],
  },
  {
    id: "v-3",
    lat: 34.1000,
    lng: -118.2950,
    type: "volunteer",
    label: "First Aid Tent",
    status: "Active",
    volunteerNeeds: ["nurses", "med students"],
  },
  {
    id: "v-4",
    lat: 34.0600,
    lng: -118.2400,
    type: "volunteer",
    label: "Pet Shelter Support",
    status: "Active",
    volunteerNeeds: ["pet handlers"],
  },
  {
    id: "v-5",
    lat: 34.0450,
    lng: -118.2700,
    type: "volunteer",
    label: "Toy Donation",
    status: "Active",
    volunteerNeeds: ["drivers"],
  },
  {
    id: "v-6",
    lat: 34.0750,
    lng: -118.2500,
    type: "volunteer",
    label: "Water Drop-off",
    status: "Active",
    volunteerNeeds: ["coolers", "volunteers"],
  },

  // UCLA / Westwood area (tracked resources, not a danger zone)
  {
    id: "ucla-s-1",
    lat: 34.0719,
    lng: -118.4490,
    type: "shelter",
    label: "Westwood Recreation Shelter",
    status: "Open",
    currentCapacity: 96,
    maxCapacity: 220,
    foodCondition: "food condition stable",
    contactInfo: "555-0210",
    safetyReports: [],
  },
  {
    id: "ucla-f-1",
    lat: 34.0667,
    lng: -118.4447,
    type: "food-bank",
    label: "UCLA Village Pantry",
    status: "Active",
    currentCapacity: 140,
    maxCapacity: 260,
    foodCondition: "food condition stable",
    contactInfo: "555-0211",
    safetyReports: [],
  },
  {
    id: "ucla-v-1",
    lat: 34.0705,
    lng: -118.4441,
    type: "volunteer",
    label: "Bruin Relief Volunteer Hub",
    status: "Active",
    volunteerNeeds: ["drivers", "supply sorters", "translators"],
  },
  {
    id: "ucla-r-1",
    lat: 34.0636,
    lng: -118.4478,
    type: "report",
    label: "Westwood Traffic Advisory",
    status: "Verified",
    reportComment: "Heavy emergency vehicle traffic near Wilshire/Westwood. Use alternate local streets.",
    isVerified: true,
    verificationCount: 12,
    reportCount: 0,
    reportCategory: "resource",
    userReportId: true,
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
    content: "You can see the fires from UCLA.",
    timestamp: "45 min ago",
    type: "image",
    media: UCLAFire,
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

export const safeModeData = {
  volunteerRegion: "Los Angeles",
  nearestDisaster: {
    type: "WILDFIRE",
    areaName: "Griffith Park area",
    riskLevel: "moderate" as const,
    distanceMiles: 6.8,
    lastUpdated: "12 min ago",
    shortDescription:
      "Smoke reported near the north ridge. Avoid trails, keep windows closed if you have respiratory sensitivity.",
  },
  volunteerOpportunities: [
    {
      id: "vol-1",
      title: "Supply sorting at West LA Warehouse",
      locationText: "West LA",
      timingText: "Today, 2–6 PM",
    },
    {
      id: "vol-2",
      title: "Sandbag filling – Elysian Valley",
      locationText: "Frogtown / Elysian Valley",
      timingText: "Tomorrow, 9 AM–1 PM",
    },
    {
      id: "vol-3",
      title: "Meal packing – Hollywood Community Kitchen",
      locationText: "Hollywood",
      timingText: "This weekend",
    },
  ],
}



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


// helper to convert meters to degrees latitude/longitude at a given latitude
function metersToDegLat(m: number) {
  return m / 111320
}
function metersToDegLng(m: number, lat: number) {
  return m / (111320 * Math.cos((lat * Math.PI) / 180))
}

// generate a roughly circular polygon with radial noise to simulate irregular wildfire perimeters
function generateIrregularPolygon(
  lat: number,
  lng: number,
  radiusMeters: number,
  points = 48,
  variance = 0.3
): [number, number][] {
  const coords: [number, number][] = []
  for (let i = 0; i < points; i++) {
    const theta = (i / points) * Math.PI * 2
    const rand = 1 + (Math.random() * 2 - 1) * variance
    const r = radiusMeters * rand
    const dy = Math.sin(theta) * r
    const dx = Math.cos(theta) * r
    coords.push([
      lat + metersToDegLat(dy),
      lng + metersToDegLng(dx, lat),
    ])
  }
  coords.push(coords[0]) // close ring
  return coords
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
    // make radius much larger and variance smaller relative to radius
    polygon: generateIrregularPolygon(34.0522, -118.2637, 3000, 80, 0.1),
  },
  {
    id: "dz-ucla",
    name: "UCLA / Westwood Threat Zone",
    type: "fire",
    color: "#f97316",
    dangerLevel: "incoming",
    acres: 950,
    containmentPercent: 5,
    polygon: generateIrregularPolygon(34.0709, -118.4441, 1700, 72, 0.12),
  },
]

// For tracking user-submitted reports in localStorage
export interface VerificationState {
  reportId: string
  isVerified: boolean
  verificationCount: number
  reportCount: number
}
