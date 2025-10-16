/**
 * Module de gestion des documents
 * Gestion documentaire (upload, téléchargement, signature)
 */

import { createClient } from '@/lib/supabase/client';
import type {
  Document,
  Inserts,
  Updates,
  DocumentType,
} from '@/types/database.types';

// =====================================================
// DOCUMENTS
// =====================================================

/**
 * Récupère tous les documents d'un bilan
 */
export async function getDocuments(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('bilan_id', bilanId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Document[];
}

/**
 * Récupère un document par ID
 */
export async function getDocument(documentId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return data as Document;
}

/**
 * Récupère les documents par type
 */
export async function getDocumentsByType(bilanId: string, type: DocumentType) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('type', type)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Document[];
}

/**
 * Récupère les documents signés
 */
export async function getDocumentsSignes(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('signe', true)
    .order('signed_at', { ascending: false});

  if (error) throw error;
  return data as Document[];
}

/**
 * Récupère les documents en attente de signature
 */
export async function getDocumentsEnAttenteSignature(bilanId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('bilan_id', bilanId)
    .eq('signe', false)
    .eq('signature_requise', true)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data as Document[];
}

/**
 * Crée un nouveau document
 */
export async function createDocument(document: Inserts<'documents'>) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

/**
 * Met à jour un document
 */
export async function updateDocument(
  documentId: string,
  updates: Updates<'documents'>
) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', documentId)
    .select()
    .single();

  if (error) throw error;
  return data as Document;
}

/**
 * Upload un fichier et crée le document
 */
export async function uploadDocument(
  bilanId: string,
  file: File,
  type: DocumentType,
  signatureRequise: boolean = false
) {
  const supabase = createClient();

  // Upload le fichier dans Supabase Storage
  const fileName = `${bilanId}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Obtenir l'URL publique
  const {
    data: { publicUrl },
  } = supabase.storage.from('documents').getPublicUrl(fileName);

  // Créer l'entrée dans la base de données
  return createDocument({
    bilan_id: bilanId,
    nom: file.name,
    type,
    url: publicUrl,
    taille_bytes: file.size,
    mime_type: file.type,
    signature_requise: signatureRequise,
    signe: false,
  });
}

/**
 * Télécharge un document
 */
export async function downloadDocument(documentId: string) {
  const document = await getDocument(documentId);
  
  // Ouvrir l'URL dans un nouvel onglet
  window.open(document.url, '_blank');
}

/**
 * Signe un document
 */
export async function signerDocument(
  documentId: string,
  signatureUrl: string
) {
  return updateDocument(documentId, {
    signe: true,
    signed_at: new Date().toISOString(),
    signature_url: signatureUrl,
  });
}

/**
 * Supprime un document
 */
export async function deleteDocument(documentId: string) {
  const supabase = createClient();
  
  // Récupérer le document pour obtenir l'URL
  const document = await getDocument(documentId);

  // Extraire le chemin du fichier depuis l'URL
  const urlParts = document.url.split('/documents/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];

    // Supprimer le fichier du storage
    await supabase.storage.from('documents').remove([filePath]);
  }

  // Supprimer l'entrée de la base de données
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);

  if (error) throw error;
}

// =====================================================
// STATISTIQUES
// =====================================================

/**
 * Récupère les statistiques des documents
 */
export async function getDocumentsStats(bilanId: string) {
  const documents = await getDocuments(bilanId);

  const stats = {
    total: documents.length,
    parType: {} as Record<DocumentType, number>,
    signes: documents.filter((d) => d.signe).length,
    enAttenteSignature: documents.filter(
      (d) => d.signature_requise && !d.signe
    ).length,
    tailleTotale: documents.reduce((sum, d) => sum + (d.taille_bytes || 0), 0),
  };

  documents.forEach((document) => {
    stats.parType[document.type] = (stats.parType[document.type] || 0) + 1;
  });

  return stats;
}

