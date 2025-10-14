-- =====================================================
-- Données de Test - BilanCompetence.AI v2
-- =====================================================

-- Note: Les utilisateurs doivent d'abord être créés via Supabase Auth
-- Ces données supposent que les UUID correspondent aux utilisateurs créés

-- =====================================================
-- PROFILES DE TEST
-- =====================================================

-- Admin
INSERT INTO profiles (id, role, email, first_name, last_name, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', 'admin@netz-informatique.fr', 'Admin', 'Système', '+33612345678');

-- Consultants
INSERT INTO profiles (id, role, email, first_name, last_name, phone, bio)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'consultant', 'consultant1@netz-informatique.fr', 'Marie', 'Dupont', '+33612345679', 'Consultante en bilans de compétences depuis 10 ans, spécialisée dans les reconversions professionnelles.'),
  ('00000000-0000-0000-0000-000000000003', 'consultant', 'consultant2@netz-informatique.fr', 'Pierre', 'Martin', '+33612345680', 'Expert en orientation professionnelle et coaching de carrière.');

-- Bénéficiaires
INSERT INTO profiles (id, role, email, first_name, last_name, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000004', 'beneficiaire', 'beneficiaire1@example.com', 'Sophie', 'Bernard', '+33612345681'),
  ('00000000-0000-0000-0000-000000000005', 'beneficiaire', 'beneficiaire2@example.com', 'Thomas', 'Petit', '+33612345682'),
  ('00000000-0000-0000-0000-000000000006', 'beneficiaire', 'beneficiaire3@example.com', 'Julie', 'Moreau', '+33612345683');

-- =====================================================
-- BILANS DE TEST
-- =====================================================

INSERT INTO bilans (id, beneficiaire_id, consultant_id, titre, description, status, date_debut, date_fin_prevue, objectifs)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Bilan de compétences - Reconversion professionnelle',
    'Bilan pour envisager une reconversion dans le domaine du numérique',
    'investigation',
    '2025-01-15',
    '2025-04-15',
    '{"objectifs": ["Identifier mes compétences transférables", "Explorer les métiers du numérique", "Construire un projet professionnel réaliste"]}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002',
    'Bilan de compétences - Évolution de carrière',
    'Bilan pour évoluer vers un poste de management',
    'preliminaire',
    '2025-02-01',
    '2025-05-01',
    '{"objectifs": ["Évaluer mes compétences managériales", "Identifier les formations nécessaires"]}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    'Bilan de compétences - Création d''entreprise',
    'Bilan pour préparer la création d''une entreprise',
    'en_attente',
    NULL,
    NULL,
    NULL
  );

-- =====================================================
-- TESTS DE TEST
-- =====================================================

INSERT INTO tests (bilan_id, type, nom, description, resultats, score, interpretation, completed_at)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    'personnalite',
    'Test MBTI',
    'Myers-Briggs Type Indicator',
    '{"type": "INTJ", "dimensions": {"E/I": "I", "S/N": "N", "T/F": "T", "J/P": "J"}}'::jsonb,
    NULL,
    'Profil INTJ - Architecte stratégique, analytique et indépendant.',
    '2025-01-20 10:00:00'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    'interets',
    'Test RIASEC',
    'Test d''intérêts professionnels de Holland',
    '{"codes": ["I", "A", "S"], "scores": {"R": 12, "I": 28, "A": 24, "S": 22, "E": 15, "C": 18}}'::jsonb,
    NULL,
    'Profil IAS - Intérêts pour les activités investigatrices, artistiques et sociales.',
    '2025-01-22 14:30:00'
  );

-- =====================================================
-- RESSOURCES DE TEST
-- =====================================================

INSERT INTO resources (created_by, titre, description, type, url, tags, is_public)
VALUES 
  (
    '00000000-0000-0000-0000-000000000002',
    'Guide de la reconversion professionnelle',
    'Guide complet pour réussir sa reconversion professionnelle',
    'pdf',
    'https://example.com/guide-reconversion.pdf',
    ARRAY['reconversion', 'guide', 'carriere'],
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Les métiers du numérique en 2025',
    'Panorama des métiers porteurs dans le secteur numérique',
    'article',
    'https://example.com/metiers-numerique-2025',
    ARRAY['numerique', 'metiers', 'tendances'],
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Créer son entreprise : les étapes clés',
    'Vidéo explicative sur les étapes de création d''entreprise',
    'video',
    'https://www.youtube.com/watch?v=example',
    ARRAY['entrepreneuriat', 'creation', 'entreprise'],
    true
  );

-- =====================================================
-- MESSAGES DE TEST
-- =====================================================

INSERT INTO messages (bilan_id, sender_id, receiver_id, subject, content, status, read_at)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000004',
    'Bienvenue dans votre bilan de compétences',
    'Bonjour Sophie, je suis ravie de vous accompagner dans votre bilan de compétences. N''hésitez pas à me contacter si vous avez des questions.',
    'lu',
    '2025-01-16 09:30:00'
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'Question sur le test MBTI',
    'Bonjour Marie, j''ai une question concernant l''interprétation de mon test MBTI. Pouvez-vous m''expliquer ce que signifie le profil INTJ ?',
    'lu',
    '2025-01-21 11:00:00'
  );

-- =====================================================
-- ACTIVITÉS DE TEST (pour Qualiopi)
-- =====================================================

INSERT INTO activites (bilan_id, user_id, type, description, metadata)
VALUES 
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'connexion',
    'Connexion à la plateforme',
    '{"ip": "192.168.1.1", "user_agent": "Mozilla/5.0..."}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000004',
    'test_complete',
    'Complétion du test MBTI',
    '{"test_id": "uuid-du-test", "duree_minutes": 25}'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'message_envoye',
    'Message envoyé au bénéficiaire',
    '{"message_id": "uuid-du-message"}'::jsonb
  );

-- =====================================================
-- COMMENTAIRES
-- =====================================================

-- Note: Pour utiliser ces données de test, vous devez d'abord :
-- 1. Créer les utilisateurs correspondants dans Supabase Auth
-- 2. Remplacer les UUID fictifs par les vrais UUID générés
-- 3. Exécuter ce script SQL dans l'éditeur SQL de Supabase

