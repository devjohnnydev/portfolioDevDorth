import sqlite3
import os

db_path = 'backend/portfolio.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Add category
    try:
        cursor.execute("ALTER TABLE certifications ADD COLUMN category TEXT")
        print("Added column 'category'")
    except sqlite3.OperationalError:
        print("Column 'category' already exists")
        
    # Add file_url
    try:
        cursor.execute("ALTER TABLE certifications ADD COLUMN file_url TEXT")
        print("Added column 'file_url'")
    except sqlite3.OperationalError:
        print("Column 'file_url' already exists")
        
    conn.commit()
    conn.close()
else:
    print(f"Database not found at {db_path}")
