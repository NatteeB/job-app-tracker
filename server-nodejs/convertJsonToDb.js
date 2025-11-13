import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read JSON data from file
const DATA_FILE = path.join(__dirname, "data", "jobDataSample.json");
const jsonData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

const db = new Database("data/sampleData.db");
console.log("Connected to SQLite database.");
console.log("Got json data with", jsonData.length, "entries.");

jsonData.forEach((entry) => {
  const stmt = db.prepare(
    `INSERT INTO jobs (company, title, website, status, applied_date, updated_date, notes, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    entry.company,
    entry.title,
    entry.website,
    entry.status,
    entry.date,
    entry.updated,
    entry.notes,
    entry.details
  );
});

console.log("Data insertion complete.");
db.close();