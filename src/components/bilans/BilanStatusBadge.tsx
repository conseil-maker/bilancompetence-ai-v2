'use client';

import { BilanStatus } from '@/types/database.types';

interface BilanStatusBadgeProps {
  status: BilanStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  en_attente: {
    label: 'En attente',
    color: 'bg-gray-100 text-gray-800',
    icon: '⏳',
  },
  en_cours: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800',
    icon: '🔄',
  },
  termine: {
    label: 'Terminé',
    color: 'bg-green-100 text-green-800',
    icon: '✅',
  },
  abandonne: {
    label: 'Abandonné',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

export default function BilanStatusBadge({ status, size = 'md' }: BilanStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.color} ${sizeClasses[size]}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

