-- =====================================================
-- Migration: Renforcement de la Sécurité RLS
-- Date: 2025-10-15
-- Description: Compléter et renforcer les politiques Row Level Security
-- Recommandation: Gemini (Expert Technique)
-- =====================================================

-- =====================================================
-- AUDIT DES POLITIQUES EXISTANTES
-- =====================================================

-- Les politiques de base (SELECT) sont déjà en place sur :
-- ✅ profiles (SELECT, UPDATE pour soi-même + ALL pour admins)
-- ✅ bilans (SELECT pour bénéficiaires, consultants, admins)
-- ✅ tests (SELECT pour bénéficiaires et consultants)
-- ✅ documents (SELECT pour bénéficiaires et consultants)
-- ✅ messages (SELECT + INSERT)
-- ✅ resources (SELECT pour public et créateurs + INSERT pour consultants/admins)

-- MANQUANT :
-- ❌ Politiques INSERT/UPDATE/DELETE pour bilans
-- ❌ Politiques INSERT/UPDATE pour tests
-- ❌ Politiques INSERT/UPDATE/DELETE pour documents
-- ❌ Politiques UPDATE/DELETE pour messages
-- ❌ Politiques UPDATE/DELETE pour resources
-- ❌ Politiques pour activites

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: profiles
-- =====================================================

-- Permettre l'insertion de profils (lors de l'inscription)
CREATE POLICY "Les nouveaux utilisateurs peuvent créer leur profil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: bilans
-- =====================================================

-- INSERT: Seuls les admins et consultants peuvent créer des bilans
CREATE POLICY "Les consultants et admins peuvent créer des bilans"
  ON bilans FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('consultant', 'admin')
    )
  );

-- UPDATE: Les bénéficiaires peuvent modifier leurs propres bilans
CREATE POLICY "Les bénéficiaires peuvent modifier leurs bilans"
  ON bilans FOR UPDATE
  USING (beneficiaire_id = auth.uid())
  WITH CHECK (beneficiaire_id = auth.uid());

-- UPDATE: Les consultants peuvent modifier les bilans assignés
CREATE POLICY "Les consultants peuvent modifier les bilans assignés"
  ON bilans FOR UPDATE
  USING (consultant_id = auth.uid())
  WITH CHECK (consultant_id = auth.uid());

-- UPDATE: Les admins peuvent tout modifier
CREATE POLICY "Les admins peuvent modifier tous les bilans"
  ON bilans FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- DELETE: Seuls les admins peuvent supprimer des bilans
CREATE POLICY "Seuls les admins peuvent supprimer des bilans"
  ON bilans FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: tests
-- =====================================================

-- INSERT: Les bénéficiaires peuvent créer des tests pour leurs bilans
CREATE POLICY "Les bénéficiaires peuvent créer des tests"
  ON tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.beneficiaire_id = auth.uid()
    )
  );

-- INSERT: Les consultants peuvent créer des tests pour leurs bilans
CREATE POLICY "Les consultants peuvent créer des tests"
  ON tests FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
  );

-- UPDATE: Les bénéficiaires peuvent modifier leurs tests
CREATE POLICY "Les bénéficiaires peuvent modifier leurs tests"
  ON tests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.beneficiaire_id = auth.uid()
    )
  );

-- UPDATE: Les consultants peuvent modifier les tests de leurs bilans
CREATE POLICY "Les consultants peuvent modifier les tests"
  ON tests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = tests.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
  );

-- DELETE: Seuls les admins peuvent supprimer des tests
CREATE POLICY "Seuls les admins peuvent supprimer des tests"
  ON tests FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Politique ALL pour admins sur tests
CREATE POLICY "Les admins peuvent tout faire sur les tests"
  ON tests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: documents
-- =====================================================

-- INSERT: Les bénéficiaires peuvent uploader des documents
CREATE POLICY "Les bénéficiaires peuvent uploader des documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = documents.bilan_id
      AND bilans.beneficiaire_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

-- INSERT: Les consultants peuvent uploader des documents
CREATE POLICY "Les consultants peuvent uploader des documents"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = documents.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
    AND uploaded_by = auth.uid()
  );

-- UPDATE: Seul l'uploader peut modifier les métadonnées
CREATE POLICY "Les uploaders peuvent modifier leurs documents"
  ON documents FOR UPDATE
  USING (uploaded_by = auth.uid());

-- DELETE: Seul l'uploader ou un admin peut supprimer
CREATE POLICY "Les uploaders peuvent supprimer leurs documents"
  ON documents FOR DELETE
  USING (uploaded_by = auth.uid());

CREATE POLICY "Les admins peuvent supprimer tous les documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: messages
-- =====================================================

-- UPDATE: Seul le destinataire peut marquer comme lu
CREATE POLICY "Les destinataires peuvent marquer les messages comme lus"
  ON messages FOR UPDATE
  USING (receiver_id = auth.uid())
  WITH CHECK (receiver_id = auth.uid());

-- DELETE: Seul l'expéditeur ou le destinataire peut supprimer
CREATE POLICY "Les utilisateurs peuvent supprimer leurs messages"
  ON messages FOR DELETE
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- =====================================================
-- RENFORCEMENT DES POLITIQUES - TABLE: resources
-- =====================================================

-- UPDATE: Seul le créateur peut modifier
CREATE POLICY "Les créateurs peuvent modifier leurs ressources"
  ON resources FOR UPDATE
  USING (created_by = auth.uid());

-- UPDATE: Les admins peuvent tout modifier
CREATE POLICY "Les admins peuvent modifier toutes les ressources"
  ON resources FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- DELETE: Seul le créateur ou un admin peut supprimer
CREATE POLICY "Les créateurs peuvent supprimer leurs ressources"
  ON resources FOR DELETE
  USING (created_by = auth.uid());

CREATE POLICY "Les admins peuvent supprimer toutes les ressources"
  ON resources FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- NOUVELLES POLITIQUES - TABLE: activites
-- =====================================================

-- SELECT: Les utilisateurs voient leurs propres activités
CREATE POLICY "Les utilisateurs voient leurs activités"
  ON activites FOR SELECT
  USING (user_id = auth.uid());

-- SELECT: Les consultants voient les activités de leurs bilans
CREATE POLICY "Les consultants voient les activités de leurs bilans"
  ON activites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM bilans
      WHERE bilans.id = activites.bilan_id
      AND bilans.consultant_id = auth.uid()
    )
  );

-- SELECT: Les admins voient toutes les activités
CREATE POLICY "Les admins voient toutes les activités"
  ON activites FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT: Tout utilisateur authentifié peut créer des activités
CREATE POLICY "Les utilisateurs peuvent créer des activités"
  ON activites FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- UPDATE/DELETE: Seuls les admins (pour nettoyage/maintenance)
CREATE POLICY "Seuls les admins peuvent modifier les activités"
  ON activites FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Seuls les admins peuvent supprimer les activités"
  ON activites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- VALIDATION DE LA SÉCURITÉ
-- =====================================================

-- Fonction pour vérifier qu'un utilisateur a un rôle spécifique
CREATE OR REPLACE FUNCTION has_role(required_role user_role)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier qu'un utilisateur est propriétaire d'un bilan
CREATE OR REPLACE FUNCTION is_bilan_owner(bilan_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM bilans
    WHERE id = bilan_uuid
    AND (beneficiaire_id = auth.uid() OR consultant_id = auth.uid())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTAIRES ET DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "Les nouveaux utilisateurs peuvent créer leur profil" ON profiles IS
'Permet l''auto-inscription des nouveaux utilisateurs';

COMMENT ON POLICY "Les consultants et admins peuvent créer des bilans" ON bilans IS
'Seuls les consultants et admins peuvent initier un nouveau bilan';

COMMENT ON POLICY "Les bénéficiaires peuvent modifier leurs bilans" ON bilans IS
'Les bénéficiaires peuvent mettre à jour les informations de leurs bilans';

COMMENT ON POLICY "Les bénéficiaires peuvent créer des tests" ON tests IS
'Les bénéficiaires peuvent passer des tests pour leurs bilans';

COMMENT ON POLICY "Les bénéficiaires peuvent uploader des documents" ON documents IS
'Les bénéficiaires peuvent uploader CV, lettres de motivation, etc.';

COMMENT ON FUNCTION has_role(user_role) IS
'Fonction utilitaire pour vérifier le rôle d''un utilisateur';

COMMENT ON FUNCTION is_bilan_owner(UUID) IS
'Fonction utilitaire pour vérifier la propriété d''un bilan';

-- =====================================================
-- RÉSUMÉ DES POLITIQUES RLS
-- =====================================================

-- TABLE: profiles
-- ✅ SELECT (soi-même + admins)
-- ✅ INSERT (auto-inscription)
-- ✅ UPDATE (soi-même + admins)
-- ✅ ALL (admins)

-- TABLE: bilans
-- ✅ SELECT (bénéficiaires, consultants, admins)
-- ✅ INSERT (consultants, admins)
-- ✅ UPDATE (bénéficiaires, consultants, admins)
-- ✅ DELETE (admins uniquement)
-- ✅ ALL (admins)

-- TABLE: tests
-- ✅ SELECT (bénéficiaires, consultants)
-- ✅ INSERT (bénéficiaires, consultants)
-- ✅ UPDATE (bénéficiaires, consultants)
-- ✅ DELETE (admins uniquement)
-- ✅ ALL (admins)

-- TABLE: documents
-- ✅ SELECT (bénéficiaires, consultants)
-- ✅ INSERT (bénéficiaires, consultants)
-- ✅ UPDATE (uploader)
-- ✅ DELETE (uploader, admins)

-- TABLE: messages
-- ✅ SELECT (expéditeur, destinataire)
-- ✅ INSERT (expéditeur)
-- ✅ UPDATE (destinataire pour marquer comme lu)
-- ✅ DELETE (expéditeur, destinataire)

-- TABLE: resources
-- ✅ SELECT (public + créateurs)
-- ✅ INSERT (consultants, admins)
-- ✅ UPDATE (créateurs, admins)
-- ✅ DELETE (créateurs, admins)

-- TABLE: activites
-- ✅ SELECT (utilisateur, consultants de leurs bilans, admins)
-- ✅ INSERT (utilisateur)
-- ✅ UPDATE (admins uniquement)
-- ✅ DELETE (admins uniquement)
-- ✅ ALL (admins)

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

