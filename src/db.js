const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const uri = process.env.MONGO
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
let isConnected = false

client.connect(err => {
  if (err) { 
    console.log(err)
    process.exit(-1)
  }

  isConnected = true
  console.log(`[sys] Connected to MongoDB`)
})

const getRoomsPromise = () => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("rooms").find({}).toArray(function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const createRoomPromise = (room) => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("rooms").insertMany([room], function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const updateRoomPromise = (id, room) => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("rooms")
    .updateOne({ id : id }, { $set: room }, function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const getRooms = async () => {
  assertDBConnection()
  return await getRoomsPromise()
}

const createRoom = async (room) => {
  assertDBConnection()
  await createRoomPromise(room)
}

const updateRoom = async (id, room) => {
  assertDBConnection()
  await updateRoomPromise(id, room)
}

const assertDBConnection = () => {
  if (!isConnected) throw new Error('DB is net connected')
}

module.exports = { getRooms, createRoom, updateRoom }



