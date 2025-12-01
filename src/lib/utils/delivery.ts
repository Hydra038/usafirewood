/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculate delivery fee based on distance
 */
export function calculateDeliveryFee(distanceMiles: number): number {
  const baseFee = parseFloat(process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE || '15');
  const perMileFee = parseFloat(process.env.NEXT_PUBLIC_PER_MILE_FEE || '2');

  if (distanceMiles <= 10) {
    return baseFee;
  }

  return baseFee + (distanceMiles - 10) * perMileFee;
}

/**
 * Check if delivery is available to a location
 */
export function isDeliveryAvailable(distanceMiles: number): boolean {
  const maxRadius = parseFloat(process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES || '50');
  return distanceMiles <= maxRadius;
}

/**
 * Get coordinates from ZIP code (using a geocoding service)
 * This is a placeholder - in production, use a real geocoding API
 */
export async function getCoordinatesFromZip(
  zipCode: string
): Promise<{ lat: number; lng: number } | null> {
  // TODO: Integrate with a real geocoding API (Google Maps, Mapbox, etc.)
  // For now, return null - implement this based on your chosen service
  console.warn('Geocoding not implemented. Please add a geocoding service.');
  return null;
}

/**
 * Validate ZIP code format
 */
export function isValidZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}
