'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/database.types';
import { messagesModule } from '@/lib/supabase/modules';

interface MessageThreadProps {
  bilanId: string;
  currentUserId: string;
}

export default function MessageThread({ bilanId, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [bilanId]);

  const loadMessages = async () => {
    try {
      const data = await messagesModule.getMessagesByBilan(bilanId);
      setMessages(data);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messagesModule.createMessage({
        bilan_id: bilanId,
        sender_id: currentUserId,
        contenu: newMessage,
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  if (loading) return <div className="p-4">Chargement...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender_id === currentUserId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="text-sm">{message.contenu}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {new Date(message.created_at).toLocaleString('fr-FR')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
