-- Script de création des utilisateurs de test
-- À exécuter dans l'éditeur SQL de Supabase

-- ============================================
-- ÉTAPE 1 : Créer les utilisateurs dans auth.users
-- ============================================

-- Note : Supabase ne permet pas de créer des utilisateurs directement via SQL
-- Il faut utiliser l'API ou l'interface web
-- Ce script va seulement créer les profils et attribuer les rôles

-- ============================================
-- ÉTAPE 2 : Créer les profils avec les rôles
-- ============================================

-- Fonction pour créer un profil avec un rôle spécifique
-- Cette fonction sera appelée automatiquement par le trigger après création d'un utilisateur

-- Vérifier si la table profiles existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        CREATE TABLE public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'beneficiaire',
            first_name TEXT,
            last_name TEXT,
            phone TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'consultant', 'beneficiaire'))
        );
        
        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
            
        CREATE POLICY "Users can update their own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
            
        CREATE POLICY "Admins can view all profiles" ON public.profiles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
    END IF;
END $$;

-- ============================================
-- ÉTAPE 3 : Créer un trigger pour auto-créer les profils
-- ============================================

-- Fonction qui sera appelée par le trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'beneficiaire')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INSTRUCTIONS POUR CRÉER LES UTILISATEURS
-- ============================================

/*
IMPORTANT : Les utilisateurs doivent être créés via l'interface Supabase ou l'API

1. Aller sur : https://supabase.com/dashboard/project/rjklvexwqukhuniregna/auth/users
2. Cliquer sur "Add user" ou "Invite user"
3. Créer les utilisateurs suivants :

ADMIN :
- Email : admin@bilancompetence.ai
- Password : Admin123!@#
- Metadata : {"role": "admin"}

CONSULTANT :
- Email : consultant@bilancompetence.ai
- Password : Consultant123!@#
- Metadata : {"role": "consultant"}

BÉNÉFICIAIRE :
- Email : beneficiaire@bilancompetence.ai
- Password : Beneficiaire123!@#
- Metadata : {"role": "beneficiaire"}

4. Cocher "Auto Confirm User" pour chaque utilisateur

Le trigger créera automatiquement le profil avec le bon rôle !
*/

-- ============================================
-- ALTERNATIVE : Mise à jour manuelle des rôles
-- ============================================

-- Si les utilisateurs existent déjà mais n'ont pas le bon rôle,
-- vous pouvez les mettre à jour avec ces requêtes :

-- Mettre à jour le rôle d'un utilisateur spécifique
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'admin@bilancompetence.ai';

-- UPDATE public.profiles
-- SET role = 'consultant'
-- WHERE email = 'consultant@bilancompetence.ai';

-- UPDATE public.profiles
-- SET role = 'beneficiaire'
-- WHERE email = 'beneficiaire@bilancompetence.ai';

