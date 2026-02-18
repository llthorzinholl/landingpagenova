import express from 'express';
import pkg from 'pg';
import cors from 'cors';
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/api/messages', async (req, res) => {
  const { user_message, assistant_response } = req.body;
  if (!user_message) return res.status(400).json({ error: 'user_message required' });

  try {
    const result = await pool.query(
      'INSERT INTO assistant_messages (user_message, assistant_response) VALUES ($1, $2) RETURNING *',
      [user_message, assistant_response || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM assistant_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
