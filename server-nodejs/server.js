// server.js
import Database from "better-sqlite3";
import express from "express";
import cors from "cors";

const app = express();
const PORT = 8000;

// Enable JSON parsing for POST requests
app.use(express.json());

// Enable CORS for all origins (same as allow_origins=["*"])
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// Path to the DB file
const db = new Database("data/sampleData.db");

// Routes
app.get("/data", (req, res) => {
  const jobs = db.prepare("SELECT * FROM jobs").all();
  res.json(jobs);
});

app.post("/data", (req, res) => {
  const { company, title, website, status, applied_date, updated_date, notes, details } = req.body;
  const stmt = db.prepare(
    `INSERT INTO jobs (company, title, website, status, applied_date, updated_date, notes, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(company, title, website, status, applied_date, updated_date, notes, details);
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
