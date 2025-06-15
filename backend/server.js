const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require("./db")

const app = express()

app.use(cors()) 
app.use(express.json()) 


app.use('/pictures', express.static(path.join(__dirname, '../DBprojekts/public/pictures')))


function checkAdmin(req, res, next) {
  const idlomas = parseInt(req.headers['x-user-role'], 10) || 2;

  if (idlomas !== 2) {
    return res.status(403).json({ success: false, message: 'Tikai administratoriem.' })
  }
  next()
}

// adminDB
app.get('/users', checkAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM lietotajs')
    res.json(rows)
  } catch (err) {
    console.error('Datubāzes kļūda!', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
});

app.put('/users/:id', checkAdmin, async (req, res) => {
  const { id } = req.params
  const { vards, epasts, parole, idlomas } = req.body

  if (!vards || !epasts || !parole || !idlomas) {
    return res.status(400).json({ success: false, message: 'Visi lauki ir jaizpilda' })
  }

  try {
    const [result] = await db.query(
      'UPDATE lietotajs SET vards = ?, epasts = ?, parole = ?, idlomas = ? WHERE idlietotajs = ?',
      [vards, epasts, parole, idlomas, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'lietotajs nav atrasts' })
    }
    res.json({ success: true, message: 'lietotajs atjauninats' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
});
// dzest lietotāju
app.delete('/users/:id', checkAdmin, async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.query('DELETE FROM lietotajs WHERE idlietotajs = ? LIMIT 1', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'lietotajs nav atrasts' })
    }
    res.json({ success: true, message: 'Lietotajs izdzests' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
});

// iegut statistiku
app.get('/api/stats', checkAdmin, async (req, res) => {
  try {

    const [spotsCount] = await db.query('SELECT COUNT(*) AS count FROM apskatespunkti')
    const [usersCount] = await db.query('SELECT COUNT(*) AS count FROM lietotajs')
    const [reviewsCount] = await db.query('SELECT COUNT(*) AS count FROM atsauksmes')

    res.json({
      spotCount: spotsCount[0].count,
      userCount: usersCount[0].count,
      reviewCount: reviewsCount[0].count,
    })
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

// iegut attēlus
app.get('/api/apskatespunkti', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ap.*, at.attels
      FROM apskatespunkti ap
      LEFT JOIN atteli at ON ap.idapskatespunkti = at.idapskatespunkti
    `)

    const host = req.get('host')
    const protocol = req.protocol

    const dataWithFullImage = rows.map(item => ({
      ...item,
      imageUrl: item.attels ? `${protocol}://${host}/pictures/${item.attels}` : null
    }))

    res.json(dataWithFullImage)
  } catch (err) {
    console.error('Datubāzes kļūda!', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda apskatot apskatespunkti' })
  }
})

// login
app.post('/api/login', async (req, res) => {
  const { epasts, parole } = req.body

  if (!epasts || !parole) {
    return res.status(400).json({ success: false, message: 'Vajadzigs epasts un parole' })
  }

  try {
    const [rows] = await db.query(
      'SELECT idlietotajs, epasts, parole, idlomas, vards FROM lietotajs WHERE epasts = ?',
      [epasts]
    )

    if (rows.length === 0 || rows[0].parole !== parole) {
      return res.status(401).json({ success: false, message: 'Nepareizi ievaditie dati' })
    }

    res.json({ success: true, role: rows[0].idlomas, vards: rows[0].vards, userId: rows[0].idlietotajs })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Servera kluda' })
  }
})

// registrācija
app.post('/api/Register', async (req, res) => {
  const { vards, epasts, parole } = req.body

  if (!vards || !epasts || !parole) {
    return res.status(400).json({ success: false, message: 'Jaizpilda visi lauki' })
  }

  try {
    const [existing] = await db.query('SELECT epasts FROM lietotajs WHERE epasts = ?', [epasts])
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Epasts jau pieregistrets' })
    }

    await db.query(
      'INSERT INTO lietotajs (vards, epasts, parole) VALUES (?, ?, ?)', [vards, epasts, parole]
    )

    res.status(201).json({ success: true, message: 'Lietotajs atjauninats' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Servera kluda' })
  }
})

// atsauksmes
app.get('/api/atsauksmes/:idapskatespunkti', async (req, res) => {
  const { idapskatespunkti } = req.params
  try {
    const [rows] = await db.query(
      `SELECT a.idatsauksmes, a.vertejums, a.komentars, a.izveidosanaslaiks, a.idlietotajs, l.vards
       FROM atsauksmes a
       JOIN lietotajs l ON a.idlietotajs = l.idlietotajs
       WHERE a.idapskatespunkti = ?
       ORDER BY a.izveidosanaslaiks DESC`,
      [idapskatespunkti]
    )
    res.json(rows)
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

// jaunas atsauksmes
app.post('/api/atsauksmes', async (req, res) => {
  const { vertejums, komentars, idlietotajs, idapskatespunkti } = req.body

  if (!vertejums || !komentars || !idlietotajs || !idapskatespunkti) {
    return res.status(400).json({ success: false, message: 'Jaizpilda visi lauki' })
  }

  try {
    await db.query(
      `INSERT INTO atsauksmes (vertejums, komentars, izveidosanaslaiks, idlietotajs, idapskatespunkti)
       VALUES (?, ?, NOW(), ?, ?)`,
      [vertejums, komentars, idlietotajs, idapskatespunkti]
    )
    res.status(201).json({ success: true, message: 'Atsauksme pievienots.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda pievienojot atsauksmi' })
  }
})

// dzest atsauksmi
app.delete('/api/atsauksmes/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.query('DELETE FROM atsauksmes WHERE idatsauksmes = ? LIMIT 1', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Atsauskme nav atrasta' })
    }
    res.json({ success: true, message: 'Atsauksme izdzesta' })
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})
// saglabāt apskates punktus
app.get('/api/savedspots/:idlietotajs', async (req, res) => {
  const { idlietotajs } = req.params
  try {
    const [rows] = await db.query(
      `SELECT 
         so.idsaglabatieobjekti, so.piezimes, so.izveidosanaslaiks, 
         ap.idapskatespunkti, ap.nosaukums, ap.apraksts, ap.darba_laiks, ap.adrese, ap.koord_x, ap.koord_y,
         at.attels
       FROM saglabatieobjekti so
       JOIN apskatespunkti ap ON so.idapskatespunkti = ap.idapskatespunkti
       LEFT JOIN atteli at ON ap.idapskatespunkti = at.idapskatespunkti
       WHERE so.idlietotajs = ?`,
      [idlietotajs]
    )

    const host = req.get('host')
    const protocol = req.protocol

    const transformed = rows.map(row => ({
      idsaglabatieobjekti: row.idsaglabatieobjekti,
      piezimes: row.piezimes,
      izveidosanaslaiks: row.izveidosanaslaiks,
      idlietotajs: idlietotajs,
      idapskatespunkti: row.idapskatespunkti,
      apskatespunkts: {
        idapskatespunkti: row.idapskatespunkti,
        nosaukums: row.nosaukums,
        apraksts: row.apraksts,
        darba_laiks: row.darba_laiks,
        adrese: row.adrese,
        koord_x: row.koord_x,
        koord_y: row.koord_y,
        imageUrl: row.attels ? `${protocol}://${host}/pictures/${row.attels}` : null
      }
    }))

    res.json(transformed)
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

app.post('/api/savedspots', async (req, res) => {
  const { idlietotajs, idapskatespunkti } = req.body

  if (!idlietotajs || !idapskatespunkti) {
    return res.status(400).json({ success: false, message: 'Jaizpilda visi lauki' })
  }

  try {
    await db.query(
      `INSERT INTO saglabatieobjekti (piezimes, izveidosanaslaiks, idlietotajs, idapskatespunkti) 
       VALUES ('', NOW(), ?, ?)`,
      [idlietotajs, idapskatespunkti]
    )
    res.status(201).json({ success: true, message: 'Saglabats' })
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

// piezimes apskates punktiem
app.put('/api/savedspots/:id', async (req, res) => {
  const { id } = req.params
  const { piezimes } = req.body

  if (piezimes === undefined) {
    return res.status(400).json({ success: false, message: 'Vajadzigas piezimes' })
  }

  try {
    const [result] = await db.query(
      'UPDATE saglabatieobjekti SET piezimes = ? WHERE idsaglabatieobjekti = ?',
      [piezimes, id]
    )
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Saglabatais objekts nav atrasts' })
    }
    res.json({ success: true, message: 'Piezimes atjauninatas' })
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

// dzest saglabātos apskates punktus
app.delete('/api/savedspots/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.query('DELETE FROM saglabatieobjekti WHERE idsaglabatieobjekti = ? LIMIT 1', [id])
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Datubāzes kļūda' })
    }
    res.json({ success: true, message: 'Saglabatais objekts izdzests' })
  } catch (err) {
    console.error('Datubāzes kļūda', err)
    res.status(500).json({ success: false, message: 'Datubāzes kļūda' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
