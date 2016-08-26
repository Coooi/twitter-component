function TwitterCtrl($scope, socket, ApiServices, $timeout, $log) {

    var vm = this;

    vm.tweets = [];
    vm.isCasting = false;
    vm.buttonText = "Get Tweets";
    vm.hashtag = "";
    vm.stop = false;
    vm.firstRequest = true;

    function toggleCasting() {
        vm.isCasting = !vm.isCasting;
    }

    vm.clearTweets = function() {
        vm.tweets = [];
    };

    vm.findTweets = function() {
        
        function readyToCast(){
            if (!vm.stop){
                vm.stop = true;
                socket.emit('connect', true);
            }
            socket.emit('tweet-io:start', true);
            socket.on('tweet-io:tweets', function (data) {
                vm.tweets = vm.tweets.concat(data);
            });
        }
        
        function errorWhileCasting(){
            $log.error('Error while changing the stream.');
        }

        if (!vm.isCasting) {
            if (vm.hashtag) {
                vm.buttonText = "Stop";
                toggleCasting();
                if (vm.firstRequest) {
                    vm.firstRequest = false;
                    var hashtag = vm.hashtag.indexOf('#') === 0 ? vm.hashtag.substring(1) : '#' + vm.hashtag;
                    ApiServices.updateStream(hashtag).then(readyToCast, errorWhileCasting);
                } else {
                    readyToCast();
                }
            }
        } else {
            toggleCasting();
            socket.emit('tweet-io:stop', true);
            $timeout(function () {
                vm.buttonText = "Get Tweets";
            }, 300);
        }
    };
}

angular.module('twitterApp').component('twitterView', {
    templateUrl: 'views/twitter-component.html',
    controller: TwitterCtrl,
    controllerAs: 'vm'
});