'use client';

import { useEffect, useState } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
import RdvCalendar from '@/components/rdv/RdvCalendar';

export default function MesRendezvousPage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-8 text-center">Veuillez vous connecter</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes Rendez-vous</h1>
      <RdvCalendar userId={user.id} role="beneficiaire" />
    </div>
  );
}
