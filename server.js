var express = require('express');

var bodyParser = require('body-parser');



var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));


app.get('/', function(req, res){
	res.sendfile(__dirname + '/index.html');

});

app.set('port', process.env.PORT || process.env.VCAP_APP_PORT || 5000);



server.listen(app.get('port'), function() {
    console.log('Express Server started on port: ' + app.get('port'));
});




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));



// Errors
app.use(function(req, res, next) {
    var err = new Error('404: Specified URL Not Found');
    err.status = 404;
    next(err);
});

// Error Handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    return res.status(500).json(err.message);
});





var Twitter = require('node-tweet-stream');
var elasticsearch = require('elasticsearch');
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




var twittr = new Twitter({
  consumer_key: '********************************',
  consumer_secret: '********************************',
  token: '********************************',
  token_secret: '********************************'
}
);


trackItems = ["nba", "New York", "donaldtrump", "clinton", "modi", "apple", "google", "fun", "manchesterunited", "love", "hate"];

trackItems.forEach(function(item) {
    twittr.track(item);
});

var getKeyword;
var key = "";
  
io.on('connection', function (socket) {

	console.log('user connected');
  
  socket.on('my other event', function (data) {
  		console.log('arjun');
        console.log(data);
        console.log(data.key);
        key = data.key;
        
  });

//     console.log(key);

//console.log('arjun');
         
  twittr.on('tweet', function(tweet) {
  	console.log(tweet.text)
  	console.log(tweet.user.location)
    //console.log(tweet.place.bounding_box.coordinates[0][0][0]);

    //console.log(tweet.place.bounding_box.coordinates[0][0][1]);
    
    if(tweet.place!=null)
    {
    	var twit={"username":tweet.user.screen_name ,"text": tweet.text, "latitude": tweet.place.bounding_box.coordinates[0][0][1], "longitude": tweet.place.bounding_box.coordinates[0][0][0]}
    	//console.log(esinp)
    
	
  		client.index({
  		index: 'twittmaps',
  		type: 'twittmaps',
  		id: tweet.id,
  		body: twit
		}, function (error, response) {

		});
		
		for (var i = 0; i < trackItems.length; i++) {
            if (tweet.text.indexOf(trackItems[i]) > -1) {
                getKeyword = trackItems[i];
                
                if(getKeyword.toLowerCase() == key.toLowerCase())
                {
                	console.log('equal equal');
                 	socket.emit('toggle', twit)
                 
                }
                break;
            }
        }

  		console.log("gotcha")
	}
	
	
  });
  
  
  twittr.on('error', function(error) {
    console.log(error);
    
    });

});