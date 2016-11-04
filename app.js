var express = require('express')
var app = express()
var Redis = require('./redis.js'),
    rClient = new Redis.Redis()

rClient.init()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  rClient.push('foo', 'bar')
  console.log('Example app listening on port 3000!')
})

app.get('/para/:number', (req, res) => {
  return res.send("paras")
})

app.get('/word/:number', (req, res) => {
  return res.send("words")
})

app.get('/letter/:number', (req, res) => {
  return res.send("letters")
})

app.get('/handles', (req, res) => {
  return res.send(["abc", "xyz"])
})