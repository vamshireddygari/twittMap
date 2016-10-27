var Twitter = require('node-tweet-stream');
var elasticsearch = require('elasticsearch');
var socketList = [];
count = [0, 0, 0, 0, 0, 0];


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7000; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}
var client = new elasticsearch.Client({
         host: 'https://search-tweetmap-j6tdjuw2dq2j4p2qxluwnbjj2q.us-east-1.es.amazonaws.com/',
         log: 'trace'
         });

var NodeGeocoder = require('node-geocoder');
var cnt=0

var twittr = new Twitter({
  consumer_key: 'd6XpjuWieFxWqqseynJipVJkK',
  consumer_secret: 'zU25eeX7z8KJ4eCy03BluEJfp0sEknFu2ymo5o9xLqRdp3kW9t',
  token: '1014622664-WDpafKUUcWsBqyywWP098KK4vHwjOibI8O8PDc4',
  token_secret: 'BrPjOZixnO4ROorNP6rv1oh7RaeFe2yft1W7Wgh8ual2V'
}
);


trackItems = ["apple", "google", "fun", "manchesterunited", "love", "hate"];

trackItems.forEach(function(item) {
    twittr.track(item);
});

 twittr.on('tweet', function(tweet)
 {
  
  	console.log(tweet.text)
  	console.log(tweet.user.location)
  
 	 if (tweet.geo) 
  	{
    	    getKeyword = null;
	
    	    for (var i = 0; i < trackItems.length; i++) 
        	{
            	if (tweet.text.indexOf(trackItems[i]) > -1) 
            	{
                	getKeyword = trackItems[i];
                	count[i]++;
                	// console.log(count);  // for trending !!!
                	break;
            	}
        	}

        	if (getKeyword != null) 
        	{
            	//console.log(getKeyword);
            	socketList.forEach(function(socket) 
            	{
                	var data = {
                    	"username": tweet.user.name,
                    	"latitude": tweet.geo.coordinates[0],
                    	"longitude": tweet.geo.coordinates[1],
                    	"text": tweet.text
                	};
                
                	client.index({
  						index: 'twittmaps',
  						type: 'twittmaps',
  						id: tweet.id,
  						body: data
					}, function (error, response) {
	
					});
        	        socket.emit('tweet', data);
         	   });
        	}
    }
 }; 
  	
    r) {
    console.log(error);
  });
  
  twittr.on('error', function(error) {
    console.log(error);
  });

