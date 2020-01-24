const mqtt = require('mqtt')
const db = require('./db')

class MqttHandler {
  constructor() {
    this.client = null
    this.host = process.env.MQTT_HOST
    this.port = process.env.MQTT_PORT
    this.username = process.env.MQTT_USER
    this.password = process.env.MQTT_PASS
    this.topic = 'tele/sonoff/RESULT'
  }

  connect() {
    this.client = mqtt.connect(this.host, { 
      port: this.port,
      username: this.username,
      password: this.password,
      clientId: 'MQTTClient',
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      connectTimeout: 1000,
    })
    
    this.client.on('error', err => {
      console.log('MQTT Client', err)
      this.client.end()
    })

    this.client.on('connect', () => console.log('MQTT Client', 'Connected'))

    this.client.subscribe(this.topic, { qos: 0 })

    this.client.on('message', function (topic, message) {
      console.log('MQTT Client', message.toString())
      try {
        var data = JSON.parse(message)
        db.updateDevice(data.RfReceived.Data, {id: data.RfReceived.Data ,lastOnline: data.Time})
      } catch (err) {
        console.log('MQTT Client', err)
      }
    })

    this.client.on('close', () => console.log('MQTT Client', 'Disconnected'))
  }
}

module.exports = MqttHandler
