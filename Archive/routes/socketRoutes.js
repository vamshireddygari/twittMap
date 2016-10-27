var mysql = require('mysql');
var Twitter = require('node-tweet-stream');
trackItems = ["apple", "google", "fun", "manchesterunited", "love", "hate"];
var socketList = [];
count = [0, 0, 0, 0, 0, 0];

var connection = mysql.createConnection({
    host: 'ramkashyapdb.c9yz7z4w6gzm.us-east-1.rds.amazonaws.com',
    user: 'kashyap',
    password: 'subhadradevi',
    database: 'cloud'
});

connection.connect(function(err) {
    if (err) console.log(err);
});



var t = new Twitter({
    consumer_key: 'flAJ6QQlG0Gp4fhhbeBdbELJn',
    consumer_secret: '2TJ72zYEtApPvI3oWO2tTXOilEHmsi4TM8oj3g9HkUrF96PnDY',
    token: '36288120-Q9OylN7dyGWSd6lgzqYUwQWT8YccOyQ6KA2SzikLy',
    token_secret: 'JhSqsuCszj8j7KzSrAoq5uAZ1IN3haYgbXTPRzb2GFlzA'
});

trackItems.forEach(function(item) {
    t.track(item);
});


// real time updates
t.on('tweet', function(tweet) {
    //console.log("inside real time tweets");
    if (tweet.geo) {
        getKeyword = null;

        for (var i = 0; i < trackItems.length; i++) {
            if (tweet.text.indexOf(trackItems[i]) > -1) {
                getKeyword = trackItems[i];
                count[i]++;
                // console.log(count);  // for trending !!!
                break;
            }
        }

        if (getKeyword != null) {
            //console.log(getKeyword);
            socketList.forEach(function(socket) {
                var data = {
                    iD: tweet.id,
                    name: tweet.user.name,
                    language: tweet.lang,
                    latitude: tweet.geo.coordinates[0],
                    longitude: tweet.geo.coordinates[1],
                    tweetTexts: tweet.text,
                    keyword: getKeyword
                };
                socket.emit('tweet', data);
            });
        }
    }
});

// Initial Tweets
module.exports = function(io) {

    io.on('connection', function(socket) {
        socketList.push(socket);
        var queryString = 'SELECT * FROM tweetDB';
        connection.query(queryString, function(error, rows) {
            if (error) {
                console.log(error);
            } else {
                socket.emit('initialTweets', rows);
            }
        });


        socket.on('initialTweetsByTag', function(keyword) {
			var queryString;
            if (keyword == "") {
                queryString = "SELECT * FROM tweetDB";
            } else {
                queryString = "SELECT * FROM tweetDB where keyword='" + keyword + "'";
            }

            connection.query(queryString, function(error, rows) {
                if (error) {
                    console.log(error);
                } else {
                    socket.emit('initialTweetsByTag', rows);
                }
            });
        });
    });
};

t.on('error', function(err) {
    console.err(err);
});
