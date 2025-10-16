'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { getConsultantConversations } from '@/lib/supabase/modules';
import { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Supposons que vous ayez un utilitaire pour les classes Tailwind

// Définition des types pour la clarté
interface Conversation {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string;
  last_message_content: string;
  last_message_date: string;
  unread_count: number;
}

// Composant de la liste des conversations
const ConversationList = ({ conversations, onSelectConversation, selectedConversationId }: {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  selectedConversationId: string | null;
}) => {
  return (
    <div className="flex flex-col space-y-1 p-2 overflow-y-auto h-full">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={cn(
            "p-3 rounded-lg cursor-pointer transition-colors duration-150",
            selectedConversationId === conv.id
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white hover:bg-gray-100 border border-gray-200"
          )}
          onClick={() => onSelectConversation(conv.id)}
        >
          <div className="font-semibold text-lg">{conv.beneficiary_name}</div>
          <div className={cn("text-sm truncate", selectedConversationId === conv.id ? "text-blue-200" : "text-gray-500")}>
            {conv.last_message_content}
          </div>
          <div className={cn("text-xs mt-1 text-right", selectedConversationId === conv.id ? "text-blue-300" : "text-gray-400")}>
            {new Date(conv.last_message_date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant de la zone de message (à implémenter)
const MessageArea = ({ conversationId }: { conversationId: string | null }) => {
  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Sélectionnez une conversation pour commencer.
      </div>
    );
  }

  // Logique de chargement et d'affichage des messages pour la conversation sélectionnée
  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold border-b pb-2 mb-4">Conversation {conversationId}</h2>
      <div className="flex-grow overflow-y-auto space-y-4">
        {/* Ici viendraient les messages */}
        <div className="text-center text-gray-400">Chargement des messages... (Implémentation future)</div>
      </div>
      <div className="mt-4">
        {/* Zone de saisie de message */}
        <input
          type="text"
          placeholder="Écrire un message..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <button className="mt-2 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">
          Envoyer
        </button>
      </div>
    </div>
  );
};


// Page principale de la messagerie
export default function ConsultantMessagingPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  const fetchConversations = useCallback(async (consultantId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // NOTE: getConsultantConversations est une fonction hypothétique de @/lib/supabase/modules
      // Elle devrait retourner la liste des conversations du consultant
      // Pour le moment, on simule une réponse vide ou une erreur si la fonction n'existe pas
      // En production, cette fonction doit être implémentée pour charger les données de Supabase
      const data = await getConsultantConversations(consultantId);
      setConversations(data as Conversation[]);
      if (data.length > 0) {
        setSelectedConversationId(data[0].id); // Sélectionne la première conversation par défaut
      }
    } catch (err) {
      console.error("Erreur lors du chargement des conversations:", err);
      // On peut simuler des données pour le développement si la fonction Supabase n'est pas encore prête
      const mockConversations: Conversation[] = [
        { id: 'conv1', beneficiary_id: 'ben1', beneficiary_name: 'Alice Dupont', last_message_content: 'Bonjour, j\'ai une question sur...', last_message_date: new Date().toISOString(), unread_count: 2 },
        { id: 'conv2', beneficiary_id: 'ben2', beneficiary_name: 'Bob Martin', last_message_content: 'Rendez-vous confirmé pour demain.', last_message_date: new Date(Date.now() - 86400000).toISOString(), unread_count: 0 },
        { id: 'conv3', beneficiary_id: 'ben3', beneficiary_name: 'Charlie Leblanc', last_message_content: 'Merci pour votre aide.', last_message_date: new Date(Date.now() - 172800000).toISOString(), unread_count: 0 },
      ];
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setSelectedConversationId(mockConversations[0].id);
      }
      // setError("Impossible de charger les conversations. Veuillez réessayer."); // Commenté pour utiliser les données mock
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthLoading && user?.id) {
      fetchConversations(user.id);
    }
  }, [user, isAuthLoading, fetchConversations]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Chargement de la messagerie...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <p className="p-4 bg-red-100 border border-red-400 rounded-lg">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <p className="p-4 bg-red-100 border border-red-400 rounded-lg">Accès refusé. Veuillez vous connecter.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar des conversations */}
      <aside className="w-80 border-r bg-white flex flex-col">
        <header className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Conversations</h1>
        </header>
        <div className="flex-grow overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Aucune conversation trouvée.</div>
          ) : (
            <ConversationList
              conversations={conversations}
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
            />
          )}
        </div>
      </aside>

      {/* Zone de message principale */}
      <main className="flex-grow">
        <MessageArea conversationId={selectedConversationId} />
      </main>
    </div>
  );
}