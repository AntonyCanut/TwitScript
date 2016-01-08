// using npm twitter
var Twitter = require('./node_modules/twitter');
var s = require('string');
var exec = require('child_process').exec;

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
    if ((s(tweet.text).toLowerCase().contains('teen') ||
        s(tweet.text).toLowerCase().contains('sexy') ||
        s(tweet.text).toLowerCase().contains('pussy') ||
        s(tweet.text).toLowerCase().contains('sex') ||
        s(tweet.text).toLowerCase().contains('milf') ||
        s(tweet.text).toLowerCase().contains('cock') ||
        s(tweet.text).toLowerCase().contains('sexe') ||
        s(tweet.text).toLowerCase().contains('bite') ||
        s(tweet.text).toLowerCase().contains('threesome') ||
        s(tweet.text).toLowerCase().contains('blowjob') ||
        s(tweet.text).toLowerCase().contains('anal') ||
        s(tweet.text).toLowerCase().contains('clitoris') ||
        s(tweet.text).toLowerCase().contains('boob') ||
        s(tweet.text).toLowerCase().contains('orgasm') ||
        s(tweet.text).toLowerCase().contains('penetration') ||
        s(tweet.text).toLowerCase().contains('chatte') ||
        s(tweet.text).toLowerCase().contains('mail') ||
        s(tweet.text).toLowerCase().contains('pipe') ||
        s(tweet.text).toLowerCase().contains('vagin') ||
        s(tweet.text).toLowerCase().contains('poop') ||
        s(tweet.text).toLowerCase().contains('putain') ||
        s(tweet.text).toLowerCase().contains('free') ||
        s(tweet.text).toLowerCase().contains('pute') ||
        s(tweet.text).toLowerCase().contains('connard') ||
        s(tweet.text).toLowerCase().contains('rudyhuyn') ||
        s(tweet.text).toLowerCase().contains('pd') ||
        s(tweet.text).toLowerCase().contains('encule') ||
        s(tweet.text).toLowerCase().contains('piece') ||
        s(tweet.text).toLowerCase().contains('pièce') ||
        s(tweet.text).toLowerCase().contains('game') ||
        s(tweet.text).toLowerCase().contains('gold') ||
        s(tweet.text).toLowerCase().contains('coin') ||
        s(tweet.text).toLowerCase().contains('download') ||
        s(tweet.text).toLowerCase().contains('salope') ||
        s(tweet.text).toLowerCase().contains('facebook') ||
        s(tweet.text).toLowerCase().contains('retweet') ||
        s(tweet.text).toLowerCase().contains('€') ||
        s(tweet.text).toLowerCase().contains('fuck') ||
        s(tweet.text).toLowerCase().contains('salopard') ||
        s(tweet.text).toLowerCase().contains('buy') ||
        s(tweet.text).toLowerCase().contains('emoji') ||
        s(tweet.text).toLowerCase().contains('$') ||
        s(tweet.text).toLowerCase().contains('shopping') ||
        s(tweet.text).toLowerCase().contains('jailbreak') ||
        s(tweet.text).toLowerCase().contains('amazon') ||
        s(tweet.text).toLowerCase().contains('nipple'))) {
        return true;
    }
    else {
        return false;
    }
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
};

function retweet(tweet) {
    if (s(tweet.text).toLowerCase().contains('windows') ||
        s(tweet.text).toLowerCase().contains('xamarin') ||
        s(tweet.text).toLowerCase().contains('android') ||
        s(tweet.text).toLowerCase().contains('iphone') ||
        s(tweet.text).toLowerCase().contains('ios') ||
        s(tweet.text).toLowerCase().contains('csharp') ||
        s(tweet.text).toLowerCase().contains('microsoft') ||
        s(tweet.text).toLowerCase().contains('google') ||
        s(tweet.text).toLowerCase().contains('apple') ||
        s(tweet.text).toLowerCase().contains('java') ||
        s(tweet.text).toLowerCase().contains('swift') ||
        s(tweet.text).toLowerCase().contains('emulator') ||
        s(tweet.text).toLowerCase().contains('uwp') ||
        s(tweet.text).toLowerCase().contains('azure')) {
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
};

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
	    '314451829, ' + // Cyril Cathala
	    '108743439, ' + // Rudy Huyn
	    '97252444, ' + // David Catuhe
	    '16837338, ' + // Julien Corioland
	    '300680960, ' + // Infinite Square
	    '543524058' + // Soat Group
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
    track: 'Windows, Windows Phone, Xamarin, UWP, Microsoft, Azure',
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
