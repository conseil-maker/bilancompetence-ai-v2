'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Upload, X, Loader2, FileText, Image, Video, Music } from 'lucide-react';

// Simulation du type de fichier de la base de données, comme demandé.
// En réalité, ce type serait importé de '@/types/database.types'.
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploaded_at: string;
}

// Type étendu pour la gestion interne des fichiers en cours d'upload
interface FileWithPreview extends File {
  id: string;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploaderProps {
  /** Le libellé affiché dans la zone de dépôt. */
  label?: string;
  /** Les types de fichiers acceptés (ex: 'image/jpeg,image/png,.pdf'). */
  accept?: string;
  /** Le nombre maximum de fichiers. */
  maxFiles?: number;
  /** La taille maximale d'un fichier en octets. */
  maxSize?: number;
  /** Fonction appelée lors de la sélection/dépôt de fichiers. */
  onFilesChange: (files: File[]) => void;
  /** Fonction pour simuler l'upload et retourner le fichier final. */
  onUpload: (file: File) => Promise<UploadedFile>;
  /** Les fichiers déjà uploadés (pour affichage initial). */
  initialFiles?: UploadedFile[];
}

const formatFileSize = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  return FileText;
};

export const FileUploader: React.FC<FileUploaderProps> = ({
  label = 'Glissez et déposez des fichiers ici, ou cliquez pour sélectionner',
  accept,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  onFilesChange,
  onUpload,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(initialFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalFiles = files.length + uploadedFiles.length;
  const canAddMoreFiles = totalFiles < maxFiles;

  const handleFileChange = useCallback(
    (newFiles: File[]) => {
      const validFiles: File[] = [];
      const filesToAdd: FileWithPreview[] = [];
      let error: string | null = null;

      if (!canAddMoreFiles) {
        error = `Limite de ${maxFiles} fichiers atteinte.`;
      }

      for (const file of newFiles) {
        if (totalFiles + validFiles.length >= maxFiles) {
          error = `Limite de ${maxFiles} fichiers atteinte.`;
          break;
        }
        if (file.size > maxSize) {
          error = `Le fichier "${file.name}" dépasse la taille maximale de ${formatFileSize(maxSize)}.`;
          continue;
        }
        
        // Simple check for accept types (can be more robust)
        if (accept && !accept.includes(file.type) && !accept.split(',').some(ext => file.name.toLowerCase().endsWith(ext.trim()))) {
             error = `Le fichier "${file.name}" n'est pas d'un type accepté.`;
             continue;
        }

        validFiles.push(file);
        filesToAdd.push({
          ...file,
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
          status: 'pending',
          progress: 0,
        });
      }

      if (error) {
        console.error(error);
        // Vous pouvez ajouter un état d'erreur global si nécessaire
      }

      if (filesToAdd.length > 0) {
        setFiles((prev) => [...prev, ...filesToAdd]);
        onFilesChange(validFiles);
        filesToAdd.forEach(uploadFile);
      }
    },
    [maxFiles, maxSize, accept, totalFiles, onFilesChange, onUpload, canAddMoreFiles]
  );

  const uploadFile = useCallback(
    async (fileToUpload: FileWithPreview) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileToUpload.id ? { ...f, status: 'uploading' } : f))
      );

      // Simulation de la progression de l'upload
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === fileToUpload.id && f.progress < 95) {
              return { ...f, progress: f.progress + 5 };
            }
            return f;
          })
        );
      }, 200);

      try {
        const uploaded = await onUpload(fileToUpload);
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) => (f.id === fileToUpload.id ? { ...f, status: 'success', progress: 100 } : f))
        );
        setUploadedFiles((prev) => [...prev, uploaded]);
        // Nettoyage après un court délai pour l'effet visuel
        setTimeout(() => {
          setFiles((prev) => prev.filter((f) => f.id !== fileToUpload.id));
        }, 1000);
      } catch (e) {
        clearInterval(interval);
        const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors de l\'upload.';
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id
              ? { ...f, status: 'error', progress: 0, error: errorMessage }
              : f
          )
        );
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragActive(false);
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        handleFileChange(Array.from(event.dataTransfer.files));
        event.dataTransfer.clearData();
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    // Ici, vous devriez également annuler l'upload si elle est en cours
  }, []);

  const handleRemoveUploadedFile = useCallback((fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    // Ici, vous devriez appeler une fonction pour supprimer le fichier du serveur
  }, []);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dropzoneClasses = useMemo(() => {
    return `
      flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200
      ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-white'}
      ${!canAddMoreFiles ? 'opacity-50 cursor-not-allowed' : ''}
    `;
  }, [isDragActive, canAddMoreFiles]);

  const renderFilePreview = (file: FileWithPreview) => {
    const Icon = getFileIcon(file.type);
    const isImage = file.type.startsWith('image/');

    return (
      <div
        key={file.id}
        className="relative flex items-center p-3 border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden"
      >
        {/* Statut et icône */}
        <div className="flex-shrink-0 mr-3">
          {file.status === 'uploading' ? (
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          ) : file.status === 'error' ? (
            <X className="w-6 h-6 text-red-500" />
          ) : file.status === 'success' ? (
            <Upload className="w-6 h-6 text-green-500" />
          ) : (
            <Icon className="w-6 h-6 text-gray-500" />
          )}
        </div>

        {/* Nom et taille du fichier */}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          {file.status === 'error' && (
            <p className="text-xs text-red-500 mt-1 truncate" title={file.error}>
              Erreur: {file.error}
            </p>
          )}
        </div>

        {/* Prévisualisation de l'image */}
        {isImage && file.preview && (
          <div className="flex-shrink-0 ml-3 w-10 h-10 rounded-md overflow-hidden">
            <img src={file.preview} alt={file.name} className="object-cover w-full h-full" />
          </div>
        )}

        {/* Bouton de suppression */}
        <button
          type="button"
          onClick={() => handleRemoveFile(file.id)}
          className="flex-shrink-0 ml-3 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={`Supprimer le fichier ${file.name}`}
          disabled={file.status === 'uploading'}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Barre de progression */}
        {file.status === 'uploading' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className="h-1 bg-indigo-500 transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  const renderUploadedFile = (file: UploadedFile) => {
    const Icon = getFileIcon(file.type);
    const isImage = file.type.startsWith('image/');

    return (
      <div
        key={file.id}
        className="relative flex items-center p-3 border border-green-200 rounded-lg shadow-sm bg-green-50 overflow-hidden"
      >
        {/* Icône de succès */}
        <div className="flex-shrink-0 mr-3">
          <Upload className="w-6 h-6 text-green-600" />
        </div>

        {/* Nom et taille du fichier */}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-green-800 truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-green-600">
            {formatFileSize(file.size)} - Uploadé le {new Date(file.uploaded_at).toLocaleDateString()}
          </p>
        </div>

        {/* Prévisualisation de l'image (si disponible) */}
        {isImage && file.url && (
          <div className="flex-shrink-0 ml-3 w-10 h-10 rounded-md overflow-hidden">
            <img src={file.url} alt={file.name} className="object-cover w-full h-full" />
          </div>
        )}

        {/* Bouton de suppression */}
        <button
          type="button"
          onClick={() => handleRemoveUploadedFile(file.id)}
          className="flex-shrink-0 ml-3 p-1 rounded-full text-green-400 hover:text-green-600 hover:bg-green-100 transition-colors"
          aria-label={`Supprimer le fichier uploadé ${file.name}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Zone de glisser-déposer */}
      <div
        className={dropzoneClasses}
        onDrop={canAddMoreFiles ? handleDrop : undefined}
        onDragOver={canAddMoreFiles ? handleDragOver : undefined}
        onDragLeave={canAddMoreFiles ? handleDragLeave : undefined}
        onClick={canAddMoreFiles ? handleClick : undefined}
        role="button"
        tabIndex={canAddMoreFiles ? 0 : -1}
        aria-disabled={!canAddMoreFiles}
        aria-label={label}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => {
            if (e.target.files) {
              handleFileChange(Array.from(e.target.files));
            }
          }}
          className="hidden"
          disabled={!canAddMoreFiles}
        />
        <Upload className={`w-8 h-8 mb-2 ${isDragActive ? 'text-indigo-600' : 'text-gray-400'}`} />
        <p className="text-sm font-semibold text-gray-600 text-center">{label}</p>
        <p className="text-xs text-gray-500 mt-1 text-center">
          {accept ? `Types acceptés: ${accept.split(',').map(t => t.trim()).join(', ')}` : 'Tous types de fichiers'}
          <br />
          Max {maxFiles} fichiers, {formatFileSize(maxSize)} par fichier.
        </p>
        {!canAddMoreFiles && (
          <p className="text-sm font-bold text-red-500 mt-2">Limite de {maxFiles} fichiers atteinte.</p>
        )}
      </div>

      {/* Liste des fichiers en cours d'upload */}
      {(files.length > 0 || uploadedFiles.length > 0) && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Fichiers</h3>
          <div className="space-y-3">
            {uploadedFiles.map(renderUploadedFile)}
            {files.map(renderFilePreview)}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
