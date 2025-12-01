import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/products/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Premium Oak Firewood',
  slug: 'premium-oak-firewood',
  price: 350,
  compare_at_price: 400,
  wood_type: 'Oak',
  unit_type: 'cord',
  is_heat_treated: true,
  stock_quantity: 10,
  product_images: [
    {
      image_url: '/test-image.jpg',
      alt_text: 'Oak Firewood',
      is_primary: true,
    },
  ],
};

describe('ProductCard', () => {
  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Premium Oak Firewood')).toBeInTheDocument();
    expect(screen.getByText(/Oak/)).toBeInTheDocument();
    expect(screen.getByText(/cord/)).toBeInTheDocument();
  });

  it('should display heat treated badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Heat Treated')).toBeInTheDocument();
  });

  it('should show discount percentage', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/Save 12%/)).toBeInTheDocument();
  });

  it('should show out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('should show low stock warning', () => {
    const lowStockProduct = { ...mockProduct, stock_quantity: 3 };
    render(<ProductCard product={lowStockProduct} />);
    expect(screen.getByText(/Only 3 left in stock!/)).toBeInTheDocument();
  });

  it('should not show discount when compare_at_price is null', () => {
    const noDiscountProduct = { ...mockProduct, compare_at_price: null };
    render(<ProductCard product={noDiscountProduct} />);
    expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
  });
});
