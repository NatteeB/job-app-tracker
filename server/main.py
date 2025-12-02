from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import Dict, Any

DBFILE = "data/sampleData.db"

app = FastAPI()

# Allow requests from Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Database helpers
# ---------------------------

def get_db_connection():
    conn = sqlite3.connect(DBFILE)
    conn.row_factory = sqlite3.Row 
    return conn

def read_data():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM jobs").fetchall()
    conn.close()
    return [dict(row) for row in rows]

def write_data(data: Dict[str, Any]):
    """
    Example logic:
    - If `id` exists, update the row.
    - Otherwise insert a new one.

    Adjust fields to match your table schema.
    """

    conn = get_db_connection()

    # Example expected fields in your job object
    job_id = data.get("id")
    title = data.get("title")
    company = data.get("company")
    applied = data.get("applied")

    if not title:
        raise HTTPException(400, detail="Missing 'title' field")

    if job_id:  # update existing
        conn.execute(
            """
            UPDATE jobs
            SET title = ?, company = ?, applied = ?
            WHERE id = ?
            """,
            (title, company, applied, job_id),
        )
    else:  # insert new
        conn.execute(
            """
            INSERT INTO jobs (title, company, applied)
            VALUES (?, ?, ?)
            """,
            (title, company, applied),
        )

    conn.commit()
    conn.close()


# ---------------------------
# Routes
# ---------------------------

@app.get("/data")
def get_data():
    return read_data()


@app.post("/data")
def update_data(data: dict):
    write_data(data)
    return {"status": "ok"}
