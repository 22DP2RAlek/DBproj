const express = require('express');
const cors = require('cors');
const db = require('./db');  // your db.js exports pool.promise()

const app = express();

app.use(cors());
app.use(express.json());

// GET all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lietotajs');
    res.json(rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST login
app.post('/api/login', async (req, res) => {
  const { epasts, parole } = req.body;

  if (!epasts || !parole) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT idlietotajs, epasts, parole FROM lietotajs WHERE epasts = ?',
      [epasts]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = rows[0];

    if (user.parole !== parole) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Login successful', userId: user.idlietotajs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST register
app.post('/api/register', async (req, res) => {
  const { vards, epasts, parole } = req.body;

  if (!vards || !epasts || !parole) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT epasts FROM lietotajs WHERE epasts = ?', [epasts]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Insert new user
    await db.query('INSERT INTO lietotajs (vards, epasts, parole) VALUES (?, ?, ?)', [vards, epasts, parole]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
