'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuthContext as useAuth } from '@/components/providers/AuthProvider';
// J'assume l'existence d'un module de notifications dans @/lib/supabase/modules
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  NotificationType,
  Notification
} from '@/lib/supabase/modules'; 

// --- Types Mockés (à adapter si les types réels sont connus) ---
// J'assume une structure de notification de base
interface MockNotification {
  id: string;
  title: string;
  content: string;
  type: 'message' | 'rdv' | 'document' | 'autre';
  is_read: boolean;
  created_at: string;
}

// --- Composants Mockés (à remplacer par les composants réels du projet) ---

const NotificationItem = ({ notification, onToggleRead }: { notification: MockNotification, onToggleRead: (id: string, isRead: boolean) => void }) => {
  const isReadClass = notification.is_read ? 'bg-gray-50 text-gray-500' : 'bg-white font-medium text-gray-900 shadow-sm hover:bg-gray-50';
  const typeColor = {
    message: 'text-blue-600 bg-blue-100',
    rdv: 'text-green-600 bg-green-100',
    document: 'text-purple-600 bg-purple-100',
    autre: 'text-yellow-600 bg-yellow-100',
  }[notification.type] || 'text-gray-600 bg-gray-100';

  return (
    <div className={`p-4 border-b last:border-b-0 transition duration-150 ease-in-out ${isReadClass}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${typeColor}`}>
            {notification.type.toUpperCase()}
          </span>
          <h3 className="text-lg mt-1 truncate">{notification.title}</h3>
          <p className="text-sm mt-1 line-clamp-2">{notification.content}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(notification.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onToggleRead(notification.id, !notification.is_read)}
            className={`text-sm p-2 rounded-full transition duration-150 ease-in-out ${
              notification.is_read
                ? 'text-blue-500 hover:bg-blue-50'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            aria-label={notification.is_read ? "Marquer comme non lu" : "Marquer comme lu"}
          >
            {notification.is_read ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> // Check icon
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> // Eye icon
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Button = ({ children, onClick, disabled = false, className = '' }: { children: React.ReactNode, onClick: () => void, disabled?: boolean, className?: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out ${
      disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
    } ${className}`}
  >
    {children}
  </button>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Chargement...
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Erreur:</strong>
    <span className="block sm:inline"> {message}</span>
  </div>
);

// --- Composant Principal ---

type FilterType = 'all' | 'unread' | 'message' | 'rdv' | 'document';

const FILTERS: { label: string, value: FilterType }[] = [
  { label: 'Tout', value: 'all' },
  { label: 'Non lu', value: 'unread' },
  { label: 'Messages', value: 'message' },
  { label: 'Rendez-vous', value: 'rdv' },
  { label: 'Documents', value: 'document' },
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<MockNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fonction de chargement des notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      // J'assume que getNotifications est disponible et retourne MockNotification[]
      // Dans un vrai projet, on utiliserait le type 'Notification' importé de @/lib/supabase/modules
      const data: MockNotification[] = await getNotifications(user.id); 
      setNotifications(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err) {
      console.error("Erreur lors du chargement des notifications:", err);
      setError("Impossible de charger les notifications. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Fonction pour marquer une notification comme lue/non lue
  const handleToggleRead = useCallback(async (id: string, isRead: boolean) => {
    setIsActionLoading(true);
    try {
      // J'assume que markNotificationAsRead est disponible
      await markNotificationAsRead(id, isRead); 
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: isRead } : n)
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la notification:", err);
      setError("Impossible de mettre à jour la notification.");
    } finally {
      setIsActionLoading(false);
    }
  }, []);

  // Fonction pour marquer toutes les notifications comme lues
  const handleMarkAllAsRead = useCallback(async () => {
    if (notifications.every(n => n.is_read)) return; // Rien à faire
    setIsActionLoading(true);
    try {
      // J'assume que markAllNotificationsAsRead est disponible
      await markAllNotificationsAsRead(user.id); 
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Erreur lors de la mise à jour de toutes les notifications:", err);
      setError("Impossible de marquer toutes les notifications comme lues.");
    } finally {
      setIsActionLoading(false);
    }
  }, [notifications, user]);

  // Filtrage des notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (filter === 'all') return true;
      if (filter === 'unread') return !n.is_read;
      // On filtre par type, en assumant que le type de la notification correspond à la valeur du filtre
      return n.type === filter;
    });
  }, [notifications, filter]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.is_read).length, [notifications]);

  if (!user) {
    // Gérer le cas où l'utilisateur n'est pas connecté (redirection ou message)
    return <div className="p-8 text-center text-gray-500">Veuillez vous connecter pour voir vos notifications.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="pb-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Vos Notifications {unreadCount > 0 && <span className="text-blue-600">({unreadCount} non lues)</span>}
          </h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Button 
              onClick={handleMarkAllAsRead} 
              disabled={isLoading || isActionLoading || unreadCount === 0}
              className="w-full sm:w-auto"
            >
              {isActionLoading ? 'Mise à jour...' : 'Tout marquer comme lu'}
            </Button>
          </div>
        </header>

        <div className="mt-6">
          {/* Barre de filtres */}
          <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition duration-150 ease-in-out ${
                  filter === f.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Liste des notifications */}
          <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
            {error && <ErrorMessage message={error} />}
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {filter === 'all' ? "Vous n'avez aucune notification." : "Aucune notification ne correspond à ce filtre."}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onToggleRead={handleToggleRead} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
