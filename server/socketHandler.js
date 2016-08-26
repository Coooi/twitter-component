module.exports = function (io, stream) {
    var START_EVENT = 'tweet-io:start';
    var STOP_EVENT  = 'tweet-io:stop';
    var DISCONNECT  = 'disconnect';
    var CONNECTION  = 'connection';
    var openSockets = 0;

    //Handle Socket.IO events
    var removeClient = function () {
        console.log('Client disconnected !');
        openSockets--;

        if (openSockets <= 0) {
            openSockets = 0;
            console.log("All clients have been disconnected.");
            stream.stop();
        }
    };

    var addClient = function (data, socket) {
        if (data == true) {
            console.log('Client connected !');

            if (openSockets <= 0) {
                openSockets = 0;
                console.log('Start streaming from Twitter');
                stream.start();
            }

            openSockets++;
        }
    };

    io.sockets.on(CONNECTION, function (socket) {

        socket.on(START_EVENT, function (data) {
            addClient(data, socket);
        });

        socket.on(STOP_EVENT, removeClient);

        socket.on(DISCONNECT, removeClient);
    });

    return stream;
};