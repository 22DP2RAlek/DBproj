const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./db')

const app = express()

app.use(cors())
app.use(express.json())

// Serve static images
app.use('/pictures', express.static(path.join(__dirname, '../DBprojekts/public/pictures')))

// Get all users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lietotajs')
    res.json(rows)
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ success: false, message: 'Database error' })
  }
})

// Get apskatespunkti with image URLs
app.get('/api/apskatespunkti', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ap.*, at.attels
      FROM apskatespunkti ap
      LEFT JOIN atteli at ON ap.idapskatespunkti = at.idapskatespunkti
    `)

    const host = req.get('host')
    const protocol = req.protocol

    const dataWithFullImageUrl = rows.map(item => ({
      ...item,
      imageUrl: item.attels ? `${protocol}://${host}/pictures/${item.attels}` : null
    }))

    res.json(dataWithFullImageUrl)
  } catch (err) {
    console.error('Database query error:', err)
    res.status(500).json({ success: false, message: 'Database error fetching apskatespunkti' })
  }
})

// POST login
app.post('/api/login', async (req, res) => {
  const { epasts, parole } = req.body

  if (!epasts || !parole) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  try {
    const [rows] = await db.query(
      'SELECT idlietotajs, epasts, parole, idlomas, vards FROM lietotajs WHERE epasts = ?',
      [epasts]
    )

    if (rows.length === 0 || rows[0].parole !== parole) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const user = rows[0]

    res.json({
      success: true,
      role: user.idlomas,
      vards: user.vards,
      userId: user.idlietotajs
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// POST register
app.post('/api/register', async (req, res) => {
  const { vards, epasts, parole } = req.body

  if (!vards || !epasts || !parole) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  try {
    const [existing] = await db.query('SELECT epasts FROM lietotajs WHERE epasts = ?', [epasts])
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' })
    }

    await db.query(
      'INSERT INTO lietotajs (vards, epasts, parole) VALUES (?, ?, ?)',
      [vards, epasts, parole]
    )

    res.status(201).json({ success: true, message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

// GET reviews
app.get('/api/atsauksmes/:idapskatespunkti', async (req, res) => {
  const { idapskatespunkti } = req.params
  try {
    const [rows] = await db.query(
      `SELECT a.idatsauksmes, a.vertejums, a.komentars, a.izveidosanas_laiks, a.idlietotajs, l.vards
       FROM atsauksmes a
       JOIN lietotajs l ON a.idlietotajs = l.idlietotajs
       WHERE a.idapskatespunkti = ?
       ORDER BY a.izveidosanas_laiks DESC`,
      [idapskatespunkti]
    )
    res.json(rows)
  } catch (err) {
    console.error('Database error fetching reviews:', err)
    res.status(500).json({ success: false, message: 'Database error fetching reviews' })
  }
})

// POST new review
app.post('/api/atsauksmes', async (req, res) => {
  const { vertejums, komentars, idlietotajs, idapskatespunkti } = req.body

  console.log('🟡 Received review submission:', {
    vertejums,
    komentars,
    idlietotajs,
    idapskatespunkti
  })

  if (!vertejums || !komentars || !idlietotajs || !idapskatespunkti) {
    return res.status(400).json({ success: false, message: 'All review fields are required' })
  }

  try {
    await db.query(
      `INSERT INTO atsauksmes (vertejums, komentars, izveidosanas_laiks, idlietotajs, idapskatespunkti)
       VALUES (?, ?, NOW(), ?, ?)`,
      [vertejums, komentars, idlietotajs, idapskatespunkti]
    )
    res.status(201).json({ success: true, message: 'Review added successfully' })
  } catch (err) {
    console.error('❌ Database error saving review:', err)
    res.status(500).json({ success: false, message: 'Database error saving review' })
  }
})

// DELETE review (admin only)
app.delete('/api/atsauksmes/:idatsauksmes', async (req, res) => {
  const { idatsauksmes } = req.params
  const { idlietotajs, idlomas } = req.body

  if (idlomas !== 2) {
    return res.status(403).json({ success: false, message: 'Unauthorized: Only admins can delete reviews' })
  }

  try {
    const [result] = await db.query('DELETE FROM atsauksmes WHERE idatsauksmes = ?', [idatsauksmes])

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    res.json({ success: true, message: 'Review deleted successfully' })
  } catch (err) {
    console.error('❌ Database error deleting review:', err)
    res.status(500).json({ success: false, message: 'Database error deleting review' })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
