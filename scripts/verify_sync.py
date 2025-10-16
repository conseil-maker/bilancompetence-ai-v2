#!/usr/bin/env python3
"""
Script de vérification de la synchronisation BDD ↔ Backend
Vérifie que les types TypeScript correspondent exactement au schéma SQL
"""

import re
import os
from pathlib import Path
from collections import defaultdict

# Chemins
MIGRATIONS_DIR = Path(__file__).parent.parent / "supabase" / "migrations"
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
                    # Extraire le nom de la colonne (premier mot)
                    col_match = re.match(r'(\w+)\s+', line)
                    if col_match:
                        col_name = col_match.group(1)
                        # Ignorer les mots-clés SQL
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

def extract_ts_columns(types_file):
    """Extrait toutes les colonnes de chaque table depuis les types TypeScript"""
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

def compare_schemas(sql_tables, ts_tables):
    """Compare les schémas SQL et TypeScript"""
    print("=" * 80)
    print("VÉRIFICATION DE SYNCHRONISATION BDD ↔ BACKEND")
    print("=" * 80)
    print()
    
    all_tables = set(sql_tables.keys()) | set(ts_tables.keys())
    
    issues = []
    perfect_tables = []
    
    for table in sorted(all_tables):
        sql_cols = sql_tables.get(table, set())
        ts_cols = ts_tables.get(table, set())
        
        missing_in_ts = sql_cols - ts_cols
        missing_in_sql = ts_cols - sql_cols
        
        if missing_in_ts or missing_in_sql:
            issues.append({
                'table': table,
                'missing_in_ts': missing_in_ts,
                'missing_in_sql': missing_in_sql
            })
        else:
            perfect_tables.append(table)
    
    # Afficher les résultats
    print(f"📊 RÉSULTATS")
    print(f"   Tables analysées : {len(all_tables)}")
    print(f"   ✅ Tables parfaites : {len(perfect_tables)}")
    print(f"   ❌ Tables avec problèmes : {len(issues)}")
    print()
    
    if perfect_tables:
        print("✅ TABLES PARFAITEMENT SYNCHRONISÉES")
        print("-" * 80)
        for table in perfect_tables:
            print(f"   ✓ {table}")
        print()
    
    if issues:
        print("❌ PROBLÈMES DÉTECTÉS")
        print("-" * 80)
        for issue in issues:
            print(f"\n📋 Table: {issue['table']}")
            
            if issue['missing_in_ts']:
                print(f"   🔴 Colonnes manquantes dans TypeScript:")
                for col in sorted(issue['missing_in_ts']):
                    print(f"      - {col}")
            
            if issue['missing_in_sql']:
                print(f"   🔴 Colonnes manquantes dans SQL:")
                for col in sorted(issue['missing_in_sql']):
                    print(f"      - {col}")
        print()
    
    # Score final
    score = (len(perfect_tables) / len(all_tables) * 100) if all_tables else 0
    print("=" * 80)
    print(f"SCORE DE SYNCHRONISATION : {score:.1f}%")
    print("=" * 80)
    
    return len(issues) == 0

def main():
    print("Extraction des colonnes depuis les migrations SQL...")
    sql_tables = extract_sql_columns(MIGRATIONS_DIR)
    
    print("Extraction des colonnes depuis les types TypeScript...")
    ts_tables = extract_ts_columns(TYPES_FILE)
    
    print()
    success = compare_schemas(sql_tables, ts_tables)
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())

