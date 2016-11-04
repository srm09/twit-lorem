var express = require('express')
var app = express()
var twitter = require('./twitter.js')
var Redis = require('./redis.js'),
    rClient = new Redis.Redis()

// Defaults
DEFAULT_PARA_LENGTH = 200


rClient.init()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  rClient.push('foo', 'bar')
  console.log('Example app listening on port 3000!')
})

app.get('/para/:handle/:number', (req, res) => {
  var params = parseForParams(req)
  getParagraphs(params.count, params.handle, (paragraph_arr) => {
    res.send(paragraph_arr);
  })

})

app.get('/word/:handle/:number', (req, res) => {
  return res.send("words")
})

app.get('/letter/:handle/:number', (req, res) => {
  return res.send("letters")
})

app.get('/handles', (req, res) => {
  return res.send(["abc", "xyz"])
})

function parseForParams(req) {
  return {
    handle: req.params.handle,
    count: req.params.number
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var getParagraphs = function(paras, handle, callback) {

  var nums = [], total = 0;
  for (var i=0; i<paras; ++i) {
    var count = getRandomIntInclusive(2, 9) * 100
    nums.push(count)
    total += count
  }

  var cb = breakIntoParas(paras, nums, callback)
  getWords(total, handle, cb)
}

var breakIntoParas = function(paras, nums, resp_callback) {
  return function() {
    var  x = 0;
    for (var i=0; i<paras; ++i) {
      paragraphs.push(content.substring(x, nums[i]-1))
      x += num
    }

    var ret =[]
    for(var i=0; i<paragraphs.length; ++i) {
      ret.push('<pre>'+paragraphs[i]+'</pre>')
    }
    resp_callback(ret)
  }
}

var getWords = function(length, key, callback) {

  tweets = rClient.getAll(key, callback)
}

var twitter_handles = ['timesofindia', 'mashable']
twitter.fetchTweets(twitter_handles, (handle_name, data) => {
  rClient.pushAll(handle_name, data)
})
