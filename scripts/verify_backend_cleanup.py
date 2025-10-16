#!/usr/bin/env python3
"""
Script d'audit inverse : Backend → BDD
Vérifie que toutes les colonnes utilisées dans le backend existent dans la BDD
"""

import re
import os
from pathlib import Path
from collections import defaultdict

# Chemins
MIGRATIONS_DIR = Path(__file__).parent.parent / "supabase" / "migrations"
MODULES_DIR = Path(__file__).parent.parent / "src" / "lib" / "supabase" / "modules"
TYPES_FILE = Path(__file__).parent.parent / "src" / "types" / "database.types.ts"

def extract_sql_columns(migrations_dir):
    """Extrait toutes les colonnes de chaque table depuis les migrations SQL"""
    tables = defaultdict(set)
    
    for sql_file in sorted(migrations_dir.glob("*.sql")):
        content = sql_file.read_text()
        
        # Trouver les CREATE TABLE
        create_matches = re.finditer(
            r'CREATE TABLE (\w+)\s*\((.*?)\);',
            content,
            re.DOTALL
        )
        
        for match in create_matches:
            table_name = match.group(1)
            table_def = match.group(2)
            
            # Extraire les colonnes
            for line in table_def.split('\n'):
                line = line.strip()
                if line and not line.startswith('--') and not line.startswith('CONSTRAINT'):
                    col_match = re.match(r'(\w+)\s+', line)
                    if col_match:
                        col_name = col_match.group(1)
                        if col_name.upper() not in ['PRIMARY', 'FOREIGN', 'UNIQUE', 'CHECK', 'INDEX']:
                            tables[table_name].add(col_name)
        
        # Trouver les ALTER TABLE ADD COLUMN
        alter_matches = re.finditer(
            r'ALTER TABLE (\w+) ADD COLUMN (?:IF NOT EXISTS )?(\w+)',
            content
        )
        
        for match in alter_matches:
            table_name = match.group(1)
            col_name = match.group(2)
            tables[table_name].add(col_name)
    
    return tables

def extract_backend_columns(modules_dir):
    """Extrait toutes les colonnes utilisées dans les modules backend"""
    tables = defaultdict(set)
    
    # Parcourir tous les fichiers TypeScript des modules
    for ts_file in modules_dir.rglob("*.ts"):
        if ts_file.name == "index.ts":
            content = ts_file.read_text()
            
            # Trouver les références aux colonnes dans les requêtes
            # Pattern: .eq('column', ...) ou .select('column') ou .order('column')
            patterns = [
                r"\.eq\('(\w+)'",
                r"\.neq\('(\w+)'",
                r"\.gt\('(\w+)'",
                r"\.gte\('(\w+)'",
                r"\.lt\('(\w+)'",
                r"\.lte\('(\w+)'",
                r"\.order\('(\w+)'",
                r"\.filter\('(\w+)'",
                r"\.or\(['\"](\w+)\.",
                r"\.ilike\('(\w+)'",
            ]
            
            # Trouver les tables utilisées
            table_matches = re.finditer(r"\.from\('(\w+)'\)", content)
            current_tables = [m.group(1) for m in table_matches]
            
            # Pour chaque pattern, extraire les colonnes
            for pattern in patterns:
                col_matches = re.finditer(pattern, content)
                for col_match in col_matches:
                    col_name = col_match.group(1)
                    # Essayer de déterminer la table (approximatif)
                    # On associe la colonne à toutes les tables du fichier
                    for table in current_tables:
                        tables[table].add(col_name)
    
    return tables

def extract_backend_columns_from_types(types_file):
    """Extrait les colonnes depuis les types TypeScript (plus fiable)"""
    tables = defaultdict(set)
    
    content = types_file.read_text()
    
    # Trouver chaque table dans l'interface Database
    table_matches = re.finditer(
        r'(\w+):\s*\{\s*Row:\s*\{(.*?)\};',
        content,
        re.DOTALL
    )
    
    for match in table_matches:
        table_name = match.group(1)
        row_def = match.group(2)
        
        # Extraire les colonnes
        col_matches = re.finditer(r'(\w+):', row_def)
        for col_match in col_matches:
            col_name = col_match.group(1)
            tables[table_name].add(col_name)
    
    return tables

def compare_backend_to_bdd(backend_tables, sql_tables):
    """Compare les colonnes du backend avec celles de la BDD"""
    print("=" * 80)
    print("AUDIT INVERSE : BACKEND → BDD")
    print("=" * 80)
    print()
    
    all_tables = set(backend_tables.keys()) | set(sql_tables.keys())
    
    phantom_data = []
    clean_tables = []
    
    for table in sorted(all_tables):
        backend_cols = backend_tables.get(table, set())
        sql_cols = sql_tables.get(table, set())
        
        # Colonnes utilisées dans le backend mais absentes de la BDD
        phantom_cols = backend_cols - sql_cols
        
        if phantom_cols:
            phantom_data.append({
                'table': table,
                'phantom_cols': phantom_cols
            })
        else:
            clean_tables.append(table)
    
    # Afficher les résultats
    print(f"📊 RÉSULTATS")
    print(f"   Tables analysées : {len(all_tables)}")
    print(f"   ✅ Tables propres : {len(clean_tables)}")
    print(f"   ⚠️  Tables avec données fantômes : {len(phantom_data)}")
    print()
    
    if clean_tables:
        print("✅ TABLES PROPRES (Aucune donnée fantôme)")
        print("-" * 80)
        for table in clean_tables:
            print(f"   ✓ {table}")
        print()
    
    if phantom_data:
        print("⚠️  DONNÉES FANTÔMES DÉTECTÉES")
        print("-" * 80)
        print("Ces colonnes sont utilisées dans le backend mais n'existent pas dans la BDD:")
        print()
        for issue in phantom_data:
            print(f"📋 Table: {issue['table']}")
            for col in sorted(issue['phantom_cols']):
                print(f"   ⚠️  Colonne fantôme: {col}")
            print()
    
    # Score final
    score = (len(clean_tables) / len(all_tables) * 100) if all_tables else 100
    print("=" * 80)
    print(f"SCORE DE PROPRETÉ : {score:.1f}%")
    print("=" * 80)
    
    return len(phantom_data) == 0

def main():
    print("Extraction des colonnes depuis les migrations SQL...")
    sql_tables = extract_sql_columns(MIGRATIONS_DIR)
    
    print("Extraction des colonnes utilisées dans les types TypeScript...")
    backend_tables = extract_backend_columns_from_types(TYPES_FILE)
    
    print()
    success = compare_backend_to_bdd(backend_tables, sql_tables)
    
    if success:
        print("\n✅ Aucune donnée fantôme détectée. Le backend est propre!")
    else:
        print("\n⚠️  Des données fantômes ont été détectées. Nettoyage recommandé.")
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())

