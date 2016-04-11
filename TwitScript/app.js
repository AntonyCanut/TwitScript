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

// Functions
function containSafeWord(tweet) {
    var txt = fs.readFileSync('safeword.txt', 'utf8');
    var tab = txt.split('\r\n').map(function (val) {
        return val;
    });
    var isNotSafe = false;

    tab.forEach(function(item){
        if (s(item).toLowerCase().contains(s(tweet.text).toLowerCase()))
            isNotSafe = true;
    });
    return isNotSafe;
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
    if (s(tweet.text).toLowerCase().contains('#windows') ||
        s(tweet.text).toLowerCase().contains('#xamarin') ||
        s(tweet.text).toLowerCase().contains('#android') ||
        s(tweet.text).toLowerCase().contains('#iphone') ||
        s(tweet.text).toLowerCase().contains('#ios') ||
        s(tweet.text).toLowerCase().contains('#csharp') ||
        s(tweet.text).toLowerCase().contains('#reactjs') ||
        s(tweet.text).toLowerCase().contains('#microsoft') ||
        s(tweet.text).toLowerCase().contains('#google') ||
        s(tweet.text).toLowerCase().contains('#apple') ||
        s(tweet.text).toLowerCase().contains('#java') ||
        s(tweet.text).toLowerCase().contains('#cordova') ||
        s(tweet.text).toLowerCase().contains('#codenameone') ||
        s(tweet.text).toLowerCase().contains('#appcelerator') ||
        s(tweet.text).toLowerCase().contains('#swift') ||
        s(tweet.text).toLowerCase().contains('#emulator') ||
        s(tweet.text).toLowerCase().contains('#uwp') ||
        s(tweet.text).toLowerCase().contains('#azure')) {
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
    follow: '563290517,' + // Antony Canut
    ' 159495647, ' + // Jonathan Antoine
    '21224422, ' + // TheVerge
    '299659914,' + // Xamarin
    '2750084700,' + // XamarinUniversity
    '314451829, ' + // Cyril Cathala
    '108743439, ' + // Rudy Huyn
    '186907331,' + // Francois Raminosona
    '92143356,' + // Etienne Margraff
    '97252444, ' + // David Catuhe
    '15056288,' + // David Poulin
    '16837338, ' + // Julien Corioland
    '300680960, ' + // Infinite Square
    '543524058,' + // Soat Group
    '74286565' // Microsoft
}, function (stream) {
    stream.on('data', function (tweet) {
        retweet(tweet);
    });

    stream.on('error', function (error) {
        console.log(error);
    });
});

// Like and retweet by popular word
client.stream('statuses/filter', {
    track: '#Windows, #WindowsPhone, #Xamarin, #UWP, #Microsoft, #Azure',
    language: 'en, fr'
}, function (stream) {
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