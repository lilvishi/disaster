export type LatLng = [number, number]

const LOS_ANGELES_TRACK_CENTER: LatLng = [34.0522, -118.2437]
const LOS_ANGELES_TRACK_RADIUS_METERS = 42000

function isSamePoint(a: LatLng, b: LatLng) {
  return a[0] === b[0] && a[1] === b[1]
}

function closeRing(path: LatLng[]): LatLng[] {
  if (path.length === 0) return path
  const first = path[0]
  const last = path[path.length - 1]
  if (isSamePoint(first, last)) return path
  return [...path, first]
}

function metersToDegLat(meters: number) {
  return meters / 111320
}

function metersToDegLng(meters: number, lat: number) {
  return meters / (111320 * Math.cos((lat * Math.PI) / 180))
}

export function pointInPolygon(point: LatLng, polygon: LatLng[]) {
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

export function createCoverageCircle(center: LatLng, radiusMeters: number, points = 32): LatLng[] {
  const [lat, lng] = center
  const ring: LatLng[] = []

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * Math.PI * 2
    const dy = Math.sin(theta) * radiusMeters
    const dx = Math.cos(theta) * radiusMeters
    ring.push([lat + metersToDegLat(dy), lng + metersToDegLng(dx, lat)])
  }

  return closeRing(ring)
}

export function getTrackedCoverageRings() {
  const laRing = createCoverageCircle(LOS_ANGELES_TRACK_CENTER, LOS_ANGELES_TRACK_RADIUS_METERS, 40)
  return [laRing]
}

export function isPointTracked(point: LatLng) {
  const trackedRings = getTrackedCoverageRings()
  return trackedRings.some((ring) => pointInPolygon(point, ring))
}
