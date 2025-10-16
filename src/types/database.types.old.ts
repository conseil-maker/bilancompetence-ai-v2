// Types générés depuis le schéma Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'beneficiaire' | 'consultant' | 'admin'

export type BilanStatus = 
  | 'en_attente' 
  | 'preliminaire' 
  | 'investigation' 
  | 'conclusion' 
  | 'termine' 
  | 'abandonne'

export type TestType = 
  | 'personnalite' 
  | 'interets' 
  | 'competences' 
  | 'valeurs' 
  | 'autre'

export type MessageStatus = 'envoye' | 'lu' | 'archive'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id: string
          role?: UserRole
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          role?: UserRole
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      bilans: {
        Row: {
          id: string
          beneficiaire_id: string
          consultant_id: string | null
          status: BilanStatus
          titre: string
          description: string | null
          objectifs: Json | null
          date_debut: string | null
          date_fin_prevue: string | null
          date_fin_reelle: string | null
          preliminaire_completed_at: string | null
          preliminaire_notes: string | null
          investigation_completed_at: string | null
          investigation_notes: string | null
          conclusion_completed_at: string | null
          synthese_document_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          beneficiaire_id: string
          consultant_id?: string | null
          status?: BilanStatus
          titre: string
          description?: string | null
          objectifs?: Json | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          preliminaire_completed_at?: string | null
          preliminaire_notes?: string | null
          investigation_completed_at?: string | null
          investigation_notes?: string | null
          conclusion_completed_at?: string | null
          synthese_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          beneficiaire_id?: string
          consultant_id?: string | null
          status?: BilanStatus
          titre?: string
          description?: string | null
          objectifs?: Json | null
          date_debut?: string | null
          date_fin_prevue?: string | null
          date_fin_reelle?: string | null
          preliminaire_completed_at?: string | null
          preliminaire_notes?: string | null
          investigation_completed_at?: string | null
          investigation_notes?: string | null
          conclusion_completed_at?: string | null
          synthese_document_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tests: {
        Row: {
          id: string
          bilan_id: string
          type: TestType
          nom: string
          description: string | null
          resultats: Json | null
          score: number | null
          interpretation: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          type: TestType
          nom: string
          description?: string | null
          resultats?: Json | null
          score?: number | null
          interpretation?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          type?: TestType
          nom?: string
          description?: string | null
          resultats?: Json | null
          score?: number | null
          interpretation?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          bilan_id: string
          uploaded_by: string | null
          nom: string
          type: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id: string
          uploaded_by?: string | null
          nom: string
          type: string
          file_path: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string
          uploaded_by?: string | null
          nom?: string
          type?: string
          file_path?: string
          file_size?: number | null
          mime_type?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          bilan_id: string
          sender_id: string
          receiver_id: string
          subject: string | null
          content: string
          status: MessageStatus
          sent_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          bilan_id: string
          sender_id: string
          receiver_id: string
          subject?: string | null
          content: string
          status?: MessageStatus
          sent_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          bilan_id?: string
          sender_id?: string
          receiver_id?: string
          subject?: string | null
          content?: string
          status?: MessageStatus
          sent_at?: string
          read_at?: string | null
        }
      }
      resources: {
        Row: {
          id: string
          created_by: string | null
          titre: string
          description: string | null
          type: string
          url: string | null
          file_path: string | null
          tags: string[] | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_by?: string | null
          titre: string
          description?: string | null
          type: string
          url?: string | null
          file_path?: string | null
          tags?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_by?: string | null
          titre?: string
          description?: string | null
          type?: string
          url?: string | null
          file_path?: string | null
          tags?: string[] | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      activites: {
        Row: {
          id: string
          bilan_id: string | null
          user_id: string | null
          type: string
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          bilan_id?: string | null
          user_id?: string | null
          type: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          bilan_id?: string | null
          user_id?: string | null
          type?: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
    }
  }
}

