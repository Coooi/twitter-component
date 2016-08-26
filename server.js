var express         = require('express'),
    http            = require('http'),
    path            = require('path'),
    Twit            = require('twit'),
    credentials     = require('./server/twitterCredentials'),
    twit            = new Twit(credentials),
    morg            = require('morgan'),
    bp              = require('body-parser'),
    tweetsHandler   = require('./server/tweetsHandler'),
    socketHandler   = require('./server/socketHandler');

var app = express();

app.use(morg('dev'));
app.use(bp.urlencoded({
    extended: true
}));
app.use(bp.json());
app.engine('html', require('ejs').renderFile);
app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/public/');
app.use(express.static(path.join(__dirname, 'public')));

var port = app.get('port');

app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

app.get('/', function (req, res) {
    res.render('index.html');
});

var server = http.createServer(app).listen(port, function() {
    console.log('Express server running. Port: ' + port);
});// Create a new ntwitter instance with credentials


// exports.io = io;
var io = require('socket.io').listen(server);

app.put('/update-stream', function (req, res) {
    if (req.body && req.body.hashtag) {
        var stream = twit.stream('statuses/filter', { track: req.body.hashtag });
        socketHandler(io, stream);
        tweetsHandler(io, stream);
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});








