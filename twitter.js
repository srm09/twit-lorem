var Twitter = require('twitter');
 
var client = new Twitter({
  //consumer_key: TWITTER_CONSUMER_KEY,
  //consumer_secret: TWITTER_CONSUMER_SECRET,
  //access_token_key: TWITTER_ACCESS_TOKEN_KEY,
  //access_token_secret: TWITTER_ACCESS_TOKEN_SECRET

  consumer_key: 'tLjVfddfYPJ8blSzkNEZ0VSX6',
  consumer_secret: '0UvgSTmYVHGXD9MbR7wbISSfmoZf6KZU8XQ6lPBIoRq6AqJCu2',
  access_token_key: '80861386-fhCQjkoohfjHgmDX5ToB8UXsZpLYGDICY5eUW7uLt',
  access_token_secret: '5kJ2be1vmtSrRsP21KmmadBnFLYh1arjzvp2qHvOvqwqv'
});

var cb = function(data) {
         console.log(data);
}

entry_point(['Lord_Voldemort7', 'ItsBadluckBrian']);//, 'BettyFckinWhite']);
function entry_point(handle_list)
{
    for (i = 0; i<handle_list.length; i++)
    {
	test(handle_list[i], cb);
    }
}

function test(user, callback) {
   client.get('search/tweets.json', {q: 'from:'+user}, (error, tweets, response) => {
   if(error) {
	console.log(error)
	throw error;
	}
   callback(tweets);
   });
}
