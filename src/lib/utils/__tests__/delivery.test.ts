import { calculateDistance, calculateDeliveryFee, isDeliveryAvailable } from '@/lib/utils/delivery';

describe('Delivery Utils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      // New York to Los Angeles (approx 2451 miles)
      const distance = calculateDistance(40.7128, -74.0060, 34.0522, -118.2437);
      expect(distance).toBeGreaterThan(2400);
      expect(distance).toBeLessThan(2500);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });

    it('should handle coordinates near equator', () => {
      const distance = calculateDistance(0, 0, 0, 1);
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe('calculateDeliveryFee', () => {
    // Set environment variables for testing
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      process.env.NEXT_PUBLIC_BASE_DELIVERY_FEE = '15';
      process.env.NEXT_PUBLIC_PER_MILE_FEE = '2';
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return base fee for distances under 10 miles', () => {
      expect(calculateDeliveryFee(5)).toBe(15);
      expect(calculateDeliveryFee(10)).toBe(15);
    });

    it('should add per-mile fee for distances over 10 miles', () => {
      expect(calculateDeliveryFee(15)).toBe(15 + 5 * 2); // 25
      expect(calculateDeliveryFee(20)).toBe(15 + 10 * 2); // 35
    });

    it('should handle decimal distances', () => {
      expect(calculateDeliveryFee(12.5)).toBe(15 + 2.5 * 2); // 20
    });
  });

  describe('isDeliveryAvailable', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      process.env.NEXT_PUBLIC_MAX_DELIVERY_RADIUS_MILES = '50';
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should return true for distances within radius', () => {
      expect(isDeliveryAvailable(25)).toBe(true);
      expect(isDeliveryAvailable(50)).toBe(true);
    });

    it('should return false for distances beyond radius', () => {
      expect(isDeliveryAvailable(51)).toBe(false);
      expect(isDeliveryAvailable(100)).toBe(false);
    });

    it('should return true for zero distance', () => {
      expect(isDeliveryAvailable(0)).toBe(true);
    });
  });
});
