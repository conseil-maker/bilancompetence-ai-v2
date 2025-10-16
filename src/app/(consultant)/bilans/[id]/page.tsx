'use client';

import { useEffect, useState } from 'react';

export default function DétailduBilanPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger les données
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Détail du Bilan</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          Contenu de la page Détail du Bilan
        </p>
      </div>
    </div>
  );
}
