// index.js — simple Express server to serve static frontend and handle onboarding
import express from "express";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store (simple demo; will reset when server restarts)
const responses = [];

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), "public")));

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// submit onboarding answers
app.post("/api/submit", (req, res) => {
  try {
    const { name, city, age_range, answers } = req.body;
    if (!name || !answers) return res.status(400).json({ error: "name and answers required" });

    const entry = {
      id: (responses.length + 1).toString(),
      name,
      city,
      age_range,
      answers,
      created_at: new Date().toISOString()
    };

    responses.push(entry);
    res.json({ ok: true, message: "saved (in-memory)", entry });
  } catch (err) {
    console.error("submit error:", err);
    res.status(500).json({ error: "server error" });
  }
});

// get stored responses
app.get("/api/responses", (req, res) => {
  res.json({ count: responses.length, responses });
});

// serve index if someone visits root
app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Memory Lane prototype listening on port ${PORT}`);
});
