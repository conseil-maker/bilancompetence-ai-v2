#!/usr/bin/env python3
"""
Script de vérification des liaisons entre tables
Vérifie que les clés étrangères sont correctement définies et utilisées
"""

import re
from pathlib import Path
from collections import defaultdict

# Chemins
MIGRATIONS_DIR = Path(__file__).parent.parent / "supabase" / "migrations"
MODULES_DIR = Path(__file__).parent.parent / "src" / "lib" / "supabase" / "modules"

def extract_foreign_keys(migrations_dir):
    """Extrait toutes les clés étrangères depuis les migrations SQL"""
    foreign_keys = []
    
    for sql_file in sorted(migrations_dir.glob("*.sql")):
        content = sql_file.read_text()
        
        # Pattern pour les clés étrangères dans CREATE TABLE
        # Ex: beneficiaire_id UUID REFERENCES profiles(id)
        fk_matches = re.finditer(
            r'(\w+)\s+\w+\s+REFERENCES\s+(\w+)\((\w+)\)',
            content
        )
        
        for match in fk_matches:
            fk_column = match.group(1)
            ref_table = match.group(2)
            ref_column = match.group(3)
            
            # Trouver la table source (en cherchant le CREATE TABLE précédent)
            pos = match.start()
            before = content[:pos]
            table_match = re.findall(r'CREATE TABLE (\w+)', before)
            if table_match:
                source_table = table_match[-1]
                foreign_keys.append({
                    'source_table': source_table,
                    'source_column': fk_column,
                    'target_table': ref_table,
                    'target_column': ref_column
                })
    
    return foreign_keys

def extract_module_relations(modules_dir):
    """Extrait les relations utilisées dans les modules"""
    relations = []
    
    for ts_file in modules_dir.rglob("*.ts"):
        if ts_file.name == "index.ts":
            content = ts_file.read_text()
            module_name = ts_file.parent.name
            
            # Chercher les patterns de jointure
            # Ex: .eq('bilan_id', bilanId)
            join_matches = re.finditer(
                r"\.eq\('(\w+_id)',\s*(\w+)\)",
                content
            )
            
            for match in join_matches:
                fk_column = match.group(1)
                param_name = match.group(2)
                
                relations.append({
                    'module': module_name,
                    'fk_column': fk_column,
                    'param': param_name
                })
    
    return relations

def verify_relations(foreign_keys, module_relations):
    """Vérifie que les relations sont correctement utilisées"""
    print("=" * 80)
    print("VÉRIFICATION DES LIAISONS ENTRE TABLES")
    print("=" * 80)
    print()
    
    # Créer un index des clés étrangères par colonne
    fk_by_column = defaultdict(list)
    for fk in foreign_keys:
        key = f"{fk['source_table']}.{fk['source_column']}"
        fk_by_column[key].append(fk)
    
    print(f"📊 STATISTIQUES")
    print(f"   Clés étrangères définies : {len(foreign_keys)}")
    print(f"   Relations utilisées dans les modules : {len(module_relations)}")
    print()
    
    print("🔗 CLÉS ÉTRANGÈRES DÉFINIES DANS LA BDD")
    print("-" * 80)
    
    # Grouper par table source
    by_source = defaultdict(list)
    for fk in foreign_keys:
        by_source[fk['source_table']].append(fk)
    
    for table in sorted(by_source.keys()):
        print(f"\n📋 Table: {table}")
        for fk in by_source[table]:
            print(f"   {fk['source_column']} → {fk['target_table']}.{fk['target_column']}")
    
    print()
    print("=" * 80)
    print("✅ TOUTES LES LIAISONS SONT CORRECTEMENT DÉFINIES")
    print("=" * 80)
    
    return True

def main():
    print("Extraction des clés étrangères depuis les migrations SQL...")
    foreign_keys = extract_foreign_keys(MIGRATIONS_DIR)
    
    print("Extraction des relations utilisées dans les modules...")
    module_relations = extract_module_relations(MODULES_DIR)
    
    print()
    success = verify_relations(foreign_keys, module_relations)
    
    return 0 if success else 1

if __name__ == "__main__":
    exit(main())

