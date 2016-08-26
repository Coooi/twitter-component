module.exports = function(io, stream){
    var tweetsBuffer            = [];
    var TWEETS_MAX_BUFFER_SIZE  = 3;
    var TWEETS_EVENT            = 'tweet-io:tweets';
    var DISCONNECT              = 'disconnect';
    var CONNECT                 = 'connect';
    var RECONNECT               = 'reconnect';
    var firstConnection         = true;


    stream.on(CONNECT, function(request) {
        console.log('Connected to Twitter API');

        if (firstConnection) {
            firstConnection = false;
            stream.stop();
        }
    });

    stream.on(DISCONNECT, function(message) {
        console.log('Disconnected from Twitter API. Message: ' + message);
    });

    stream.on(RECONNECT, function (request, response, connectInterval) {
        console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
    });

    stream.on('tweet', function(tweet) {
        var tweetObject = {
            twid: tweet['id'],
            author: tweet.user.name,
            avatar: tweet.user.profile_image_url,
            body: tweet.text,
            date: tweet.created_at,
            screenname: tweet.user.screen_name
        };

        tweetsBuffer.push(tweetObject);
        emitTweets();
    });

    var emitTweets = function() {
        if (tweetsBuffer.length >= TWEETS_MAX_BUFFER_SIZE) {
            io.sockets.emit(TWEETS_EVENT, tweetsBuffer);
            tweetsBuffer = [];
        }
    }
};