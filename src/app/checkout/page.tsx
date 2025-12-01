'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { createOrder, getPaymentMethods } from '@/app/actions/orders';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';

// US States list
const US_STATES = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington DC' },
];

type CartItem = {
  id: string;
  quantity: number;
  price_at_add: number;
  product: {
    id: string;
    name: string;
    price: number;
    unit_type: string;
  };
};

type PaymentMethod = {
  id: string;
  name: string;
  type: string;
  instructions?: string;
  account_username?: string;
  venmo_link?: string;
  qr_code_url?: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [error, setError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryNotes: '',
    paymentMethodId: '',
    paymentProofFile: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No user found, redirecting to login');
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      console.log('Loading checkout data for user:', user.id);

      // Get user's profile information
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email, full_name, phone, address_line1, city, state, zip_code')
        .eq('id', user.id)
        .single();

      if (profileData) {
        // Pre-fill form with user's profile data
        setFormData(prev => ({
          ...prev,
          customerEmail: profileData.email || user.email || '',
          customerName: profileData.full_name || '',
          customerPhone: profileData.phone || '',
          deliveryAddress: profileData.address_line1 || '',
          deliveryCity: profileData.city || '',
          deliveryState: profileData.state || '',
          deliveryZip: profileData.zip_code || '',
        }));
      } else {
        // At minimum, use the email from auth
        setFormData(prev => ({
          ...prev,
          customerEmail: user.email || '',
        }));
      }

      // Get user's cart
      const { data: cartData, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        throw new Error('Failed to load cart');
      }

      if (!cartData) {
        console.log('No cart found for user, redirecting to cart page');
        setLoading(false);
        router.push('/cart');
        return;
      }

      if (cartError) {
        console.error('Error fetching cart:', cartError);
        throw new Error('Failed to load cart');
      }

      if (!cartData) {
        console.log('No cart found for user');
        setCart([]);
        setLoading(false);
        return;
      }

      console.log('Found cart:', cartData.id);

      // Get cart items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          price_at_add,
          products (
            id,
            name,
            price,
            unit_type
          )
        `)
        .eq('cart_id', cartData.id);

      if (itemsError) {
        console.error('Error fetching cart items:', itemsError);
        throw new Error('Failed to load cart items');
      }

      console.log('Loaded cart items:', itemsData?.length || 0);
      console.log('Raw items data:', JSON.stringify(itemsData, null, 2));
      
      // Transform the data to match our CartItem type and filter out items with null products
      const transformedItems = (itemsData || [])
        .filter((item: any) => item.products !== null) // Filter out deleted products
        .map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price_at_add: item.price_at_add,
          product: {
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            unit_type: item.products.unit_type
          }
        }));
      
      console.log('Transformed cart items:', transformedItems.length);
      
      // Check if cart is empty after filtering
      if (transformedItems.length === 0) {
        console.log('Cart is empty, redirecting to cart page');
        setLoading(false);
        router.push('/cart');
        return;
      }
      
      setCart(transformedItems);

      // Get payment methods from server action
      const paymentData = await getPaymentMethods();
      setPaymentMethods(paymentData || []);

    } catch (err: any) {
      console.error('Error loading checkout data:', err);
      setError(err.message || 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-lookup ZIP code when city and state are filled
  const lookupZipCode = async (city: string, state: string) => {
    if (!city || !state || city.length < 3) {
      return;
    }

    try {
      // Use Zippopotam.us API to get ZIP code for city/state
      const response = await fetch(
        `https://api.zippopotam.us/us/${state}/${encodeURIComponent(city)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          // Auto-fill with the first ZIP code found
          const zipCode = data.places[0]['post code'];
          console.log(`Auto-filled ZIP code for ${city}, ${state}: ${zipCode}`);
          setFormData(prev => ({ ...prev, deliveryZip: zipCode }));
        }
      }
    } catch (err) {
      console.log('Could not auto-lookup ZIP code:', err);
      // Silently fail - user can still enter ZIP manually
    }
  };

  // Effect to auto-lookup ZIP when city and state change
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (formData.deliveryCity && formData.deliveryState) {
        lookupZipCode(formData.deliveryCity, formData.deliveryState);
      }
    }, 800); // Wait 800ms after user stops typing

    return () => clearTimeout(debounce);
  }, [formData.deliveryCity, formData.deliveryState]);

  // Set flat delivery fee when ZIP is entered
  useEffect(() => {
    if (formData.deliveryZip && formData.deliveryZip.length === 5) {
      const flatFee = parseFloat(process.env.NEXT_PUBLIC_FLAT_DELIVERY_FEE || '25');
      setDeliveryFee(flatFee);
      setError('');
    }
  }, [formData.deliveryZip]);

  // Set flat delivery fee when ZIP is entered
  useEffect(() => {
    if (formData.deliveryZip && formData.deliveryZip.length === 5) {
      const flatFee = parseFloat(process.env.NEXT_PUBLIC_FLAT_DELIVERY_FEE || '25');
      setDeliveryFee(flatFee);
      setError('');
    }
  }, [formData.deliveryZip]);

  const subtotal = cart.reduce((sum, item) => sum + item.price_at_add * item.quantity, 0);
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.paymentMethodId) {
      setError('Please select a payment method');
      return;
    }

    setSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      // Upload payment proof if provided
      let paymentProofUrl = null;
      if (formData.paymentProofFile) {
        const fileExt = formData.paymentProofFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `payment-proofs/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, formData.paymentProofFile);

        if (uploadError) {
          console.error('Error uploading payment proof:', uploadError);
          setError('Failed to upload payment proof. Please try again.');
          setSubmitting(false);
          return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);

        paymentProofUrl = publicUrl;
      }

      const orderData = {
        customer_email: formData.customerEmail,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        shipping_address_line1: formData.deliveryAddress,
        shipping_city: formData.deliveryCity,
        shipping_state: formData.deliveryState,
        shipping_zip: formData.deliveryZip,
        delivery_type: 'delivery' as const,
        payment_method_id: formData.paymentMethodId,
        customer_notes: formData.deliveryNotes,
        payment_proof_url: paymentProofUrl,
      };

      const result = await createOrder(orderData);

      if (result.error) {
        throw new Error(result.error);
      }

      // The createOrder returns { success: true, order: {...} }
      if (result.success && result.order) {
        router.push(`/checkout/success/${result.order.id}`);
      } else {
        throw new Error('Order creation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">Add some products before checking out.</p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer & Delivery Information</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
              placeholder="John Doe"
            />

            <Input
              label="Email Address"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
              readOnly
              disabled
              placeholder="john@example.com"
            />
            <p className="text-sm text-gray-500 -mt-2">Email from your account. To change, update your profile.</p>

            <Input
              label="Phone Number"
              name="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
              placeholder="(555) 123-4567"
            />

            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
            </div>

            <Input
              label="Street Address"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="deliveryCity"
                value={formData.deliveryCity}
                onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                required
                placeholder="Enter city name"
              />

              <Select
                label="State"
                name="deliveryState"
                value={formData.deliveryState}
                onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                required
                options={US_STATES}
              />
            </div>

            <Input
              label="ZIP Code"
              name="deliveryZip"
              value={formData.deliveryZip}
              onChange={(e) => setFormData({ ...formData, deliveryZip: e.target.value })}
              required
              pattern="[0-9]{5}"
              maxLength={5}
              placeholder="Auto-filled or enter manually"
            />
            {formData.deliveryCity && formData.deliveryState && !formData.deliveryZip && (
              <p className="text-sm text-blue-600 -mt-2">
                💡 Looking up ZIP code for {formData.deliveryCity}, {formData.deliveryState}...
              </p>
            )}
            {formData.deliveryZip && (
              <p className="text-sm text-green-600 -mt-2">
                ✓ ZIP code ready. You can edit if needed.
              </p>
            )}

            <Input
              label="Delivery Notes (Optional)"
              name="deliveryNotes"
              value={formData.deliveryNotes}
              onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
              placeholder="Any special instructions..."
            />

            <Select
              label="Payment Method"
              name="paymentMethodId"
              value={formData.paymentMethodId}
              onChange={(e) => setFormData({ ...formData, paymentMethodId: e.target.value })}
              required
              options={[
                { value: '', label: 'Select payment method' },
                ...paymentMethods.map((pm) => ({
                  value: pm.id,
                  label: pm.name,
                })),
              ]}
            />

            {/* Display payment method details when selected */}
            {formData.paymentMethodId && (() => {
              const selectedMethod = paymentMethods.find(pm => pm.id === formData.paymentMethodId);
              if (!selectedMethod) return null;
              
              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <svg className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-900 mb-2">Payment Instructions for {selectedMethod.name}</h4>
                      
                      {selectedMethod.account_username && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-blue-800">Send payment to:</p>
                          <p className="text-sm font-mono bg-white px-3 py-2 rounded border border-blue-200 text-blue-900 mt-1">
                            {selectedMethod.account_username}
                          </p>
                        </div>
                      )}

                      {selectedMethod.venmo_link && (
                        <div className="mb-3">
                          <a
                            href={selectedMethod.venmo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.384 4.616c.56 1.04.816 2.128.816 3.408 0 4.224-3.6 9.696-6.552 13.176H7.848L4.8 4.464l5.88-.72 2.064 12.696c1.296-2.088 2.928-5.472 2.928-7.752 0-1.272-.216-2.136-.576-2.88l4.288-.192z"/>
                            </svg>
                            Pay with Venmo
                          </a>
                          <p className="text-xs text-blue-700 mt-1">Click to open Venmo and send payment</p>
                        </div>
                      )}
                      
                      {selectedMethod.instructions && (
                        <div className="mb-3">
                          <p className="text-sm text-blue-800">{selectedMethod.instructions}</p>
                        </div>
                      )}

                      {selectedMethod.qr_code_url && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-blue-800 mb-2">Or scan QR code:</p>
                          <img 
                            src={selectedMethod.qr_code_url} 
                            alt="Payment QR Code" 
                            className="w-48 h-48 border-2 border-blue-200 rounded"
                          />
                        </div>
                      )}
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mt-3">
                        <p className="text-xs text-yellow-800">
                          <strong>Important:</strong> After placing your order, you'll receive detailed payment instructions including your order number. Please include your order number in the payment notes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Payment Proof Upload */}
            {formData.paymentMethodId && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Payment Proof (Optional but Recommended)
                </label>
                <div className="mt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setFormData({ ...formData, paymentProofFile: file });
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-lg file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100
                      cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Upload a screenshot or photo of your payment confirmation. This helps us process your order faster!
                  </p>
                  
                  {/* File selected indicator and preview */}
                  {formData.paymentProofFile && (
                    <div className="mt-3 space-y-3">
                      {/* File name with remove button */}
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-semibold">{formData.paymentProofFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentProofFile: null })}
                          className="text-red-600 hover:text-red-700 ml-2 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                      
                      {/* Image Preview */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Preview:</p>
                        <img
                          src={URL.createObjectURL(formData.paymentProofFile)}
                          alt="Payment proof preview"
                          className="max-w-full max-h-64 mx-auto rounded-lg shadow-md object-contain bg-white"
                        />
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          This is how your payment proof will appear to the admin
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition"
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × {formatCurrency(item.price_at_add)}/{item.product.unit_type}
                  </p>
                </div>
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.price_at_add * item.quantity)}
                </p>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-900">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-900">
                <span>Delivery Fee</span>
                <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'TBD'}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
