'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const getVariant = (status: string): typeof variant => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('active')) return 'default';
    if (lowerStatus.includes('completed') || lowerStatus.includes('received')) return 'default';
    if (lowerStatus.includes('pending') || lowerStatus.includes('draft')) return 'secondary';
    if (lowerStatus.includes('cancelled') || lowerStatus.includes('retired') || lowerStatus.includes('damaged')) return 'destructive';
    if (lowerStatus.includes('inactive')) return 'outline';
    
    return variant;
  };

  return (
    <Badge variant={getVariant(status)}>
      {status}
    </Badge>
  );
}
