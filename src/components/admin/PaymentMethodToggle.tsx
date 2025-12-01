'use client';

import { useState } from 'react';
import { togglePaymentMethodStatus } from '@/app/actions/admin';

interface PaymentMethodToggleProps {
  methodId: string;
  isActive: boolean;
  methodName: string;
}

export default function PaymentMethodToggle({ 
  methodId, 
  isActive, 
  methodName 
}: PaymentMethodToggleProps) {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(isActive);

  const handleToggle = async () => {
    if (loading) return;

    const confirmed = window.confirm(
      currentStatus
        ? `Disable "${methodName}"? Clients will not see this payment option.`
        : `Enable "${methodName}"? Clients will see this payment option.`
    );

    if (!confirmed) return;

    setLoading(true);
    
    try {
      const result = await togglePaymentMethodStatus(methodId, currentStatus);
      
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        setCurrentStatus(!currentStatus);
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('Failed to update payment method status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${currentStatus 
          ? 'bg-green-600 focus:ring-green-500' 
          : 'bg-gray-300 focus:ring-gray-400'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      aria-label={currentStatus ? 'Disable payment method' : 'Enable payment method'}
      title={currentStatus ? 'Click to disable' : 'Click to enable'}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${currentStatus ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}
