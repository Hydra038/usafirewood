import { formatCurrency, formatDate, slugify } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format numbers as USD currency', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0.99)).toBe('$0.99');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle large numbers', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });
  });

  describe('formatDate', () => {
    it('should format date strings', () => {
      const date = '2024-01-15';
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2024');
    });

    it('should format Date objects', () => {
      const date = new Date('2024-12-25');
      const formatted = formatDate(date);
      expect(formatted).toContain('December');
      expect(formatted).toContain('25');
      expect(formatted).toContain('2024');
    });
  });

  describe('slugify', () => {
    it('should convert text to URL-friendly slugs', () => {
      expect(slugify('Premium Oak Firewood')).toBe('premium-oak-firewood');
      expect(slugify('Hello World!')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Test & Product #1')).toBe('test-product-1');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces   Here')).toBe('multiple-spaces-here');
    });

    it('should handle uppercase', () => {
      expect(slugify('UPPERCASE TEXT')).toBe('uppercase-text');
    });

    it('should trim whitespace', () => {
      expect(slugify('  trim me  ')).toBe('trim-me');
    });
  });
});
