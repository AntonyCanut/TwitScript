// using npm twitter
var Twitter = require('./node_modules/twitter');
var s = require('string');
var exec = require('child_process').exec;
var fs = require('fs');

// new Object Twitter with login-user
var client = new Twitter({
    consumer_key: 'todo',
    consumer_secret: 'todo',
    access_token_key: 'todo',
    access_token_secret: 'todo'
});


// variables
var minutes_like = 3;
var minutes_retweet = 180;
var likable = true;
var retweetable = true;
var trackWords = fs.readFileSync('trackwords.txt', 'utf8');
var tracker = fs.readFileSync('trackaccount.txt', 'utf8');
var trackAccount = "";

// Get values files
trackWords = s(trackWords).replaceAll('\r\n', ' ').s;
tracker.split('\r\n').map(function (val) {
    var value = val.split('+').map(function (val2) {
        if (!s(val2).contains('\''))
            return val2;
    });
    trackAccount = trackAccount + value[0] + ', ';
    return val;
});

// Functions
function containSafeWord(tweet) {
    var txt = fs.readFileSync('safeword.txt', 'utf8');
    var tab = txt.split('\r\n').map(function (val) {
        return val;
    });
    var isNotSafe = false;

    tab.forEach(function(item){
        if (s(tweet.text).toLowerCase().contains(s(item).toLowerCase()))
            isNotSafe = true;
    });
    return isNotSafe;
}

function containTrackWord(tweet) {
    var txt = fs.readFileSync('trackwords.txt', 'utf8');
    var tab = txt.split(',\r\n').map(function (val) {
        return val;
    });
    var isTrack = false;

    tab.forEach(function(item){
        if (s(tweet.text).toLowerCase().contains(s(item).toLowerCase()))
            isTrack = true;
    });
    return isTrack;
}

function likeTweets(tweet) {
    // Filter safe-keyword
    if (!containSafeWord(tweet)) {
        var alreadylike = false;
        var myDate = new Date();

        if (likable) {
            client.post('favorites/create', { id: tweet.id_str }, function (error, tweet, response) {
                if (error != null) {
                    console.log(error); // log an error
                } else {
                    console.log('-- LIKE --');
                    console.log('Tweet : ' + myDate.getHours() + 'h' + ((myDate.getMinutes() <= 9) ? ('0' + myDate.getMinutes()) : (myDate.getMinutes())));
                    console.log(tweet.text);
                    console.log('----------');
                }
            });
            likable = false;
            alreadylike = true;
        }

        if (retweetable && !alreadylike) {
            client.post('statuses/retweet/' + tweet.id_str, function (error, tweet, response) {
                if (error != null) {
                    console.log(error); // log an error
                } else {
                    console.log('-- RETWEET --');
                    console.log('Tweet : ' + myDate.getHours() + 'h' + ((myDate.getMinutes() <= 9) ? ('0' + myDate.getMinutes()) : (myDate.getMinutes())));
                    console.log(tweet.text);
                    console.log('-------------');
                }
            });
            retweetable = false;
        }
    }
}
function retweet(tweet) {
    if (containTrackWord(tweet)) {
        if (!containSafeWord(tweet)) {
            var myDate = new Date();

            client.post('statuses/retweet/' + tweet.id_str, function (error, tweet, response) {
                if (error != null) {
                    console.log(error); // log an error
                } else {
                    console.log('-- RETWEET BY ID & KEYWORDS --');
                    console.log('Tweet : ' + myDate.getHours() + 'h' + ((myDate.getMinutes() <= 9) ? ('0' + myDate.getMinutes()) : (myDate.getMinutes())));
                    console.log(tweet.text);
                    console.log('------------------------------');
                }
            });
        }
    }
}
function like_enable() {
    likable = true;
}
function retweet_enable() {
    retweetable = true;
}

// Streams
// Retweet popular by id, Antony Canut (me) - Jonathan Antoine - TheVerge - Cyril Cathala - Rudy Huyn - David Catuhe - Julien Corioland
//
// Make id here : http://gettwitterid.com/
client.stream('statuses/filter', {
    follow: trackAccount
}, function (stream) {
    console.log('Démarrage du stream sur Personnes.');
    stream.on('data', function (tweet) {
        retweet(tweet);
    });

    stream.on('error', function (error) {
        console.log(error);
    });
});

// Like and retweet by popular word
client.stream('statuses/filter', {
    track: trackWords,
    language: 'en, fr'
}, function (stream) {
    console.log('Démarrage du stream sur Trackwords.');
    stream.on('data', function (tweet) {
        likeTweets(tweet);
    });

    stream.on('error', function (error) {
        console.log(error);
    });
});

// Timer for Retweet and like
setInterval(like_enable, minutes_like * 60000);
setInterval(retweet_enable, minutes_retweet * 60000);