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

const getDevicesPromise = () => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("devices").find({}).toArray(function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const createDevicePromise = (devices) => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("devices").insertMany([devices], function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const updateDevicePromise = (id, device) => {
  return new Promise((resolve, reject) => {
    client.db("test").collection("devices")
    .updateOne({ id : id }, { $set: device }, { upsert: true }, function(err, docs) {
      err ? reject(err) : resolve(docs)
    })
  })
}

const getDevices = async () => {
  assertDBConnection()
  return await getDevicesPromise()
}

const createDevice = async (room) => {
  assertDBConnection()
  await createDevicePromise(room)
}

const updateDevice = async (id, room) => {
  assertDBConnection()
  await updateDevicePromise(id, room)
}

const assertDBConnection = () => {
  if (!isConnected) throw new Error('DB is not connected')
}

module.exports = { getDevices, createDevice, updateDevice }



