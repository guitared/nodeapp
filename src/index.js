const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8080
const db = require('./db')

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.json({up: true})
})

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await db.getRooms()
    res.json(rooms.map(r => { 
      return {id: r.id, isOccupied: r.isOccupied}
    }))
  } catch (err) {
    console.log('GET /api/rooms', err)
    res.status(500).json(err.message)
  }
})

app.post('/api/rooms/', async (req, res) => {
  try {
    await db.createRoom({
      id: req.body.id,
      isOccupied: req.body.isOccupied
    })
    res.send(201)
  } catch (err) {
    console.log('POST /api/rooms', err)
    res.status(500).json(err.message)
  }
})

app.put('/api/rooms/:id', async (req, res) => {
  try {
    await db.updateRoom(req.params.id, {
      isOccupied: req.body.isOccupied
    })
    res.send(200)
  } catch (err) {
    console.log('PUT /api/rooms', err)
    res.status(500).json(err.message)
  }
})

app.listen(port, () => console.log(`[sys] Express started on ${port}!`))

module.exports = app