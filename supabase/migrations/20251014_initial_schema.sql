-- =====================================================
-- Migration Initiale - BilanCompetence.AI v2
-- Date: 2025-10-14
-- Description: Création du schéma de base de données complet
-- =====================================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Rôles utilisateurs
CREATE TYPE user_role AS ENUM ('beneficiaire', 'consultant', 'admin');

-- Statuts des bilans
CREATE TYPE bilan_status AS ENUM ('en_attente', 'preliminaire', 'investigation', 'conclusion', 'termine', 'abandonne');

-- Types de tests
CREATE TYPE test_type AS ENUM ('personnalite', 'interets', 'competences', 'valeurs', 'autre');

-- Statuts des messages
CREATE TYPE message_status AS ENUM ('envoye', 'lu', 'archive');

-- =====================================================
-- TABLE: profiles
-- Profils utilisateurs étendus (lié à auth.users)
-- =====================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'beneficiaire',
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Index pour les recherches
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- =====================================================
-- TABLE: bilans
-- Dossiers de bilans de compétences
-- =====================================================

CREATE TABLE bilans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  beneficiaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  consultant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations du bilan
  status bilan_status DEFAULT 'en_attente',
  titre TEXT NOT NULL,
  description TEXT,
  objectifs JSONB, -- Objectifs définis avec le bénéficiaire
  
  -- Dates clés
  date_debut DATE,
  date_fin_prevue DATE,
  date_fin_reelle DATE,
  
  -- Phase préliminaire
  preliminaire_completed_at TIMESTAMP WITH TIME ZONE,
  preliminaire_notes TEXT,
  
  -- Phase d'investigation
  investigation_completed_at TIMESTAMP WITH TIME ZONE,
  investigation_notes TEXT,
  
  -- Phase de conclusion
  conclusion_completed_at TIMESTAMP WITH TIME ZONE,
  synthese_document_url TEXT, -- URL du document de synthèse final
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_dates CHECK (date_fin_prevue IS NULL OR date_debut IS NULL OR date_fin_prevue >= date_debut)
);

-- Index
CREATE INDEX idx_bilans_beneficiaire ON bilans(beneficiaire_id);
CREATE INDEX idx_bilans_consultant ON bilans(consultant_id);
CREATE INDEX idx_bilans_status ON bilans(status);

-- =====================================================
-- TABLE: tests
-- Tests psychométriques et évaluations
-- =====================================================

CREATE TABLE tests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations du test
  type test_type NOT NULL,
  nom TEXT NOT NULL,
  description TEXT,
  
  -- Résultats
  resultats JSONB, -- Résultats structurés du test
  score NUMERIC,
  interpretation TEXT,
  
  -- Métadonnées
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_tests_bilan ON tests(bilan_id);
CREATE INDEX idx_tests_type ON tests(type);

-- =====================================================
-- TABLE: documents
-- Stockage des métadonnées de documents
-- =====================================================

CREATE TABLE documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations du document
  nom TEXT NOT NULL,
  type TEXT NOT NULL, -- cv, lettre_motivation, synthese, etc.
  file_path TEXT NOT NULL, -- Chemin dans Supabase Storage
  file_size INTEGER,
  mime_type TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_documents_bilan ON documents(bilan_id);
CREATE INDEX idx_documents_type ON documents(type);

-- =====================================================
-- TABLE: messages
-- Messagerie bénéficiaire-consultant
-- =====================================================

CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  
  -- Contenu
  subject TEXT,
  content TEXT NOT NULL,
  status message_status DEFAULT 'envoye',
  
  -- Métadonnées
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Index
CREATE INDEX idx_messages_bilan ON messages(bilan_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_status ON messages(status);

-- =====================================================
-- TABLE: resources
-- Bibliothèque de ressources pédagogiques
-- =====================================================

CREATE TABLE resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations de la ressource
  titre TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- article, video, pdf, lien, etc.
  url TEXT,
  file_path TEXT, -- Si fichier hébergé
  tags TEXT[], -- Tags pour la recherche
  
  -- Visibilité
  is_public BOOLEAN DEFAULT false,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_resources_created_by ON resources(created_by);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);

-- =====================================================
-- TABLE: activites
-- Journal d'activité pour le suivi Qualiopi
-- =====================================================

CREATE TABLE activites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bilan_id UUID REFERENCES bilans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  
  -- Informations de l'activité
  type TEXT NOT NULL, -- connexion, test_complete, message_envoye, etc.
  description TEXT,
  metadata JSONB, -- Données supplémentaires
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_activites_bilan ON activites(bilan_id);
CREATE INDEX idx_activites_user ON activites(user_id);
CREATE INDEX idx_activites_type ON activites(type);
CREATE INDEX idx_activites_created_at ON activites(created_at);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bilans_updated_at BEFORE UPDATE ON bilans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bilans ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE activites ENABLE ROW LEVEL SECURITY;

-- Policies pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Les admins peuvent tout voir"
  ON profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies pour bilans
CREATE POLICY "Les bénéficiaires voient leurs bilans"
  ON bilans FOR SELECT
  USING (beneficiaire_id = auth.uid());

CREATE POLICY "Les consultants voient les bilans assignés"
  ON bilans FOR SELECT
  USING (consultant_id = auth.uid());

CREATE POLICY "Les admins voient tous les bilans"
  ON bilans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies pour tests
CREATE POLICY "Les bénéficiaires voient leurs tests"
  ON tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les tests de leurs bilans"
  ON tests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
  );

-- Policies pour documents
CREATE POLICY "Les bénéficiaires voient leurs documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = documents.bilan_id
      AND bilans.beneficiaire_id = auth.uid()
    )
  );

CREATE POLICY "Les consultants voient les documents de leurs bilans"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = documents.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
  );

-- Policies pour messages
CREATE POLICY "Les utilisateurs voient leurs messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Les utilisateurs peuvent envoyer des messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Policies pour resources
CREATE POLICY "Tout le monde peut voir les ressources publiques"
  ON resources FOR SELECT
  USING (is_public = true);

CREATE POLICY "Les créateurs voient leurs ressources"
  ON resources FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Les consultants et admins peuvent créer des ressources"
  ON resources FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('consultant', 'admin')
    )
  );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE profiles IS 'Profils utilisateurs étendus avec rôles RBAC';
COMMENT ON TABLE bilans IS 'Dossiers de bilans de compétences avec suivi des 3 phases';
COMMENT ON TABLE tests IS 'Tests psychométriques et évaluations';
COMMENT ON TABLE documents IS 'Métadonnées des documents stockés dans Supabase Storage';
COMMENT ON TABLE messages IS 'Messagerie sécurisée bénéficiaire-consultant';
COMMENT ON TABLE resources IS 'Bibliothèque de ressources pédagogiques';
COMMENT ON TABLE activites IS 'Journal d''activité pour conformité Qualiopi';

