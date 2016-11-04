var express = require('express')
var app = express()
var twitter = require('./twitter.js')
var Redis = require('./redis.js'),
    rClient = new Redis.Redis()

// Defaults
DEFAULT_PARA_LENGTH = 200

// Init Redis client
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
  var params = parseForParams(req)
  getWords(params.count, params.handle, (paragraph_arr) => {
    res.send(paragraph_arr);
  })
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

var getParagraphs = function(number_of_paras, handle, callback) {

  var nums = [];
  for (var i=0; i<number_of_paras; ++i) {
    var count = getRandomIntInclusive(2, 4) * 100
    nums.push(count)
  }

  var cb = breakIntoParas(number_of_paras, nums, callback)
  fetchFromRedis(handle, cb)
}

var getWords = function(number_of_words, handle, callback) {
  var para_divider = getRandomIntInclusive(2, 4) * 100
  var para_sizes = []
  while(number_of_words > para_divider) {
    para_sizes.push(para_divider)
    number_of_words -= para_divider
  }
  para_sizes.push(number_of_words)

  var cb = breakIntoParas(para_sizes.length, para_sizes, callback)
  fetchFromRedis(handle, cb)
}

var breakIntoParas = function(paras, nums, resp_callback) {
  return function(content) {
    var  x = 0, paragraphs=[];
    var content_arr = content.split(' ')
    for (var i=0; i<paras; ++i) {
      var temp = 0, para_text = '';
      for (var j=0; j<nums[i]; ++j) {
        //console.log(content_arr[temp])
        para_text += ' '+content_arr[temp]
        temp++;
        // check for size of temp and reset
        if(temp == content_arr.length) temp=0
      }
      console.log('Para formed: '+para_text)
      paragraphs.push(para_text)
    }

    console.log('paragraphs.length: '+paragraphs.length)
    var ret =[]
    for(var i=0; i<paragraphs.length; ++i) {
      ret.push('<pre>'+paragraphs[i]+'</pre>')
    }
    console.log('Returning using response.send')
    resp_callback(ret)
  }
}

var fetchFromRedis = function(key, callback) {

  console.log('Inside getWords')
  rClient.getAll(key, function(tweets_arr) {
    console.log('getAll for redis returned array: '+tweets_arr.length)
    var tweet_string='';
    for(var i=0; i<tweets_arr.length; ++i) tweet_string += (' '+tweets_arr[i])
    callback(tweet_string)
  })
}

var twitter_handles = ['timesofindia', 'mashable']
twitter.fetchTweets(twitter_handles, (handle_name, data) => {
  rClient.pushAll(handle_name, data)
})
