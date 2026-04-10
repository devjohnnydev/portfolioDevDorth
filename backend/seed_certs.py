import sqlite3
import os

db_path = 'backend/portfolio.db'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Clean and insert test data
    cursor.execute("DELETE FROM certifications")
    test_data = [
        ('React Specialist', 'Meta', '2024', 'Frontend', 'Advanced React patterns and performance optimization.', 'https://coursera.org'),
        ('Backend Engineering', 'Google', '2023', 'Backend', 'Building scalable systems with Python and Node.js.', 'https://google.com'),
        ('Cloud Architect', 'AWS', '2024', 'Cloud', 'Architecting solutions on AWS.', 'https://aws.amazon.com')
    ]
    cursor.executemany("INSERT INTO certifications (title, institution, date, category, description, credential_url) VALUES (?, ?, ?, ?, ?, ?)", test_data)
    
    conn.commit()
    conn.close()
    print("Test data inserted successfully")
else:
    print(f"Database not found at {db_path}")
