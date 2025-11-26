// server.js
import dotenv from "dotenv";
dotenv.config();

import Database from "better-sqlite3";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

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
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Routes
app.get("/data", (req, res) => {
    const jobs = db.prepare("SELECT * FROM jobs").all();
    res.json(jobs);
});

app.post("/createjob", (req, res) => {
    const { company, title, website, status, applied_date, updated_date, notes, details } = req.body;
    const stmt = db.prepare(
        `INSERT INTO jobs (company, title, website, status, applied_date, updated_date, notes, details)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(company, title, website, status, applied_date, updated_date, notes, details);
    res.json({ status: "ok" });
});

app.post("/parsejob", async (req, res) => {
    const { description } = req.body;

    const jobSchema = {
        name: "job_post_extraction",
        schema: {
            type: "object",
            additionalProperties: false,
            properties: {
                company: { type: "string", description: "Company name" },
                position: { type: "string", description: "Role or title" },
                required_skills: { type: "array", items: { type: "string" }, nullable: true },
                nice_to_have: { type: "array", items: { type: "string" }, nullable: true },
                description_details: {
                    type: "string",
                    nullable: true,
                    description: "Convert the entire job description into HTML format. Wrap the output into html section element."
                },
                description_summary: {
                    type: "string",
                    nullable: true,
                    description: "Extract a summary of the job description preserving the original words. Convert the entire output into HTML format. Wrap the output into html section element."
                }
            },
            required: ["company", "position", "description_summary", "description_details"],
        },
    };

    const instructions = `
You are a precise information extraction engine.
Extract only what the post states explicitly. If a field is unknown, set it to null.
Populate description_details field by converting entire text into HTML format where the whole content is wrapped into a html section element.
All sections related to requirements, responsibilities, bonus points or nice-to-have should be included and converted into ul/li elements preserving all original words.
Perform appropriate formating to make the content readable in HTML.
Do not invent values. Keep arrays concise. Respond in valid JSON only.
`;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: instructions },
                {
                    role: "user",
                    content: `Extract job info from this description:\n\n${description}`,
                },
            ],
            response_format: {
                type: "json_schema",
                json_schema: jobSchema,
            },
            temperature: 0,
        });

        const message = completion.choices[0].message;

        // In JS SDK, structured output still comes as JSON text in `content`
        const raw = typeof message.content === "string"
            ? message.content
            : // sometimes content is an array of parts; join their text
            message.content.map((p) => p.text || "").join("");
        const parsed = JSON.parse(raw);

        res.json(parsed);
    } catch (err) {
        console.error("LLM parsing failed:", err);
        res.status(500).json({ error: "LLM parsing failed" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
