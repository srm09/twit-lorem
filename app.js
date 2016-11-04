var express = require('express')
var app = express(),
    path = require('path')
var twitter = require('./twitter.js')
var Redis = require('./redis.js'),
    rClient = new Redis.Redis()

// Defaults
DEFAULT_PARA_LENGTH = 200
var twitter_handles = ['ConanOBrien', 'FirstWorldPains', 'Lmao', 'realDonaldTrump', 'BarackObama',
'kellyoxford', 'MensHumor', 'itsBroStinson', 'itsWillyFerrell', 'Seinfeld2000', 'shutupmikeginn',
'WomensHumor']

// Init Redis client
rClient.init()

// Load Redis with twitter crap
twitter.fetchTweets(twitter_handles, (handle_name, data) => {
  rClient.pushAll(handle_name, data)
})

// Use middleware for hosting static files
app.use('/public', express.static('ProjectIpsum'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000, function () {
  rClient.push('foo', 'bar')
  console.log('Example app listening on port 3000!')
})

app.get('/para/:handle/:number', (req, res) => {
  var params = parseForParams(req)
  getParagraphs(params.count, params.handle, (paragraph_arr) => {
    res.send({"handle": params.handle,
              "paras":paragraph_arr});
  })
})

app.get('/word/:handle/:number', (req, res) => {
  var params = parseForParams(req)
  getWords(params.count, params.handle, (paragraph_arr) => {
    res.send({"handle": params.handle,
              "paras":paragraph_arr});
  })
})

app.get('/letter/:handle/:number', (req, res) => {
  var params = parseForParams(req)
  getLetters(params.count, params.handle, (paragraph_arr) => {
    res.send({"handle": params.handle,
              "paras":paragraph_arr});
  })
})

app.get('/handles', (req, res) => {
  res.send(twitter_handles)
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

var getLetters = function(number_of_letters, handle, resp_callback) {
  var breakLettersToWords = function(content, paracallback) {
    var temp = number_of_letters, content_arr = content.split(' ')
    var word_arr = [], i = 0
    while(i<content_arr.length) {
      var curr_word = content_arr[i]
      var len = curr_word.length
      if(temp >= len) {
        temp -= len
        word_arr.push(curr_word)
      } else {
        // this word is too long, break it and exit the loop
        word_arr.push(curr_word.substring(0, temp))
        break;
      }
      i++;
      if(i == content_arr.length) i = 0;
    }
    paracallback(word_arr)
  }

  var toParas = brkIntoParas(resp_callback)

  fetchFromRedis(handle, function(content) {
    breakLettersToWords(content, toParas)
  })
}

var brkIntoParas = function(cb) {

  return function(word_arr) {
    var para_divider = getRandomIntInclusive(2, 4) * 100
    var para_sizes = []
    var temp = word_arr.length
    while(temp > para_divider) {
      para_sizes.push(para_divider)
      temp -= para_divider
    }
    para_sizes.push(temp)

    var para_texts = [], count =0
    for(var i=0; i<para_sizes.length; ++i) {
      var size_of_para = para_sizes[i], para_text = ''
      for(var j=0; j<size_of_para; ) {
        if(! word_arr[count].startsWith('http')) {
          para_text += (' '+word_arr[count])
          ++j
        }
        count++
      }
      para_texts.push('<p>' + para_text + '</p>')
    }
    cb(para_texts)
  }
}

var breakIntoParas = function(paras, nums, resp_callback) {
  return function(content) {
    var  x = 0, paragraphs=[];
    var content_arr = content.split(' ')
    for (var i=0; i<paras; ++i) {
      var temp = 0, para_text = '';
      for (var j=0; j<nums[i]; ) {
        //console.log(content_arr[temp])
        if(! content_arr[temp].startsWith('http')) {
          para_text += ' '+content_arr[temp]
          ++j
        }
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
      ret.push('<p>'+paragraphs[i]+'</p>')
      //ret.push(paragraphs[i])
    }
    console.log('Returning using response.send')
    resp_callback(ret)
  }
}

var fetchFromRedis = function(key, callback) {

  rClient.getAll(key, function(tweets_arr) {
    console.log('getAll for redis returned array: '+tweets_arr.length)
    var tweet_string='';
    for(var i=0; i<tweets_arr.length; ++i) tweet_string += (' '+tweets_arr[i])
    callback(tweet_string)
  })
}
