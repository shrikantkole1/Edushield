"""
setup_client_dbs.py
====================
Reads data/attendance_data.csv  (500 rows, student_ids 1-500)
Reads data/learning_data.csv   (500 rows, student_ids 1-500)

Splits them across 5 clients (100 students each) and writes:
    data/clients/client_1.db  →  students  1-100
    data/clients/client_2.db  →  students 101-200
    data/clients/client_3.db  →  students 201-300
    data/clients/client_4.db  →  students 301-400
    data/clients/client_5.db  →  students 401-500

Each DB gets both attendance_data and learning_data tables.
Run once before starting client_api.py.
"""

import os
import sqlite3
import pandas as pd
import numpy as np

# ── paths ──────────────────────────────────────────────────
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
DATA_DIR     = os.path.join(SCRIPT_DIR, '..', 'data')
CLIENTS_DIR  = os.path.join(DATA_DIR, 'clients')
ATT_CSV      = os.path.join(DATA_DIR, 'attendance_data.csv')
LEARN_CSV    = os.path.join(DATA_DIR, 'learning_data.csv')

NUM_CLIENTS  = 5

os.makedirs(CLIENTS_DIR, exist_ok=True)

# ── helpers ─────────────────────────────────────────────────
def get_weak_subject(row):
    scores = {
        'math':    row.get('math_score', 50),
        'science': row.get('science_score', 50),
        'english': row.get('english_score', 50),
    }
    mn = min(scores.values())
    if mn >= 70:
        return 'none'
    return min(scores, key=scores.get)


def init_db(conn):
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS attendance_data (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id      INTEGER NOT NULL,
            attendance_rate REAL    NOT NULL,
            absences        INTEGER NOT NULL,
            study_hours     REAL    NOT NULL,
            participation   REAL    NOT NULL,
            at_risk         INTEGER NOT NULL,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_att_sid ON attendance_data(student_id)')

    cur.execute('''
        CREATE TABLE IF NOT EXISTS learning_data (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id      INTEGER NOT NULL,
            math_score      REAL    NOT NULL,
            science_score   REAL    NOT NULL,
            english_score   REAL    NOT NULL,
            time_math       REAL    NOT NULL,
            time_science    REAL    NOT NULL,
            time_english    REAL    NOT NULL,
            assignment_rate REAL    NOT NULL,
            quiz_avg        REAL    NOT NULL,
            weak_subject    TEXT    NOT NULL,
            created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cur.execute('CREATE INDEX IF NOT EXISTS idx_learn_sid ON learning_data(student_id)')
    conn.commit()


# ── load CSVs ────────────────────────────────────────────────
print("Loading CSVs…")
att_df = pd.read_csv(ATT_CSV)
# attendance CSV has columns: student_id, attendance_rate, absences, study_hours, participation, at_risk
# student_ids are 1-indexed row numbers
att_df['student_id'] = att_df['student_id'].astype(int)

# learning CSV may or may not exist — generate dummy if missing
if os.path.exists(LEARN_CSV):
    learn_df = pd.read_csv(LEARN_CSV)
    learn_df['student_id'] = learn_df['student_id'].astype(int)
else:
    print("  ⚠ learning_data.csv not found — generating synthetic learning data…")
    np.random.seed(42)
    n = len(att_df)
    sids = att_df['student_id'].values
    math_s    = np.random.uniform(40, 100, n)
    sci_s     = np.random.uniform(40, 100, n)
    eng_s     = np.random.uniform(40, 100, n)
    learn_df = pd.DataFrame({
        'student_id':      sids,
        'math_score':      np.round(math_s, 2),
        'science_score':   np.round(sci_s, 2),
        'english_score':   np.round(eng_s, 2),
        'time_math':       np.round(np.random.uniform(1, 5, n), 2),
        'time_science':    np.round(np.random.uniform(1, 5, n), 2),
        'time_english':    np.round(np.random.uniform(1, 5, n), 2),
        'assignment_rate': np.round(np.random.uniform(0.5, 1.0, n), 3),
        'quiz_avg':        np.round(np.random.uniform(40, 95, n), 2),
    })
    learn_df['weak_subject'] = learn_df.apply(get_weak_subject, axis=1)
    learn_df.to_csv(LEARN_CSV, index=False)
    print("  ✓ Synthetic learning data saved to", LEARN_CSV)

print(f"  Attendance rows: {len(att_df)}")
print(f"  Learning rows:   {len(learn_df)}")

# ── populate each client DB ──────────────────────────────────
students_per_client = max(1, len(att_df) // NUM_CLIENTS)

for cid in range(1, NUM_CLIENTS + 1):
    lo = (cid - 1) * students_per_client + 1
    hi = cid * students_per_client if cid < NUM_CLIENTS else 9999  # last client gets remainder

    att_slice   = att_df[(att_df['student_id'] >= lo) & (att_df['student_id'] <= hi)]
    learn_slice = learn_df[(learn_df['student_id'] >= lo) & (learn_df['student_id'] <= hi)]

    db_path = os.path.join(CLIENTS_DIR, f'client_{cid}.db')
    # Remove stale DB to rebuild fresh
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    init_db(conn)
    cur = conn.cursor()

    # Insert attendance
    for _, row in att_slice.iterrows():
        cur.execute(
            'INSERT INTO attendance_data (student_id, attendance_rate, absences, study_hours, participation, at_risk) VALUES (?,?,?,?,?,?)',
            (int(row['student_id']), float(row['attendance_rate']),
             int(row['absences']),   float(row['study_hours']),
             float(row['participation']), int(row['at_risk']))
        )

    # Insert learning
    for _, row in learn_slice.iterrows():
        ws = row.get('weak_subject') if 'weak_subject' in row else get_weak_subject(row)
        cur.execute(
            '''INSERT INTO learning_data
               (student_id, math_score, science_score, english_score,
                time_math, time_science, time_english, assignment_rate, quiz_avg, weak_subject)
               VALUES (?,?,?,?,?,?,?,?,?,?)''',
            (int(row['student_id']),
             float(row['math_score']), float(row['science_score']), float(row['english_score']),
             float(row['time_math']),  float(row['time_science']),  float(row['time_english']),
             float(row['assignment_rate']), float(row['quiz_avg']), str(ws))
        )

    conn.commit()
    conn.close()
    print(f"  ✓ client_{cid}.db — attendance: {len(att_slice)}, learning: {len(learn_slice)}  (IDs {lo}–{hi})")

print("\n✅  All client databases ready in:", os.path.abspath(CLIENTS_DIR))
print("   Now start:  python client_api.py")
