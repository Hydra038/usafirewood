'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

export default function EditPaymentMethodPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'manual',
    instructions: '',
    account_username: '',
    venmo_link: '',
    qr_code_url: '',
    is_active: true,
    display_order: 0,
  });

  useEffect(() => {
    params.then(p => {
      setId(p.id);
      loadPaymentMethod(p.id);
    });
  }, []);

  const loadPaymentMethod = async (methodId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', methodId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || '',
          type: data.type || 'manual',
          instructions: data.instructions || '',
          account_username: data.account_username || '',
          venmo_link: data.venmo_link || '',
          qr_code_url: data.qr_code_url || '',
          is_active: data.is_active ?? true,
          display_order: data.display_order || 0,
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from('payment_methods')
        .update({
          name: formData.name,
          type: formData.type,
          instructions: formData.instructions,
          account_username: formData.account_username,
          venmo_link: formData.venmo_link,
          qr_code_url: formData.qr_code_url,
          is_active: formData.is_active,
          display_order: formData.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      router.push('/admin/payment-methods');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to update payment method');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      setSubmitting(true);
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      router.push('/admin/payment-methods');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to delete payment method');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment method...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Edit Payment Method</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <Input
              label="Payment Method Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Venmo, Cash App, PayPal"
            />

            <Select
              label="Type"
              name="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'manual', label: 'Manual Payment' },
                { value: 'online', label: 'Online Payment' },
              ]}
            />

            <Textarea
              label="Instructions"
              name="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Payment instructions for customers"
              rows={4}
            />

            <Input
              label="Account Username (Optional)"
              name="account_username"
              value={formData.account_username}
              onChange={(e) => setFormData({ ...formData, account_username: e.target.value })}
              placeholder="e.g., @yourhandle for Cash App/Venmo"
            />

            <Input
              label="Venmo Link (Optional)"
              name="venmo_link"
              value={formData.venmo_link}
              onChange={(e) => setFormData({ ...formData, venmo_link: e.target.value })}
              placeholder="https://venmo.com/yourusername"
              helperText="Customers can click this link to pay directly via Venmo"
            />

            <Input
              label="QR Code URL (Optional)"
              name="qr_code_url"
              value={formData.qr_code_url}
              onChange={(e) => setFormData({ ...formData, qr_code_url: e.target.value })}
              placeholder="URL to QR code image"
            />

            <Input
              label="Display Order"
              name="display_order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              helperText="Lower numbers appear first"
            />

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active (visible to customers)
              </label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              Delete Payment Method
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/admin/payment-methods')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
