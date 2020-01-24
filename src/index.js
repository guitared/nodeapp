const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8080
const db = require('./db')
const mqttHandler = require('./mqtt_handler')

app.use(express.json())
app.use(cors())

var mqttClient =  new mqttHandler()
mqttClient.connect()

app.get('/', (req, res) => {
  res.json({up: true})
})

app.get('/api/devices', async (req, res) => {
  try {
    const devices = await db.getDevices()
    res.json(devices.map(r => { 
      return {id: r.id, building: r.building, floor: r.floor, room: r.room, lastOnline: r.lastOnline}
    }))
  } catch (err) {
    console.log('GET /api/devices', err)
    res.status(500).json(err.message)
  }
})

app.post('/api/devices/', async (req, res) => {
  try {
    await db.createDevice({
      id: req.body.id,
      building: req.body.building,
      floor: req.body.floor,
      room: req.body.room,
      lastOnline: req.body.lastOnline
    })
    res.send(201)
  } catch (err) {
    console.log('POST /api/devices', err)
    res.status(500).json(err.message)
  }
})

app.put('/api/devices/:id', async (req, res) => {
  try {
    await db.updateDevice(req.params.id, {
      lastOnline: req.body.lastOnline
    })
    res.send(200)
  } catch (err) {
    console.log('PUT /api/devices', err)
    res.status(500).json(err.message)
  }
})

app.listen(port, () => console.log(`[sys] Express started on ${port}!`))

module.exports = app
