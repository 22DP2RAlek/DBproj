const express = require('express');
const cors = require('cors');
const db = require('./db');  // your db.js exports pool.promise()

const app = express(); // ✅ Define app before using it

app.use(cors()); // ✅ Use cors middleware after app is defined
app.use(express.json()); // ✅ Parse incoming JSON requests

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
