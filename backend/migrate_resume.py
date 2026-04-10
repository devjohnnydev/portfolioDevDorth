import sqlite3
import os

db_path = 'backend/portfolio.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add new columns if they don't exist
    new_cols = [
        ("resume_languages", "TEXT"),
        ("resume_education", "TEXT"),
        ("resume_website", "TEXT"),
    ]
    
    cursor.execute("PRAGMA table_info(profiles)")
    existing = {row[1] for row in cursor.fetchall()}
    
    for col_name, col_type in new_cols:
        if col_name not in existing:
            cursor.execute(f"ALTER TABLE profiles ADD COLUMN {col_name} {col_type}")
            print(f"Added column: {col_name}")
        else:
            print(f"Column already exists: {col_name}")
    
    conn.commit()
    conn.close()
    print("Migration complete")
else:
    print(f"Database not found at {db_path}")
