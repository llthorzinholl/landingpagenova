import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();

// Restrict CORS to trusted origins in production
const allowedOrigins = ["https://aeslanding.com", "http://localhost:3000"];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins[0]);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function sanitizeInput(input) {
  return String(input).replace(/[<>"'`]/g, "");
}

app.post("/api/messages", async (req, res) => {
  let { user_message, assistant_response } = req.body;
  if (!user_message)
    return res.status(400).json({ error: "user_message required" });

  // Sanitize inputs
  user_message = sanitizeInput(user_message);
  assistant_response = assistant_response
    ? sanitizeInput(assistant_response)
    : null;

  try {
    const result = await pool.query(
      "INSERT INTO assistant_messages (user_message, assistant_response) VALUES ($1, $2) RETURNING *",
      [user_message, assistant_response],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("DB ERROR:", err);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM assistant_messages ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("DB ERROR:", err);
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  }
});

app.get("/", (req, res) => {
  res.send("API running ✅");
});
