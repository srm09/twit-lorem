function Redis(){

  this.r = require("redis")
  this.client;

  this.init = function() {
    this.client = this.r.createClient({
        host: 'localhost',
        port: 6379
      });
  }

  this.push = function(key, value) {
    this.client.set(key, value, (err, reply) => {
      if(err) throw err;
      console.log(reply)
    });
  }

  this.pushAll = function(key, values) {
    this.client.lpush(key, values)
  }

  this.getAll = function(key, callback) {
    this.client.llen(key, (err, count) => {
      this.client.lrange(key, 0, count-1, (err, data) => {
        if(err) throw err;
        callback(data)
      })
    })
  }

  this.get = function(key, callback) {
    this.client.get(key, (err, reply) => {
      callback(reply);
    })
  }

  this.quit = function() {
    this.client.quit()
  }
}

module.exports.Redis = Redis