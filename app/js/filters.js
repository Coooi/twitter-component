(function () {
    'use strict';

    angular.module('twitterApp')

        .filter('reverse', function () {
            return function (items) {
                return (items !== null ? items.slice().reverse() : []);
            };
        })
        .filter('format', function () {
            return function (date, method) {
                var momented = moment(date);
                return momented[method].apply(momented, Array.prototype.slice.call(arguments, 2));
            };
        });

})();