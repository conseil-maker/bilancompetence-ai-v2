'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Viewer, Worker, ViewMode, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

// Import des styles nécessaires
// NOTE: Ces imports de CSS doivent être gérés au niveau de l\'application (ex: dans un fichier global ou _app.tsx)
// Pour le composant seul, on les laisse en commentaire mais ils sont requis pour le bon fonctionnement.
// import \'@react-pdf-viewer/core/lib/styles/index.css\';
// import \'@react-pdf-viewer/default-layout/lib/styles/index.css\';

// Définition de l\'interface des Props
// On suppose que le type Document est un type simple pour cet exemple,
// car le type @/types/database.types n\'est pas disponible.
// Si le type Document est plus complexe, il faudra l\'ajuster.
interface Document {
  id: string;
  url: string; // URL du document PDF
  name: string;
  // ... autres champs potentiels de @/types/database.types
}

interface DocumentViewerProps {
  document: Document | null;
  isLoading: boolean;
  error: string | null;
}

// Composant de chargement simple
const LoadingState: React.FC = () => (
  <div className="flex items-center justify-center h-full bg-gray-100/50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-600">Chargement du document...</p>
  </div>
);

// Composant d\'erreur simple
const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full bg-red-50 border border-red-200 p-6 rounded-lg">
    <svg className="w-10 h-10 text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <h3 className="text-lg font-semibold text-red-700">Erreur de chargement</h3>
    <p className="text-sm text-red-600 text-center mt-2">{message}</p>
  </div>
);

/**
 * Composant DocumentViewer pour afficher un document PDF avec zoom et navigation.
 * Utilise @react-pdf-viewer et Tailwind CSS.
 */
const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, isLoading, error }) => {
  // Le Worker est nécessaire pour le fonctionnement de pdf.js
  // Il est recommandé d\'utiliser un CDN pour le chemin du worker.
  const workerUrl = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

  // Gestion des états de chargement et d\'erreur
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!document || !document.url) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 border border-gray-200 p-6 rounded-lg">
        <p className="text-gray-500">Aucun document à afficher.</p>
      </div>
    );
  }

  // Configuration des plugins
  const defaultLayoutPluginInstance = useMemo(() => defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      // On peut filtrer ou ajouter des onglets ici si nécessaire
      // Ex: Filtrer pour ne garder que les miniatures
      // defaultTabs.filter(tab => tab.content.props.ariaLabel === 'Thumbnails'),
      ...defaultTabs,
    ],
    // On peut personnaliser la barre d\'outils ici
    toolbar: {
      // Les boutons de zoom et de navigation sont inclus par défaut dans le layout
      // On peut les personnaliser ou les masquer si on utilise les plugins dédiés
    }
  }), []);

  // Plugins spécifiques pour le zoom et la navigation (si on ne veut pas le layout par défaut)
  // Le defaultLayoutPlugin inclut déjà ces fonctionnalités, mais on les définit pour la clarté
  const zoomPluginInstance = useMemo(() => zoomPlugin(), []);
  const pageNavigationPluginInstance = useMemo(() => pageNavigationPlugin(), []);

  // Liste des plugins à passer au Viewer
  const plugins = useMemo(() => [
    defaultLayoutPluginInstance,
    // zoomPluginInstance, // Déjà inclus dans defaultLayoutPlugin
    // pageNavigationPluginInstance, // Déjà inclus dans defaultLayoutPlugin
  ], [defaultLayoutPluginInstance]);

  return (
    <div className="document-viewer-container w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <Worker workerUrl={workerUrl}>
        <div className="h-full w-full">
          <Viewer
            fileUrl={document.url}
            plugins={plugins}
            // Configuration initiale du zoom
            defaultScale={SpecialZoomLevel.PageFit}
            // Mode de vue (par défaut, une page à la fois)
            viewMode={ViewMode.SinglePage}
            // Personnalisation du style via la classe CSS
            // Le style Tailwind CSS est appliqué via la structure HTML générée par le plugin
            // et les classes globales de l\'application.
          />
        </div>
      </Worker>
    </div>
  );
};

export default DocumentViewer;