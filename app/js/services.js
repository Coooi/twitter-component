(function () {
    'use strict';

    angular.module('twitterApp')

        .service('ApiServices', function ($q, $http) {
            return {
                updateStream: function (hashtag) {
                    var promise = $q.defer();

                    $http({
                        method: 'PUT',
                        url: 'update-stream',
                        data: {
                            hashtag: hashtag
                        }
                    }).then(function () {
                        promise.resolve();
                    });

                    return promise.promise;
                }
            };
        })

        .factory('socket', function ($rootScope) {
            var socket;
            // var socket = io.connect('http://192.168.2.5:5000');
            return {
                on: function (eventName, callback) {
                    socket.on(eventName, function () {
                        var args = arguments;
                        $rootScope.$apply(function () {
                            callback.apply(socket, args);
                        });
                    });
                },
                emit: function (eventName, data, callback) {
                    if (!socket && eventName === 'connect') {
                        socket = io.connect('http://localhost:5000');
                    } else {
                        socket.emit(eventName, data, function () {
                            var args = arguments;
                            $rootScope.$apply(function () {
                                if (callback) {
                                    callback.apply(socket, args);
                                }
                            });
                        });
                    }
                }
            };
        });
})();