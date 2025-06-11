const express = require('express');
const cors = require('cors');
const db = require('./db');  // your db.js exports pool.promise()

const app = express();

app.use(cors());
app.use(express.json());

// GET all users (for testing/debugging)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lietotajs');
    res.json(rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// GET all apskatespunkti (points of interest)
app.get('/api/apskatespunkti', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM apskatespunkti');
    res.json(rows);  // returns array of points for frontend to render markers
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ success: false, message: 'Database error fetching apskatespunkti' });
  }
});

// POST login
app.post('/api/login', async (req, res) => {
  const { epasts, parole } = req.body;

  if (!epasts || !parole) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT idlietotajs, epasts, parole, idlomas, vards FROM lietotajs WHERE epasts = ?',
      [epasts]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = rows[0];

    if (user.parole !== parole) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    res.json({
      success: true,
      role: user.idlomas,
      vards: user.vards,
      userId: user.idlietotajs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST register
app.post('/api/register', async (req, res) => {
  const { vards, epasts, parole } = req.body;

  if (!vards || !epasts || !parole) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  try {
    const [existing] = await db.query('SELECT epasts FROM lietotajs WHERE epasts = ?', [epasts]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    await db.query('INSERT INTO lietotajs (vards, epasts, parole) VALUES (?, ?, ?)', [vards, epasts, parole]);

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
