#!/usr/bin/env python3
"""
Script pour créer automatiquement les utilisateurs de test dans Supabase
"""

import os
import requests
import json

# Configuration Supabase
SUPABASE_URL = "https://rjklvexwqukhuniregna.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqa2x2ZXh3cXVraHVuaXJlcW5hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDQzMjg4OSwiZXhwIjoyMDc2MDA4ODg5fQ.v12zFjQGC3v_dTq4iNxTGNg8BbXX3JYo5sc_Z4hn3sM"

# Utilisateurs à créer
USERS = [
    {
        "email": "admin@bilancompetence.ai",
        "password": "Admin123!@#",
        "role": "admin",
        "user_metadata": {
            "role": "admin",
            "first_name": "Admin",
            "last_name": "BilanCompetence"
        }
    },
    {
        "email": "consultant@bilancompetence.ai",
        "password": "Consultant123!@#",
        "role": "consultant",
        "user_metadata": {
            "role": "consultant",
            "first_name": "Jean",
            "last_name": "Consultant"
        }
    },
    {
        "email": "beneficiaire@bilancompetence.ai",
        "password": "Beneficiaire123!@#",
        "role": "beneficiaire",
        "user_metadata": {
            "role": "beneficiaire",
            "first_name": "Marie",
            "last_name": "Dupont"
        }
    }
]

def create_user(user_data):
    """Créer un utilisateur via l'API Admin de Supabase"""
    
    url = f"{SUPABASE_URL}/auth/v1/admin/users"
    
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "email": user_data["email"],
        "password": user_data["password"],
        "email_confirm": True,
        "user_metadata": user_data["user_metadata"]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200 or response.status_code == 201:
            user = response.json()
            print(f"✅ Utilisateur créé : {user_data['email']} (ID: {user.get('id', 'N/A')})")
            return user
        elif response.status_code == 422 and "already been registered" in response.text:
            print(f"⚠️  Utilisateur existe déjà : {user_data['email']}")
            return None
        else:
            print(f"❌ Erreur lors de la création de {user_data['email']}")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Exception lors de la création de {user_data['email']}: {str(e)}")
        return None

def update_profile(user_id, email, role):
    """Mettre à jour le profil de l'utilisateur dans la table profiles"""
    
    url = f"{SUPABASE_URL}/rest/v1/profiles"
    
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }
    
    payload = {
        "id": user_id,
        "email": email,
        "role": role
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code in [200, 201, 204]:
            print(f"   ✅ Profil créé/mis à jour pour {email}")
            return True
        else:
            print(f"   ⚠️  Erreur lors de la mise à jour du profil de {email}")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Exception lors de la mise à jour du profil: {str(e)}")
        return False

def main():
    print("🚀 Création des utilisateurs de test...\n")
    
    created_users = []
    
    for user_data in USERS:
        print(f"📝 Création de {user_data['email']}...")
        user = create_user(user_data)
        
        if user and user.get('id'):
            # Mettre à jour le profil
            update_profile(user['id'], user_data['email'], user_data['role'])
            created_users.append(user_data)
        
        print()
    
    print("\n" + "="*60)
    print("✅ RÉSUMÉ DES UTILISATEURS CRÉÉS")
    print("="*60 + "\n")
    
    if created_users:
        print("Identifiants de connexion :\n")
        for user in created_users:
            print(f"🔹 {user['role'].upper()}")
            print(f"   Email    : {user['email']}")
            print(f"   Password : {user['password']}")
            print(f"   URL      : https://bilancompetence-ai-v2.vercel.app/login")
            print()
    else:
        print("⚠️  Aucun nouvel utilisateur créé (ils existent peut-être déjà)")
        print("\nVous pouvez essayer de vous connecter avec :")
        for user in USERS:
            print(f"\n🔹 {user['role'].upper()}")
            print(f"   Email    : {user['email']}")
            print(f"   Password : {user['password']}")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()

